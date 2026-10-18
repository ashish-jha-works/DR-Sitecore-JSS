import { CustomImage, CustomLink, Text } from 'src/common/SitecoreOverrides';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: replace `any` with proper type
export default function Landing({ fields }: any) {
  return (
    <section className="relative z-10 min-h-[90vh] w-full overflow-hidden bg-white-pure px-4 pt-6 pb-15 sm:px-10">
      <CustomImage
        field={fields?.backgroundImage}
        className="absolute bottom-0 left-0 max-w-230.5 h-137.5 w-full object-cover -z-10"
      />

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="col-span-1 sm:col-span-4 sm:order-1">
            <div className="text-center sm:text-left">
              <CustomLink field={fields?.logoLink} className="inline-block">
                <CustomImage field={fields?.logoImage} className="w-23.75" />
              </CustomLink>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-12 sm:order-3">
            <div className="mt-4 sm:mt-10">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <Text
                    tag="h1"
                    field={fields?.title}
                    className="font-colgent text-display-3 sm:text-[48px] sm:leading-12.75 sm:tracking-[3.24px] sm:pr-3 text-black mb-8 sm:mb-6"
                  />

                  <Text
                    tag="p"
                    field={fields?.subTitle}
                    className="text-body-xs sm:text-heading-3 text-black font-light mb-4"
                  />

                  <ul className="list-none p-0 m-0 mb-6 sm:mb-4">
                    {fields?.features?.map((feature: any, index: number) => (
                      <li
                        key={index}
                        className="text-body-xs sm:text-heading-3 text-black font-light mt-3 sm:mt-2 first:mt-0 flex items-start"
                      >
                        <span className="inline-block w-5 mr-3.5 shrink-0">
                          <CustomImage field={feature?.fields?.icon} className="max-w-full" />
                        </span>
                        <Text tag="span" field={feature?.fields?.text} />
                      </li>
                    ))}
                  </ul>
                  {fields?.qrCode &&
                    fields?.appStoreImage &&
                    fields?.googlePlayImage &&
                    fields?.googlePlayLink && (
                      <div className="flex mt-2 sm:mt-0 mb-0 sm:mb-4">
                        <div className="pr-6 sm:pr-8 relative">
                          <CustomImage field={fields?.qrCode} className="w-20 sm:w-31" />
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-15 bg-lilac-hover"></div>
                        </div>

                        <div className="pl-6 sm:pl-8 flex flex-col gap-5 sm:gap-5">
                          <CustomLink
                            field={fields?.appStoreLink}
                            className="block w-24 sm:w-40"
                            data-analytics-value="main_ios_appstore"
                          >
                            <CustomImage field={fields?.appStoreImage} className="w-full" />
                          </CustomLink>
                          <CustomLink
                            field={fields?.googlePlayLink}
                            className="block w-24 sm:w-40"
                            data-analytics-value="main_android_googleplay"
                          >
                            <CustomImage field={fields?.googlePlayImage} className="w-full" />
                          </CustomLink>
                        </div>
                      </div>
                    )}
                  <Text
                    tag="p"
                    field={fields?.downloadText}
                    className="text-body-xs sm:text-heading-3 text-black font-light mb-6 sm:mb-4"
                  />
                </div>

                <div className="col-span-1 hidden lg:block">
                  <CustomImage field={fields?.heroImage} className="w-full max-w-96.5 ml-auto" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 sm:col-span-8 sm:order-2">
            <div className="flex justify-start flex-wrap gap-2.5 mt-0 sm:mt-0 sm:h-full sm:items-center sm:justify-end">
              <CustomLink
                field={fields?.loginCTA}
                className="btn btn-secondary btn-xs"
              ></CustomLink>
              <CustomLink
                field={fields?.registerCTA}
                className="btn btn-secondary btn-xs"
              ></CustomLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
