'use client';

import { useEffect } from 'react';

export default function RecaptchaObserver() {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const potentialPopups = document.querySelectorAll('div[style*="z-index: 2000000000"]');

      potentialPopups.forEach((popup) => {
        const iframe = popup.querySelector('iframe[src*="recaptcha"]');

        if (iframe && !popup.classList.contains('custom-recaptcha-popup')) {
          popup.classList.add('custom-recaptcha-popup');
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
