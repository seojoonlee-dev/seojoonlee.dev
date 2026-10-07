import { useLocation, useNavigate } from "react-router";
import Section from "./Section";
import Pipe from "./Pipe";
import Meta from "./Meta";
import "../style/resume.css";

export default function Resume() {
  const navigate = useNavigate();
  const location = useLocation();
  const back = () => (location.key === "default" ? navigate("/") : navigate(-1));

  return(
    <div className="resume-page">
      <Meta
        description="Resume of Seojoon Lee, Software Developer based in Seoul, South Korea."
        path="/resume"
        image="/og/profile.jpg"
      />
      <button type="button" className="resume-back" onClick={back}>
        Back
      </button>
      <div className="view resume">
        <h1>Seojoon Lee</h1>
        <div className="contacts">
          <p>developer.seojoonlee@gmail.com</p>
          <Pipe />
          <a 
            href="https://github.com/seojoonlee-dev"
            target="_blank" 
            rel="noopener noreferrer"
          >github.com/seojoonlee-dev</a>
          <Pipe />
          <a 
            href="https://seojoonlee.dev"
            target="_blank" 
            rel="noopener noreferrer"
          >seojoonlee.dev</a>
        </div>
        <Section name="EDUCATION"/>
        <div className="content">
          <div style={{display: "flex"}}>
            <p style={{fontWeight: "bold"}}>Korea University</p>
            <Pipe />
            <p>Seoul, South Korea</p>
            <p style={{marginLeft: "auto", fontWeight: "bold"}}>Expected Feb. 2030</p>
          </div>
          <div style={{display: "flex"}}>
            <p style={{fontStyle: "italic", fontWeight: "bold"}}>B.S. in Artificial Intelligence</p>
            <Pipe />
            <p>GPA: 4.15/4.5</p>
          </div>
          <ul>
          </ul>
        </div>
        <Section name="EXPERIENCE"/>
        <div className="content">
          <div style={{display: "flex"}}>
            <p style={{fontWeight: "bold"}}>Software Engineering Intern</p>
            <Pipe />
            <p>Seoul, South Korea</p>
            <p style={{marginLeft: "auto", fontWeight: "bold"}}>Jun. 2026 – Aug. 2026</p>
          </div>
          <div style={{display: "flex"}}>
            <p style={{fontStyle: "italic", fontWeight: "bold"}}>Barreleye</p>
            <p>&nbsp;(AI medical ultrasound startup partnered with GE HealthCare)</p>
          </div>
          <ul>
            <li><p>Enabled the AI team to evaluate every new version of the lesion clustering algorithm in Vis-BUS, the company's AI breast ultrasound product, for the first time, by designing and building a Python benchmarking platform with a Flask web interface and SQLite run storage for side-by-side comparison.</p></li>
            <li><p>Reduced test time on the ~3,000-sample dataset from 10 minutes on an RTX 3060 to 0.2 seconds even without a GPU, by caching GPU-heavy preprocessing so only the clustering step reruns.</p></li>
            <li><p>Enabled engineers to pinpoint clustering errors, which can cause doctors to miss lesions or chase ones that don't exist, by designing an interactive exam viewer, rendered as SVG with Matplotlib, that colors scans by true lesion and overlays the algorithm's clusters as lassos.</p></li>
          </ul>
        </div>
        <Section name="PROJECTS"/>
        <div className="content">
          <div style={{display: "flex"}}>
            <p style={{fontWeight: "bold"}}>GraphWrite</p>
            <Pipe />
            <a 
              href="https://graphwrite.app"
              target="_blank" 
              rel="noopener noreferrer"
            >graphwrite.app</a>
            <p style={{marginLeft: "auto", fontWeight: "bold"}}>Dec. 2025 – Present</p>
          </div>
          <p style={{fontStyle: "italic"}}>React, TypeScript, Tauri, CodeMirror, React Flow, Node.js, Docker</p>
          <ul>
            <li><p>Shipped GraphWrite, a self-hosted markdown note-taking app where notes branch into a tree shown in an interactive graph view, across 4 releases on web, Windows, macOS, Linux, and Android with ~2 MB desktop installers, by building every platform from a single React/TypeScript codebase on Tauri.</p></li>
            <li><p>Eliminated stutter when resizing the sidebar, cutting markdown re-rendering from every animation frame to zero, by caching CodeMirror decorations across layout-only updates and rebuilding them only on edits, cursor moves, or scrolling.</p></li>
            <li><p>Let anyone try the app with no account, install, or server at <a href="https://graphwrite.app/demo" target="_blank" rel="noopener noreferrer">graphwrite.app/demo</a>, by writing an IndexedDB storage adapter that follows the same contract as the Express backend's API, so the unchanged app runs fully in the browser.</p></li>
          </ul>
        </div>
        <div className="content" style={{paddingTop: "4pt"}}>
          <div style={{display: "flex"}}>
            <p style={{fontWeight: "bold"}}>Silmari</p>
            <Pipe />
            <a 
              href="https://github.com/seojoonlee-dev/silmari"
              target="_blank" 
              rel="noopener noreferrer"
            >GitHub</a>
            <p style={{marginLeft: "auto", fontWeight: "bold"}}>Sep. 2026</p>
          </div>
          <p style={{fontStyle: "italic"}}>React, TypeScript, Python, FastAPI, SQLite, vLLM, Tailscale</p>
          <ul>
            <li><p>Won the People's Choice Award among 40+ projects at the GDGoC Korea University BYPP Hackathon, by building Silmari alone overnight, a memory aid for people with ADHD that turns screen captures into a searchable timeline with a local vision model, later featured in a judge's <a href="https://youtu.be/glUuyvN1lBU?t=350" target="_blank" rel="noopener noreferrer">YouTube video</a>.</p></li>
            <li><p>Made recording work with no install across Chrome, Edge, Firefox, and Safari on Windows, macOS, and Linux, by capturing frames in the browser with getDisplayMedia and serving the React frontend and FastAPI backend from a single URL.</p></li>
          </ul>
        </div>
        <Section name="LEADERSHIP & ACTIVITIES"/>
        <div className="content">
          <div style={{display: "flex"}}>
            <p style={{fontWeight: "bold"}}>Google Developer Groups on Campus Korea University</p>
            <Pipe />
            <p>Seoul, South Korea</p>
            <p style={{marginLeft: "auto", fontWeight: "bold"}}>Aug. 2026 – Present</p>
          </div>
          <p style={{fontWeight: "bold", fontStyle: "italic"}}>General Software Developer</p>
          <ul>
            <li>
              <p>Developing the chapter's new official website as the lead front-end developer on a 12-person team, also contributing to the backend.</p>
            </li>
          </ul>
        </div>
        <Section name="SKILLS"/>
        <div className="content">
          <ul>
            <li>
              <p><span style={{fontWeight: "bold"}}>Programming Languages:</span> TypeScript, JavaScript, HTML/CSS, Python, Bash, Swift, C#</p>
            </li>
            <li>
              <p><span style={{fontWeight: "bold"}}>Frameworks & Tools:</span> React.js, Node.js, Express, Flask, FastAPI, pandas, PyTorch, Docker, SQLite, Linux</p>
            </li>
            <li>
              <div style={{display: "flex"}}>
                <p><span style={{fontWeight: "bold"}}>Spoken Languages:</span> Korean (Native), English (Fluent)</p>
                <Pipe />
                <p><span style={{fontWeight: "bold"}}>Work Authorization:</span> U.S. Citizen</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
