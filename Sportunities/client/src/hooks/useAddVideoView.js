import { useEffect, useState } from "react";


export default function useAddVideoView({
  ref: videoPlayerRef,
  percentage = 30,
  callback
}) {

  const [videoTimer, setVideoTimer] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);

  useEffect(() => {
    if (!isVideoPlaying) return;
    const interval = setInterval(() => {
      setVideoTimer(prev => prev + 1)
    }, 1000);
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  useEffect(async () => {
    let isCancelled = false;
    if (!videoPlayerRef.current) return;
    const totalVideoDuration = videoPlayerRef.current.duration;
    const totalViewed = Math.round(100 * videoTimer / totalVideoDuration);
    //console.log("totalViewed", totalViewed + ' %');
    if (totalViewed >= percentage && !hasBeenViewed && !isCancelled) {
      setHasBeenViewed(true);
      await callback();
    }
    return () => {
      isCancelled = true
    };
  }, [videoTimer]);


  return { setIsVideoPlaying }
}