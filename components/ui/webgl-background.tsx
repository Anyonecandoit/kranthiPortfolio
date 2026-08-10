"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Premium WebGL background — aurora mesh + floating particles.
 * Renders to a fixed canvas behind page content.
 * Respects prefers-reduced-motion.
 */
export function WebGLBackground({
  className = "fixed inset-0 -z-10",
  intensity = 1,
}: { className?: string; intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const particlesRef = useRef<THREE.Points>();
  const auroraRef = useRef<THREE.Mesh[]>([]);
  const timeRef = useRef(0);
  // Store the compiled ShaderMaterial to access uniforms
  const particleShaderMaterialRef = useRef<THREE.ShaderMaterial>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      canvas.style.display = "none";
      return;
    }

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // ── Aurora mesh layers ──
    const auroraGeometry = new THREE.PlaneGeometry(200, 200, 64, 64);
    const auroraColors = [
      new THREE.Color(0xe65800), // accent
      new THREE.Color(0x3b82f6), // blue
      new THREE.Color(0xec4899), // pink
      new THREE.Color(0x2dd4bf), // teal
    ];

    for (let i = 0; i < 4; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: auroraColors[i],
        transparent: true,
        opacity: 0.08 * intensity,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(auroraGeometry, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = -30 + i * 8;
      mesh.position.z = -20 - i * 15;
      scene.add(mesh);
      auroraRef.current.push(mesh);
    }

    // ── Particle field ──
    const particleCount = 2000 * intensity;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);
    const hues = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 40 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 20;
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = 0.5 + Math.random() * 1.5;
      alphas[i] = 0.1 + Math.random() * 0.4;
      hues[i] = Math.random();
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    particleGeometry.setAttribute("hue", new THREE.BufferAttribute(hues, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    // Custom shader for color-by-hue
    particleMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uIntensity = { value: intensity };
      // Store reference to the compiled ShaderMaterial
      particleShaderMaterialRef.current = shader as unknown as THREE.ShaderMaterial;
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `
          #include <common>
          attribute float alpha;
          attribute float hue;
          varying float vAlpha;
          varying float vHue;
          uniform float uTime;
          uniform float uIntensity;
          `
        )
        .replace(
          "gl_PointSize = size;",
          `
          float pulse = 1.0 + 0.3 * sin(uTime * 2.0 + hue * 100.0);
          gl_PointSize = size * pulse * uIntensity * (300.0 / -mvPosition.z);
          vAlpha = alpha;
          vHue = hue;
          `
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `
          #include <common>
          varying float vAlpha;
          varying float vHue;
          vec3 hsv2rgb(float h) {
            vec3 c = vec3(1.0, 1.0, 1.0);
            float hh = fract(h);
            vec3 rgb = clamp(abs(mod(hh * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
            return rgb;
          }
          `
        )
        .replace(
          "gl_FragColor = vec4( diffuse, opacity );",
          `
          vec3 color = hsv2rgb(vHue * 0.5 + 0.7);
          gl_FragColor = vec4( color, vAlpha * opacity );
          `
        );
    };

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // ── Animation loop ──
    const animate = () => {
      timeRef.current += 0.008;

      // Animate aurora meshes
      auroraRef.current.forEach((mesh, i) => {
        const t = timeRef.current * (0.5 + i * 0.2);
        mesh.position.x = Math.sin(t * 0.7) * 8;
        mesh.position.y = -30 + i * 8 + Math.cos(t * 0.5) * 5;
        mesh.rotation.z = Math.sin(t * 0.3) * 0.15;
        (mesh.material as THREE.MeshBasicMaterial).opacity = 0.06 * intensity * (1 + 0.3 * Math.sin(t));
      });

      // Animate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = timeRef.current * 0.02;
        particlesRef.current.rotation.x = Math.sin(timeRef.current * 0.3) * 0.05;
        const posAttr = particlesRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
        const count = posAttr.count;
        for (let i = 0; i < count; i++) {
          const y = posAttr.getY(i);
          posAttr.setY(i, y + 0.01 * (0.5 + Math.sin(timeRef.current + i) * 0.5));
          if (posAttr.getY(i) > 40) {
            posAttr.setY(i, -60);
          }
        }
        posAttr.needsUpdate = true;
        // Use the stored ShaderMaterial reference to update uniforms
        if (particleShaderMaterialRef.current) {
          particleShaderMaterialRef.current.uniforms.uTime.value = timeRef.current;
        }
      }

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const onResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Capture refs for cleanup to avoid stale closure
    const auroraMeshes = auroraRef.current;
    const particlesMesh = particlesRef.current;
    const rendererInstance = rendererRef.current;
    const animationFrame = animationRef.current;

    return () => {
      window.removeEventListener("resize", onResize);
      if (animationFrame) cancelAnimationFrame(animationFrame);
      // Cleanup aurora meshes
      auroraMeshes.forEach((m) => {
        scene.remove(m);
        (m.geometry as THREE.BufferGeometry).dispose();
        (m.material as THREE.Material).dispose();
      });
      if (particlesMesh) {
        scene.remove(particlesMesh);
        particlesMesh.geometry.dispose();
        (particlesMesh.material as THREE.Material).dispose();
      }
      if (rendererInstance) rendererInstance.dispose();
    };
  }, [intensity]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}