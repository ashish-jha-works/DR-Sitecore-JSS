import { CustomRichText, Text } from 'src/common/SitecoreOverrides';
import MoveOutStepper from '../Stepper/MoveOutStepper';
import { useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from 'src/store/useUserStore';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { Checkbox } from 'components/common/Checkbox';
import { useFileDownload } from 'components/payments/PaymentsPage/useFileDownload';
import TerminateUtilitiesSkeleton from './TerminateUtilitiesSkeleton';
import {
  hasMoveOutUtilities,
  MOVE_OUT_API_STEPS,
  setCachedHasMoveOutUtilities,
} from '../Stepper/moveOutNoUtilities';

/** Multi-provider when Name lists more than one provider, e.g. "EMGAS/Petrosafe". */
const isMultiProvider = (name?: string) =>
  (name || '')
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean).length > 1;

const isEmpowerProvider = (name?: string) => (name || '').toLowerCase().includes('empower');

/** Display order: DEWA (Electricity & Water) → Gas → AC Cooling. */
const getUtilitySortOrder = (utility: any) => {
  const type = (utility?.Type || '').toLowerCase();
  const name = (utility?.Name || '').toLowerCase();

  if (type.includes('electricity') || type.includes('water') || name.includes('dewa')) {
    return 0;
  }
  if (type.includes('gas') || name.includes('gas') || name.includes('emgas')) {
    return 1;
  }
  if (
    type.includes('ac') ||
    type.includes('cool') ||
    name.includes('aqua') ||
    name.includes('empower') ||
    name.includes('chiller')
  ) {
    return 2;
  }
  return 3;
};

export default function TerminateUtilities({ fields }: any) {
  const { tCode } = useUserStore();
  const { openModal } = useUIStore();
  const { downloadFile } = useFileDownload();
  const router = useRouter();
  const [utilities, setUtilities] = useState<any>([]);
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { mutate: getAllUtilities } = useApiMutation<any, any>(
    () => `/Community/Utilities/${tCode}`,
    'GET',
    false
  );

  const { mutate: updateStepper } = useApiMutation<any, any>(
    () => `/MoveOut/UpdateStepper`,
    'POST',
    true
  );

  const { mutate: getEmpowerNoc, isPending: isDownloadingNoc } = useApiMutation<any, any>(
    () => `/MoveOut/GetEmpowerNoc/${tCode}`,
    'GET',
    true
  );

  const sortedUtilities = useMemo(
    () => [...utilities].sort((a, b) => getUtilitySortOrder(a) - getUtilitySortOrder(b)),
    [utilities]
  );

  const skipToMoveOutPermit = () => {
    updateStepper(
      {
        ProfileId: tCode,
        IsUtilityTerminationPageVisited: true,
        UserState: MOVE_OUT_API_STEPS.UTILITIES_TERMINATION,
      },
      {
        onSuccess: (stepperRes) => {
          if (stepperRes?.Status === 'Success' || stepperRes?.Code === 200) {
            router.replace('/move-out/move-out-permit');
            return;
          }
          openModal('error-modal');
          setIsInitialLoading(false);
        },
        onError: () => {
          openModal('error-modal');
          setIsInitialLoading(false);
        },
      }
    );
  };

  const handleDownloadEmpowerNoc = () => {
    if (!tCode || isDownloadingNoc) return;

    getEmpowerNoc(null, {
      onSuccess: (response) => {
        if (response?.FileBase64String && response?.File_Name) {
          downloadFile(response.FileBase64String, response.File_Name);
          return;
        }
        openModal('error-modal');
      },
      onError: () => openModal('error-modal'),
    });
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!checkbox || !tCode) return;

    updateStepper(
      {
        ProfileId: tCode,
        IsUtilityTerminationPageVisited: true,
      },
      {
        onSuccess: (stepperRes) => {
          if (stepperRes?.Status === 'Success' || stepperRes?.Code === 200) {
            router.push('/move-out/upload-documents');
            return;
          }
          openModal('error-modal');
        },
        onError: () => openModal('error-modal'),
      }
    );
  };

  useEffect(() => {
    if (!tCode) return;

    setIsInitialLoading(true);
    getAllUtilities(null, {
      onSuccess: (res) => {
        const utilitiesPresent = hasMoveOutUtilities(res);
        setCachedHasMoveOutUtilities(tCode, utilitiesPresent);

        if (!utilitiesPresent) {
          skipToMoveOutPermit();
          return;
        }

        const updatedRes = res.map((utility: any) => ({
          ...utility,
          RegistrationNo: '',
          selectedRegistrationDate: '',
        }));
        setUtilities(updatedRes);
        setIsInitialLoading(false);
      },
      onError: () => {
        openModal('error-modal');
        setIsInitialLoading(false);
      },
    });
  }, [tCode]);

  return (
    <>
      <MoveOutStepper />
      <section className="TerminateUtilities">
        <div className="container-sm my-8 md:my-10">
          {isInitialLoading ? (
            <TerminateUtilitiesSkeleton />
          ) : (
            <>
              <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
                <div className="flex flex-col gap-2 lg:gap-3">
                  <div className="flex items-center gap-4">
                    <CustomRichText field={fields?.icon} />
                    <Text tag="h1" field={fields?.heading} className="text-[16px] md:text-[20px]" />
                  </div>
                  <div className="prerequisite-details">
                    <CustomRichText
                      className="[&_ul]:list-disc [&_ul]:ps-4 text-body font-light"
                      field={fields?.description}
                    />
                  </div>
                </div>
                <div className="utility-providers-section flex flex-col gap-8 lg:gap-10">
                  {sortedUtilities?.map((utility: any, index: number) => {
                    const multiProvider = isMultiProvider(utility?.Name);
                    const detailsUrl = utility?.WebsiteUrl || utility?.LocationUrl;
                    const showEmpowerNoc = isEmpowerProvider(utility?.Name);

                    return (
                      <div className="flex flex-col gap-4 lg:gap-6" key={index}>
                        <div className="flex flex-col gap-1">
                          <h3 className="text-body font-medium">{utility?.Type}</h3>
                          <p className="text-body font-light">
                            {multiProvider
                              ? fields?.multiProviderInfoLabel?.value ||
                                'Your provider details are available below.'
                              : `Your provider is ${utility?.Name}`}
                          </p>
                        </div>
                        {showEmpowerNoc ? (
                          <p className="text-body font-light text-navy-500 m-0">
                            {fields?.empowerNocNoticeText?.value ||
                              'NOC is mandatory for requesting Empower utility termination:'}{' '}
                            <button
                              type="button"
                              className="text-cta-sm text-sky-700 underline uppercase font-medium cursor-pointer disabled:opacity-50"
                              onClick={handleDownloadEmpowerNoc}
                              disabled={isDownloadingNoc}
                            >
                              {fields?.empowerNocDownloadLabel?.value || 'DOWNLOAD'}
                            </button>
                          </p>
                        ) : null}
                        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
                          {multiProvider ? (
                            detailsUrl ? (
                              <NextLink
                                href={detailsUrl}
                                target="_blank"
                                className="flex items-center gap-3 lg:gap-4 w-full rounded-xl border border-lilac-500 px-4 h-14 max-h-14 outline-none bg-white-pure glow"
                              >
                                <CustomRichText
                                  field={fields?.documentIcon || fields?.desktopIcon}
                                />
                                <p className="flex-1 text-navy-500 text-body">
                                  {fields?.viewDetailsCTALabel?.value || 'View details'}
                                </p>
                                <CustomRichText field={fields?.redirectIcon} />
                              </NextLink>
                            ) : null
                          ) : (
                            <>
                              {utility?.WebsiteUrl ? (
                                <NextLink
                                  href={utility?.WebsiteUrl}
                                  target="_blank"
                                  className="flex items-center gap-3 lg:gap-4 w-full rounded-xl border border-lilac-500 px-4 h-14 max-h-14 outline-none bg-white-pure glow"
                                >
                                  <CustomRichText field={fields?.desktopIcon} />
                                  <Text
                                    tag="p"
                                    field={fields?.requestOnlineTermination}
                                    className="flex-1 text-navy-500 text-body"
                                  />
                                  <CustomRichText field={fields?.redirectIcon} />
                                </NextLink>
                              ) : null}
                              {utility?.LocationUrl ? (
                                <NextLink
                                  href={utility?.LocationUrl}
                                  target="_blank"
                                  className="flex items-center gap-3 lg:gap-4 w-full rounded-xl border border-lilac-500 px-4 h-14 max-h-14 outline-none bg-white-pure glow"
                                >
                                  <CustomRichText field={fields?.mapIcon} />
                                  <Text
                                    tag="p"
                                    field={fields?.findCustomerServiceCenter}
                                    className="flex-1 text-navy-500 text-body"
                                  />
                                  <CustomRichText field={fields?.redirectIcon} />
                                </NextLink>
                              ) : null}
                            </>
                          )}
                        </div>
                        {!multiProvider ? (
                          <p className="text-body font-light">{`You will be redirected to the ${utility?.Name} website.`}</p>
                        ) : null}
                      </div>
                    );
                  })}
                  <div className="flex items-center gap-4 cursor-pointer">
                    <Checkbox
                      id="utility-termination-confirmation"
                      name="utility-termination-confirmation"
                      value="utility-termination-confirmation"
                      checked={checkbox}
                      onChange={setCheckbox}
                    >
                      <p className="text-body font-light">
                        I have contacted my utility providers and terminated my utility services
                      </p>
                    </Checkbox>
                  </div>
                </div>
              </div>
              <div className="btn-wrapper flex flex-col justify-center items-end mt-5 md:mt-6">
                <button
                  type="button"
                  className={`btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase ${
                    !checkbox ? 'disabled' : ''
                  }`}
                  disabled={!checkbox}
                  onClick={handleNext}
                >
                  {fields?.nextCTALabel?.value || fields?.cta?.value?.text || 'Next'}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
