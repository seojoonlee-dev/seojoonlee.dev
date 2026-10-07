import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { useNavigate, useParams } from "react-router";
import Scene, { type Pointer } from "./Scene";
import Float from "./Float";
import ProjectPage from "./ProjectPage";
import NotFound from "./NotFound";
import { projects } from "../data/projects";
import "../style/home.css";

type Phase = "closed" | "opening" | "open" | "closing";

const N = projects.length;
const wrap = (i: number) => ((i % N) + N) % N;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function Portfolio() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const urlIdx = slug ? projects.findIndex((p) => p.slug === slug) : -1;
  const start = Math.max(0, urlIdx);

  const [cur, setCur] = useState(start);
  const [phase, setPhase] = useState<Phase>(urlIdx >= 0 ? "open" : "closed");
  const [openIdx, setOpenIdx] = useState(start);
  const [mobile, setMobile] = useState(false);

  const stage = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLElement | null)[]>([]);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const shots = useRef<(HTMLDivElement | null)[]>([]);
  const hero = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const motion = useRef({ pos: start, target: start, base: start });
  const live = useRef({ phase, cur, openIdx });
  const flightFrom = useRef<DOMRect | null>(null);
  const afterClose = useRef<(() => void) | null>(null);
  const closeTimer = useRef(0);
  const aimed = useRef(start);
  const geo = useRef({ s: 1, gap: 560, mobile: false });
  const tilt = useRef({ x: 0, y: 0 });

  useEffect(() => {
    live.current = { phase, cur, openIdx };
  }, [phase, cur, openIdx]);

  function step(k: number) {
    const m = motion.current;
    m.base += k;
    m.target = m.base;
  }

  function settled() {
    const m = motion.current;
    return Math.abs(m.target - m.pos) < 0.15;
  }

  function close() {
    const h = hero.current;
    const target = shots.current[live.current.openIdx];
    if (h && target) {
      const hr = h.getBoundingClientRect();
      const t = target.getBoundingClientRect();
      h.style.transition = "transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)";
      h.style.transform = `translate3d(${t.left - hr.left}px, ${t.top - hr.top}px, 0) scale(${t.width / hr.width})`;
    }
    setPhase("closing");
    clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setPhase("closed");
      afterClose.current?.();
      afterClose.current = null;
    }, 920);
  }

  /* stage fit */
  useLayoutEffect(() => {
    const fit = () => {
      const m = window.innerWidth < 820;
      setMobile(m);
      const w = m ? 420 : 1440;
      const h = m ? 860 : 900;
      const s = Math.min(window.innerWidth / w, window.innerHeight / h);
      const spare = Math.max(0, window.innerHeight / s - h) / 2;
      const gap = (m ? 600 : 560) + spare;
      geo.current = { s, gap, mobile: m };
      stage.current?.style.setProperty("--s", s.toFixed(4));
      stage.current?.style.setProperty("--gap", `${gap.toFixed(1)}px`);
      stage.current?.style.setProperty("--ngap", `${(gap * 0.45).toFixed(1)}px`);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  /* strip */
  useEffect(() => {
    let raf = 0;
    let drawn = NaN;
    const tick = () => {
      const m = motion.current;
      m.pos += (m.target - m.pos) * 0.04;
      if (Math.abs(m.target - m.pos) < 0.0005) m.pos = m.target;
      if (m.pos === drawn) {
        raf = requestAnimationFrame(tick);
        return;
      }
      drawn = m.pos;
      slides.current.forEach((el, i) => {
        if (!el) return;
        let d = wrap(i - m.pos);
        if (d > N / 2) d -= N;
        const a = Math.min(1, Math.abs(d));
        el.style.setProperty("--d", d.toFixed(4));
        el.style.setProperty("--fade", (1 - a * 0.68).toFixed(3));
        el.style.setProperty("--sc", (1 - a * 0.1).toFixed(4));
        el.style.setProperty("--numop", Math.max(0, 1 - Math.abs(d) * 1.4).toFixed(3));
        el.style.setProperty("--cg", Math.max(0, 1 - Math.abs(d) * 2).toFixed(3));
        el.style.zIndex = String(Math.round(10 - Math.abs(d) * 3));
        el.style.visibility = Math.abs(d) < 1.7 ? "visible" : "hidden";
      });
      const c = wrap(Math.round(m.pos));
      setCur((prev) => (prev === c ? prev : c));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* input */
  useEffect(() => {
    const m = motion.current;
    let snapTimer = 0;
    let touchY: number | null = null;
    const snap = () => {
      const diff = m.target - m.base;
      if (Math.abs(diff) > 0.35) m.base += Math.sign(diff) * Math.max(1, Math.round(Math.abs(diff)));
      m.target = m.base;
    };
    const nudge = (dy: number) => {
      m.target = clamp(m.target + dy, m.base - 1.4, m.base + 1.4);
      clearTimeout(snapTimer);
      snapTimer = window.setTimeout(snap, 220);
    };
    const onWheel = (e: WheelEvent) => {
      if (live.current.phase !== "closed") return;
      nudge(clamp(e.deltaY / 520, -0.6, 0.6));
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (live.current.phase !== "closed" || touchY === null) return;
      const y = e.touches[0].clientY;
      nudge((touchY - y) / (window.innerHeight * 0.5));
      touchY = y;
    };
    const onTouchEnd = () => {
      touchY = null;
    };
    const onKey = (e: KeyboardEvent) => {
      const p = live.current.phase;
      if (p === "open" && e.key === "Escape") navigate("/");
      if (p !== "closed") return;
      if (e.key === "ArrowDown" || e.key === "PageDown") step(1);
      if (e.key === "ArrowUp" || e.key === "PageUp") step(-1);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(snapTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [navigate]);

  /* url */
  useEffect(() => {
    const p = live.current.phase;
    if (urlIdx >= 0 && p === "closed") {
      const shot = shots.current[urlIdx];
      const m = motion.current;
      if (shot && wrap(Math.round(m.pos)) === urlIdx && settled()) {
        flightFrom.current = shot.getBoundingClientRect();
        setOpenIdx(urlIdx);
        setPhase("opening");
      } else {
        const k = urlIdx - wrap(Math.round(m.base));
        m.base += k;
        m.target = m.base;
        m.pos = m.base;
        flightFrom.current = null;
        setOpenIdx(urlIdx);
        setPhase("open");
      }
    } else if (urlIdx < 0 && (p === "open" || p === "opening")) {
      close();
    }
  }, [urlIdx]);

  /* flight */
  useLayoutEffect(() => {
    if (phase !== "opening") return;
    const h = hero.current;
    const from = flightFrom.current;
    if (page.current) page.current.scrollTop = 0;
    if (!h || !from) {
      setPhase("open");
      return;
    }
    const to = h.getBoundingClientRect();
    h.style.transition = "none";
    h.style.transform = `translate3d(${from.left - to.left}px, ${from.top - to.top}px, 0) scale(${from.width / to.width})`;
    h.getBoundingClientRect();
    const raf = requestAnimationFrame(() => {
      h.style.transition = "transform 1s cubic-bezier(0.76, 0, 0.24, 1)";
      h.style.transform = "none";
    });
    const t = window.setTimeout(() => setPhase("open"), 450);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [phase]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  function reset(i: number) {
    const slide = slides.current[i];
    const t = slide?.querySelector<HTMLElement>(".tilt");
    const e = slide?.querySelector<HTMLElement>(".edge-wrap");
    if (t) t.style.transform = "none";
    e?.style.setProperty("--glow", "0");
  }

  function onFrame(k: number, p: Pointer) {
    const { s, gap, mobile: m } = geo.current;
    if (live.current.phase !== "closed" || m || p.x < 0) return false;
    const i = live.current.cur;
    if (aimed.current !== i) {
      reset(aimed.current);
      tilt.current = { x: 0, y: 0 };
      aimed.current = i;
    }
    const slide = slides.current[i];
    if (!slide) return false;
    const mp = motion.current;
    let d = wrap(i - mp.pos);
    if (d > N / 2) d -= N;
    const sc = 1 - Math.min(1, Math.abs(d)) * 0.1;
    const cx = window.innerWidth / 2 + (560 + 380 - 720) * s;
    const cy = window.innerHeight / 2 + (230 + 220 - 450 + d * gap) * s;
    const w = 760 * sc * s;
    const h = 440 * sc * s;
    const left = cx - w / 2;
    const top = cy - h / 2;
    const tx = clamp((p.x - cx) / (w * 0.79), -1, 1);
    const ty = clamp((p.y - cy) / (h * 0.86), -1, 1);
    const tl = tilt.current;
    tl.x += (tx - tl.x) * k;
    tl.y += (ty - tl.y) * k;
    const t = slide.querySelector<HTMLElement>(".tilt");
    if (t) t.style.transform = `rotateX(${(tl.y * 2.5).toFixed(3)}deg) rotateY(${(tl.x * -2.5).toFixed(3)}deg)`;
    const ex = Math.max(left - p.x, 0, p.x - (left + w));
    const ey = Math.max(top - p.y, 0, p.y - (top + h));
    const glow = Math.max(0, 1 - Math.hypot(ex, ey) / (420 * (w / 760)));
    const e = slide.querySelector<HTMLElement>(".edge-wrap");
    if (e) {
      e.style.setProperty("--glow", glow.toFixed(3));
      const gx = (p.x - left) / (s * sc);
      const gy = (p.y - top) / (s * sc);
      e.querySelectorAll<HTMLElement>(".edge-blob").forEach((b) => {
        b.style.transform = `translate3d(${gx.toFixed(1)}px, ${gy.toFixed(1)}px, 0)`;
      });
    }
    return Math.abs(tx - tl.x) > 0.001 || Math.abs(ty - tl.y) > 0.001;
  }

  function onLeave() {
    slides.current[aimed.current]?.querySelector<HTMLElement>(".edge-wrap")?.style.setProperty("--glow", "0");
  }

  function openCurrent() {
    if (live.current.phase !== "closed" || !settled()) return;
    navigate(`/projects/${projects[live.current.cur].slug}`);
  }

  function onShotClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    openCurrent();
  }

  function onNext() {
    afterClose.current = () => step(1);
    navigate("/");
  }

  if (slug && urlIdx < 0) return <NotFound />;

  const away = phase !== "closed";
  const project = projects[openIdx];
  const next = projects[wrap(openIdx + 1)];

  return (
    <Scene onFrame={onFrame} onLeave={onLeave} back={{ visible: phase === "open" || phase === "opening", onClick: () => navigate("/") }}>
      {!away && <title>Seojoon Lee</title>}

      {/* home */}
      <div className={`home ${phase}`} inert={away}>
        <div className={`stage${mobile ? " mobile" : ""}`} ref={stage}>
          {projects.map((p, i) => (
            <section
              key={p.slug}
              className="slide"
              ref={(el) => {
                slides.current[i] = el;
              }}
              aria-hidden={i !== cur}
              inert={i !== cur}
            >
              {/* numeral */}
              <div className="numeral" aria-hidden="true">
                <Float kx={-124} ky={-52} ax={15.2}>
                  <span>{p.num}</span>
                </Float>
              </div>

              <div className="slide-flow">
                {/* image */}
                <a
                  className="shot-link"
                  href={`/projects/${p.slug}`}
                  aria-label={`${p.title}, open project`}
                  onClick={onShotClick}
                  ref={(el) => {
                    links.current[i] = el;
                  }}
                  style={{ visibility: away && i === openIdx ? "hidden" : "visible" }}
                >
                  <Float kx={84} ky={56} ax={12} fill>
                    <div className="tilt-wrap fill">
                      <div className="tilt fill">
                        <div
                          className="shot fill"
                          ref={(el) => {
                            shots.current[i] = el;
                          }}
                        >
                          <img src={p.image} alt="" />
                        </div>
                        <div className="edge-wrap fill" aria-hidden="true">
                          <div className="edge-soft">
                            <div className="edge">
                              <div className="edge-blob" />
                            </div>
                          </div>
                          <div className="edge">
                            <div className="edge-blob" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Float>
                </a>

                {/* text */}
                <div className="slide-text">
                  <Float kx={40} ky={26} ax={8}>
                    <div className="slide-lines">
                      <span className="label">{p.date}</span>
                      <h2 className="slide-title">{p.title}</h2>
                      <p className="slide-blurb">{p.blurb}</p>
                      <p className="slide-stack">{p.stack}</p>
                    </div>
                  </Float>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* click zone */}
      {!away && <div className="zone" aria-hidden="true" onClick={openCurrent} />}

      {/* project page */}
      {away && (
        <ProjectPage
          project={project}
          phase={phase}
          heroRef={hero}
          pageRef={page}
          nextTitle={project.last ? undefined : next.title}
          onNext={onNext}
        />
      )}
    </Scene>
  );
}
