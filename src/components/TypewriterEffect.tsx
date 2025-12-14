import { useState, useEffect } from 'react';

interface TypewriterEffectProps {
    phrases: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
}

export const TypewriterEffect = ({
    phrases,
    typingSpeed = 100,
    deletingSpeed = 50,
    pauseDuration = 2000,
}: TypewriterEffectProps) => {
    const [text, setText] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentPhrase = phrases[phraseIndex];

        const handleTyping = () => {
            setText(prev => {
                if (isDeleting) {
                    return currentPhrase.substring(0, prev.length - 1);
                } else {
                    return currentPhrase.substring(0, prev.length + 1);
                }
            });

            // Se terminou de digitar
            if (!isDeleting && text === currentPhrase) {
                setTimeout(() => setIsDeleting(true), pauseDuration);
                return;
            }

            // Se terminou de apagar
            if (isDeleting && text === '') {
                setIsDeleting(false);
                setPhraseIndex(prev => (prev + 1) % phrases.length);
                return;
            }
        };

        const timer = setTimeout(
            handleTyping,
            isDeleting ? deletingSpeed : typingSpeed
        );

        return () => clearTimeout(timer);
    }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <div className="text-3xl lg:text-5xl font-bold text-white leading-tight min-h-[120px]">
            <span>{text}</span>
            <span className="animate-pulse">|</span>
        </div>
    );
};
