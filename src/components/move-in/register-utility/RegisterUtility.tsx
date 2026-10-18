import React, { useEffect, useState } from 'react';
import { CustomLink, CustomRichText, Text } from 'src/common/SitecoreOverrides';
import ArrowLeft from 'assets/icons/ArrowLeft';
import RegisterUtilityDetailsSkeleton from './RegisterUtilitySkeleton';
import Link from 'next/link';
import { useUserStore } from 'src/store/useUserStore';
import { useUIStore } from 'src/store/useUIStore';
import { RegisterUtilityProps, Utility } from './registerUtility.types';
import { useApiMutation } from 'src/hooks/useApi';
import DateInput from 'components/common/DateInput';
import { Input } from 'components/common/Input';
import { formatToMMDDYYYY } from 'lib/utils/helper';
import { useRouter } from 'next/navigation';
import useBrowserBackEventAction from 'src/hooks/useBrowserBackEventAction';
import MoveInStepper from '../Stepper/MoveInStepper';

/** Multi-provider when Name lists more than one provider, e.g. "EMGAS/Petrosafe". */
const isMultiProvider = (name?: string) =>
  (name || '')
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean).length > 1;

const RegisterUtility = ({ fields }: RegisterUtilityProps) => {
  const { tCode, Community, PropertyPhase } = useUserStore();
  const { openModal } = useUIStore();
  const router = useRouter();

  const [stepperAPIData, setStepperAPIData] = useState<any>(null);
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [step, setStep] = useState(1);
  const [showEmpower, setShowEmpower] = useState(false);
  const [showChiller, setShowChiller] = useState(false);

  // Fetch utilities API
  const { mutate: getAllUtilities, isPending: isLoadingUtilities } = useApiMutation<any, any>(
    () => `/Community/Utilities/${tCode}`,
    'GET',
    false
  );

  // Register Utilities Submit API
  const { mutate: registerUtilities } = useApiMutation<any, any>(
    () => `/MoveIn/UtilityRegistrationDetails`,
    'POST',
    true
  );

  // Update Stepper API
  const { mutate: updateStepper } = useApiMutation<any, any>(
    () => `/MoveIn/UpdateStepper`,
    'POST',
    true
  );

  // Handlers

  const handleSubmitUtilitiesRegistration = () => {
    const registrationDetailsReqData = {
      Entity_Record_Code: tCode,
      Table_Name: 'COMMLEASEBUT_UTILITYREG',
    };

    let fieldIndex = 0;
    utilities.forEach((item) => {
      let regName = '';
      let regDateName = '';

      const type = item.Type.toLowerCase();

      if (type === 'electricity and water') {
        regName = 'DEWA_REG_NUM';
        regDateName = 'DEWA_REG_DATE';
      } else if (type === 'gas') {
        regName = 'EMGAS_REG_NUM';
        regDateName = 'EMGAS_REG_DATE';
      } else if (type === 'ac') {
        if (showEmpower) {
          regName = 'EMPOWER_REG_NUM';
          regDateName = 'EMPOWER_REG_DATE';
        }

        if (showChiller) {
          regName = 'COOLING_REG_NUM';
          regDateName = 'COOLING_REG_DATE';
        }
      }

      if (regName && regDateName) {
        fieldIndex++;
        (registrationDetailsReqData as Record<string, any>)[`Field_Name${fieldIndex}`] = regName;
        (registrationDetailsReqData as Record<string, any>)[`Field_Value${fieldIndex}`] =
          item.RegistrationNo;

        fieldIndex++;
        (registrationDetailsReqData as Record<string, any>)[`Field_Name${fieldIndex}`] =
          regDateName;
        (registrationDetailsReqData as Record<string, any>)[`Field_Value${fieldIndex}`] =
          formatToMMDDYYYY(item.selectedRegistrationDate);
      }
    });
    fieldIndex++;
    (registrationDetailsReqData as Record<string, any>)[`Field_Name${fieldIndex}`] = 'DEWA_COM';
    (registrationDetailsReqData as Record<string, any>)[`Field_Value${fieldIndex}`] = 'Yes';

    registerUtilities(JSON.stringify(registrationDetailsReqData), {
      onSuccess: (res) => {
        if (res?.UpdateTableFields?.Status === 'Success') {
          const stepperReqData = {
            ProfileId: tCode,
            UserState: 1,
          };
          updateStepper(stepperReqData, {
            onSuccess: (res) => {
              if (res?.Status === 'Success' || res?.Code === 200) {
                router.replace('move-in/upload-documents');
              } else openModal('error-modal');
            },
            onError: () => openModal('error-modal'),
          });
        } else openModal('error-modal');
      },
      onError: () => openModal('error-modal'),
    });
  };

  // Fetch Utilities
  useEffect(() => {
    if (!tCode) return;

    getAllUtilities(null, {
      onSuccess: (res) => {
        if (res?.length) {
          const updatedRes = res.map((utility: Utility) => ({
            ...utility,
            RegistrationNo: '',
            selectedRegistrationDate: '',
          }));
          setUtilities(updatedRes);
        } else openModal('error-modal');
      },
      onError: () => openModal('error-modal'),
    });
  }, [tCode]);

  // Set Empower and Chiller flags based on Community and Property Phase
  useEffect(() => {
    if (!Community) return;
    switch (Community) {
      case 'AlKhailGate':
      case 'Al Khail Gate':
        if (PropertyPhase == '2') {
          setShowEmpower(true);
        }
        break;
      case 'Ghoroob':
        setShowEmpower(true);
        break;
      case 'Dubai Wharf':
      case 'Manazel al Khor':
      case 'DubaiWharf':
      case 'ManazelalKhor':
        setShowChiller(true);
        break;
      default: //do nothing
    }
  }, [Community, PropertyPhase]);

  useBrowserBackEventAction();

  const updateUtilityField = (index: number, field: string, value: any) => {
    // Sanitize only the RegistrationNo field
    const sanitizedValue =
      field === 'RegistrationNo' && typeof value === 'string'
        ? value.replace(/[^0-9]/g, '')
        : value;

    setUtilities((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: sanitizedValue } : item))
    );
  };

  const isFormValid =
    utilities.length > 0 &&
    utilities.every((u) => u.RegistrationNo?.trim() && u.selectedRegistrationDate);

  return (
    <>
      <MoveInStepper setStepperAPIData={setStepperAPIData} />
      {isLoadingUtilities || !stepperAPIData || stepperAPIData?.Steppers?.[0]?.StepCompleted ? (
        <RegisterUtilityDetailsSkeleton />
      ) : (
        <div className="relative lg:static container-sm py-8 md:py-10 flex flex-col gap-5 md:gap-6">
          {step === 1 ? (
            <CustomLink
              field={fields.backToMoveInCTA}
              className="text-body-sm font-medium flex gap-2 lg:gap-4 text-navy-500 uppercase items-center"
            >
              <ArrowLeft width={28} height={28} />
              {fields?.backToMoveInCTA?.value?.text}
            </CustomLink>
          ) : null}
          <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-10">
            <div className="flex flex-col gap-2 lg:gap-3">
              <div className="flex items-center gap-4">
                <CustomRichText field={fields?.clipBoardIcon} />
                <Text
                  tag="h1"
                  field={step === 1 ? fields?.title : fields?.registerUtilitiesInputSectionTitle}
                  className="text-[16px] md:text-[20px]"
                />
              </div>
              {step === 1 ? (
                <div className="prerequisite-details">
                  <Text
                    tag="p"
                    field={fields?.registrationPrerequisiteInfo}
                    className="text-body font-light inline"
                  />
                  :
                  {fields?.prerequisiteList && (
                    <ul className="list-disc px-3 lg:px-4">
                      {fields?.prerequisiteList?.map((listItem: any, listIndex: any) => (
                        <li key={listIndex} className="items-center gap-3.5 text-body font-light">
                          <Text
                            tag="span"
                            field={listItem?.fields?.text}
                            className="text-navy-500"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null}
            </div>
            <div
              className={`utility-providers-section flex flex-col ${
                step === 1 ? 'gap-8 lg:gap-10' : 'gap-5 lg:gap-4'
              }`}
            >
              {utilities?.map((utility, index) => {
                const multiProvider = isMultiProvider(utility?.Name);
                const detailsUrl = utility?.WebsiteUrl || utility?.LocationUrl;

                return (
                  <div
                    className={`flex flex-col ${step === 1 ? 'gap-4 lg:gap-6' : 'gap-1 lg:gap-2'}`}
                    key={index}
                  >
                    <div className="flex gap-5 lg:gap-6">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-medium">{utility?.Type}</h3>
                        <p className="font-light text-body">
                          {multiProvider
                            ? fields?.multiProviderInfoLabel?.value ||
                              'Your provider details are available below.'
                            : `Your provider is ${utility?.Name}`}
                        </p>
                      </div>
                    </div>
                    {step === 1 ? (
                      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
                        {multiProvider ? (
                          detailsUrl ? (
                            <Link
                              href={detailsUrl}
                              target="_blank"
                              className="flex items-center gap-3 lg:gap-4 w-full rounded-xl border border-lilac-500 px-4 h-14 max-h-14 outline-none bg-white-pure glow"
                            >
                              <CustomRichText field={fields?.documentIcon} />
                              <p className="flex-1 text-navy-500 text-body">
                                {fields?.viewDetailsCTALabel?.value ||
                                  fields?.browseUtilityProvider?.value ||
                                  'View details'}
                              </p>
                              <CustomRichText field={fields?.redirectIcon} />
                            </Link>
                          ) : null
                        ) : (
                          <>
                            {utility?.WebsiteUrl ? (
                              <Link
                                href={utility?.WebsiteUrl}
                                target="_blank"
                                className="flex items-center gap-3 lg:gap-4 w-full rounded-xl border border-lilac-500 px-4 h-14 max-h-14 outline-none bg-white-pure glow"
                              >
                                <CustomRichText field={fields?.desktopIcon} />
                                <Text
                                  tag="p"
                                  field={fields?.submitOnlineRequest}
                                  className="flex-1 text-navy-500 text-body"
                                />
                                <CustomRichText field={fields?.redirectIcon} />
                              </Link>
                            ) : null}
                            {utility?.LocationUrl ? (
                              <Link
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
                              </Link>
                            ) : null}
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col lg:flex-row gap-0 lg:gap-6">
                        <div className="form-group w-full">
                          <Input
                            label={fields?.accountNumberLabel.value}
                            value={utility.RegistrationNo}
                            className="mt-0"
                            onChange={(e) =>
                              updateUtilityField(index, 'RegistrationNo', e.target.value)
                            }
                          />
                        </div>

                        <DateInput
                          selectedDate={utility.selectedRegistrationDate as any}
                          onSelect={(date) =>
                            updateUtilityField(index, 'selectedRegistrationDate', date)
                          }
                          label="Registration date"
                          className="mt-2"
                          disableAfter={new Date(Date.now())}
                        />
                      </div>
                    )}
                    {step === 1 && !multiProvider ? (
                      <p className="font-light text-body">{`You will be redirected to the ${utility?.Name} website.`}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="btn-wrapper flex flex-col justify-center items-end gap-2 md:gap-3">
            {step === 1 ? (
              <button
                type="button"
                className="btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase"
                disabled={isLoadingUtilities}
                onClick={() => {
                  setStep(2);
                }}
              >
                {fields?.nextCTALabel?.value}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase"
                disabled={!isFormValid}
                onClick={handleSubmitUtilitiesRegistration}
              >
                {fields?.submitCTALabel?.value}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterUtility;
