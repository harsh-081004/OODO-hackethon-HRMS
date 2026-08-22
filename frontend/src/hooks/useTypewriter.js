import { useState, useEffect } from 'react';

/**
 * Custom hook that types out text character-by-character.
 * @param {string} text - The full text to type out.
 * @param {number} speed - Milliseconds between characters.
 * @param {number} startDelay - Milliseconds before starting.
 * @returns {{ displayed: string, done: boolean }}
 */
export function useTypewriter(text, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayed('');
    setDone(false);

    const delayTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));

        if (index >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(delayTimeout);
  }, [text, speed, startDelay]);

  return { displayed, done };
}
