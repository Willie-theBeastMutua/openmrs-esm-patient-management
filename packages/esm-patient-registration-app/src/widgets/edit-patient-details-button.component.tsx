import React from 'react';
import { navigate } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import styles from './edit-patient-details-button.scss';

interface EditPatientDetailsButtonProps {
  onTransition?: () => void;
  patientUuid: string;
}

const EditPatientDetailsButton: React.FC<EditPatientDetailsButtonProps> = ({ patientUuid, onTransition }) => {
  const { t } = useTranslation();
  const handleClick = React.useCallback(() => {
    navigate({ to: `\${openmrsSpaBase}/patient/${patientUuid}/edit` });
    onTransition && onTransition();
  }, [onTransition, patientUuid]);

  return (
    <li className="cds--overflow-menu-options__option">
      <button
        className="cds--overflow-menu-options__btn"
        role="menuitem"
        data-floating-menu-primary-focus
        onClick={handleClick}>
        <span className="cds--overflow-menu-options__option-content">
          {t('editPatientDetails', 'Edit patient details')}
        </span>
      </button>
    </li>
  );
};

export default EditPatientDetailsButton;
