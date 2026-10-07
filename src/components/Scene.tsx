import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import Header from "./Header";
import "../style/scene.css";

const MOUSE_K = 2;
const EASE = 0.28;
const TILT_RANGE = 15;
const TILT_MAX = 0.6;
const RECENTER = 4;
const still = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const unit = (v: number) => Math.min(1, Math.max(-1, v));

type Motion = { requestPermission?: () => Promise<string> };
let tiltGranted = false;

export type Pointer = { x: number; y: number };

type SceneProps = {
  children: ReactNode;
  onFrame?: (k: number, pointer: Pointer) => boolean;
  onLeave?: () => void;
  back?: { visible: boolean; onClick: () => void };
  home?: boolean;
};

export default function Scene({ children, onFrame, onLeave, back, home }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const flashlight = useRef<HTMLDivElement>(null);
  const idle = useRef(0);
  const raf = useRef(0);
  const last = useRef(0);
  const target = useRef({ x: 0, y: 0 });
  const eased = useRef({ x: 0, y: 0 });
  const pointer = useRef<Pointer>({ x: -1, y: -1 });
  const frame = useRef(onFrame);

  useEffect(() => {
    frame.current = onFrame;
  }, [onFrame]);

  function loop(now: number) {
    const el = root.current;
    if (!el) {
      raf.current = 0;
      return;
    }
    const dt = Math.min(0.1, (now - last.current) / 1000);
    last.current = now;
    const k = 1 - Math.exp(-dt / EASE);
    const t = target.current;
    const c = eased.current;
    c.x += (t.x - c.x) * k;
    c.y += (t.y - c.y) * k;
    const busy = frame.current?.(k, pointer.current) ?? false;
    if (!still()) {
      el.querySelectorAll<HTMLElement>("[data-kx]").forEach((m) => {
        const x = c.x * Number(m.dataset.kx);
        const y = c.y * Number(m.dataset.ky);
        m.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      });
    }
    const moving = Math.abs(t.x - c.x) > 0.0002 || Math.abs(t.y - c.y) > 0.0002;
    raf.current = moving || busy ? requestAnimationFrame(loop) : 0;
  }

  function kick() {
    if (raf.current) return;
    last.current = performance.now();
    raf.current = requestAnimationFrame(loop);
  }

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const watch = new MutationObserver(kick);
    watch.observe(el, { childList: true, subtree: true });
    kick();
    return () => {
      watch.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
      clearTimeout(idle.current);
    };
  }, []);

  /* tilt */
  useEffect(() => {
    if (!("DeviceOrientationEvent" in window) || !window.matchMedia("(pointer: coarse)").matches) return;
    let base: { x: number; y: number } | null = null;
    let prev = 0;
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      const angle = screen.orientation?.angle ?? 0;
      let x = e.gamma;
      let y = e.beta;
      if (angle === 90) [x, y] = [e.beta, -e.gamma];
      else if (angle === 270 || angle === -90) [x, y] = [-e.beta, e.gamma];
      else if (angle === 180) [x, y] = [-x, -y];
      const now = performance.now();
      if (!base) {
        base = { x, y };
      } else {
        const k = 1 - Math.exp(-(now - prev) / 1000 / RECENTER);
        base.x += (x - base.x) * k;
        base.y += (y - base.y) * k;
      }
      prev = now;
      target.current.x = unit(-(x - base.x) / TILT_RANGE) * TILT_MAX;
      target.current.y = unit(-(y - base.y) / TILT_RANGE) * TILT_MAX;
      kick();
    };
    const listen = () => window.addEventListener("deviceorientation", onTilt);
    const motion = DeviceOrientationEvent as unknown as Motion;
    const ask = () => {
      motion.requestPermission?.()
        .then((r) => {
          window.removeEventListener("touchend", ask);
          if (r !== "granted") return;
          tiltGranted = true;
          listen();
        })
        .catch(() => {});
    };
    if (typeof motion.requestPermission !== "function" || tiltGranted) listen();
    else window.addEventListener("touchend", ask);
    return () => {
      window.removeEventListener("touchend", ask);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  function light(on: boolean) {
    root.current?.classList.toggle("lit", on);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const x = Math.min(1, Math.max(0, e.clientX / window.innerWidth));
    const y = Math.min(1, Math.max(0, e.clientY / window.innerHeight));
    target.current.x = (0.5 - x) * MOUSE_K;
    target.current.y = (0.5 - y) * MOUSE_K;
    pointer.current = { x: e.clientX, y: e.clientY };
    if (flashlight.current) {
      flashlight.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }
    kick();
    light(true);
    clearTimeout(idle.current);
    idle.current = window.setTimeout(() => light(false), 80);
  }

  function onPointerLeave() {
    clearTimeout(idle.current);
    light(false);
    onLeave?.();
  }

  return (
    <div className="scene" ref={root} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      {/* darkening */}
      <div className="shade" aria-hidden="true" />

      {/* fog */}
      <div className="fog-layer" aria-hidden="true">
        <div className="fog-wob fog-wob-a">
          <div className="fog fog-back" />
        </div>
        <div className="fog-wob fog-wob-b">
          <div className="fog fog-front" />
        </div>
      </div>

      {children}

      {/* edge gradients */}
      <div className="fade-top" aria-hidden="true" />
      <div className="fade-bottom" aria-hidden="true" />

      <Header back={back} home={home} />

      {/* lens */}
      <div className="lens" aria-hidden="true" />

      {/* flashlight */}
      <div className="flashlight" ref={flashlight} aria-hidden="true">
        <div className="flashlight-glow" />
      </div>
    </div>
  );
}
