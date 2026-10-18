import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CustomRichText, Text } from 'src/common/SitecoreOverrides';
import { CustomModal } from 'components/modals/CustomModal';
import { useFileDownload } from 'components/payments/PaymentsPage/useFileDownload';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';

import MoveOutStepper from '../Stepper/MoveOutStepper';
import MoveOutPermitSkeleton from './MoveOutPermitSkeleton';

export default function MoveOutPermit({ fields }: any) {
  const { tCode } = useUserStore();
  const { downloadFile } = useFileDownload();
  const router = useRouter();
  const [showDownloadErrorModal, setShowDownloadErrorModal] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { mutate: getMoveoutPermit } = useApiMutation<any, any>(
    () => `/MoveOut/GetMoveOutPermit/${tCode}`,
    'GET',
    true
  );
  const { mutate: updateStepper } = useApiMutation<any, any>(
    () => `/MoveOut/UpdateStepper`,
    'POST',
    true
  );
  const { mutate: getStepperStates } = useApiMutation<any, any>(
    () => `/MoveOut/Stepper/${tCode}`,
    'GET',
    false
  );

  useEffect(() => {
    if (!tCode) return;

    setIsInitialLoading(true);
    getStepperStates(null, {
      onSuccess: () => setIsInitialLoading(false),
      onError: () => setIsInitialLoading(false),
    });
  }, [tCode]);

  const openDownloadErrorModal = () => setShowDownloadErrorModal(true);

  const downloadPermit = () => {
    getMoveoutPermit(null, {
      onSuccess: (response) => {
        if (response?.FileBase64String && response?.File_Name) {
          downloadFile(response.FileBase64String, response.File_Name);
          return;
        }
        openDownloadErrorModal();
      },
      onError: () => openDownloadErrorModal(),
    });
  };

  const proceedToNextStep = (e: any) => {
    e.preventDefault();
    const stepperReqData = {
      ProfileId: tCode,
      UserState: 3,
    };
    updateStepper(stepperReqData, {
      onSuccess: (stepperRes) => {
        if (stepperRes?.Status === 'Success' || stepperRes?.Code === 200) {
          router.push(e.target.href);
        }
      },
    });
  };

  return (
    <>
      <MoveOutStepper />
      <section className="MoveOutPermit">
        <div className="container-sm my-8 md:my-10">
          {isInitialLoading ? (
            <MoveOutPermitSkeleton />
          ) : (
            <>
              <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
                <div className="flex flex-col gap-2 lg:gap-3">
                  <div className="flex items-center gap-4">
                    <CustomRichText field={fields?.icon} />
                    <Text tag="h1" field={fields?.heading} className="text-[16px] md:text-[20px]" />
                  </div>
                  <CustomRichText
                    className="[&_ul]:list-disc [&_ul]:ps-4 text-body font-light"
                    field={fields?.description}
                  />
                  <button
                    className="btn btn-secondary md:max-w-68.5 mx-auto mt-1 md:mt-2"
                    onClick={downloadPermit}
                  >
                    <CustomRichText field={fields?.ctaIcon} />
                    <Text tag="span" field={fields?.ctaLabel} />
                  </button>
                </div>
              </div>
              <div className="text-end mt-5 md:mt-6">
                <Link
                  href={fields?.proceedCTA?.value?.href}
                  className="btn btn-primary md:btn-sm"
                  onClick={(e: any) => proceedToNextStep(e)}
                >
                  {fields?.proceedCTA?.value?.text}
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <CustomModal
        showModal={showDownloadErrorModal}
        setShowModal={setShowDownloadErrorModal}
        modalType="error"
        heading={fields?.downloadErrorModalHeading?.value}
        description={fields?.downloadErrorModalDescription?.value}
        imagePath="/assets/svg/deactivate-account.svg"
        primaryBtnLabel={fields?.downloadErrorModalCloseLabel?.value}
      />
    </>
  );
}
