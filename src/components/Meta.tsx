export const SITE = "https://seojoonlee.dev";

type MetaProps = {
  title: string;
  description: string;
  path?: string;
  image: string;
};

export default function Meta({ title, description, path, image }: MetaProps) {
  const url = path === undefined ? undefined : `${SITE}${path}`;
  const img = `${SITE}${image}`;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Seojoon Lee" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
    </>
  );
}

export function Person() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Seojoon Lee",
    jobTitle: "Software Developer",
    url: SITE,
    email: "mailto:developer.seojoonlee@gmail.com",
    sameAs: ["https://github.com/seojoonlee-dev"],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
