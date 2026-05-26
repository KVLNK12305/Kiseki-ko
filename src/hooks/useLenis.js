import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

export default function useLenis() {
  const [lenis, setLenis] = useState(null);
  const reqIdRef = useRef(null);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const lenisInstance = new Lenis({
      duration: 2,
      lerp: 0.05,
      smoothWheel: true,
    });

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
