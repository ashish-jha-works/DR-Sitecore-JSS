import Image from 'next/image';
import Link from 'next/link';

export default function Custom500() {
  const socialLinks = [
    {
      href: 'https://www.youtube.com/@Dubai.Residential',
      icon: '/assets/svg/youtube.svg',
      alt: 'Youtube',
    },
    {
      href: 'https://www.facebook.com/DubaiAMLife/',
      icon: '/assets/svg/facebook.svg',
      alt: 'Facebook',
    },
    {
      href: 'https://www.linkedin.com/company/dubairesidential/',
      icon: '/assets/svg/linkedin.svg',
      alt: 'LinkedIn',
    },
    {
      href: 'https://www.instagram.com/dubairesidential',
      icon: '/assets/svg/instagram.svg',
      alt: 'Instagram',
    },
  ];
  return (
    <section className="relative z-10 min-h-[90vh] w-full overflow-hidden bg-white-pure">
      <header className="GuestHeader sticky top-0 z-1000">
        <div className=" text-white-pure bg-navy-500 text-body-xs font-normal px-9 py-6 2xl:py-3 2xl:px-8 h-23.5 xl:h-auto">
          <div className="hidden xl:block">
            <div className="flex gap-6">
              <div className="shrink">
                <Link href="/">
                  <Image
                    src="/assets/svg/dubai-residential-logo-abstract.svg"
                    className="w-22.5"
                    alt="Logo"
                    width={100}
                    height={100}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="xl:hidden">
            <div className="flex gap-6">
              <div className="grow">
                <div className="h-11.5 flex justify-center items-center relative">
                  <Link
                    href="/"
                    className="h-full absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 transition-default"
                  >
                    <Image
                      src="/assets/svg/dubai-residential-logo-abstract.svg"
                      className="h-full"
                      alt="Logo"
                      width={100}
                      height={100}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="error-container relative z-10 lg:min-h-[90vh] w-full overflow-hidden bg-white-pure">
        <Image
          src="/assets/images/maintenance-static-bg.png"
          className="absolute bottom-0 left-0 max-w-230.5 h-137.5 w-full object-cover -z-10"
          alt="background Image"
          width={100}
          height={100}
        />
        <div className="container-sm py-16 lg:py-20 px-5 lg:px-auto">
          <div className="flex flex-col items-center justify-center gap-8 lg:gap-10">
            <h3 className="font-colgent text-[30px] leading-[38px] lg:text-display-3 font-normal">
              500 - Server Error
            </h3>
            <Image
              className="error-image"
              src="/assets/svg/error.svg"
              alt="Error"
              width={294}
              height={210}
            />
            <p className="text-body lg:text-heading-3 font-light text-center">
              Sorry, something went wrong.
              <br />
              We’re working to fix the problem; please check back soon.
            </p>
            <div className="btn-wrapper flex flex-col lg:flex-row justify-center items-center gap-4 md:gap-6 w-full">
              <Link href="/" className="btn-primary w-full lg:max-w-74.5">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer className="relative p-8 xl:p-18 xl:pt-14 text-white-pure bg-navy-500 overflow-visible">
        <div className="border-b border-solid border-lilac-200 pb-10 xl:pb-6">
          <div className="flex flex-col xl:flex-row gap-x-6">
            <div className="grow">
              <Link href="/" className="w-32.5 lg:w-35">
                <Image
                  src="/assets/svg/dubai-residential-logo-abstract.svg"
                  className="w-full"
                  alt="Logo"
                  width={100}
                  height={100}
                />
              </Link>
            </div>
            <div className="shrink flex xl:hidden items-center">
              <ul className="flex gap-4 mt-10 xl:mt-0">
                {socialLinks.map((link, index) => (
                  <li className="flex justify-center items-center" key={index}>
                    <Link href={link.href} target="_blank" className="size-5">
                      <Image
                        src={link.icon}
                        className="max-w-full"
                        alt={link.alt}
                        width={100}
                        height={100}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink flex items-center">
              <Link
                className="px-4 py-2 items-center gap-3 rounded-xl border border-solid border-lilac-500 mt-10 mb-5 xl:m-0"
                href={'tel:8009933'}
              >
                <svg width="30" height="30" viewBox="0 0 24 24">
                  <path
                    d="M1.01281 17.6187C1.20895 19.1093 1.94098 20.4775 3.07215 21.4677C4.20333 22.458 5.65631 23.0027 7.15972 23C15.8939 23 23 15.8939 23 7.15984C23.0027 5.65644 22.458 4.20347 21.4677 3.0723C20.4774 1.94113 19.1093 1.20912 17.6187 1.01298C17.2418 0.966954 16.8601 1.04407 16.5306 1.2328C16.2011 1.42154 15.9415 1.71178 15.7905 2.06019L13.4672 7.24674V7.25994C13.3516 7.52664 13.3039 7.81782 13.3283 8.10747C13.3526 8.39712 13.4484 8.67623 13.6069 8.91985C13.6267 8.94955 13.6476 8.97705 13.6696 9.00455L15.9599 11.7194C15.136 13.3936 13.3847 15.1294 11.6885 15.9555L9.01105 13.6774C8.98476 13.6553 8.95721 13.6347 8.92855 13.6158C8.68512 13.4534 8.40506 13.3543 8.11369 13.3274C7.82232 13.3006 7.52885 13.3467 7.25982 13.4618L7.24552 13.4684L2.06333 15.7905C1.7143 15.941 1.42335 16.2004 1.23399 16.5299C1.04463 16.8594 0.967039 17.2414 1.01281 17.6187ZM2.75964 17.3987C2.75964 17.3987 2.76734 17.3987 2.77174 17.3987L7.94183 15.0832L10.6204 17.3613C10.6464 17.3833 10.6735 17.4039 10.7018 17.4229C10.9551 17.5919 11.2478 17.6923 11.5515 17.7143C11.8552 17.7362 12.1593 17.6791 12.4343 17.5483C14.4946 16.5528 16.5484 14.5145 17.545 12.4762C17.677 12.2032 17.7362 11.9008 17.7169 11.5982C17.6976 11.2957 17.6005 11.0032 17.435 10.7492C17.4163 10.7193 17.3954 10.691 17.3723 10.6645L15.0799 7.94634L17.3899 2.77629C17.3903 2.77191 17.3903 2.76748 17.3899 2.76309C18.4566 2.90224 19.4361 3.42548 20.1448 4.23482C20.8535 5.04415 21.2428 6.08407 21.24 7.15984C21.2359 10.8929 19.7511 14.4718 17.1115 17.1115C14.4718 19.7511 10.8928 21.2359 7.15972 21.24C6.08461 21.2437 5.04495 20.8557 4.23515 20.1485C3.42533 19.4413 2.90081 18.4634 2.75964 17.3976V17.3987Z"
                    fill="currentColor"
                  />
                </svg>
                <p className="text-body-sm whitespace-nowrap flex flex-col gap-2">
                  <span>Customer Care</span>
                  <span>800 9933</span>
                </p>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-10 xl:mt-8">
          <div className="flex flex-col xl:flex-row gap-x-6">
            <div className="shrink flex items-center">
              <p className="text-body-xs font-medium mb-8 xl:mb-0">© 2026. DUBAI RESIDENTIAL.</p>
            </div>
            <div className="grow flex flex-wrap gap-5 xl:flex-nowrap xl:justify-center xl:items-center">
              <p className="text-body-xs font-medium xl:mb-0 w-full xl:w-auto">
                Download the DUBAI RESIDENTIAL LIFE APP TODAY
              </p>
              <Link href="https://apps.apple.com/app-link" className="w-35 xl:w-30">
                <Image
                  src="/assets/svg/app-store.svg"
                  className="w-full"
                  alt="Download on the App Store"
                  width={100}
                  height={100}
                />
              </Link>
              <Link
                href="https://play.google.com/store-link"
                target="_blank"
                className="w-35 xl:w-30"
              >
                <Image
                  src="/assets/svg/play-store.svg"
                  className="w-full"
                  alt="Get it on Google Play"
                  width={100}
                  height={100}
                />
              </Link>
            </div>
            <div className="shrink hidden xl:flex items-center">
              <ul className="flex gap-4 mt-10 xl:mt-0">
                {socialLinks.map((link, index) => (
                  <li className="flex justify-center items-center" key={index}>
                    <Link href={link.href} target="_blank" className="size-5">
                      <Image
                        src={link.icon}
                        className="max-w-full"
                        alt={link.alt}
                        width={100}
                        height={100}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
