import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { useNavigate, useParams } from "react-router";
import Scene, { type Pointer } from "./Scene";
import Float from "./Float";
import ProjectPage from "./ProjectPage";
import NotFound from "./NotFound";
import Meta, { Person } from "./Meta";
import { projects } from "../data/projects";
import "../style/home.css";

type Phase = "closed" | "opening" | "open" | "closing";

const N = projects.length;
const wrap = (i: number) => ((i % N) + N) % N;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const bez = (a: number, b: number, t: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
const ease = (x: number) => {
  let lo = 0;
  let hi = 1;
  let t = x;
  for (let i = 0; i < 20; i++) {
    t = (lo + hi) / 2;
    if (bez(0.76, 0.24, t) < x) lo = t;
    else hi = t;
  }
  return bez(0, 1, t);
};

type Box = { left: number; top: number; width: number };

function slideVars(i: number, pos: number) {
  let d = wrap(i - pos);
  if (d > N / 2) d -= N;
  const a = Math.min(1, Math.abs(d));
  return {
    "--d": d.toFixed(4),
    "--fade": (1 - a * 0.68).toFixed(3),
    "--sc": (1 - a * 0.1).toFixed(4),
    "--numop": Math.max(0, 1 - Math.abs(d) * 1.4).toFixed(3),
    "--cg": Math.max(0, 1 - Math.abs(d) * 2).toFixed(3),
    zIndex: String(Math.round(10 - Math.abs(d) * 3)),
    visibility: Math.abs(d) < 1.7 ? "visible" : "hidden",
  };
}

export default function Portfolio() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const urlIdx = slug ? projects.findIndex((p) => p.slug === slug) : -1;
  const start = Math.max(0, urlIdx);

  const [cur, setCur] = useState(start);
  const [phase, setPhase] = useState<Phase>(urlIdx >= 0 ? "open" : "closed");
  const [openIdx, setOpenIdx] = useState(start);
  const [initial] = useState(() => projects.map((_, i) => slideVars(i, start) as CSSProperties));

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
  const geo = useRef({ s: 1, gap: 560, mobile: false, vh: 900 });
  const tilt = useRef({ x: 0, y: 0 });
  const flight = useRef(0);
  const heroT = useRef({ dx: 0, dy: 0, s: 1 });

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

  function reset(i: number) {
    const slide = slides.current[i];
    const t = slide?.querySelector<HTMLElement>(".tilt");
    const e = slide?.querySelector<HTMLElement>(".edge-wrap");
    if (t) t.style.transform = "none";
    e?.style.setProperty("--glow", "0");
  }

  function flatten(i: number) {
    reset(i);
    tilt.current = { x: 0, y: 0 };
  }

  function fly(from: (natural: Box) => Box, to: (natural: Box) => Box, ms: number, done?: () => void) {
    cancelAnimationFrame(flight.current);
    const h = hero.current;
    const img = h?.querySelector("img");
    if (!h || !img) return false;
    h.style.transition = "none";
    const t0 = performance.now();
    const frame = (now: number) => {
      const x = Math.min(1, (now - t0) / ms);
      const e = x < 1 ? ease(x) : 1;
      const st = heroT.current;
      const hb = h.getBoundingClientRect();
      const ib = img.getBoundingClientRect();
      const bx = hb.left - st.dx;
      const by = hb.top - st.dy;
      const bw = hb.width / st.s;
      const ix = (ib.left - hb.left) / st.s;
      const iy = (ib.top - hb.top) / st.s;
      const natural = { left: bx + ix, top: by + iy, width: bw };
      const a = from(natural);
      const b = to(natural);
      const left = a.left + (b.left - a.left) * e;
      const top = a.top + (b.top - a.top) * e;
      const sc = (a.width + (b.width - a.width) * e) / bw;
      heroT.current = { dx: left - bx - sc * ix, dy: top - by - sc * iy, s: sc };
      const n = heroT.current;
      h.style.transform = `translate3d(${n.dx.toFixed(2)}px, ${n.dy.toFixed(2)}px, 0) scale(${n.s.toFixed(5)})`;
      if (x < 1) {
        flight.current = requestAnimationFrame(frame);
      } else {
        flight.current = 0;
        done?.();
      }
    };
    frame(t0);
    return true;
  }

  function close() {
    const i = live.current.openIdx;
    const target = shots.current[i];
    const img = hero.current?.querySelector("img");
    flatten(i);
    setPhase("closing");
    clearTimeout(closeTimer.current);
    const finish = () => {
      setPhase("closed");
      afterClose.current?.();
      afterClose.current = null;
    };
    const start = img?.getBoundingClientRect();
    if (!target || !start || !fly(() => start, () => target.getBoundingClientRect(), 900, finish)) {
      closeTimer.current = window.setTimeout(finish, 920);
    }
  }

  /* stage fit */
  useLayoutEffect(() => {
    const fit = () => {
      const m = window.innerWidth < 820;
      const root = document.documentElement;
      root.toggleAttribute("data-mobile", m);
      const w = m ? 420 : 1440;
      const h = m ? 860 : 900;
      const vh = stage.current?.parentElement?.clientHeight || window.innerHeight;
      const s = Math.min(window.innerWidth / w, vh / h);
      const spare = Math.max(0, vh / s - h) / 2;
      const gap = (m ? 600 : 560) + spare;
      geo.current = { s, gap, mobile: m, vh };
      root.style.setProperty("--s", s.toFixed(4));
      root.style.setProperty("--t", Math.min(1.6, Math.max(1, 1 / s)).toFixed(4));
      root.style.setProperty("--gap", `${gap.toFixed(1)}px`);
      root.style.setProperty("--ngap", `${(gap * 0.45).toFixed(1)}px`);
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
        const v = slideVars(i, m.pos);
        for (const [k, val] of Object.entries(v)) {
          if (k.startsWith("--")) el.style.setProperty(k, val);
        }
        el.style.zIndex = v.zIndex;
        el.style.visibility = v.visibility;
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
      e.preventDefault();
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
    window.addEventListener("touchmove", onTouchMove, { passive: false });
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
        flatten(urlIdx);
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
    heroT.current = { dx: 0, dy: 0, s: 1 };
    h.style.transform = "none";
    fly(() => from, (natural) => natural, 1000);
    const t = window.setTimeout(() => setPhase("open"), 450);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(
    () => () => {
      clearTimeout(closeTimer.current);
      cancelAnimationFrame(flight.current);
    },
    [],
  );

  function onFrame(k: number, p: Pointer) {
    const { s, gap, mobile: m, vh } = geo.current;
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
    const cy = vh / 2 + (230 + 220 - 450 + d * gap) * s;
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
    <Scene onFrame={onFrame} onLeave={onLeave} home={!away} back={{ visible: phase === "open" || phase === "opening", onClick: () => navigate("/") }}>
      {!away && (
        <Meta
          description="Software Developer based in Seoul, South Korea."
          path="/"
          image="/og/home.jpg"
        />
      )}
      {!away && <Person />}

      {/* home */}
      <div className={`home ${phase}`} inert={away}>
        <div className="stage" ref={stage}>
          {projects.map((p, i) => (
            <section
              key={p.slug}
              className="slide"
              style={initial[i]}
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
                          <img src={p.image} alt="" fetchPriority={i === start ? "high" : "low"} />
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
