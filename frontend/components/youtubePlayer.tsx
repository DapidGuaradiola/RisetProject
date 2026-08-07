'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function YouTubePlayer({ videoId }: { videoId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    function createPlayer() {
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '400',
        width: '650',
        videoId,
        events: {
          onReady: () => setIsReady(true),
        },
      });
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      playerRef.current?.destroy?.();
    };
  }, [videoId]);

  return (
    <div>
      <div className="aspect-video rounded-3xl w-full" ref={containerRef} />
    </div>
  );
}