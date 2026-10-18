'use client';

import { JSX } from 'react';
import HelpIcon from 'assets/icons/HelpIcon';
import MoveOutReasonSection from './MoveOutReasonSection';
import { useMoveOutRequest } from './useMoveOutRequest';

export default function MoveOutRequest({ fields = {} }: { fields?: any }): JSX.Element {
  const {
    categoryOptions,
    specificReasonOptions,
    selectedCategory,
    selectedReasonId,
    isSubmitDisabled,
    isReasonsReady,
    handleCategoryChange,
    setSelectedReasonId,
    handleCancel,
    handleSubmit,
  } = useMoveOutRequest();

  return (
    <section className="MoveOutRequest bg-silver-chalice-50">
      <div className="container-sm py-8 md:py-10 flex flex-col gap-5 md:gap-6">
        <div className="bg-white-pure border border-lilac-300 rounded-xl p-4 md:p-8 flex flex-col gap-6 md:gap-8">
          {isReasonsReady ? (
            <>
              <MoveOutReasonSection
                icon={<HelpIcon className="size-7 md:size-8 text-lilac-500 shrink-0" />}
                title={fields?.reasonTitle}
                name="moveOutReasonCategory"
                options={categoryOptions}
                selectedValue={selectedCategory}
                onSelect={handleCategoryChange}
              />

              {selectedCategory && specificReasonOptions.length > 0 ? (
                <MoveOutReasonSection
                  title={fields?.specifyTitle}
                  name="moveOutReason"
                  options={specificReasonOptions}
                  selectedValue={selectedReasonId}
                  onSelect={setSelectedReasonId}
                />
              ) : null}
            </>
          ) : null}
        </div>

        <div className="btn-wrapper flex flex-col md:flex-row justify-end gap-4 md:gap-6">
          <button
            type="button"
            className="btn btn-secondary w-full md:w-68.75 h-11 md:h-15"
            onClick={handleCancel}
          >
            {fields?.cancelButtonText?.value}
          </button>
          <button
            type="button"
            className={`btn btn-primary w-full md:w-68.75 h-11 md:h-15 ${
              isSubmitDisabled ? 'disabled' : ''
            }`}
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          >
            {fields?.submitButtonText?.value || 'SUBMIT MOVE-OUT NOTICE'}
          </button>
        </div>
      </div>
    </section>
  );
}
