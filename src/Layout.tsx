import { JSX } from 'react';
import Head from 'next/head';
import { Placeholder, LayoutServiceData, Field, HTMLLink } from '@sitecore-jss/sitecore-jss-nextjs';
import config from 'temp/config';
import Scripts from 'src/Scripts';
import GlobalLoader from 'src/components/GlobalLoader';
import ErrorModal from 'src/components/modals/ErrorModal';
import DirhamProvider from 'components/DirhamProvider/DirhamProvider';

const publicUrl = config.publicUrl;

interface LayoutProps {
  layoutData: LayoutServiceData;
  headLinks: HTMLLink[];
}

interface RouteFields {
  [key: string]: unknown;
  pageTitle: Field;
}

const Layout = ({ layoutData, headLinks }: LayoutProps): JSX.Element => {
  const { route } = layoutData.sitecore;
  console.log('Layout Data', route?.placeholders);
  const fields = route?.fields as RouteFields;

  return (
    <>
      <Scripts />
      <GlobalLoader />
      <ErrorModal />

      <Head>
        <title>{(fields?.pageTitle?.value ?? 'Page').toString()}</title>
        <link rel="icon" href={`${publicUrl}/favicon.ico`} />
        {headLinks.map((headLink) => (
          <link rel={headLink.rel} key={headLink.href} href={headLink.href} />
        ))}
      </Head>

      <DirhamProvider>
        <div className="font-filson bg-silver-chalice-50">
          {route && (
            <>
              <Placeholder name="jss-main" rendering={route} />
              <Placeholder name="jss-footer" rendering={route} />
            </>
          )}
        </div>
      </DirhamProvider>
    </>
  );
};

export default Layout;
