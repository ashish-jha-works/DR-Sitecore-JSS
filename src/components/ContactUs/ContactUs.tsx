'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import ReCAPTCHA from 'react-google-recaptcha';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { CustomLink, CustomRichText } from 'src/common/SitecoreOverrides';
import { Checkbox } from 'src/components/common/Checkbox';
import { Input } from 'src/components/common/Input';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { USER_ROLES } from 'lib/common/constants/common';
import { useUserStore } from 'src/store/useUserStore';
import ContactSuccessModal from './ContactSuccessModal';

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;
const MESSAGE_MAX_LENGTH = 1500;

export default function ContactUs({ fields }: any) {
  const openModal = useUIStore((state) => state.openModal);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    tCode,
    FirstName,
    LastName,
    Community,
    CommunityDisplayName,
    Email,
    Mobile,
    ProfileType,
  } = useUserStore();

  const [message, setMessage] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const [messageError, setMessageError] = useState('');

  const { mutate: sendContactEmail, isPending } = useApiMutation('/Email', 'POST', true);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
  const { isLoaded: isMapLoaded, loadError: mapLoadError } = useLoadScript({
    googleMapsApiKey,
    id: 'contact-us-map',
  });

  const mapCenter = useMemo(() => {
    const lat = Number(fields?.mapLatitude?.value);
    const lng = Number(fields?.mapLongitude?.value);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return null;
    }
    return { lat, lng };
  }, [fields?.mapLatitude?.value, fields?.mapLongitude?.value]);

  const isSubmitDisabled = useMemo(() => {
    return !message.trim() || !agreedToTerms || isPending;
  }, [message, agreedToTerms, isPending]);

  const buildTenantRequest = (body: string) => {
    const name = [FirstName, LastName].filter(Boolean).join(' ').trim();
    const community = CommunityDisplayName || Community || '';
    const footer = [
      '',
      `Tenant Unique ID: ${tCode || ''}`,
      `Community: ${community}`,
      'Contact Details:',
      `Email: ${Email || ''}`,
      `Phone: ${Mobile || ''}`,
    ].join('<br/>');

    return {
      Subject: `Feedback from App / Portal - ${FirstName || ''} ${LastName || ''} ${tCode || ''}`,
      EmailBody: `${name} has the following query:<br/>${body}<br/>${footer}`,
    };
  };

  const buildCorporateRequest = (body: string) => {
    const name = FirstName || '';
    const footer = [
      '',
      `Customer Code: ${tCode || ''}`,
      'Contact Details:',
      `Email: ${Email || ''}`,
      `Phone: ${Mobile || ''}`,
    ].join('<br/>');

    return {
      Subject: `Feedback from App / Portal - ${name} ${tCode || ''}`,
      EmailBody: `${name} has the following query:<br/>${body}<br/>${footer}`,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageError('');
    setCaptchaError('');

    if (!message.trim()) {
      setMessageError('Message cannot be empty');
      return;
    }

    if (!agreedToTerms) {
      return;
    }

    if (!tCode) {
      openModal('error-modal');
      return;
    }

    recaptchaRef.current?.execute();
  };

  const onCaptchaChange = (token: string | null) => {
    if (!token) {
      setCaptchaError('Captcha is required');
      return;
    }

    setCaptchaError('');

    const isCorporate =
      ProfileType === USER_ROLES.CorporateManager || ProfileType === USER_ROLES.AccomodationManager;
    const { Subject, EmailBody } = isCorporate
      ? buildCorporateRequest(message.trim())
      : buildTenantRequest(message.trim());

    sendContactEmail(
      {
        Subject,
        EmailBody,
        Captcha_Token: token,
        profileId: tCode,
      },
      {
        onSuccess: (response: any) => {
          if (ProfileType === 8 && response?.Code === 403) {
            recaptchaRef.current?.reset();
            openModal('error-modal');
            return;
          }

          if (response === true || response?.Code === 200) {
            setMessage('');
            setAgreedToTerms(false);
            recaptchaRef.current?.reset();
            openModal('contact-success-modal');
            return;
          }

          recaptchaRef.current?.reset();
          openModal('error-modal');
        },
        onError: () => {
          recaptchaRef.current?.reset();
          openModal('error-modal');
        },
      }
    );
  };

  return (
    <section className="bg-silver-chalice-50 pb-12 md:pb-16 pt-6 md:pt-8">
      <div className="container-sm flex flex-col gap-4 md:gap-5">
        <div className="bg-white-pure border border-lilac-300 rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[9fr_11fr] lg:h-[237px]">
            <div className="flex flex-col justify-center gap-3 p-5 lg:px-6 lg:py-4">
              <CustomRichText
                field={fields?.address}
                className="text-heading-3 font-normal text-navy-500 [&_p]:m-0"
              />

              <div className="flex gap-3 items-start">
                <span className="shrink-0 text-lilac-500 mt-0.5">
                  <Image
                    src="/assets/svg/phone.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="size-6"
                  />
                </span>
                <CustomRichText
                  field={fields?.phoneText}
                  className="text-body font-light text-navy-500 [&_p]:m-0"
                />
              </div>

              <div className="flex gap-3 items-start">
                <span className="shrink-0 text-lilac-500 mt-0.5">
                  <Image
                    src="/assets/svg/mail.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="size-6"
                  />
                </span>
                <CustomRichText
                  field={fields?.emailText}
                  className="text-body font-light text-navy-500 [&_p]:m-0 [&_a]:text-sky-700 [&_a]:hover:text-sky-900"
                />
              </div>
            </div>

            <div className="h-[200px] lg:h-[237px] border-t lg:border-t-0 lg:border-l border-lilac-300">
              {googleMapsApiKey && mapCenter ? (
                mapLoadError ? (
                  <div className="flex h-full w-full items-center justify-center text-body-sm text-navy-400">
                    Map unavailable
                  </div>
                ) : !isMapLoaded ? (
                  <div className="flex h-full w-full items-center justify-center text-body-sm text-navy-400">
                    Loading map…
                  </div>
                ) : (
                  <div className="h-full w-full">
                    <GoogleMap
                      center={mapCenter}
                      zoom={15}
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      options={{
                        fullscreenControl: true,
                        streetViewControl: true,
                        mapTypeControl: true,
                        zoomControl: true,
                      }}
                    >
                      <Marker
                        position={mapCenter}
                        icon={{
                          url: '/assets/svg/marker-2.svg',
                          scaledSize: new window.google.maps.Size(27, 33),
                        }}
                      />
                    </GoogleMap>
                  </div>
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center text-body-sm text-navy-400">
                  Map unavailable
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8">
          <h2 className="text-heading-2 font-normal text-navy-500 text-start mb-5 md:mb-6">
            {fields?.formTitle?.value}
          </h2>

          <form onSubmit={handleSubmit} noValidate className="form-group !text-start">
            <div>
              <Input
                label={fields?.messageLabel?.value}
                value={message}
                maxLength={MESSAGE_MAX_LENGTH}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setMessageError('');
                }}
                error={messageError}
                showClearButton={false}
              />
              {!messageError ? (
                <p className="text-body-sm text-navy-400 text-right font-light mt-1">
                  {MESSAGE_MAX_LENGTH - message.length} characters remaining
                </p>
              ) : null}
            </div>

            <div className="mt-4 md:mt-5 flex gap-3 items-start">
              <Checkbox
                id="contact-terms"
                name="contact-terms"
                value="agreed"
                checked={agreedToTerms}
                onChange={setAgreedToTerms}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <CustomRichText
                  field={fields?.termsText}
                  className="text-body font-light text-navy-500 [&_p]:m-0 [&_a]:text-sky-700 [&_a]:underline"
                />
                <CustomRichText
                  field={fields?.privacyText}
                  className="text-body-sm font-light text-navy-500 [&_p]:m-0 [&_a]:text-sky-700 [&_a]:underline"
                />
              </div>
            </div>

            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={onCaptchaChange}
            />

            <div className="mt-6 flex flex-col items-end gap-2">
              {captchaError ? (
                <p className="text-body-sm text-danger-500 w-full text-end">{captchaError}</p>
              ) : null}
              <button
                type="submit"
                className="btn btn-primary w-full md:w-auto uppercase shrink-0 px-8"
                disabled={isSubmitDisabled}
              >
                {fields?.submitButtonText?.value}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8">
          <h2 className="text-heading-2 font-normal text-navy-500 text-start mb-5 md:mb-6">
            {fields?.followUsTitle?.value}
          </h2>
          <ul className="flex flex-wrap gap-3 text-white-pure">
            {fields?.socialLinks?.map((item: any, index: number) => (
              <li key={index} className="flex items-center justify-center">
                <CustomLink
                  field={item?.fields?.link}
                  className="flex size-12 items-center justify-center rounded-lg bg-lilac-500 hover:bg-lilac-hover transition-colors"
                >
                  <CustomRichText
                    field={item?.fields?.icon}
                    className="text-white-pure [&_svg]:block [&_svg]:size-7"
                  />
                </CustomLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ContactSuccessModal />
    </section>
  );
}
