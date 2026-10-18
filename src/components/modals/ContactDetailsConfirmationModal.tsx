'use client';
import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { useEffect, useState } from 'react';
import { CustomImage, CustomLink } from 'src/common/SitecoreOverrides';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';

export default function ContactDetailsConfirmationModal({ fields }: any) {
  const [showPopup, setShowPopup] = useState(false);
  const [disableDismiss, setDisableDismiss] = useState(false);
  const { tCode } = useUserStore();
  const { mutate } = useApiMutation<any, any>(
    `/Tenant/${tCode}/Notifications/ContactDetailsConfirmation`,
    'GET',
    false
  );

  useEffect(() => {
    if (tCode) {
      mutate(null, {
        onSuccess: (response) => {
          if (response != null) {
            if (!response.Dismiss) {
              setDisableDismiss(true);
            }
            if (response.IsActive) {
              setShowPopup(true);
            }
          }
        },
      });
    }
  }, [tCode, mutate]);

  return (
    <div className={`custom-modal ContactDetailsConfirmationModal ${showPopup ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <Text
          tag="h3"
          field={disableDismiss ? fields?.heaidng2 : fields?.heaidng1}
          className="custom-modal__heading"
        />
        <CustomImage field={fields?.icon} className="custom-modal__img" />
        <Text
          tag="p"
          field={disableDismiss ? fields?.desc2 : fields?.desc1}
          className="custom-modal__desc"
        />
        <div className="custom-modal__btn-wrapper">
          {fields?.dismissCTA?.value && (
            <button className={`btn btn-secondary ${disableDismiss ? 'disabled' : ''}`}>
              {fields?.dismissCTA?.value}
            </button>
          )}
          <CustomLink field={fields?.confirmCTA} className="btn btn-primary" />
        </div>
      </div>
    </div>
  );
}
