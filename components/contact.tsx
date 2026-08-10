"use client";

import { motion } from "framer-motion";
import { resumeData } from "@/data/resume";
import { SectionHeader } from "./section-header";
import { DotMatrixBottom } from "@/components/ui/dot-pattern";

export function Contact() {
  const { contact } = resumeData;

  return (
    <section id="contact" className="py-32 px-6 bg-[var(--bg-dark)] text-[var(--text-light)] relative overflow-hidden">
      <DotMatrixBottom className="text-[var(--text-light)]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeader
          number="12"
          label="CONTACTS"
          title="Let's Build Something"
          description="Open to opportunities and interesting conversations about test automation."
          light={false}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          {/* Left — links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-8">
              <div>
                <div className="label-mono text-[var(--text-light-muted)] text-[0.6rem] mb-2">EMAIL</div>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-lg font-semibold hover:text-accent transition-colors"
                >
                  {contact.email}
                </a>
              </div>
              <div>
                <div className="label-mono text-[var(--text-light-muted)] text-[0.6rem] mb-2">PHONE</div>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, "")}`}
                  className="text-lg font-semibold hover:text-accent transition-colors"
                >
                  {contact.phone}
                </a>
              </div>
              <div>
                <div className="label-mono text-[var(--text-light-muted)] text-[0.6rem] mb-2">LINKEDIN</div>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold hover:text-accent transition-colors"
                >
                  linkedin.com/in/kranthi-kumar-katta
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right — CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-2xl md:text-3xl font-medium tracking-[-0.04em] mb-6">
              Got something in mind?
            </h3>
            <p className="text-[var(--text-light-muted)] mb-8 leading-relaxed">
              Whether it&apos;s about test automation, performance engineering, or just a quick chat — I&apos;m always happy to connect.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${contact.email}`}
                className="btn-solid inline-flex items-center gap-2"
                style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8rem", letterSpacing: "0.1em" }}
              >
                SEND MESSAGE
              </a>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2 border-[var(--border-dark)] text-[var(--text-light)] hover:bg-[var(--text-light)] hover:text-[var(--bg-dark)]"
                style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.8rem", letterSpacing: "0.1em" }}
              >
                LINKEDIN
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* Export a default version for any import style that expects it */
export default Contact;
