import Image from 'next/image';
import { CustomModal } from 'components/modals/CustomModal';
import { useEffect, useState } from 'react';
import AddDependentModal from './AddDependentModal';
import AddFamilyMemberModal from './AddFamilyMemberModal';
import AddPetModal from './AddPetModal';
import {
  DomesticWorkerOccupant,
  getSubprofileStatusLabel,
  useDomesticWorkers,
} from './useDomesticWorkers';
import { FamilyMemberOccupant, useFamilyMembers } from './useFamilyMembers';
import { PetDetails, usePets } from './usePets';

type DependentsDetailsProps = {
  fields?: any;
  tCode: string | null;
  parentTenantCode?: string | null;
  onSaved?: () => void;
};

export default function DependentsDetails({
  fields,
  tCode,
  parentTenantCode,
  onSaved,
}: DependentsDetailsProps) {
  const menuIcon = '/assets/svg/vertical-icon.svg';
  const [openFamilyMenuId, setOpenFamilyMenuId] = useState<string | null>(null);
  const [openDomesticMenuId, setOpenDomesticMenuId] = useState<string | null>(null);
  const [openPetsMenuId, setOpenPetsMenuId] = useState<string | null>(null);

  const {
    isModalOpen: isAddFamilyMemberModalOpen,
    modalMode: familyModalMode,
    modalStep: familyModalStep,
    showPermissionsStep: familyShowPermissionsStep,
    permissionsAcknowledged: familyPermissionsAcknowledged,
    form: familyForm,
    fieldErrors: familyFieldErrors,
    relationshipOptions,
    isFieldsEditable: familyIsFieldsEditable,
    isSaving: familyIsSaving,
    isSuccessOpen: isFamilySuccessOpen,
    successHeading: familySuccessHeading,
    successDescription: familySuccessDescription,
    isAlertOpen: isFamilyAlertOpen,
    alertHeading: familyAlertHeading,
    alertDescription: familyAlertDescription,
    isConfirmOpen: isFamilyConfirmOpen,
    confirmHeading: familyConfirmHeading,
    confirmDescription: familyConfirmDescription,
    confirmImagePath: familyConfirmImagePath,
    openAddModal: openFamilyAddModal,
    openEditModal: openFamilyEditModal,
    closeModal: closeFamilyModal,
    handleModalNext: handleFamilyModalNext,
    handleModalBack: handleFamilyModalBack,
    setPermissionsAcknowledged: setFamilyPermissionsAcknowledged,
    handleFirstNameChange: handleFamilyFirstNameChange,
    handleLastNameChange: handleFamilyLastNameChange,
    handleEmailChange: handleFamilyEmailChange,
    handleMobileChange: handleFamilyMobileChange,
    handleRelationshipChange: handleFamilyRelationshipChange,
    handleRequiresSubProfileChange: handleFamilyRequiresSubProfileChange,
    handleActivate: handleFamilyActivate,
    handleDeactivate: handleFamilyDeactivate,
    handleDelete: handleFamilyDelete,
    getFamilyMemberActions,
    setIsSuccessOpen: setIsFamilySuccessOpen,
    setIsAlertOpen: setIsFamilyAlertOpen,
    setIsConfirmOpen: setIsFamilyConfirmOpen,
    confirmSubProfileAction: confirmFamilySubProfileAction,
  } = useFamilyMembers({ tCode, parentTenantCode, onSaved });

  const {
    isModalOpen: isDomesticModalOpen,
    modalMode: domesticModalMode,
    modalStep: domesticModalStep,
    permissionsAcknowledged: domesticPermissionsAcknowledged,
    form: domesticForm,
    fieldErrors: domesticFieldErrors,
    isFieldsEditable: domesticIsFieldsEditable,
    isSaving: domesticIsSaving,
    isSuccessOpen: isDomesticSuccessOpen,
    successHeading: domesticSuccessHeading,
    successDescription: domesticSuccessDescription,
    isAlertOpen: isDomesticAlertOpen,
    alertHeading: domesticAlertHeading,
    alertDescription: domesticAlertDescription,
    isConfirmOpen: isDomesticConfirmOpen,
    confirmHeading: domesticConfirmHeading,
    confirmDescription: domesticConfirmDescription,
    confirmImagePath: domesticConfirmImagePath,
    openAddModal: openDomesticAddModal,
    openEditModal: openDomesticEditModal,
    closeModal: closeDomesticModal,
    handleModalNext: handleDomesticModalNext,
    handleModalBack: handleDomesticModalBack,
    setPermissionsAcknowledged: setDomesticPermissionsAcknowledged,
    handleFirstNameChange: handleDomesticFirstNameChange,
    handleLastNameChange: handleDomesticLastNameChange,
    handleMobileChange: handleDomesticMobileChange,
    handleRequiresSubProfileChange: handleDomesticRequiresSubProfileChange,
    handleActivate: handleDomesticActivate,
    handleDeactivate: handleDomesticDeactivate,
    handleDelete: handleDomesticDelete,
    getDomesticWorkerActions,
    setIsSuccessOpen: setIsDomesticSuccessOpen,
    setIsAlertOpen: setIsDomesticAlertOpen,
    setIsConfirmOpen: setIsDomesticConfirmOpen,
    confirmSubProfileAction: confirmDomesticSubProfileAction,
  } = useDomesticWorkers({ tCode, parentTenantCode, onSaved });

  const {
    isModalOpen: isPetModalOpen,
    modalMode: petModalMode,
    form: petForm,
    fieldErrors: petFieldErrors,
    isSaving: petIsSaving,
    isSuccessOpen: isPetSuccessOpen,
    successHeading: petSuccessHeading,
    successDescription: petSuccessDescription,
    isAlertOpen: isPetAlertOpen,
    alertHeading: petAlertHeading,
    alertDescription: petAlertDescription,
    isConfirmOpen: isPetConfirmOpen,
    confirmHeading: petConfirmHeading,
    openAddModal: openPetAddModal,
    openEditModal: openPetEditModal,
    closeModal: closePetModal,
    handleSave: handlePetSave,
    handleDelete: handlePetDelete,
    confirmDelete: confirmPetDelete,
    handleNameChange: handlePetNameChange,
    handleTypeChange: handlePetTypeChange,
    handleBreedChange: handlePetBreedChange,
    getPetActions,
    parsePetType,
    setIsSuccessOpen: setIsPetSuccessOpen,
    setIsAlertOpen: setIsPetAlertOpen,
    setIsConfirmOpen: setIsPetConfirmOpen,
  } = usePets({ tCode, onSaved });

  useEffect(() => {
    const closeMenu = () => {
      setOpenFamilyMenuId(null);
      setOpenDomesticMenuId(null);
      setOpenPetsMenuId(null);
    };
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  return (
    <div className="pb-6">
      <section>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
          <div>
            <h4 className="text-[20px] leading-[28px] font-medium text-navy-500">Family</h4>
            <p className="text-[16px] leading-[24px] font-light text-navy-500 mt-2">
              Add your family members and their details.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary uppercase md:btn-sm h-11 px-[26px] py-[12px]"
            onClick={openFamilyAddModal}
          >
            Add Family Member
          </button>
        </div>

        <div className="table w-full md:rounded-t-3xl overflow-visible">
          <div className="text-body-xs lg:text-body font-normal bg-lilac-100 hidden lg:table-header-group">
            <div className="table-row">
              <div className="table-cell p-3 font-medium">Name</div>
              <div className="table-cell p-3 font-medium">Relationship</div>
              <div className="table-cell p-3 font-medium">Email</div>
              <div className="table-cell p-3 font-medium">Contact number</div>
              <div className="table-cell p-3 font-medium">Subprofile</div>
              <div className="table-cell p-3 font-medium"></div>
            </div>
          </div>
          <div className="text-body-xs lg:text-body font-light flex flex-col gap-3 lg:table-row-group lg:gap-0">
            {fields?.occupantDetails?.map((item: FamilyMemberOccupant, index: number) => (
              <div
                key={item.Occupant_Id ?? index}
                className="relative p-3 rounded-xl border border-lilac-200 flex flex-wrap gap-3 lg:table-row lg:p-0 lg:border-none lg:rounded-none"
              >
                <div className="order-1 flex-[1_1_45%] flex flex-col min-h-[70px] lg:table-cell lg:p-3 lg:align-middle lg:border-b lg:border-b-lilac-200">
                  <div className="mb-2 lg:hidden">
                    {getSubprofileStatusLabel(item.SubProfileStatus) !== '' && (
                      <StatusBadge label={getSubprofileStatusLabel(item.SubProfileStatus)} />
                    )}
                  </div>
                  <p className="font-light text-navy-500 mt-auto">{`${item?.Firstname} ${item?.Lastname}`}</p>
                </div>
                <div
                  className="absolute top-3 right-3 lg:hidden"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    aria-label="Open menu"
                    className="inline-flex items-center justify-center rounded-md p-1 transition-all hover:bg-lilac-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac-500"
                    onClick={() =>
                      setOpenFamilyMenuId(
                        openFamilyMenuId === `family-mobile-${index}`
                          ? null
                          : `family-mobile-${index}`
                      )
                    }
                  >
                    <Image
                      src={menuIcon}
                      alt="More actions"
                      width={16}
                      height={16}
                      className="w-4 h-4 object-contain"
                    />
                  </button>
                  {openFamilyMenuId === `family-mobile-${index}` && (
                    <FamilyActionTab
                      occupant={item}
                      onClose={() => setOpenFamilyMenuId(null)}
                      onEdit={() => {
                        setOpenFamilyMenuId(null);
                        openFamilyEditModal(item);
                      }}
                      onActivate={() => {
                        setOpenFamilyMenuId(null);
                        handleFamilyActivate(item);
                      }}
                      onDeactivate={() => {
                        setOpenFamilyMenuId(null);
                        handleFamilyDeactivate(item);
                      }}
                      onDelete={() => {
                        setOpenFamilyMenuId(null);
                        handleFamilyDelete(item);
                      }}
                      getFamilyMemberActions={getFamilyMemberActions}
                    />
                  )}
                </div>
                <div className="order-2 flex-[1_1_45%] pe-6 lg:hidden flex flex-col justify-center items-start text-left">
                  <p className="text-navy-500">Relationship</p>
                  <p className="text-navy-500 font-semibold">{item.Occupant_Relation}</p>
                  <p className="text-navy-500 mt-2">Email</p>
                  <p className="text-navy-500 font-semibold">{item.Occupant_Email}</p>
                  <p className="text-navy-500 mt-2">Contact number</p>
                  <p className="text-navy-500 font-semibold">{item.Occupant_Mobile}</p>
                </div>
                <div className="hidden lg:table-cell lg:p-3 lg:align-middle lg:border-b lg:border-b-lilac-200">
                  {item.Occupant_Relation}
                </div>
                <div className="hidden lg:table-cell lg:p-3 lg:align-middle lg:border-b lg:border-b-lilac-200">
                  {item.Occupant_Email}
                </div>
                <div className="hidden lg:table-cell lg:p-3 lg:align-middle lg:border-b lg:border-b-lilac-200">
                  {item.Occupant_Mobile}
                </div>
                <div className="hidden lg:table-cell lg:p-3 lg:align-middle lg:border-b lg:border-b-lilac-200">
                  {getSubprofileStatusLabel(item.SubProfileStatus) !== '' && (
                    <StatusBadge label={getSubprofileStatusLabel(item.SubProfileStatus)} />
                  )}
                </div>
                <div className="hidden lg:table-cell lg:p-3 lg:align-middle lg:border-b lg:border-b-lilac-200 text-right lg:pe-5">
                  <div
                    className="relative inline-flex"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      aria-label="Open menu"
                      className="inline-flex items-center justify-center rounded-md p-1 transition-all hover:bg-lilac-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac-500"
                      onClick={() =>
                        setOpenFamilyMenuId(
                          openFamilyMenuId === `family-desktop-${index}`
                            ? null
                            : `family-desktop-${index}`
                        )
                      }
                    >
                      <Image
                        src={menuIcon}
                        alt="More actions"
                        width={4}
                        height={22}
                        className="inline-block w-[4px] h-[22px]"
                      />
                    </button>
                    {openFamilyMenuId === `family-desktop-${index}` && (
                      <FamilyActionTab
                        occupant={item}
                        onClose={() => setOpenFamilyMenuId(null)}
                        onEdit={() => {
                          setOpenFamilyMenuId(null);
                          openFamilyEditModal(item);
                        }}
                        onActivate={() => {
                          setOpenFamilyMenuId(null);
                          handleFamilyActivate(item);
                        }}
                        onDeactivate={() => {
                          setOpenFamilyMenuId(null);
                          handleFamilyDeactivate(item);
                        }}
                        onDelete={() => {
                          setOpenFamilyMenuId(null);
                          handleFamilyDelete(item);
                        }}
                        getFamilyMemberActions={getFamilyMemberActions}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3 mt-6">
          <div>
            <h4 className="text-[20px] leading-[28px] font-medium text-navy-500">
              Domestic workers
            </h4>
            <p className="text-[16px] leading-[24px] font-light text-navy-500 mt-2">
              Add details of domestic workers such as a gardener or cook.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary uppercase md:btn-sm h-11 px-[12px] py-[12px]"
            onClick={openDomesticAddModal}
          >
            Add Domestic Worker
          </button>
        </div>

        <div className="table w-full md:rounded-t-3xl overflow-visible">
          <div className="text-body-xs lg:text-body font-normal bg-lilac-100 hidden lg:table-header-group">
            <div className="table-row">
              <div className="table-cell p-3 font-medium">Name</div>
              <div className="table-cell p-3 font-medium">Contact number</div>
              <div className="table-cell p-3 font-medium">Subprofile</div>
              <div className="table-cell p-3 font-medium"></div>
            </div>
          </div>
          <div className="text-body-xs lg:text-body font-light flex flex-col gap-3 lg:table-row-group lg:gap-0">
            {fields?.householdDetails?.map((item: DomesticWorkerOccupant, index: number) => (
              <div
                key={item.Occupant_Id ?? index}
                className="relative p-3 rounded-xl border border-lilac-200 flex flex-wrap gap-3 lg:table-row lg:p-0 lg:border-none lg:rounded-none"
              >
                <div className="order-1 flex-[1_1_45%] flex flex-col min-h-[70px] lg:table-cell lg:p-3 lg:align-middle lg:border-b lg:border-b-lilac-200">
                  <div className="mb-2 lg:hidden">
                    {getSubprofileStatusLabel(item.SubProfileStatus) !== '' && (
                      <StatusBadge label={getSubprofileStatusLabel(item.SubProfileStatus)} />
                    )}
                  </div>
                  <p className="font-medium text-navy-500 mt-auto">{`${item?.Firstname} ${item?.Lastname}`}</p>
                </div>
                <div
                  className="absolute top-3 right-3 lg:hidden"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    aria-label="Open menu"
                    className="inline-flex items-center justify-center rounded-md p-1 transition-all hover:bg-lilac-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac-500"
                    onClick={() =>
                      setOpenDomesticMenuId(
                        openDomesticMenuId === `domestic-mobile-${index}`
                          ? null
                          : `domestic-mobile-${index}`
                      )
                    }
                  >
                    <Image
                      src={menuIcon}
                      alt="More actions"
                      width={16}
                      height={16}
                      className="w-4 h-4 object-contain"
                    />
                  </button>
                  {openDomesticMenuId === `domestic-mobile-${index}` && (
                    <DomesticActionTab
                      occupant={item}
                      onClose={() => setOpenDomesticMenuId(null)}
                      onEdit={() => {
                        setOpenDomesticMenuId(null);
                        openDomesticEditModal(item);
                      }}
                      onActivate={() => {
                        setOpenDomesticMenuId(null);
                        handleDomesticActivate(item);
                      }}
                      onDeactivate={() => {
                        setOpenDomesticMenuId(null);
                        handleDomesticDeactivate(item);
                      }}
                      onDelete={() => {
                        setOpenDomesticMenuId(null);
                        handleDomesticDelete(item);
                      }}
                      getDomesticWorkerActions={getDomesticWorkerActions}
                    />
                  )}
                </div>
                <div className="order-2 flex-[1_1_45%] pe-6 lg:hidden flex flex-col justify-end min-h-[70px] items-start text-left">
                  <p className="text-navy-500 font-medium">Contact number</p>
                  <p className="text-navy-500 font-semibold">{item.Occupant_Mobile}</p>
                </div>
                <div className="hidden lg:table-cell lg:p-3 lg:align-middle lg:border-b lg:border-b-lilac-200">
                  {item.Occupant_Mobile}
                </div>
                <div className="hidden lg:table-cell lg:p-3 lg:align-middle lg:border-b lg:border-b-lilac-200">
                  {getSubprofileStatusLabel(item.SubProfileStatus) !== '' && (
                    <StatusBadge label={getSubprofileStatusLabel(item.SubProfileStatus)} />
                  )}
                </div>
                <div className="hidden lg:table-cell lg:p-3 lg:align-middle lg:border-b lg:border-b-lilac-200 text-right lg:pe-5">
                  <div
                    className="relative inline-flex"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      aria-label="Open menu"
                      className="inline-flex items-center justify-center rounded-md p-1 transition-all hover:bg-lilac-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac-500"
                      onClick={() =>
                        setOpenDomesticMenuId(
                          openDomesticMenuId === `domestic-desktop-${index}`
                            ? null
                            : `domestic-desktop-${index}`
                        )
                      }
                    >
                      <Image
                        src={menuIcon}
                        alt="More actions"
                        width={4}
                        height={22}
                        className="inline-block w-[4px] h-[22px]"
                      />
                    </button>
                    {openDomesticMenuId === `domestic-desktop-${index}` && (
                      <DomesticActionTab
                        occupant={item}
                        onClose={() => setOpenDomesticMenuId(null)}
                        onEdit={() => {
                          setOpenDomesticMenuId(null);
                          openDomesticEditModal(item);
                        }}
                        onActivate={() => {
                          setOpenDomesticMenuId(null);
                          handleDomesticActivate(item);
                        }}
                        onDeactivate={() => {
                          setOpenDomesticMenuId(null);
                          handleDomesticDeactivate(item);
                        }}
                        onDelete={() => {
                          setOpenDomesticMenuId(null);
                          handleDomesticDelete(item);
                        }}
                        getDomesticWorkerActions={getDomesticWorkerActions}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-4 md:mb-8 overflow-visible">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3 mt-6">
          <div>
            <h4 className="text-[20px] leading-[28px] font-medium text-navy-500">Pets</h4>
            <p className="text-[16px] leading-[24px] font-light text-navy-500 mt-2">
              Add details of your pet.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary uppercase md:btn-sm h-11 px-[12px] py-[12px]"
            onClick={openPetAddModal}
          >
            Add a Pet
          </button>
        </div>

        <div className="table w-full md:rounded-t-3xl overflow-visible">
          <div className="text-body-xs lg:text-body font-normal bg-lilac-100 hidden lg:table-header-group">
            <div className="table-row">
              <div className="table-cell p-3 font-medium">Name</div>
              <div className="table-cell p-3 font-medium">Type</div>
              <div className="table-cell p-3 font-medium">Breed</div>
              <div className="table-cell p-3 font-medium"></div>
            </div>
          </div>
          <div className="text-body-xs lg:text-body font-light flex flex-col gap-3 lg:table-row-group lg:gap-0">
            {fields?.petDetails?.map((item: PetDetails, index: number) => {
              const { type, breed } = parsePetType(item.Pet_Type);

              return (
                <div
                  key={item.Pet_Id ?? index}
                  className="relative overflow-visible p-3 rounded-xl border border-lilac-200 flex flex-wrap gap-3 lg:table-row lg:p-0 lg:border-none lg:rounded-none"
                >
                  <div className="order-1 flex-[1_1_45%] flex flex-col min-h-[70px] lg:table-cell lg:p-3 lg:align-middle lg:border-b lg:border-b-lilac-200">
                    <p className="font-light text-navy-500 mt-auto">{item.Pet_Name}</p>
                  </div>
                  <div
                    className="absolute top-3 right-3 lg:hidden overflow-visible"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      aria-label="Open menu"
                      className="inline-flex items-center justify-center rounded-md p-1 transition-all hover:bg-lilac-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac-500"
                      onClick={() =>
                        setOpenPetsMenuId(
                          openPetsMenuId === `pets-mobile-${index}` ? null : `pets-mobile-${index}`
                        )
                      }
                    >
                      <Image
                        src={menuIcon}
                        alt="More actions"
                        width={16}
                        height={16}
                        className="w-4 h-4 object-contain"
                      />
                    </button>
                    {openPetsMenuId === `pets-mobile-${index}` && (
                      <PetsActionTab
                        onClose={() => setOpenPetsMenuId(null)}
                        onEdit={() => {
                          setOpenPetsMenuId(null);
                          openPetEditModal(item);
                        }}
                        onDelete={() => {
                          setOpenPetsMenuId(null);
                          handlePetDelete(item);
                        }}
                        getPetActions={getPetActions}
                      />
                    )}
                  </div>
                  <div className="order-2 flex-[1_1_45%] pe-6 lg:hidden flex flex-col justify-end min-h-[70px] items-start text-left">
                    <p className="text-navy-500">Type</p>
                    <p className="text-navy-500 font-semibold">{type}</p>
                    <p className="text-navy-500 mt-2">Breed</p>
                    <p className="text-navy-500 font-semibold">{breed || '-'}</p>
                  </div>
                  <div className="hidden lg:table-cell lg:p-3 lg:align-middle lg:border-b lg:border-b-lilac-200">
                    {type}
                  </div>
                  <div className="hidden lg:table-cell lg:p-3 lg:align-middle lg:border-b lg:border-b-lilac-200">
                    {breed || '-'}
                  </div>
                  <div className="hidden lg:table-cell lg:p-3 lg:align-middle lg:border-b lg:border-b-lilac-200 text-right lg:pe-5 lg:overflow-visible">
                    <div
                      className="relative inline-flex overflow-visible"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        aria-label="Open menu"
                        className="inline-flex items-center justify-center rounded-md p-1 transition-all hover:bg-lilac-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac-500"
                        onClick={() =>
                          setOpenPetsMenuId(
                            openPetsMenuId === `pets-desktop-${index}`
                              ? null
                              : `pets-desktop-${index}`
                          )
                        }
                      >
                        <Image
                          src={menuIcon}
                          alt="More actions"
                          width={4}
                          height={22}
                          className="inline-block w-[4px] h-[22px]"
                        />
                      </button>
                      {openPetsMenuId === `pets-desktop-${index}` && (
                        <PetsActionTab
                          onClose={() => setOpenPetsMenuId(null)}
                          onEdit={() => {
                            setOpenPetsMenuId(null);
                            openPetEditModal(item);
                          }}
                          onDelete={() => {
                            setOpenPetsMenuId(null);
                            handlePetDelete(item);
                          }}
                          getPetActions={getPetActions}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <AddFamilyMemberModal
        isOpen={isAddFamilyMemberModalOpen}
        mode={familyModalMode}
        modalStep={familyModalStep}
        showPermissionsStep={familyShowPermissionsStep}
        permissionsAcknowledged={familyPermissionsAcknowledged}
        fields={fields}
        form={familyForm}
        fieldErrors={familyFieldErrors}
        relationshipOptions={relationshipOptions}
        isFieldsEditable={familyIsFieldsEditable}
        isSaving={familyIsSaving}
        onClose={closeFamilyModal}
        onNext={handleFamilyModalNext}
        onBack={handleFamilyModalBack}
        onFirstNameChange={handleFamilyFirstNameChange}
        onLastNameChange={handleFamilyLastNameChange}
        onEmailChange={handleFamilyEmailChange}
        onMobileChange={handleFamilyMobileChange}
        onRelationshipChange={handleFamilyRelationshipChange}
        onRequiresSubProfileChange={handleFamilyRequiresSubProfileChange}
        onPermissionsAcknowledgedChange={setFamilyPermissionsAcknowledged}
      />
      <AddDependentModal
        isOpen={isDomesticModalOpen}
        mode={domesticModalMode}
        modalStep={domesticModalStep}
        permissionsAcknowledged={domesticPermissionsAcknowledged}
        fields={fields}
        form={domesticForm}
        fieldErrors={domesticFieldErrors}
        isFieldsEditable={domesticIsFieldsEditable}
        isSaving={domesticIsSaving}
        onClose={closeDomesticModal}
        onNext={handleDomesticModalNext}
        onBack={handleDomesticModalBack}
        onFirstNameChange={handleDomesticFirstNameChange}
        onLastNameChange={handleDomesticLastNameChange}
        onMobileChange={handleDomesticMobileChange}
        onRequiresSubProfileChange={handleDomesticRequiresSubProfileChange}
        onPermissionsAcknowledgedChange={setDomesticPermissionsAcknowledged}
      />
      <AddPetModal
        isOpen={isPetModalOpen}
        mode={petModalMode}
        form={petForm}
        fieldErrors={petFieldErrors}
        isSaving={petIsSaving}
        onClose={closePetModal}
        onSave={handlePetSave}
        onNameChange={handlePetNameChange}
        onTypeChange={handlePetTypeChange}
        onBreedChange={handlePetBreedChange}
      />

      <CustomModal
        showModal={isFamilySuccessOpen}
        setShowModal={setIsFamilySuccessOpen}
        heading={familySuccessHeading}
        description={familySuccessDescription}
        imagePath="/assets/svg/celebrate.svg"
        primaryBtnLabel="CLOSE"
      />

      <CustomModal
        showModal={isFamilyAlertOpen}
        setShowModal={setIsFamilyAlertOpen}
        modalType="error"
        heading={familyAlertHeading}
        description={familyAlertDescription}
        imagePath="/assets/svg/no-maintenance-request.svg"
        primaryBtnLabel="OK"
      />

      <CustomModal
        showModal={isFamilyConfirmOpen}
        setShowModal={setIsFamilyConfirmOpen}
        modalType="error"
        heading={familyConfirmHeading}
        description={familyConfirmDescription}
        imagePath={familyConfirmImagePath}
        primaryBtnLabel="CONFIRM"
        secondaryBtnLabel="CANCEL"
        handlePrimaryBtnClick={confirmFamilySubProfileAction}
      />

      <CustomModal
        showModal={isDomesticSuccessOpen}
        setShowModal={setIsDomesticSuccessOpen}
        heading={domesticSuccessHeading}
        description={domesticSuccessDescription}
        imagePath="/assets/svg/celebrate.svg"
        primaryBtnLabel="CLOSE"
      />

      <CustomModal
        showModal={isDomesticAlertOpen}
        setShowModal={setIsDomesticAlertOpen}
        modalType="error"
        heading={domesticAlertHeading}
        description={domesticAlertDescription}
        imagePath="/assets/svg/no-maintenance-request.svg"
        primaryBtnLabel="OK"
      />

      <CustomModal
        showModal={isDomesticConfirmOpen}
        setShowModal={setIsDomesticConfirmOpen}
        modalType="error"
        heading={domesticConfirmHeading}
        description={domesticConfirmDescription}
        imagePath={domesticConfirmImagePath}
        primaryBtnLabel="CONFIRM"
        secondaryBtnLabel="CANCEL"
        handlePrimaryBtnClick={confirmDomesticSubProfileAction}
      />

      <CustomModal
        showModal={isPetSuccessOpen}
        setShowModal={setIsPetSuccessOpen}
        heading={petSuccessHeading}
        description={petSuccessDescription}
        imagePath="/assets/svg/celebrate.svg"
        primaryBtnLabel="CLOSE"
      />

      <CustomModal
        showModal={isPetAlertOpen}
        setShowModal={setIsPetAlertOpen}
        modalType="error"
        heading={petAlertHeading}
        description={petAlertDescription}
        imagePath="/assets/svg/no-maintenance-request.svg"
        primaryBtnLabel="OK"
      />

      <CustomModal
        showModal={isPetConfirmOpen}
        setShowModal={setIsPetConfirmOpen}
        heading={petConfirmHeading}
        imagePath="/assets/svg/deactivate-account.svg"
        primaryBtnLabel="CONFIRM"
        secondaryBtnLabel="CANCEL"
        handlePrimaryBtnClick={confirmPetDelete}
      />
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  let statusClass: string;

  switch (label) {
    case 'Active':
      statusClass = 'text-success-900 bg-success-50 border-success-500';
      break;

    case 'Deactivated':
    case 'Locked':
      statusClass = 'text-warning-900 bg-warning-50 border-warning-500';
      break;

    default:
      statusClass = 'text-lilac-800 bg-lilac-100 border-lilac-500';
  }

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full border text-body-xs font-medium ${statusClass}`}
    >
      {label}
    </span>
  );
}

type FamilyActionTabProps = {
  occupant: FamilyMemberOccupant;
  onClose: () => void;
  onEdit: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  getFamilyMemberActions: (occupant: FamilyMemberOccupant) => {
    showEdit: boolean;
    showActivate: boolean;
    showDeactivate: boolean;
    showDelete: boolean;
    activateLabel: string;
  };
};

function FamilyActionTab({
  occupant,
  onClose,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
  getFamilyMemberActions,
}: FamilyActionTabProps) {
  const actions = getFamilyMemberActions(occupant);

  return (
    <div className="absolute right-0 top-6 z-50 min-w-[152px] rounded-lg border border-lilac-300 bg-white-pure shadow-md p-1">
      {actions.showEdit ? (
        <button
          type="button"
          className="w-full text-left px-3 py-2 text-body-sm text-navy-500 hover:bg-lilac-100 rounded-md"
          onClick={onEdit}
        >
          Edit
        </button>
      ) : null}
      {actions.showActivate ? (
        <button
          type="button"
          className="w-full text-left px-3 py-2 text-body-sm text-navy-500 hover:bg-lilac-100 rounded-md"
          onClick={onActivate}
        >
          {actions.activateLabel}
        </button>
      ) : null}
      {actions.showDeactivate ? (
        <button
          type="button"
          className="w-full text-left px-3 py-2 text-body-sm text-navy-500 hover:bg-lilac-100 rounded-md"
          onClick={onDeactivate}
        >
          Deactivate
        </button>
      ) : null}
      {actions.showDelete ? (
        <button
          type="button"
          className="w-full text-left px-3 py-2 text-body-sm text-navy-500 hover:bg-lilac-100 rounded-md"
          onClick={onDelete}
        >
          Delete
        </button>
      ) : null}
      {!actions.showEdit &&
      !actions.showActivate &&
      !actions.showDeactivate &&
      !actions.showDelete ? (
        <button
          type="button"
          className="w-full text-left px-3 py-2 text-body-sm text-navy-500 hover:bg-lilac-100 rounded-md"
          onClick={onClose}
        >
          Close
        </button>
      ) : null}
    </div>
  );
}

type DomesticActionTabProps = {
  occupant: DomesticWorkerOccupant;
  onClose: () => void;
  onEdit: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  getDomesticWorkerActions: (occupant: DomesticWorkerOccupant) => {
    showEdit: boolean;
    showActivate: boolean;
    showDeactivate: boolean;
    showDelete: boolean;
    activateLabel: string;
  };
};

function DomesticActionTab({
  occupant,
  onClose,
  onEdit,
  onActivate,
  onDeactivate,
  onDelete,
  getDomesticWorkerActions,
}: DomesticActionTabProps) {
  const actions = getDomesticWorkerActions(occupant);

  return (
    <div className="absolute right-0 top-6 z-50 min-w-[152px] rounded-lg border border-lilac-300 bg-white-pure shadow-md p-1">
      {actions.showEdit ? (
        <button
          type="button"
          className="w-full text-left px-3 py-2 text-body-sm text-navy-500 hover:bg-lilac-100 rounded-md"
          onClick={onEdit}
        >
          Edit
        </button>
      ) : null}
      {actions.showActivate ? (
        <button
          type="button"
          className="w-full text-left px-3 py-2 text-body-sm text-navy-500 hover:bg-lilac-100 rounded-md"
          onClick={onActivate}
        >
          {actions.activateLabel}
        </button>
      ) : null}
      {actions.showDeactivate ? (
        <button
          type="button"
          className="w-full text-left px-3 py-2 text-body-sm text-navy-500 hover:bg-lilac-100 rounded-md"
          onClick={onDeactivate}
        >
          Deactivate
        </button>
      ) : null}
      {actions.showDelete ? (
        <button
          type="button"
          className="w-full text-left px-3 py-2 text-body-sm text-navy-500 hover:bg-lilac-100 rounded-md"
          onClick={onDelete}
        >
          Delete
        </button>
      ) : null}
      {!actions.showEdit &&
      !actions.showActivate &&
      !actions.showDeactivate &&
      !actions.showDelete ? (
        <button
          type="button"
          className="w-full text-left px-3 py-2 text-body-sm text-navy-500 hover:bg-lilac-100 rounded-md"
          onClick={onClose}
        >
          Close
        </button>
      ) : null}
    </div>
  );
}

type PetsActionTabProps = {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  getPetActions: () => {
    showEdit: boolean;
    showDelete: boolean;
  };
};

function PetsActionTab({ onClose, onEdit, onDelete, getPetActions }: PetsActionTabProps) {
  const actions = getPetActions();

  return (
    <div className="absolute right-0 bottom-full mb-1 z-50 min-w-[152px] rounded-lg border border-lilac-300 bg-white-pure shadow-md p-1">
      {actions.showEdit ? (
        <button
          type="button"
          className="w-full text-left px-3 py-2 text-body-sm text-navy-500 hover:bg-lilac-100 rounded-md"
          onClick={onEdit}
        >
          Edit
        </button>
      ) : null}
      {actions.showDelete ? (
        <button
          type="button"
          className="w-full text-left px-3 py-2 text-body-sm text-navy-500 hover:bg-lilac-100 rounded-md"
          onClick={onDelete}
        >
          Delete
        </button>
      ) : null}
      {!actions.showEdit && !actions.showDelete ? (
        <button
          type="button"
          className="w-full text-left px-3 py-2 text-body-sm text-navy-500 hover:bg-lilac-100 rounded-md"
          onClick={onClose}
        >
          Close
        </button>
      ) : null}
    </div>
  );
}
