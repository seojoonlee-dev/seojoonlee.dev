import type { ComponentType, ReactNode } from "react";
import GraphWrite from "../projects/GraphWrite";
import Silmari from "../projects/Silmari";
import Handheld from "../projects/Handheld";
import graphwrite from "../assets/projects/graphwrite-editor.webp";
import silmari from "../assets/projects/silmari.webp";
import handheld from "../assets/projects/handheld.webp";

export type Project = {
  slug: string;
  num: string;
  title: string;
  date: string;
  blurb: string;
  tagline: string;
  stack: string;
  image: string;
  alt: string;
  details: { term: string; value: ReactNode }[];
  Body: ComponentType;
  last?: boolean;
};

export const projects: Project[] = [
  {
    slug: "graphwrite",
    num: "I",
    title: "GraphWrite",
    date: "Dec. 2025 – now",
    blurb: "Branching, self-hosted markdown notes.",
    tagline: "Branching, self-hosted markdown notes.",
    stack: "React · TypeScript · Node.js",
    image: graphwrite,
    alt: "GraphWrite editor: the note tree in the sidebar and a note being written in live-preview markdown",
    details: [
      { term: "Stack", value: "React, TypeScript, Tauri, Node.js, Express, CodeMirror, React Flow, Docker" },
      { term: "Runs on", value: <>Browser, Linux, Windows, Android, macOS <em className="muted">(iOS in progress)</em></> },
      { term: "Links", value: <span className="links"><a href="https://graphwrite.app/demo">Live demo</a><a href="https://github.com/seojoonlee-dev/graphwrite">Source</a></span> },
    ],
    Body: GraphWrite,
  },
  {
    slug: "silmari",
    num: "II",
    title: "Silmari",
    date: "Sep. 2026",
    blurb: "A memory aid for people with ADHD: screen captures become a searchable timeline.",
    tagline: "A memory aid for ADHD that remembers your screen for you.",
    stack: "React · TypeScript · Python · FastAPI · vLLM",
    image: silmari,
    alt: "Silmari: the live screen view, a list of things left unfinished, an answer to “What did I leave unfinished?”, and the day’s timeline",
    details: [
      { term: "Stack", value: "React, TypeScript, Vite, Python, FastAPI, SQLite, vLLM, Tailscale" },
      { term: "Made", value: "Solo, in one night, at the GDGoC Korea University BYPP Hackathon" },
      { term: "Award", value: "People’s Choice, among 40+ projects" },
      { term: "Links", value: <span className="links"><a href="https://github.com/seojoonlee-dev/silmari">Source</a><a href="https://youtu.be/glUuyvN1lBU?t=350">Featured in a judge’s video</a></span> },
    ],
    Body: Silmari,
  },
  {
    slug: "handheld",
    num: "III",
    title: "Handheld",
    date: "Aug. 2020 – Jan. 2022",
    blurb: "A portable handheld gaming device.",
    tagline: "A portable handheld gaming device.",
    stack: "Raspberry Pi · LattePanda · Arduino · 3D printing",
    image: handheld,
    alt: "The handheld gaming device, held in two hands, running a racing game",
    details: [
      { term: "Stack", value: "Raspberry Pi, LattePanda, Arduino, 3D printing, 3D modeling" },
      { term: "Links", value: <a href="https://github.com/Holdupp/handheld">Source</a> },
    ],
    Body: Handheld,
    last: true,
  },
];
