import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CustomLink } from 'src/common/SitecoreOverrides';

import { Accordion } from 'components/common/Accordion';

export default function FAQs({ fields }: any) {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems = fields?.faqs?.[0]?.items ?? fields?.faqs?.[0]?.fields?.items ?? [];
  const currentPath = (router.asPath || '').split('?')[0].replace(/\/$/, '');
  const forceLastFaqBorder = currentPath === '/move-in' || currentPath === '/move-out';
  // SIT may send version as plain string/number ("2"); local/yml uses { value: 2 }
  const version = Number(fields?.version?.value ?? fields?.version ?? 1);

  const getFaqFields = (faq: any) =>
    faq?.fields
      ? { question: faq.fields.Question, answer: faq.fields.Answer }
      : { question: faq.Question, answer: faq.Answer };

  return (
    <section className={`FAQs py-8 md:pb-12 ${version == 2 ? '' : 'border-t border-t-lilac-200'}`}>
      <div className="container-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10">
          <div className="col-span-4">
            <Text
              tag="h3"
              field={fields?.title}
              className="text-heading-2 font-normal text-navy-500"
            />
            <CustomLink
              field={fields?.cta}
              className="btn btn-primary w-full md:w-68.75 px-0 h-11 md:h-15 uppercase hidden md:inline-flex mt-4"
            />
          </div>
          <div className="col-span-8">
            <div className="flex-col gap-2 md:gap-3">
              {faqItems.map((faq: any, index: number) => {
                const { question, answer } = getFaqFields(faq);
                const isLast = index === faqItems.length - 1;

                return (
                  <Accordion
                    key={index}
                    title={question}
                    // eslint-disable-next-line react/no-children-prop
                    children={answer}
                    version={version || 1}
                    isOpen={openIndex === index}
                    onToggle={() => setOpenIndex((prev) => (prev === index ? null : index))}
                    isLast={isLast}
                    forceBottomBorder={forceLastFaqBorder && isLast}
                  />
                );
              })}
            </div>
            <CustomLink
              field={fields?.cta}
              className="btn btn-primary md:hidden w-full px-0 h-11 uppercase inline-flex mt-4"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
