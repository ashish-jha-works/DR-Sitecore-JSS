import { SERVICE_REQUEST_TYPE } from 'lib/common/constants/common';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useUIStore } from 'src/store/useUIStore';

interface Props {
  viewDetailsURL?: string;
  serviceRequestId: string | null;
  isEmergencyRequest?: boolean;
  isTypeReschedule?: boolean;
  isReopen?: boolean;
  isCommunityMaintenanceCategory?: boolean;
}

export const CreateServiceSuccessModal = ({
  serviceRequestId,
  isEmergencyRequest = false,
  isTypeReschedule = false,
  isReopen = false,
  isCommunityMaintenanceCategory = false,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeModal, closeModal } = useUIStore();
  const serviceRequestType = searchParams.get('serviceRequestType');

  const getModalConfig = () => {
    const detailsURLForCreateRequest = `/service-requests/details?serviceRequestType=${serviceRequestType}&id=${serviceRequestId}&referrer=cr`;

    /** MAINTENANCE CASES */
    if (serviceRequestType === SERVICE_REQUEST_TYPE.MAINTENANCE) {
      // Reschedule
      if (isTypeReschedule) {
        return {
          heading: `Reschedule request submitted for SR ID ${serviceRequestId}`,
          description: '',
          ctaText: 'Close',
          redirectUrl: null,
        };
      }

      // Reopen
      if (isReopen) {
        return {
          heading: 'Request reopened successfully',
          description:
            'Your request is being processed and will be available within 5-7 minutes. Please avoid submitting duplicate requests during this time.',
          ctaText: 'Close',
          redirectUrl: '/service-requests',
        };
      }

      // Emergency
      if (isEmergencyRequest) {
        return {
          heading: 'Request submitted successfully',
          description:
            'Your request is being processed and will be available within 5-7 minutes. Please avoid submitting duplicate requests during this time.',
          ctaText: 'Close',
          redirectUrl: '/service-requests',
        };
      }

      // Normal Maintenance
      return {
        heading: 'Request submitted successfully',
        description:
          'Your request is being processed and will be available within 5-7 minutes. Please avoid submitting duplicate requests during this time.',
        ctaText: 'Close',
        redirectUrl: '/service-requests',
      };
    }

    /** COMMUNITY CASES */
    if (serviceRequestType === SERVICE_REQUEST_TYPE.COMMUNITY) {
      // Emergency / Exception
      if (isCommunityMaintenanceCategory) {
        return {
          heading: 'Request submitted successfully',
          description:
            'Your request is being processed and will be available within 5-7 minutes. Please avoid submitting duplicate requests during this time.',
          ctaText: 'Close',
          redirectUrl: '/service-requests',
        };
      }

      // Normal Community
      return {
        heading: 'Request submitted successfully',
        description: `SR ID: ${serviceRequestId}`,
        ctaText: 'View Details',
        redirectUrl: detailsURLForCreateRequest,
      };
    }

    /** LEASING CASES */
    if (serviceRequestType === SERVICE_REQUEST_TYPE.LEASING) {
      return {
        heading: 'Request submitted successfully',
        description: `SR ID: ${serviceRequestId}`,
        ctaText: 'View Details',
        redirectUrl: detailsURLForCreateRequest,
      };
    }

    /** Fallback */
    return {
      heading: 'Request submitted successfully',
      description: '',
      ctaText: 'Close',
      redirectUrl: null,
    };
  };

  const { heading, description, ctaText, redirectUrl } = getModalConfig();

  const handleCTA = () => {
    if (redirectUrl) {
      router.push(redirectUrl);
    }
    closeModal();
  };

  return (
    <div className={`custom-modal ${activeModal === 'create-service-success-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper">
        <h3 className="custom-modal__heading">{heading}</h3>

        <Image
          className="custom-modal__img"
          src="/assets/svg/registration-successful.svg"
          alt="Success"
          width={294}
          height={210}
        />

        {description && <p className="custom-modal__desc">{description}</p>}

        <div className="custom-modal__btn-wrapper">
          <button className="btn btn-primary lg:w-fit lg:px-16" onClick={handleCTA}>
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  );
};
