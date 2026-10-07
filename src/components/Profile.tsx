import { useEffect, useState } from "react";
import { Link } from "react-router";
import Scene from "./Scene";
import { Block, Labeled } from "./ProjectPage";
import { projects } from "../data/projects";
import "../style/profile.css";

type Row = { title: string; date: string; line: string; to?: string; href?: string };

const rows: Row[] = [
  ...projects.map((p) => ({ title: p.title, date: p.date, line: p.blurb, to: `/projects/${p.slug}` })),
  {
    title: "Gesture Control",
    date: "2023 – 2024",
    line: "Controls the computer with hand gestures tracked through a webcam.",
    href: "https://github.com/seojoon1ee/gesture-control",
  },
  {
    title: "Centerlocked",
    date: "2022",
    line: "A simple mobile game made with Unity, published on the Play Store.",
  },
];

export default function Profile() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Scene>
      <title>Profile · Seojoon Lee</title>
      <div className={`page${shown ? " in" : ""}`}>
        <div className="profile">
          {/* intro */}
          <Block delay={0} kx={36} ky={24} className="profile-intro">
            <span className="label">Profile</span>
            <h1>Seojoon Lee</h1>
            <p>Software Developer</p>
          </Block>

          {/* contact */}
          <Block delay={0.1} kx={24} ky={16}>
            <Labeled label="Contact">
              <dl className="profile-contact">
                <div>
                  <dt className="label">Email</dt>
                  <dd><a href="mailto:developer.seojoonlee@gmail.com">developer.seojoonlee@gmail.com</a></dd>
                </div>
                <div>
                  <dt className="label">GitHub</dt>
                  <dd><a href="https://github.com/seojoonlee-dev">github.com/seojoonlee-dev</a></dd>
                </div>
              </dl>
            </Labeled>
          </Block>

          {/* projects */}
          <Block delay={0.18} kx={18} ky={12}>
            <Labeled label="Projects">
              <ul className="profile-projects">
                {rows.map((r) => (
                  <li key={r.title}>
                    {r.to ? (
                      <Link to={r.to}>{r.title}</Link>
                    ) : r.href ? (
                      <a href={r.href}>{r.title}</a>
                    ) : (
                      <span className="profile-name">{r.title}</span>
                    )}
                    <span className="profile-date">{r.date}</span>
                    <p>{r.line}</p>
                  </li>
                ))}
              </ul>
            </Labeled>
          </Block>
        </div>
      </div>
    </Scene>
  );
}
