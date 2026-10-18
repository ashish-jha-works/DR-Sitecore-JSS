import { CustomLink, CustomRichText, Text } from 'src/common/SitecoreOverrides';
import { useUserStore } from 'src/store/useUserStore';

export default function CtaTextCard({ fields }: any) {
  const { CommunityDisplayName } = useUserStore();

  return (
    <>
      {CommunityDisplayName === fields?.communityName?.value ? (
        <section className="CtaTextCard">
          <div className="container-sm my-5 md:my-6">
            <div className="bg-white-pure p-4 md:p-8 rounded-xl border border-solid border-lilac-300">
              <div className="flex flex-col md:flex-row md:items-center gap-5">
                <div className="grow">
                  <Text
                    field={fields?.title}
                    tag="h3"
                    className="text-heading-3 font-normal text-navy-500"
                  />
                  <Text
                    field={fields?.description}
                    tag="p"
                    className="text-body-sm font-light text-navy-500 mt-2 md:mt-3"
                  />
                </div>
                <div className="shrink-0">
                  <CustomLink
                    field={fields?.cta}
                    className="btn btn-primary h-11 lg:h-15 w-full lg:w-68.75 md:btn-sm"
                  >
                    <CustomRichText field={fields?.icon} />
                    {fields?.cta?.title || fields?.cta?.value?.title}
                  </CustomLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
