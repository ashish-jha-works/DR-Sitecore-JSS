import { useEffect, useRef, useState } from 'react';
import { CustomImage, Text } from 'src/common/SitecoreOverrides';

import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';
import { formatPhoneInput, getFileMetaData, validateEmail } from 'lib/utils/helper';

import { FeedbackFields } from './Feedback.types';
import { Radio } from 'components/common/Radio';
import Upload from 'components/common/Upload';
import Select from 'components/common/Select';
import { useApiMutation } from 'src/hooks/useApi';
import { useUIStore } from 'src/store/useUIStore';
import FeedbackSuccessModal from './FeedbackSuccessModal';

export default function Feedback({ fields }: FeedbackFields) {
  const formRef = useRef<HTMLFormElement>(null);
  const openModal = useUIStore((state) => state.openModal);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [mobileNumber, setMobileNumber] = useState('');
  const [communities, setCommunities] = useState<any[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [building, setBuilding] = useState('');
  const [issue, setIssue] = useState('');
  const [issueType, setIssueType] = useState<string | number>('login');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ---------------- API ----------------

  const { mutate: sendLoginSignUpFeedbackRequest } = useApiMutation(
    'Email/SendLoginSingUpFeedbackEmail',
    'POST',
    true
  );

  const { mutate: fetchCommunities } = useApiMutation(
    '/ContractRenewal/ExploreProperties',
    'GET',
    true
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailResult = validateEmail(email);

    setEmailError(emailResult.message);

    if (!emailResult.isValid) {
      return;
    }

    const { fileName, base64 } = selectedFile
      ? ((await getFileMetaData(selectedFile)) as any)
      : { fileName: null, base64: null };

    const requestData = {
      Name: name,
      Email: email.trim(),
      Mobile: mobileNumber.trim(),
      Community: selectedCommunity,
      UnitNumber: building.trim(),
      Comments: issue.trim(),
      OverAllExperience: 0,
      EaseOfUse: 0,
      SpeedOrPerformance: 0,
      Functionality: 0,
      IssueType: issueType === 'login' ? 2 : 1, // login - 2 register - 1
      AttachmentName: fileName || null,
      AttachmentImage: base64 || null,
      Source: 'Portal',
    };

    sendLoginSignUpFeedbackRequest(requestData, {
      onSuccess: (response) => {
        if (response) {
          openModal('feedback-success-modal');
        }
      },
      onError: () => openModal('error-modal'),
    });
  };

  /* DISABLE SUBMIT BUTTON */
  const isFormDisabled =
    !name ||
    !email ||
    !mobileNumber ||
    mobileNumber.length !== 11 ||
    !selectedCommunity ||
    !building ||
    !issue;

  // ---------------- EFFECTS ----------------

  useEffect(() => {
    fetchCommunities(null, {
      onSuccess: (res: any) => {
        if (res && res?.CommunityList.length) {
          const tempCommunities: any = [];
          res.CommunityList.forEach((item: any) => {
            tempCommunities.push({ value: item.Id, label: item.Description });
          });
          setCommunities(tempCommunities);
        }
      },
      onError: () => openModal('error-modal'),
    });
  }, [fetchCommunities, openModal]);

  return (
    <div className="font-filson flex items-center min-h-screen px-4 py-14 md:px-8 md:py-6 relative z-10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <CustomImage field={fields.backgroundImage} className="w-full h-full object-cover" />
      </div>

      <div className="max-w-[480px] w-full mx-auto p-4 md:p-8 rounded-2xl bg-white-pure/90 backdrop-blur-sm">
        <Text
          tag="h2"
          field={fields.heading}
          className="text-heading-3 md:text-heading-2 text-center text-navy-500 mb-5 lg:mb-6"
        />

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="form-group flex flex-col gap-4"
        >
          <Input
            placeholder={fields.namePlaceHolder.value}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Input
            placeholder={fields.emailPlaceHolder.value}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(undefined);
            }}
            error={emailError}
          />
          <Input
            placeholder={fields.mobilePlaceHolder.value}
            value={mobileNumber}
            onChange={(e) => {
              setMobileNumber(formatPhoneInput(e.target.value));
            }}
          />
          <Select
            placeholder={fields.communityPlaceHolder.value}
            options={communities.map((community) => ({
              label: community.label,
              value: community.value,
            }))}
            value={selectedCommunity}
            onChange={setSelectedCommunity}
          />
          <Input
            placeholder={fields.buildingPlaceHolder.value}
            value={building}
            onChange={(e) => {
              setBuilding(e.target.value);
            }}
          />
          <Textarea
            className="min-h-24"
            label={fields.issueDescriptionLabel.value}
            placeholder={fields.issueDescriptionPlaceHolder.value}
            value={issue}
            onChange={(e) => {
              setIssue(e.target.value);
            }}
            maxLength={1500}
          />
          <div>
            <Radio
              id="issue-registration"
              name="issue"
              label={fields.issueWithRegistrationLabel.value}
              value="registration"
              checked={issueType === 'registration'}
              onChange={setIssueType}
            />

            <Radio
              id="issue-login"
              name="issue"
              label={fields.issueWithLoginLabel.value}
              value="login"
              checked={issueType === 'login'}
              onChange={setIssueType}
            />
          </div>
          <Upload
            label={fields?.uploadImageLabel?.value}
            helperText={fields?.uploadHelper?.value}
            accept={
              fields?.uploadHelper?.value
                ?.match(/\(([^)]+)\)/)?.[1]
                .split(',')
                .map((v) => v.trim()) || []
            }
            multiple={false}
            files={selectedFile ? [selectedFile] : []}
            onChange={(files) => setSelectedFile(files[0] || null)}
          />

          <button
            type="submit"
            className="btn btn-primary mt-4 w-full uppercase"
            disabled={isFormDisabled}
          >
            {fields?.submitCTALabel?.value}
          </button>
        </form>
      </div>
      <FeedbackSuccessModal />
    </div>
  );
}
