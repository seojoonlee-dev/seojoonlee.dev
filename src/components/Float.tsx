import type { ReactNode } from "react";
import { mouse } from "../lib/vars";
import { driftPath, useDriftScale } from "../lib/drift";

type FloatProps = {
  kx?: number;
  ky?: number;
  ax?: number;
  fill?: boolean;
  children: ReactNode;
};

export default function Float({ kx, ky, ax, fill, children }: FloatProps) {
  const k = useDriftScale();
  const f = fill ? " fill" : "";
  let node = children;
  if (ax !== undefined) {
    node = (
      <div className={`drift${f}`} style={{ offsetPath: driftPath(ax, k) }}>
        {node}
      </div>
    );
  }
  if (kx !== undefined) {
    node = (
      <div className={`mouse${f}`} {...mouse(kx, ky ?? kx)}>
        {node}
      </div>
    );
  }
  return <>{node}</>;
}
