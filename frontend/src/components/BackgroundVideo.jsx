import React, { useRef, useEffect } from 'react';

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4';

export const BackgroundVideo = () => {
  const videoRef = useRef(null);
  const prevXRef = useRef(null);
  const isSeekingRef = useRef(false);

  // Desktop Mouse Scrubbing Hook
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleSeeked = () => {
      isSeekingRef.current = false;
    };

    video.addEventListener('seeked', handleSeeked);

    const handleMouseMove = (e) => {
      if (window.innerWidth < 1024) return; // Ignore on mobile / tablet

      const currentX = e.clientX;

      if (prevXRef.current !== null && video.duration) {
        const delta = currentX - prevXRef.current;
        const scrubStep = (delta / window.innerWidth) * 0.8 * video.duration;
        let targetTime = video.currentTime + scrubStep;

        // Clamp between 0 and duration
        if (targetTime < 0) targetTime = 0;
        if (targetTime > video.duration) targetTime = video.duration;

        if (!isSeekingRef.current) {
          isSeekingRef.current = true;
          video.currentTime = targetTime;
        }
      }

      prevXRef.current = currentX;
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Mobile Autoplay Hook (< 1024px)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const checkMobilePlay = () => {
      if (window.innerWidth < 1024) {
        video.autoplay = true;
        video.loop = true;
        video.play().catch(() => {
          // Autoplay policy fallback
        });
      } else {
        video.pause();
      }
    };

    checkMobilePlay();
    window.addEventListener('resize', checkMobilePlay);

    return () => {
      window.removeEventListener('resize', checkMobilePlay);
    };
  }, []);

  return (
    <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-right lg:object-right-bottom"
      />
    </div>
  );
};
