'use client';

import { useEffect, useRef } from 'react';

const AED_REGEX = /AED|درهم|دراهم|درهمًا|درهما/g;
const PROCESSED_ATTR = 'data-aed-processed';

export default function DirhamProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const replaceAED = (root: Node) => {
      // 1. Validation
      if (!root || (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE)) {
        return;
      }

      // 2. Find text nodes
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (
            !node.nodeValue ||
            !AED_REGEX.test(node.nodeValue) ||
            parent?.closest(`[${PROCESSED_ATTR}]`) ||
            parent?.tagName === 'SCRIPT' ||
            parent?.tagName === 'STYLE'
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      const nodesToReplace: Text[] = [];
      while (walker.nextNode()) nodesToReplace.push(walker.currentNode as Text);

      // 3. Perform replacement
      nodesToReplace.forEach((node) => {
        const span = document.createElement('span'); // Using span for valid HTML
        span.setAttribute(PROCESSED_ATTR, 'true');
        span.className = 'dirham-wrapper';

        // We use innerHTML to inject your specific markup
        span.innerHTML = node.nodeValue!.replace(
          AED_REGEX,
          `<span class="dirham-logo">
            <span class="dirham-text">AED</span>
          </span>`
        );

        node.parentNode?.replaceChild(span, node);
      });
    };

    // Initial run
    if (containerRef.current) replaceAED(containerRef.current);

    // Mutation Observer for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) replaceAED(node.parentNode!);
            else if (node.nodeType === Node.ELEMENT_NODE) replaceAED(node);
          });
        } else if (mutation.type === 'characterData') {
          replaceAED(mutation.target.parentNode!);
        }
      });
    });

    observer.observe(containerRef.current!, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
