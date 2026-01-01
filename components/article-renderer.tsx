// components/blog/ArticleRenderer.tsx
"use client";

import React, { useMemo, ReactElement, JSX } from "react";
import parse, { DOMNode, Element, domToReact } from "html-react-parser";
import { AdBanner } from "@/components/ads/AdBanner";
import { useSession } from "@/hooks/use-session";

interface ArticleRendererProps {
  htmlContent: string;
  isPremium?: boolean;
  canAccess?: boolean;
  onLogin?: () => void;
  onUpgrade?: () => void;
  ads?: (JSX.Element | null)[];
}

export function ArticleRenderer({ htmlContent, isPremium = false, canAccess = false, onLogin, onUpgrade, ads = [] }: ArticleRendererProps) {
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
    if (contentArray.length > 4 && ads.length > 0) {
      const injectedContent: (JSX.Element | string)[] = [];
      // Calculate interval:
      // - Ensure we spread ads evenly.
      // - Ensure we don't spam: minimum 3 paragraphs between ads.
      // - If we have too many ads for the content length, we prioritize spacing over showing all ads.
      const rawInterval = Math.floor(contentArray.length / (ads.length + 1));
      const interval = Math.max(3, rawInterval); // Minimum 3 nodes between ads

      let adIndex = 0;
      contentArray.forEach((node, index) => {
        injectedContent.push(node);
        // Inject if:
        // 1. It's an interval match
        // 2. Not the last element
        // 3. We have ads left
        // 4. We are at least a few paragraphs in (index > 1) to avoid ad immediately at top
        if (index > 1 && (index + 1) % interval === 0 && index !== contentArray.length - 1 && adIndex < ads.length) {
          injectedContent.push(
            <div key={`ad-container-${index}`} className="my-12">
              {ads[adIndex]}
            </div>
          );
          adIndex++;
        }
      });
      if (isPremium && !canAccess) {
        return injectedContent.length > 3 ? injectedContent.slice(0, 3) : injectedContent;
      }
      return injectedContent;
    }

    if (isPremium && !canAccess) {
      return contentArray.length > 3 ? contentArray.slice(0, 3) : contentArray;
    }

    return contentArray;
  }, [htmlContent, isPremium, canAccess, ads]);

  const { session } = useSession();
  const showGuardrail = isPremium && !canAccess;


  return (
    <article className="max-w-4xl mx-auto w-full relative">
      {content}

      {showGuardrail && (
        <div className="absolute inset-x-0 bottom-0 h-[400px] bg-linear-to-b from-transparent via-gold-primary/10 to-gold-primary/20 flex flex-col items-center justify-end pb-12 z-20 ">
          <div className="text-center max-w-md p-6 border bg-black-primary border-gold-primary/30 ">
            <h3 className="text-2xl text-gold-primary mb-4">Premium Content</h3>
            <p className="text-muted-foreground mb-8">
              This article is reserved for Modemen members. Sign in or upgrade to continue reading.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!session && <button
                onClick={onLogin}
                className="px-8 py-3 bg-white text-black-primary font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors"
              >
                Sign In
              </button>}
              <button
                onClick={session ? onUpgrade : onLogin}
                className="px-8 py-3 bg-gold-primary text-black-primary font-bold uppercase tracking-widest text-xs hover:bg-gold-secondary transition-colors"
              >
                {session ? 'Upgrade to Premium' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

