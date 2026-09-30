import { Link } from "react-router";
import Section from "./Section";
import Pipe from "./Pipe";

export default function Reumse() {
  return(
    <>
      <div className="view">
        <Link to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.666em" height="1.666em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M13.83 19a1 1 0 0 1-.78-.37l-4.83-6a1 1 0 0 1 0-1.27l5-6a1 1 0 0 1 1.54 1.28L10.29 12l4.32 5.36a1 1 0 0 1-.78 1.64"></path>
          </svg>
        </Link>
        <h1>Seojoon Lee</h1>
        <div className="contacts">
          <p>developer.seojoonlee@gmail.com</p>
          <p>|</p>
          <p>+82 10-4161-1462</p>
          <p>|</p>
          <a 
            href="https://github.com/seojoonlee-dev"
            target="_blank" 
            rel="noopener noreferrer"
          >github.com/seojoonlee-dev</a>
        </div>
        <Section name="EDUCATION"/>
        <div className="content">
          <div style={{display: "flex"}}>
            <p style={{fontWeight: "bold"}}>Korea University</p>
            <Pipe />
            <p>Seoul, South Korea</p>
            <p style={{marginLeft: "auto", fontWeight: "bold"}}>Expected Feb. 2030</p>
          </div>
          <p style={{fontStyle: "italic", fontWeight: "bold"}}>B.S. in Artifical Intelligence</p>
          <ul>
            <li><p>GPA: 4.15/4.5</p></li>
            <li><p>Relevant Coursework: Data Structures, Mathmatics for Computer Science, Data Science and Artificial Intelligence </p></li>
          </ul>
        </div>
        <Section name="EXPERIENCE"/>
        <div className="content">
          <div style={{display: "flex"}}>
            <p style={{fontWeight: "bold"}}>Barreleye</p>
            <p>&nbsp;(AI medical ultrasound startup)</p>
            <Pipe />
            <p>Seoul, South Korea</p>
            <p style={{marginLeft: "auto", fontWeight: "bold"}}>June 2026 - Aug. 2026</p>
          </div>
          <p style={{fontStyle: "italic", fontWeight: "bold"}}>Software Engineering Intern</p>
          <ul>
            <li><p>Developed a benchmarking platform with Python to evaluate the lesion clustering algorithm for Vis-BUS, the company's AI breast ultrasound product, reducing the test time of the ~3,000-sample dataset from 10 minutes on an RTX 3060 to 0.2 seconds even without a GPU.</p></li>
            <li><p>Designed and built a web interface (Flask) with SQLite run storage, letting engineers inspect single exams, track lesions across a patient's visits, and compare two runs side by side.</p></li>
            <li><p>Built an interactive exam viewer that colors each scan by its true lesion and overlays the algorithm's clusters as lassos, so engineers could spot misclustered scans at a glance and click through to original DICOM images.</p></li>
            <li><p>Designed a distance-weighted scoring metric based on macro F1, fixing cases where the standard metric (ARI) gave serious and minor clustering errors the same score, and built it to support training future clustering models.</p></li>
          </ul>
        </div>
        <Section name="PROJECTS"/>
        <div className="content">
          <div style={{display: "flex"}}>
            <p style={{fontWeight: "bold"}}>GraphWrite</p>
            <Pipe />
            <p>graphwrite.app</p>
            <p style={{marginLeft: "auto", fontWeight: "bold"}}>Dec. 2025 - Present</p>
          </div>
          <p style={{fontStyle: "italic"}}>React, TypeScript, Tauri, CodeMirror, React Flow, Node.js, Docker</p>
        </div>
        <Section name="LEADERSHIP & ACTIVITIES"/>
        <div className="content">
          <div style={{display: "flex"}}>
            <p style={{fontWeight: "bold"}}>Graphwrite</p>
          </div>
        </div>
        <Section name="SKILLS"/>
        <div className="content">
          <div style={{display: "flex"}}>
            <p style={{fontWeight: "bold"}}>Graphwrite</p>
          </div>
        </div>
      </div>
    </>
  )
}
