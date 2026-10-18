import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import LocationIcon from 'assets/icons/LocationIcon';
import { formatLeaseDate } from 'lib/utils/helper';
import Image from 'next/image';
import { useEffect } from 'react';
import ProfileImageModal from 'src/components/ProfileDetails/ProfileImageModal';
import { useProfileImage } from 'src/components/ProfileDetails/useProfileImage';
import { CustomLink, CustomRichText } from 'src/common/SitecoreOverrides';
import { CustomModal } from 'src/components/modals/CustomModal';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';

export default function UserDetails({ fields }: any) {
  const {
    tenant_name,
    CommunityDisplayName,
    Unit_Code,
    tCode: storeTCode,
    setUserData,
  } = useUserStore();
  const isEditProfile = fields?.editProfile?.value == 1;
  const tCode = fields?.tCode ?? storeTCode ?? null;
  const trimmedUnitCode = Unit_Code?.trim?.() || '';
  const locationText = isEditProfile
    ? fields?.address
    : [trimmedUnitCode, CommunityDisplayName].filter(Boolean).join(', ');

  const { mutate: loadTenantDetails } = useApiMutation<any, any>(
    () => `/Yardi/GetDetails?tCode=${tCode}`,
    'GET',
    false
  );

  useEffect(() => {
    if (isEditProfile || !tCode || trimmedUnitCode) return;

    loadTenantDetails(null, {
      onSuccess: (response) => {
        const unitCode = response?.Tenant_Details?.[0]?.Unit_Code?.trim?.();
        if (unitCode) {
          setUserData({ Unit_Code: unitCode });
        }
      },
    });
  }, [isEditProfile, tCode, trimmedUnitCode, loadTenantDetails, setUserData]);

  const {
    profileImageSrc,
    hasProfileImage,
    isOptionsOpen,
    successType,
    isUploadErrorOpen,
    isRemoving,
    fileInputRef,
    setSuccessType,
    setIsUploadErrorOpen,
    openOptionsModal,
    closeOptionsModal,
    triggerFileSelect,
    handleFileChange,
    handleFileDrop,
    handleRemoveImage,
    retryUpload,
  } = useProfileImage(tCode, Boolean(tCode));

  return (
    <section className="UserDetails bg-silver-chalice-50">
      <div className="container-sm -mt-8 md:-mt-10 z-25 relative">
        <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-3">
            <div className="flex gap-5 md:gap-4 items-center">
              <div className={`relative shrink-0 ${isEditProfile ? 'size-30 me-3' : 'size-20'}`}>
                <div className="size-full rounded-full overflow-hidden bg-white-pure">
                  {profileImageSrc ? (
                    <img
                      src={profileImageSrc}
                      alt="Profile Image"
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <Image
                      src="/assets/images/user-image.png"
                      alt="Profile placeholder"
                      width={120}
                      height={120}
                      className="object-cover h-full w-full"
                    />
                  )}
                </div>
                {isEditProfile && (
                  <button
                    type="button"
                    className="absolute bottom-0 -right-3 w-11 h-11 rounded-md border border-lilac-300 bg-white-pure text-lilac-500 flex items-center justify-center cursor-pointer"
                    aria-label="Edit profile picture"
                    onClick={openOptionsModal}
                  >
                    <CustomRichText
                      field={fields?.editProfileIcon}
                      className="[&_svg]:w-[22px] [&_svg]:h-[22px]"
                    />
                  </button>
                )}
              </div>
              <div>
                <h3 className="text-body font-medium text-navy-500">{tenant_name}</h3>
                <p className="flex gap-1 mt-1 text-body font-light text-navy-500">
                  <span>
                    <LocationIcon className="size-6 text-lilac-500" />
                  </span>
                  {locationText ? locationText : '-'}
                </p>
                {isEditProfile && (
                  <CustomLink
                    field={fields?.changePasswordCTA}
                    className="btn btn-secondary mt-3 h-11 hidden md:inline-flex"
                  />
                )}
              </div>
            </div>
            {isEditProfile ? (
              <div className="flex flex-col gap-4">
                {fields?.tenantDetails?.Lease_Start_Date && (
                  <div>
                    <span className="text-caption md:text-body text-navy-500 font-medium">
                      Lease Start Date:
                    </span>
                    <p className="inline ms-1 text-body text-navy-500 font-light">
                      {formatLeaseDate(fields?.tenantDetails?.Lease_Start_Date)}
                    </p>
                  </div>
                )}
                {fields?.tenantDetails?.Lease_End_Date && (
                  <div>
                    <span className="text-caption md:text-body text-navy-500 font-medium">
                      Lease Renewal Due:
                    </span>
                    <p className="inline ms-1 text-body text-navy-500 font-light">
                      {formatLeaseDate(fields?.tenantDetails?.Lease_End_Date)}
                    </p>
                  </div>
                )}
                {isEditProfile && (
                  <CustomLink
                    field={fields?.changePasswordCTA}
                    className="btn btn-secondary h-11 md:hidden"
                  />
                )}
              </div>
            ) : (
              <div>
                {fields?.customercarecontacts?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className={`${index != 0 ? 'pt-2' : ''} ${
                      index < fields?.customercarecontacts?.length - 1
                        ? 'pb-2 border-b border-b-lilac-500'
                        : ''
                    }`}
                  >
                    <Text
                      tag="h4"
                      field={item?.ContactTitle || item?.fields?.ContactTitle}
                      className="text-body font-medium text-silver-chalice-700"
                    />
                    <CustomLink
                      field={item?.ContactNumber || item?.fields?.ContactNumber}
                      className="text-body font-normal text-sky-700 hover:text-sky-900"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {!isEditProfile && fields?.contacts?.length && (
            <div className="mt-5 md:mt-6 border-t border-t-lilac-500">
              <h2 className="pt-2 md:pt-3 text-heading-3 text-navy-500">Emergency numbers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 md:gap-x-10 mt-2">
                {fields?.contacts?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className={`${index == 0 ? 'pb-3 pt-0 md:py-3' : 'py-3'} flex justify-between ${
                      index < fields?.contacts?.length - 1
                        ? 'border-b border-b-lilac-500'
                        : 'border-0 md:border-b border-b-lilac-500'
                    }`}
                  >
                    <Text
                      tag="h4"
                      field={item?.ContactTitle || item?.fields?.ContactTitle}
                      className="text-body font-light text-navy-500"
                    />
                    <CustomLink
                      field={item?.ContactNumber || item?.fields?.ContactNumber}
                      className="text-body font-medium text-sky-700 hover:text-sky-900"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditProfile && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/bmp,image/jpeg,image/png,image/jpg"
            onChange={handleFileChange}
          />

          <ProfileImageModal
            isOpen={isOptionsOpen}
            hasProfileImage={hasProfileImage}
            profileImageSrc={profileImageSrc}
            isRemoving={isRemoving}
            onClose={closeOptionsModal}
            onUploadClick={triggerFileSelect}
            onRemoveClick={handleRemoveImage}
            onFileDrop={handleFileDrop}
          />

          <CustomModal
            showModal={successType === 'upload'}
            setShowModal={(open) => !open && setSuccessType(null)}
            heading="You have successfully uploaded your profile photo"
            imagePath="/assets/svg/celebrate.svg"
            primaryBtnLabel="CLOSE"
          />

          <CustomModal
            showModal={successType === 'delete'}
            setShowModal={(open) => !open && setSuccessType(null)}
            heading="You have successfully deleted your profile photo"
            imagePath="/assets/svg/delete-account.svg"
            primaryBtnLabel="CLOSE"
          />

          <CustomModal
            showModal={isUploadErrorOpen}
            setShowModal={setIsUploadErrorOpen}
            modalType="error"
            heading="Uploading Failed!"
            description="The image format must be jpg, bmp or png. The file size should not be more than 5 MB."
            imagePath="/assets/svg/error.svg"
            primaryBtnLabel="RETRY"
            secondaryBtnLabel="CANCEL"
            handlePrimaryBtnClick={retryUpload}
          />
        </>
      )}
    </section>
  );
}
