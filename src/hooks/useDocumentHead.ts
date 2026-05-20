import { useEffect } from 'react';

interface HeadOptions {
  title: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  canonicalPath?: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_TITLE = 'Developer Atlas';
const BASE_URL = 'https://Emmanr-eng.github.io/developer-atlas-V.2';

function setMeta(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
    || document.querySelector<HTMLMetaElement>(`meta[name="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('article:')) {
      el.setAttribute('property', property);
    } else {
      el.setAttribute('name', property);
    }
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function setJsonLd(data: Record<string, unknown>) {
  let script = document.querySelector<HTMLScriptElement>('script[data-head="jsonld"]');
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-head', 'jsonld');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function useDocumentHead(options: HeadOptions) {
  useEffect(() => {
    const prevTitle = document.title;

    // Title
    document.title = options.title
      ? `${options.title} | ${BASE_TITLE}`
      : BASE_TITLE;

    // Description
    const desc = options.description || 'A full-stack developer portfolio powered by React, Firebase, and Google Gemini AI.';
    setMeta('description', desc);
    setMeta('og:description', desc);

    // Open Graph
    setMeta('og:title', document.title);
    setMeta('og:type', options.ogType || 'website');
    setMeta('og:url', options.canonicalPath ? `${BASE_URL}/${options.canonicalPath}` : BASE_URL);
    if (options.ogImage) {
      setMeta('og:image', options.ogImage);
    }

    // Twitter card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', document.title);
    setMeta('twitter:description', desc);

    // Canonical
    setCanonical(options.canonicalPath ? `${BASE_URL}/${options.canonicalPath}` : BASE_URL);

    // JSON-LD
    if (options.jsonLd) {
      setJsonLd(options.jsonLd);
    }

    return () => {
      document.title = prevTitle;
    };
  }, [options.title, options.description, options.ogImage, options.ogType, options.canonicalPath]);
}
