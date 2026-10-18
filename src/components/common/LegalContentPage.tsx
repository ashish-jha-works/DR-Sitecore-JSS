import { JSX, useLayoutEffect } from 'react';
import { CustomRichText } from 'src/common/SitecoreOverrides';

export default function LegalContentPage({ fields }: any): JSX.Element {
  useLayoutEffect(() => {
    openDetailsFromHash();
    window.addEventListener('hashchange', openDetailsFromHash);
    return () => window.removeEventListener('hashchange', openDetailsFromHash);
  }, [fields?.content]);

  return (
    <section className="LegalContentPage">
      <div className="LegalContentPage__inner">
        <CustomRichText field={fields?.content} className="LegalContentPage__content" />
      </div>
    </section>
  );
}

function openDetailsFromHash(): void {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return;

  const target = document.getElementById(hash);
  if (!target) return;

  if (target instanceof HTMLDetailsElement) {
    target.open = true;
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
