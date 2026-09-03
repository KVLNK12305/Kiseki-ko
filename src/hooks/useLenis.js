import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function useLenis() {
  const [lenis, setLenis] = useState(null);
  const reqIdRef = useRef(null);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const lenisInstance = new Lenis({
      duration: 1.6,
      lerp: 0.08,
      smoothWheel: true,
    });

    lenisInstance.on('scroll', ScrollTrigger.update);
    setLenis(lenisInstance);

    function raf(time) {
      lenisInstance.raf(time);
      reqIdRef.current = requestAnimationFrame(raf);
    }
    reqIdRef.current = requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
      cancelAnimationFrame(reqIdRef.current);
    };
  }, []);

  return lenis;
}
