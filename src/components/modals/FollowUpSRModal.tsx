'use client';
import { Textarea } from 'components/common/Textarea';
import { useState } from 'react';
import { useUIStore } from 'src/store/useUIStore';

interface Props {
  createSRFollowUP: (comment: string) => void;
}

export default function FollowUpSRModal({ createSRFollowUP }: Props) {
  const { activeModal, closeModal } = useUIStore();
  const [followupComment, setFollowupComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSRFollowUP(followupComment);
    setFollowupComment('');
    closeModal();
  };

  return (
    <div className={`custom-modal ${activeModal === 'followup-sr-modal' ? 'show' : ''}`}>
      <div className="custom-modal__wrapper max-w-195">
        <h3 className="custom-modal__heading text-start">Follow up </h3>
        <form onSubmit={handleSubmit} className="form-group">
          <Textarea
            className="min-h-16 md:min-h-12.5"
            containerClassName="text-end"
            value={followupComment}
            onChange={(e) => {
              setFollowupComment(e.target.value);
            }}
            rows={1}
            placeholder="Please enter the reason to follow up on this request"
            helperText={`Description within ${2300 - followupComment.length} characters`}
            maxLength={2300}
          />
          <div className="custom-modal__btn-wrapper justify-end mt-6">
            <button className="btn btn-secondary md:btn-sm" onClick={closeModal}>
              Cancel
            </button>
            <button
              className={`btn btn-primary md:btn-sm ${
                followupComment.trim().length == 0 && 'disabled'
              }`}
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
