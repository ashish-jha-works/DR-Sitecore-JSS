import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import useExperienceEditor from 'src/hooks/useExperienceEditor';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function TabLayout(props: any) {
  const inExperienceEditor = useExperienceEditor();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const receivedActiveTab = searchParams.get('activeTab');

  const tabsList = useMemo(
    () => props?.rendering?.fields?.items || [],
    [props?.rendering?.fields?.items]
  );

  const findTabIndex = useCallback(
    (tabKey?: string | null) => {
      if (!tabKey) return -1;

      return tabsList.findIndex((tab: any) => {
        const candidates = [
          tab.fields?.Key?.value,
          tab.fields?.Label?.value,
          tab.name,
          tab.displayName,
        ];

        return candidates.some((candidate) => isSameTabKey(candidate, tabKey));
      });
    },
    [tabsList]
  );

  const [activeTab, setActiveTab] = useState(() => {
    const index = findTabIndex(receivedActiveTab);
    return index !== -1 ? index : 0;
  });

  const [underlineStyle, setUnderlineStyle] = useState<React.CSSProperties>({});
  const [showUnderline, setShowUnderline] = useState(false);

  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const previousActiveTabParam = useRef<string | null>(null);

  const syncTabToUrl = (index: number) => {
    const key = tabsList[index]?.fields?.Key?.value;
    const params = new URLSearchParams(searchParams.toString());

    if (index === 0 || normalizeTabKey(key) === normalizeTabKey('MyCommunity')) {
      params.delete('activeTab');
    } else if (key) {
      params.set('activeTab', key);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  useEffect(() => {
    // Query cleared (e.g. browser Back) → return to My Community
    if (!receivedActiveTab) {
      if (previousActiveTabParam.current) {
        setActiveTab(0);
      }
      previousActiveTabParam.current = null;
      return;
    }

    previousActiveTabParam.current = receivedActiveTab;

    const tabIndex = findTabIndex(receivedActiveTab);

    // Never set -1 — that hides every tab panel
    if (tabIndex !== -1) {
      setActiveTab(tabIndex);
    }
  }, [receivedActiveTab, findTabIndex]);

  const updateUnderline = useCallback(() => {
    if (typeof window === 'undefined') return;

    const activeTabElement = tabRefs.current[activeTab];
    if (!activeTabElement) return;

    const tabsWrapper = activeTabElement.closest('.tabs-wrapper') as HTMLElement;
    if (!tabsWrapper) return;

    const tabOffsetLeft = activeTabElement.offsetLeft;
    const tabWidth = activeTabElement.offsetWidth;

    setUnderlineStyle({
      left: `${tabOffsetLeft}px`,
      width: `${tabWidth}px`,
    });

    tabsWrapper.scrollTo({
      left: tabOffsetLeft - 20,
      behavior: 'smooth',
    });

    setTimeout(() => setShowUnderline(true), 100);
  }, [activeTab]);

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(updateUnderline);
    } else {
      updateUnderline();
    }

    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [activeTab, updateUnderline]);

  return (
    <div className="TabLayout bg-silver-chalice-50">
      <div className="text-center border-b border-lilac-200 mb-6 md:mb-10 tabs-wrapper overflow-auto no-scrollbar">
        <div className="relative">
          <ul className="inline-flex gap-4">
            {tabsList.map((tab: any, index: number) => (
              <li key={index}>
                <button
                  ref={(el: any) => (tabRefs.current[index] = el)}
                  className={`link-btn text-[14px] leading-5 font-bold py-3 px-4 whitespace-nowrap transition-colors
                    ${activeTab === index ? 'text-navy-500' : 'text-navy-400 hover:text-navy-500'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(index);
                    syncTabToUrl(index);
                  }}
                >
                  {tab.fields?.Label?.value}
                </button>
              </li>
            ))}
          </ul>
          <span
            className={`inline-block h-[3px] bg-lilac-500 absolute -bottom-px transition-all duration-300 ${
              showUnderline ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            style={underlineStyle}
          />
        </div>
      </div>
      <div className="tab-content px-4 md:px-0 [&_.container-sm]:px-0 md:[&_.container-sm]:px-3">
        {tabsList.map((_: any, index: number) => (
          <div
            key={index}
            className={activeTab === index || inExperienceEditor ? 'block' : 'hidden'}
          >
            <Placeholder name={`tab-content-${index + 1}`} rendering={props.rendering} />
          </div>
        ))}
      </div>
    </div>
  );
}
const normalizeTabKey = (str?: string | null) =>
  (str ?? '')
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase()
    .replace(/ing/g, '');

const isSameTabKey = (left?: string | null, right?: string | null) => {
  const a = normalizeTabKey(left);
  const b = normalizeTabKey(right);
  if (!a || !b) return false;
  return a === b || a.includes(b) || b.includes(a);
};
