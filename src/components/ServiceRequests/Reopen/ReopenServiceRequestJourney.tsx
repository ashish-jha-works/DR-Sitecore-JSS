import NotFound from 'src/NotFound';

import { SERVICE_REQUEST_TYPE } from 'lib/common/constants/common';
import ScheduleVisit from '../Create/ScheduleVisit';
import { CreateServiceSuccessModal } from '../Create/modals/CreateServiceSuccessModal';
import ReopenServiceRequest from './ReopenServiceRequest';
import { useReopenServiceRequest } from './useReopenServiceRequest';

const ReopenServiceRequestJourney = () => {
  const {
    serviceRequestType,
    isValidServiceType,
    issue,
    setIssue,
    selectedFiles,
    setSelectedFiles,
    step,
    technicianSchedule,
    setTechnicianSchedule,
    selectedDate,
    setSelectedDate,
    slots,
    setSlots,
    selectedSlot,
    setSelectedSlot,
    manualMode,
    setManualMode,
    isNextBtnDisabled,
    handleCancelBtnClick,
    handleNextBtnClick,
    Community,
    serviceRequestID,
    serviceRequestDetails,
    isDetailsLoading,
    tenantDetails,
  } = useReopenServiceRequest();

  if (!isValidServiceType) {
    return <NotFound />;
  }

  return (
    <div className="bg-silver-chalice-50">
      {step === 1 ? (
        <ReopenServiceRequest
          serviceRequestID={serviceRequestID}
          serviceRequestType={serviceRequestType}
          serviceRequestDetails={serviceRequestDetails}
          tenantDetails={tenantDetails}
          isDetailsLoading={isDetailsLoading}
          issue={issue}
          setIssue={setIssue}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      ) : (
        <ScheduleVisit
          templateCode={serviceRequestDetails?.Template_Code.trim()}
          community={Community ? Community : ''}
          technicianSchedule={technicianSchedule}
          setTechnicianSchedule={setTechnicianSchedule}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          slots={slots}
          setSlots={setSlots}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
          manualMode={manualMode}
          setManualMode={setManualMode}
        />
      )}

      <div className="container-sm btn-wrapper flex flex-col md:flex-row justify-end gap-4 md:gap-6 pb-5 md:pb-6">
        {step === 2 ? (
          <button
            className={`btn btn-secondary w-full md:w-68.75 h-11 md:h-15`}
            onClick={handleCancelBtnClick}
          >
            Back
          </button>
        ) : null}

        <button
          className={`btn btn-primary w-full md:w-68.75 h-11 md:h-15 ${
            isNextBtnDisabled ? 'disabled' : ''
          }`}
          onClick={handleNextBtnClick}
        >
          {serviceRequestType === SERVICE_REQUEST_TYPE.MAINTENANCE
            ? step === 1
              ? 'Next'
              : 'Schedule Visit'
            : 'Submit'}
        </button>
      </div>

      {/* Modals */}
      <CreateServiceSuccessModal
        serviceRequestId={serviceRequestID}
        isReopen={true}
        isCommunityMaintenanceCategory={
          serviceRequestDetails?.Sub_Category === 'Water leaking' ||
          serviceRequestDetails?.Sub_Category === 'No Electricity'
        }
      />
    </div>
  );
};

export default ReopenServiceRequestJourney;
