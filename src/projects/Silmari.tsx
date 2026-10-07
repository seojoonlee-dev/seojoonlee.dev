import { Block, Items, Labeled, Paragraphs } from "../components/ProjectPage";

export default function Silmari() {
  return (
    <>
      <Block delay={0.26} kx={14} ky={9}>
        <Labeled label="The idea">
          <Paragraphs>
            <p>Silmari is Korean for the loose end of a thread: the clue that lets you untangle something.</p>
            <p>It is built for ADHD working memory, the constant “where was I?” after every interruption. Silmari watches your screen and remembers it for you: what was open, what you were doing, what you left unfinished, and which notifications you dismissed. Scrub back to any moment, or just ask.</p>
          </Paragraphs>
        </Labeled>
      </Block>

      <Block delay={0.34} kx={22} ky={15}>
        <Labeled label="How it works">
          <ol className="steps">
            <li>
              <span className="label">I</span>
              <span className="item-title">Capture</span>
              The browser records one frame every three seconds. Chrome, Edge, Firefox and Safari, on any OS, with nothing to install.
            </li>
            <li>
              <span className="label">II</span>
              <span className="item-title">Understand</span>
              A vision model on your own machine names every window on screen and keeps track of it from frame to frame.
            </li>
            <li>
              <span className="label">III</span>
              <span className="item-title">Remember</span>
              Each stretch of work gets a short narrative, a list of loose ends, and questions you can ask about it.
            </li>
          </ol>
          <p className="steps-note">Nothing leaves your own server. There is no cloud API in the loop.</p>
        </Labeled>
      </Block>

      <Block delay={0.42} kx={12} ky={8}>
        <Labeled label="Features">
          <Items
            items={[
              ["Timeline", "One lane per window, drawn while it was on screen. Hover to scrub through the saved frames."],
              ["Notifications", "Recorded when they appear, marked dismissed when they vanish."],
              ["Ask your day", "A chat that answers from the actual screenshots and links the times it mentions."],
              ["Korean and English", "For the interface and for everything the model writes."],
            ]}
          />
        </Labeled>
      </Block>
    </>
  );
}
