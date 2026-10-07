import type { ReactNode, Ref } from "react";
import Float from "./Float";
import Meta from "./Meta";
import type { Project } from "../data/projects";
import "../style/page.css";

type BlockProps = {
  delay: number;
  kx: number;
  ky: number;
  ax?: number;
  className?: string;
  children: ReactNode;
};

export function Block({ delay, kx, ky, ax = 8, className, children }: BlockProps) {
  return (
    <div className={`rise${className ? ` ${className}` : ""}`} style={{ transitionDelay: `${delay}s` }}>
      <Float kx={kx} ky={ky} ax={ax}>
        {children}
      </Float>
    </div>
  );
}

export function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="labeled">
      <h2 className="label">{label}</h2>
      {children}
    </section>
  );
}

export function Paragraphs({ children }: { children: ReactNode }) {
  return <div className="paragraphs">{children}</div>;
}

export function Items({ items, columns = 2 }: { items: [string, string][]; columns?: number }) {
  return (
    <ul className={`items items-${columns}`}>
      {items.map(([title, text]) => (
        <li key={title}>
          <span className="item-title">{title}</span>
          {text}
        </li>
      ))}
    </ul>
  );
}

type ProjectPageProps = {
  project: Project;
  phase: string;
  heroRef: Ref<HTMLDivElement>;
  pageRef: Ref<HTMLDivElement>;
  nextTitle?: string;
  onNext: () => void;
};

export default function ProjectPage({ project, phase, heroRef, pageRef, nextTitle, onNext }: ProjectPageProps) {
  const Body = project.Body;
  const state = phase === "open" ? " in" : phase === "closing" ? " out" : "";

  return (
    <div className={`page${state}`} ref={pageRef} aria-label={project.title}>
      <Meta
        title={`${project.title} · Seojoon Lee`}
        description={project.tagline}
        path={`/projects/${project.slug}`}
        image={`/og/${project.slug}.jpg`}
      />
      <div className="page-inner">
        {/* top */}
        <div className="page-top">
          <div className="hero" ref={heroRef}>
            <Float kx={40} ky={26} ax={12} fill>
              <img src={project.image} alt={project.alt} />
            </Float>
          </div>

          <Block delay={0.1} kx={36} ky={24} className="page-title">
            <span className="label">{project.date}</span>
            <h1>{project.title}</h1>
            <p>{project.tagline}</p>
          </Block>

          <Block delay={0.18} kx={20} ky={13} className="page-details">
            <dl>
              {project.details.map(({ term, value }) => (
                <div key={term}>
                  <dt className="label">{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </Block>
        </div>

        <Body />

        {/* next */}
        {nextTitle && (
          <Block delay={0.5} kx={18} ky={12} className="page-next">
            <button type="button" onClick={onNext}>
              <span className="label">Next project</span>
              <span className="page-next-title">{nextTitle}</span>
            </button>
          </Block>
        )}
      </div>
    </div>
  );
}
