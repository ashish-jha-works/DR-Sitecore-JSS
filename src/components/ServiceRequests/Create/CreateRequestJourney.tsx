import NotFound from 'src/NotFound';

import { SERVICE_REQUEST_CONFIG, SERVICE_REQUEST_TYPE } from 'lib/common/constants/common';

import CreateRequest from './CreateRequest';
import { CreateServiceSuccessModal } from './modals/CreateServiceSuccessModal';
import ScheduleVisit from './ScheduleVisit';
import { useCreateRequestJourney } from './useCreateRequestJourney';
import CreateServiceErrorModal from './modals/CreateServiceErrorModal';

const CreateRequestJourney = () => {
  const {
    serviceRequestType,
    isValidServiceType,
    phoneNumber,
    setPhoneNumber,
    location,
    setLocation,
    phoneNumberError,
    setPhoneNumberError,
    categories,
    selectedCategory,
    setSelectedCategory,
    subCategories,
    selectedSubCategory,
    setSelectedSubCategory,
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
    serviceRequestId,
    isEmergencyRequest,
    Community,
    isLoadingCategories,
  } = useCreateRequestJourney();

  if (!isValidServiceType) {
    return <NotFound />;
  }

  return (
    <div className="bg-silver-chalice-50">
      {step === 1 ? (
        <CreateRequest
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          serviceRequestType={serviceRequestType}
          location={location}
          setLocation={setLocation}
          phoneNumberError={phoneNumberError}
          setPhoneNumberError={setPhoneNumberError}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          subCategories={subCategories}
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={setSelectedSubCategory}
          issue={issue}
          setIssue={setIssue}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          SERVICE_REQUEST_CONFIG={SERVICE_REQUEST_CONFIG}
          isLoadingCategories={isLoadingCategories}
        />
      ) : (
        <ScheduleVisit
          templateCode={selectedSubCategory?.TemplateCode ? selectedSubCategory.TemplateCode : ''}
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
        <button
          className={`btn btn-secondary w-full md:w-68.75 h-11 md:h-15`}
          onClick={handleCancelBtnClick}
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </button>

        <button
          className={`btn btn-primary w-full md:w-68.75 h-11 md:h-15 ${
            isNextBtnDisabled ? 'disabled' : ''
          }`}
          onClick={handleNextBtnClick}
        >
          {serviceRequestType === SERVICE_REQUEST_TYPE.MAINTENANCE && !isEmergencyRequest
            ? step === 1
              ? 'Next'
              : 'Schedule Visit'
            : 'Submit'}
        </button>
      </div>

      {/* Modals */}
      <CreateServiceSuccessModal
        serviceRequestId={serviceRequestId}
        isEmergencyRequest={isEmergencyRequest}
        isTypeReschedule={false}
        isReopen={false}
        isCommunityMaintenanceCategory={
          selectedSubCategory?.SubCategoryName === 'Water leaking' ||
          selectedSubCategory?.SubCategoryName === 'No Electricity'
        }
      />

      <CreateServiceErrorModal />
    </div>
  );
};

export default CreateRequestJourney;
