// src/utils/analytics.ts
export const pushDataLayerEvent = (eventName: string, value?: string) => {
  if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      value: value,
    });
  }
};

export const bindAnalyticsClicks = (selector: string) => {
  const handleClick = (event: MouseEvent) => {
    const element = event.currentTarget as HTMLElement;

    // Determine event based on environment
    const targetEvent = window.location.origin.includes('residents.dubairesidential.ae')
      ? 'prod_event_goal'
      : 'sit_event_goal';

    const value = element.getAttribute('data-analytics-value') ?? undefined;

    pushDataLayerEvent(targetEvent, value);
  };

  const rebindListeners = () => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      el.removeEventListener('click', handleClick);
      el.addEventListener('click', handleClick);
    });
  };

  rebindListeners();

  // Observe dynamically added elements
  const observer = new MutationObserver(() => {
    rebindListeners();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
};
