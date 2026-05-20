import { useEffect } from 'react';

interface UseDocumentHeadOptions {
  title: string;
  description?: string;
  ogType?: string;
  canonicalPath?: string;
  jsonLd?: Record<string, unknown>;
}

function setMetaTag(
  selector: string,
  create: () => HTMLMetaElement | null,
  value: string | undefined,
) {
  if (!value) {
    return;
  }

  let tag = document.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = create();
    if (!tag) {
      return;
    }
    document.head.appendChild(tag);
  }

  tag.content = value;
}

export function useDocumentHead({
  title,
  description,
  ogType,
  canonicalPath,
  jsonLd,
}: UseDocumentHeadOptions) {
  useEffect(() => {
    document.title = title;

    setMetaTag(
      'meta[name="description"]',
      () => {
        const meta = document.createElement('meta');
        meta.name = 'description';
        return meta;
      },
      description,
    );

    setMetaTag(
      'meta[property="og:type"]',
      () => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:type');
        return meta;
      },
      ogType,
    );

    if (canonicalPath) {
      const canonicalHref = `${window.location.origin}/${canonicalPath.replace(/^\/+/, '')}`;
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = canonicalHref;
    }

    let jsonLdScript = document.querySelector('script[data-document-head-json-ld="true"]') as
      | HTMLScriptElement
      | null;

    if (jsonLd) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.type = 'application/ld+json';
        jsonLdScript.dataset.documentHeadJsonLd = 'true';
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(jsonLd);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }
  }, [title, description, ogType, canonicalPath, jsonLd]);
}
