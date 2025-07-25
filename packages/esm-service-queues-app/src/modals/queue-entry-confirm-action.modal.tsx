import React, { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type QueueEntry } from '../types';
import { Button, ModalHeader, ModalBody, ModalFooter, Stack } from '@carbon/react';
import { type FetchResponse, showSnackbar } from '@openmrs/esm-framework';
import { useMutateQueueEntries } from '../hooks/useQueueEntries';

interface QueueEntryUndoActionsModalProps {
  queueEntry: QueueEntry;
  closeModal: () => void;
  modalParams: ModalParams;
  isRemovingPatientFromQueue?: boolean;
}

interface ModalParams {
  modalTitle: string;
  modalInstruction: ReactNode;
  submitButtonText: string;
  submitSuccessTitle: string;
  submitSuccessText: string;
  submitFailureTitle: string;
  submitAction: (queueEntry: QueueEntry) => Promise<FetchResponse<any>>;
}
// Modal for confirming a queue entry action that does not require additional form fields / inputs from user
// Used by UndoTransitionQueueEntryModal, VoidQueueEntryModal and EndQueueEntryModal
export const QueueEntryConfirmActionModal: React.FC<QueueEntryUndoActionsModalProps> = ({
  queueEntry,
  closeModal,
  modalParams,
  isRemovingPatientFromQueue,
}) => {
  const { t } = useTranslation();
  const { mutateQueueEntries } = useMutateQueueEntries();
  const {
    modalTitle,
    modalInstruction,
    submitButtonText,
    submitSuccessTitle,
    submitSuccessText,
    submitFailureTitle,
    submitAction,
  } = modalParams;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    submitAction(queueEntry)
      .then(({ status }) => {
        const success = status >= 200 && status < 300;
        if (success) {
          showSnackbar({
            isLowContrast: true,
            title: submitSuccessTitle,
            kind: 'success',
            subtitle: submitSuccessText,
          });
          mutateQueueEntries();
          closeModal();
        } else {
          throw { message: t('unexpectedServerResponse', 'Unexpected Server Response') };
        }
      })
      .catch((error) => {
        showSnackbar({
          title: submitFailureTitle,
          kind: 'error',
          subtitle: error?.message,
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <ModalHeader closeModal={closeModal} title={modalTitle} />
      <ModalBody>
        {isRemovingPatientFromQueue ? (
          <p>{modalInstruction}</p>
        ) : (
          <Stack gap={4}>
            <h5>{queueEntry.display}</h5>
            <span>{modalInstruction}</span>
          </Stack>
        )}
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button kind="danger" disabled={isSubmitting} onClick={submitForm}>
          {submitButtonText}
        </Button>
      </ModalFooter>
    </>
  );
};

export default QueueEntryConfirmActionModal;
