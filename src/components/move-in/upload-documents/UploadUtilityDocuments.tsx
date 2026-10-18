import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { CustomRichText, Text } from 'src/common/SitecoreOverrides';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import { useUserStore } from 'src/store/useUserStore';

import InfoIcon from 'assets/icons/InfoIcon';
import UploadImage from 'components/common/UploadImage';
import InfoMessage from 'components/InfoMessage';
import { getFileMetaData } from 'lib/utils/helper';

import { getUtilityAttachmentType, Utility } from '../register-utility/registerUtility.types';
import { UploadUtilityDocumentsProps } from './uploadUtilityDocuments.types';
import UploadUtilityDocumentsSkeleton from './UploadUtilityDocumentsSkeleton';
import { CustomModal } from 'components/modals/CustomModal';
import useBrowserBackEventAction from 'src/hooks/useBrowserBackEventAction';
import MoveInStepper from '../Stepper/MoveInStepper';

const customErrorText = 'Upload failed. Please try again or check the file size and format.';

const UploadUtilityDocuments = ({ fields }: UploadUtilityDocumentsProps) => {
  const { tCode, Community } = useUserStore();
  const { openModal } = useUIStore();
  const router = useRouter();

  const [stepperAPIData, setStepperAPIData] = useState<any>(null);

  const [selectedFilesByUtility, setSelectedFilesByUtility] = useState<any>({});

  const [utilities, setUtilities] = useState<Utility[]>([]);

  const [showDocumentsUploadSuccessModal, setShowDocumentsUploadSuccessModal] = useState(false);

  const [uploadErrors, setUploadErrors] = useState<{ [key: string]: string }>({});

  // Fetch utilities API
  const { mutate: getAllUtilities, isPending: isLoadingUtilities } = useApiMutation<any, any>(
    () => `/Community/Utilities/${tCode}`,
    'GET',
    false
  );

  // Upload Documents API
  const { mutate: uploadUtilitiesDocuments } = useApiMutation<any, any>(
    () => `/MyDocuments/Attachment/Create`,
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
  const handleFileChange = (utilityName: string) => (file: File) => {
    setSelectedFilesByUtility((prev: any) => ({
      ...prev,
      [utilityName]: file,
    }));
    if (Object.keys(uploadErrors).length > 0) {
      setUploadErrors((prev: any) => ({
        ...prev,
        [utilityName]: '',
      }));
    }
  };

  const getModifiedFileName = (originalName: string) => {
    // Remove all spaces
    const nameNoSpaces = originalName.replace(/\s/g, '');
    // Get extension
    const ext = nameNoSpaces.split('.').pop();
    // Get name without extension
    const nameWithoutExt = nameNoSpaces.substr(0, nameNoSpaces.lastIndexOf('.'));
    // Append timestamp and extension
    return `${nameWithoutExt}_${Date.now()}.${ext}`;
  };

  const handleSubmitUploadDocuments = async () => {
    try {
      let allUploadsSucceeded = true;
      const errors: { [key: string]: string } = {};

      for (let index = 0; index < utilities.length; index++) {
        const utility = utilities[index];
        const selectedFileArr = selectedFilesByUtility[utility.Name] || [];
        const selectedFile = selectedFileArr[0];

        if (!selectedFile) continue; // Skip if no file selected

        const attachmentType = getUtilityAttachmentType(utility, Community, 'move-in');

        // Generate modified file name
        const modifiedFileName = getModifiedFileName(selectedFile.name);

        // Get base64 content
        const { base64 }: any = await getFileMetaData(selectedFile);

        // Build request payload
        const uploadReqBody = {
          Object_Type: 'Tenant',
          Object_Reference: tCode,
          File_Name: modifiedFileName.slice(0, modifiedFileName.lastIndexOf('.')),
          Attachment_Type: attachmentType,
          File_Extension: '.' + modifiedFileName.split('.').pop(),
          Attachment: base64,
        };

        // Await the upload and check for success
        const uploadResult = await new Promise<boolean>((resolve) => {
          uploadUtilitiesDocuments(JSON.stringify(uploadReqBody), {
            onSuccess: (res) => {
              if (res?.CreateAttachment !== null) {
                resolve(true);
              } else {
                errors[utility.Name] = customErrorText;
                resolve(false);
              }
            },
            onError: () => {
              errors[utility.Name] = customErrorText;
              resolve(false);
            },
          });
        });

        if (!uploadResult) {
          allUploadsSucceeded = false;
        }
      }

      setUploadErrors(errors);

      if (allUploadsSucceeded) {
        const stepperReqData = {
          ProfileId: tCode,
          UserState: 2,
        };
        updateStepper(stepperReqData, {
          onSuccess: (stepperRes) => {
            if (stepperRes?.Status === 'Success' || stepperRes?.Code === 200) {
              setShowDocumentsUploadSuccessModal(true);
            } else openModal('error-modal');
          },
          onError: () => openModal('error-modal'),
        });
      } else {
        openModal('error-modal');
      }
    } catch (error) {
      openModal('error-modal');
    }
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
        }
      },
      onError: () => openModal('error-modal'),
    });
  }, [tCode]);

  useBrowserBackEventAction();

  return (
    <>
      <MoveInStepper setStepperAPIData={setStepperAPIData} />
      <div className="container-sm relative lg:static py-8 md:py-10 flex flex-col gap-5 md:gap-6">
        {isLoadingUtilities || // Show Skeleton when Utilities are loading
        !stepperAPIData || // Show Skeleton when Stepper API is loading the get steps states
        !stepperAPIData?.Steppers?.[0]?.StepCompleted || // Show Skeleton when step 1 is not completed & we are accessing step2 directly
        stepperAPIData?.Steppers?.[1]?.StepCompleted ? ( // Show Skeleton when step 2 is completed already until redirection to Step3
          <UploadUtilityDocumentsSkeleton />
        ) : (
          <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
            <div className="flex flex-col gap-2 lg:gap-3">
              <div className="flex items-center gap-4">
                <CustomRichText field={fields?.uploadUtilityDocumentHeadingIcon} />
                <Text tag="h1" field={fields?.title} className="text-[16px] md:text-[20px]" />
              </div>
              <div className="font-light text-body">
                Accepted formats:{' '}
                <Text tag="p" field={fields?.acceptedFormatsTerms} className="inline" />
              </div>
            </div>
            <div className="flex flex-col gap-5 lg:gap-6 upload-section">
              {utilities?.map((utility) => (
                <UploadImage
                  key={utility.Name}
                  label={`${utility.Name} Connection Acknowledgement`}
                  labelClassName="text-body! font-normal"
                  accept={['.jpg', '.pdf']}
                  files={
                    uploadErrors[utility.Name] ? [] : selectedFilesByUtility[utility.Name] || []
                  }
                  onChange={handleFileChange(utility.Name) as any}
                  disabled={false}
                  maxFiles={1}
                  showFileName={true}
                  containerClassName={'border border-lilac-100 rounded-lg lg:py-8.5'}
                  compressImages={true}
                  errorText={customErrorText}
                  customError={uploadErrors[utility.Name]}
                />
              ))}
              <InfoMessage IconComponent={InfoIcon} status="normal">
                <p className="text-body">{fields?.documentUploadInfoText?.value}</p>
              </InfoMessage>
            </div>
          </div>
        )}
        <div className="btn-wrapper flex flex-col justify-center items-end gap-2 md:gap-3">
          <button
            type="button"
            className="btn btn-primary w-full md:w-68.75 h-11 md:h-15 uppercase"
            disabled={
              Object.values(selectedFilesByUtility)?.length === 0 ||
              Object.values(selectedFilesByUtility)?.length !== utilities.length ||
              !Object.values(selectedFilesByUtility).every(
                (files) => Array.isArray(files) && files.length > 0
              )
            }
            onClick={handleSubmitUploadDocuments}
          >
            {fields?.submitCTALabel?.value}
          </button>
        </div>
      </div>
      {showDocumentsUploadSuccessModal ? (
        <CustomModal
          showModal={showDocumentsUploadSuccessModal}
          setShowModal={setShowDocumentsUploadSuccessModal}
          primaryBtnLabel={fields?.proceedCTALabel?.value}
          heading={fields?.documentsUploadSuccessModalTitle?.value}
          description={fields?.documentsUploadSuccessModalDescription?.value}
          handlePrimaryBtnClick={() => router.replace('move-in/key-handover')}
        />
      ) : null}
    </>
  );
};

export default UploadUtilityDocuments;
