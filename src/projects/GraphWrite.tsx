import { Block, Items, Labeled, Paragraphs } from "../components/ProjectPage";
import graph from "../assets/projects/graphwrite-graph.webp";

export default function GraphWrite() {
  return (
    <>
      <Block delay={0.26} kx={14} ky={9}>
        <Labeled label="The idea">
          <Paragraphs>
            <p>A self-hosted, no-nonsense note taking app with live-preview markdown. No AI, no telemetry, no bloat. Just good old note taking.</p>
            <p>Your notes are connected, so you should be able to see how. Any note can branch into child notes, so a collection grows into a tree instead of a flat, scrolling list. Notes stay plain markdown files on disk, yours to grep, back up, or take elsewhere.</p>
          </Paragraphs>
        </Labeled>
      </Block>

      <Block delay={0.34} kx={30} ky={20} ax={12}>
        <figure className="page-figure">
          <img src={graph} alt="GraphWrite graph view: notes laid out as a left-to-right tree" />
          <figcaption className="labeled">
            <span className="label">Graph view</span>
            <span>Every note is a node and every branch an edge, laid out as a tidy left-to-right tree. Drag a branch onto another note to re-parent it, or drag out from a node to grow a new one.</span>
          </figcaption>
        </figure>
      </Block>

      <Block delay={0.42} kx={12} ky={8}>
        <Labeled label="Features">
          <Items
            items={[
              ["Branching notes", "Any note can hold child notes; the sidebar shows the whole tree."],
              ["Live-preview markdown", "Renders inline as you type, syntax hidden until you need it."],
              ["Wiki links", "Type [[name]] to link a child note, creating it if needed."],
              ["Themes", "Dark, AMOLED black and light, or a fully custom palette."],
            ]}
          />
        </Labeled>
      </Block>
    </>
  );
}
