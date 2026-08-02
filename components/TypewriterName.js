'use client';

import { useState, useEffect } from 'react';

export default function TypewriterName() {
    const fullText = "Kranthi Kumar Katta";
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index <= fullText.length) {
                setDisplayedText(fullText.substring(0, index));
                index++;
            } else {
                clearInterval(timer);
                setIsComplete(true);
            }
        }, 90);

        return () => clearInterval(timer);
    }, []);

    return (
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3 flex items-center justify-center">
            <span>{displayedText}</span>
            <span className={`inline-block w-2.5 h-8 bg-blue-400 ml-1 ${isComplete ? 'animate-pulse' : 'animate-ping'}`} />
        </h1>
    );
}