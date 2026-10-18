import { JSX, useEffect, useState } from 'react';

import type { AppProps } from 'next/app';
import { I18nProvider } from 'next-localization';
import { SitecorePageProps } from 'lib/page-props';
import Bootstrap from 'src/Bootstrap';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApolloProvider } from '@apollo/client/react';
import { createApolloClient } from 'lib/apollo-client';
import Script from 'next/script';
import 'assets/app.css';
import { bindAnalyticsClicks } from 'src/utils/analytics';
import RecaptchaObserver from 'components/RecaptchaObserver';
import { useRouteGuard } from 'src/auth/useRouteGuard';
import { useUserStore } from 'src/store/useUserStore';

function App({ Component, pageProps }: AppProps<SitecorePageProps>): JSX.Element {
  const { IsBlackListedOrGR } = useUserStore();
  const { dictionary, ...rest } = pageProps;
  const guardState = useRouteGuard(IsBlackListedOrGR);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  const [apolloClient] = useState(() => createApolloClient());

  useEffect(() => {
    bindAnalyticsClicks('[data-analytics-value]');
  }, []);

  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}');
          `,
        }}
      />
      <RecaptchaObserver />

      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <Bootstrap {...pageProps} />
          <I18nProvider lngDict={dictionary} locale={pageProps.locale}>
            {/* Allow the same page content to access only when it is authorized to that user by routeGuard */}
            {guardState === 'AUTHORIZED' && <Component {...rest} />}
          </I18nProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </>
  );
}

export default App;
