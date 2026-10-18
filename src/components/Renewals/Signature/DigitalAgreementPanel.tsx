import DownloadIcon from 'assets/icons/DownloadIcon';
import { Checkbox } from 'components/common/Checkbox';

interface DigitalAgreementPanelProps {
  downloadLabel: string;
  downloadCTA: string;
  termsText: string;
  termsAccepted: boolean;
  onTermsChange: (checked: boolean) => void;
  onDownload: () => void;
  isDownloading?: boolean;
}

export default function DigitalAgreementPanel({
  downloadLabel,
  downloadCTA,
  termsText,
  termsAccepted,
  onTermsChange,
  onDownload,
  isDownloading = false,
}: DigitalAgreementPanelProps) {
  return (
    <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-5 md:gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-[16px] leading-[24px] md:text-[20px] md:leading-[24px] font-normal text-navy-500">
          {downloadLabel}
        </p>
        <button
          type="button"
          className="btn btn-secondary w-full md:w-auto h-11 md:h-12 font-normal! px-6 md:px-8"
          onClick={onDownload}
          disabled={isDownloading}
        >
          <DownloadIcon className="text-lilac-500 shrink-0" width={20} height={20} />
          {downloadCTA}
        </button>
      </div>

      <div className="flex items-start gap-4 cursor-pointer">
        <Checkbox
          id="renewal-sign-agreement-terms"
          name="renewal-sign-agreement-terms"
          value="accepted"
          checked={termsAccepted}
          onChange={onTermsChange}
        >
          <p className="text-[14px] leading-[20px] md:text-[16px] md:leading-[24px] font-normal text-navy-500">
            {termsText}
          </p>
        </Checkbox>
      </div>
    </div>
  );
}
