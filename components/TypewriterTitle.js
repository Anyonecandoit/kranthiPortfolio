'use client';

import { useState, useEffect } from 'react';

export default function TypewriterTitle({ roles = ["SDET 2", "Automation Engineer", "Fintech Systems Specialist"] }) {
    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const fullText = roles[currentRoleIndex];

        const handleTyping = () => {
            if (!isDeleting) {
                setCurrentText(fullText.substring(0, currentText.length + 1));
                if (currentText === fullText) {
                    // Pause at full text before deleting
                    setTimeout(() => setIsDeleting(true), 2000);
                    setTypingSpeed(100);
                }
            } else {
                setCurrentText(fullText.substring(0, currentText.length - 1));
                if (currentText === '') {
                    setIsDeleting(false);
                    setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
                    setTypingSpeed(150);
                }
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentRoleIndex, roles, typingSpeed]);

    return (
        <h2 className="text-xl sm:text-2xl font-normal text-slate-400 mt-2 mb-8">
      <span id="typewriter" className="border-r-2 border-white pr-1 animate-pulse">
        {currentText}
      </span>
        </h2>
    );
}