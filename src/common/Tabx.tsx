import React, { useEffect, useRef, useState } from 'react';

export interface TabItem {
  id: number | string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  containerClasslist?: string;
  headerClasslist?: string;
  defaultActiveTab?: number | string;
  activeTabId?: number | string;
  onTabChange?: (tabId: number | string) => void;
}

export default function Tabs({
  tabs,
  containerClasslist = '',
  headerClasslist = '',
  defaultActiveTab,
  activeTabId,
  onTabChange,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState<number | string>(
    activeTabId ?? defaultActiveTab ?? tabs[0]?.id
  );
  const [underlineStyle, setUnderlineStyle] = useState<React.CSSProperties>({});
  const [showUnderline, setShowUnderline] = useState(false);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initTabs = () => {
    if (typeof window === 'undefined') return;

    const activeIndex = tabs.findIndex((tab: any) => tab.id === activeTab);
    const activeTabElement = tabRefs.current[activeIndex];

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

    setTimeout(() => {
      setShowUnderline(true);
    }, 100);
  };

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(initTabs);
    } else {
      initTabs();
    }

    window.addEventListener('resize', initTabs);
    return () => window.removeEventListener('resize', initTabs);
  }, [activeTab, tabs]);

  useEffect(() => {
    if (activeTabId !== undefined) {
      setActiveTab(activeTabId);
    }
  }, [activeTabId]);

  return (
    <div className={`pb-6 md:pb-10 ${containerClasslist}`}>
      {/* Tabs Header */}
      <div
        className={`border-b border-lilac-200 mb-6 md:mb-10 tabs-wrapper overflow-auto no-scrollbar ${headerClasslist}`}
      >
        <div className="relative inline-block min-w-full text-center">
          <ul className="inline-flex gap-4">
            {tabs.map((tab: any, index: any) => (
              <li key={tab.id}>
                <button
                  ref={(el: any) => (tabRefs.current[index] = el)}
                  className={`link-btn text-[14px] leading-5 font-bold py-3 px-4 whitespace-nowrap transition-colors
                    ${
                      activeTab === tab.id ? 'text-navy-500' : 'text-navy-400 hover:text-navy-500'
                    }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (activeTabId === undefined) {
                      setActiveTab(tab.id);
                    }
                    onTabChange?.(tab.id);
                  }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Underline */}
          <span
            className={`inline-block h-[3px] bg-lilac-500 absolute -bottom-px transition-all duration-300 ${
              showUnderline ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
            style={underlineStyle}
          />
        </div>
      </div>

      {/* Tabs Content - Persists state by hiding instead of unmounting */}
      <div className="tab-content">
        {tabs.map((tab: any) => (
          <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
