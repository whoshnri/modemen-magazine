// components/blog/ArticleRenderer.tsx
"use client";

import React, { useMemo, ReactElement, isValidElement } from "react";
import parse, { DOMNode, Element, domToReact } from "html-react-parser";

interface ArticleRendererProps {
  htmlContent: string;
  ads: ReactElement[]; 
}

export function ArticleRenderer({ htmlContent, ads }: ArticleRendererProps) {
  const contentWithAds = useMemo(() => {
    if (!htmlContent) return [];

    const parsedNodes = parse(htmlContent);
    const nodes = Array.isArray(parsedNodes) ? parsedNodes : [parsedNodes];

    const blockElements = nodes.filter(
      (node) => isValidElement(node) && typeof node.type === "string"
    ) as ReactElement[];

    if (blockElements.length < 4 || ads.length === 0) {
      return blockElements;
    }
    const insertionIndex = Math.floor(blockElements.length / 2);
    let adsInjected = 0;

    const finalContent: ReactElement[] = [];

    blockElements.forEach((element, index) => {
      finalContent.push(element);

      if (index === insertionIndex && adsInjected < ads.length) {
        finalContent.push(
          <div key={`ad-${adsInjected}`} className="my-8 md:my-12">
            {ads[adsInjected]}
          </div>
        );
        adsInjected++;
      }
    });

    return finalContent;
  }, [htmlContent, ads]);
  return (
    <article className="prose prose-invert prose-p:text-muted-foreground prose-h1:tracking-widest prose-h1:text-gold-primary prose-headings:text-foreground mx-auto w-full max-w-4xl">
      {contentWithAds}
    </article>
  );
}
