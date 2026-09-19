import { useEffect, useRef, useState } from "react";
import "./waygo-plane.css";
import { usePlane } from "../../hooks/usePlaneContext";

type Point = { x: number; y: number };

export default function WayGoPlane() {
  const plane = useRef<HTMLDivElement | null>(null);
  const points = useRef<Point[]>([]);
  const [trail, setTrail] = useState("");
  const { startPosition } = usePlane();

  useEffect(() => {
    if (!startPosition) return;

    let mouse = { ...startPosition };
    let current = { ...startPosition };
    let frame: number;
    let started = false;

    const move = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", move);

    const startTimer = window.setTimeout(() => {
      started = true;
      plane.current?.classList.add("visible");
    }, 3000);

    const animate = () => {
      if (started) {
        current.x += (mouse.x - current.x) * 0.08;
        current.y += (mouse.y - current.y) * 0.08;

        const angle =
          (Math.atan2(
            mouse.y - current.y,
            mouse.x - current.x
          ) *
            180) /
          Math.PI;

        if (plane.current) {
          plane.current.style.transform = `
            translate3d(
              ${current.x - 14}px,
              ${current.y - 17}px,
              0
            )
            rotate(${angle + 90}deg)
          `;
        }

        const last = points.current.at(-1);

        if (
          !last ||
          Math.abs(last.x - current.x) > 5 ||
          Math.abs(last.y - current.y) > 5
        ) {
          points.current.push({
            x: current.x,
            y: current.y,
          });
        }

        if (points.current.length > 15) {
          points.current.shift();
        }

        setTrail(
          points.current
            .map(
              (p, i) =>
                `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`
            )
            .join(" ")
        );
      }

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearTimeout(startTimer);
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(frame);
    };
  }, [startPosition]);

  return (
    <>
      <svg className="mouse-trail">
        <defs>
          <linearGradient id="planeGradient">
            <stop offset="0%" stopColor="#18A8FF" stopOpacity="0" />
            <stop offset="50%" stopColor="#18A8FF" />
            <stop offset="100%" stopColor="#8FE3FF" />
          </linearGradient>
        </defs>

        <path d={trail} />
      </svg>

      <div ref={plane} className="waygo-plane">
        <img src="/images/icons/plane.svg" alt="" />
      </div>
    </>
  );
}