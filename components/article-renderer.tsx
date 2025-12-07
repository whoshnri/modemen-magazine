// components/blog/ArticleRenderer.tsx
"use client";

import React, { useMemo, ReactElement, JSX } from "react";
import parse, { DOMNode, Element, domToReact } from "html-react-parser";

interface ArticleRendererProps {
  htmlContent: string;
  ads: ReactElement[];
}

export function ArticleRenderer({ htmlContent, ads }: ArticleRendererProps) {
  const content = useMemo(() => {
    if (!htmlContent) return null;

    const options = {
      replace: (domNode: DOMNode) => {
        if (domNode instanceof Element && domNode.name) {
          switch (domNode.name) {
            case 'h1':
              return <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-16 mb-8 text-gold-primary">{domToReact(domNode.children as DOMNode[], options)}</h1>;
            case 'h2':
              return <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-14 mb-6 text-white">{domToReact(domNode.children as DOMNode[], options)}</h2>;
            case 'h3':
              return <h3 className="text-2xl md:text-3xl font-bold tracking-wide mt-12 mb-6 text-white/90">{domToReact(domNode.children as DOMNode[], options)}</h3>;
            case 'h4':
              return <h4 className="text-xl md:text-2xl font-bold tracking-wide mt-10 mb-5 text-white/80">{domToReact(domNode.children as DOMNode[], options)}</h4>;
            case 'p':
              return <p className="leading-relaxed text-lg text-muted-foreground mb-8">{domToReact(domNode.children as DOMNode[], options)}</p>;
            case 'ul':
              return <ul className="list-disc pl-6 space-y-2 mb-8 text-muted-foreground">{domToReact(domNode.children as DOMNode[], options)}</ul>;
            case 'ol':
              return <ol className="list-decimal pl-6 space-y-2 mb-8 text-muted-foreground">{domToReact(domNode.children as DOMNode[], options)}</ol>;
            case 'li':
              return <li className="pl-2">{domToReact(domNode.children as DOMNode[], options)}</li>;
            case 'blockquote':
              return <blockquote className="border-l-4 border-gold-primary pl-6 italic text-xl my-10 text-white/80">{domToReact(domNode.children as DOMNode[], options)}</blockquote>;
          }
        }
      }
    };

    const parsedContent = parse(htmlContent, options);

    // Convert to array if single element
    const contentArray = Array.isArray(parsedContent) ? parsedContent : [parsedContent];

    // Inject Ads
    if (ads.length > 0 && contentArray.length > 4) {
      const injectedContent: (JSX.Element | string)[] = [];
      const interval = Math.floor(contentArray.length / (ads.length + 1));
      let adIndex = 0;

      contentArray.forEach((node, index) => {
        injectedContent.push(node);
        // Inject ad after every 'interval' blocks, but not at the very end
        if ((index + 1) % interval === 0 && adIndex < ads.length && index !== contentArray.length - 1) {
          injectedContent.push(
            <div key={`ad-${adIndex}`} className="my-12 flex justify-center w-full">
              {ads[adIndex]}
            </div>
          );
          adIndex++;
        }
      });
      return injectedContent;
    }

    return contentArray;
  }, [htmlContent, ads]);

  return (
    <article className="max-w-4xl mx-auto w-full">
      {content}
    </article>
  );
}
