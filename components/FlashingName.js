'use client';

export default function FlashingName() {
    return (
        <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 transition-transform duration-700 hover:scale-[1.02]"
            style={{
                fontFamily: '"Nunito", "Roboto", sans-serif',
                fontWeight: 300,
                fontSize: '4rem',
                background: 'linear-gradient(180deg, #ffffff 20%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 20px rgba(255, 255, 255, 0.15))',
            }}
        >
            Kranthi Kumar Katta
        </h1>
    );
}