import ArrowLeft from 'assets/icons/ArrowLeft';
import Link from 'next/link';
import React from 'react';
import { SERVICE_REQUEST_TYPE } from 'lib/common/constants/common';
import { Input } from 'components/common/Input';
import { formatPhoneInput, normalizeCategory } from 'lib/utils/helper';
import { CATEGORY_ICONS } from 'lib/common/constants/categoryIcons';
import PlumbingIcon from 'assets/icons/category/PlumbingIcon';
import { Radio } from 'components/common/Radio';
import { Textarea } from 'components/common/Textarea';
import { CreateRequestProps } from './createRequest.types';
import UploadImage from 'components/common/UploadImage';
import { CreateRequestSkeleton } from './CreateRequestSkeleton';

const getCategoryIcon = (categoryName: string) => {
  const key = normalizeCategory(categoryName);
  return CATEGORY_ICONS[key] ?? PlumbingIcon;
};

const CreateRequest: React.FC<CreateRequestProps> = ({
  phoneNumber,
  setPhoneNumber,
  serviceRequestType,
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
  SERVICE_REQUEST_CONFIG,
  isLoadingCategories,
}) => {
  const { icon: Icon, title, description } = SERVICE_REQUEST_CONFIG[serviceRequestType as string];

  return (
    <div className="container-sm py-5 md:py-6 flex flex-col gap-5 md:gap-6">
      <Link
        href="/service-requests"
        className="text-body-sm font-medium flex gap-4 text-navy-500 uppercase items-center"
      >
        <ArrowLeft className="size-5 md:size-7" />
        Back to service requests
      </Link>

      <div className="bg-white-pure border border-lilac-300 rounded-xl p-5 md:p-6 flex flex-col gap-5 md:gap-6">
        <div className="flex flex-col gap-2 md:gap-3">
          <h3 className="flex gap-4 text-[16px] md:text-[20px] font-normal items-center">
            <span>
              <Icon className="size-7 md:size-8 text-lilac-500" />
            </span>
            {title}
          </h3>
          <p className="text-body font-light">{description}</p>
        </div>
        {isLoadingCategories ? (
          <CreateRequestSkeleton />
        ) : (
          <>
            <div className="flex flex-col gap-2 md:gap-3">
              <h4 className="text-body font-medium">Contact details</h4>
              <p className="font-light text-body">
                Our team will use your mobile number to contact you.
              </p>
              <div className="form-group md:max-w-194 flex flex-col md:flex-row gap-2 md:gap-6">
                <Input
                  label={'Mobile number*'}
                  value={phoneNumber}
                  placeholder="05x xxxxxxx"
                  onChange={(e) => {
                    setPhoneNumber(formatPhoneInput(e.target.value));
                    setPhoneNumberError(undefined);
                  }}
                  error={phoneNumberError}
                  containerClassName="w-full md:max-w-[50%] mt-0!"
                />
                {serviceRequestType === SERVICE_REQUEST_TYPE.COMMUNITY ? (
                  <Input
                    label={'Location'}
                    value={location}
                    onChange={(e) => {
                      const regExpr = /[^a-zA-Z0-9- ]/g;
                      setLocation(e.target.value.replace(regExpr, ''));
                    }}
                    containerClassName="w-full md:max-w-[50%] mt-0!"
                    helperText="Eg. Phase 01 Building xyz, floor 7, or Street light next to building xyz not working"
                  />
                ) : null}
              </div>
            </div>
            {categories?.length > 0 ? (
              <div className="space-y-2 md:space-y-3">
                <h4 className="text-body font-medium">Select category</h4>
                <div className="flex gap-3 md:gap-4 flex-wrap">
                  {categories?.map((category) => {
                    const CategoryIcon = getCategoryIcon(category.CategoryName);
                    const isCategorySelected =
                      selectedCategory?.CategoryName === category.CategoryName;
                    return (
                      <div
                        key={category.Id}
                        className={`flex flex-col items-center justify-center gap-3 px-3 md:px-4 border border-lilac-200 rounded-xl w-[48%] h-25 lg:w-32.5 lg:h-30 cursor-pointer ${
                          isCategorySelected ? 'bg-lilac-100' : ''
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        <CategoryIcon className="text-lilac-500" />
                        <span className="text-body-sm font-light text-center">
                          {category.CategoryName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </>
        )}
        {subCategories?.length > 0 ? (
          <div className="space-y-2 md:space-y-3">
            <h4 className="text-body font-medium">Select subcategory</h4>
            <div className="flex flex-wrap gap-6 form-group">
              {subCategories?.map((category) => {
                const isChecked = selectedSubCategory?.SubCategoryName === category.SubCategoryName;
                return (
                  <Radio
                    key={category.Id}
                    name="sub-category"
                    label={category.SubCategoryName}
                    id={category.Id.toString()}
                    value={category.SubCategoryName}
                    onChange={() => setSelectedSubCategory(category)}
                    className={`border border-lilac-300 p-3 md:p-4 rounded-lg flex-row-reverse mb-0! ${
                      isChecked ? 'bg-lilac-100' : ''
                    }`}
                    inputClassName="h-4! w-4!"
                    checked={isChecked}
                  />
                );
              })}
            </div>
          </div>
        ) : null}
        <div className="form-group">
          <Textarea
            label="Issue description*"
            containerClassName="text-end"
            placeholder="Please describe the issue in detail to help us understand it better."
            value={issue}
            onChange={(e) => {
              setIssue(e.target.value);
            }}
            maxLength={1500}
            helperText="Max. 1500 characters"
            autoGrow
            labelClassName="text-body font-medium text-start"
            disabled={isLoadingCategories}
          />
        </div>
        {serviceRequestType !== SERVICE_REQUEST_TYPE.LEASING ? (
          <UploadImage
            label="Upload images"
            labelClassName="text-body! font-medium"
            helperText=" Images must be in JPG or PNG format. You may upload up to 3 images, with each image not exceeding 5 MB."
            accept={['.jpg', '.png']}
            files={selectedFiles}
            onChange={setSelectedFiles}
            disabled={isLoadingCategories}
          />
        ) : null}
      </div>
    </div>
  );
};

export default CreateRequest;
