import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

export default function useLenis() {
  const [lenis, setLenis] = useState(null);
  const reqIdRef = useRef(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.5,
      lerp: 0.1,
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
