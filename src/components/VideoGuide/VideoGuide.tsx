import { Text } from '@sitecore-jss/sitecore-jss-nextjs';

export default function VideoGuide({ fields }: any) {
  return (
    <section className="VideoGuide my-8">
      <div className="container-sm">
        <Text
          tag="h3"
          field={fields?.heading}
          className="text-heading-2 font-normal text-navy-500 mb-4 md:mb-5"
        />
        <iframe
          className="h-108 w-full"
          src="https://www.youtube.com/embed/vyEdAIXSCGg?autoplay=0&rel=0"
          title="Dubai Residential - A new chapter of living."
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}
