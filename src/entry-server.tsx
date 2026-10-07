import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import { routes } from "./routes";
import { projects } from "./data/projects";

export const paths = ["/", "/profile", ...projects.map((p) => `/projects/${p.slug}`)];

export async function render(path: string) {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`https://seojoonlee.dev${path}`));
  if (context instanceof Response) throw new Error(`redirect at ${path}`);
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} />
    </StrictMode>,
  );
}
