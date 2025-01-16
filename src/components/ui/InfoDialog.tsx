import React from 'react';
import styles from './InfoDialog.module.css';
import { createPortal } from 'react-dom';
import CloseIcon from '@/image/close square.svg'

interface InfoDialogProps {
  emoji?: string;
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string
  closable?: boolean
}

const InfoDialog: React.FC<InfoDialogProps> = ({ emoji, isOpen, closable, onClose, className, children }) => {

  return isOpen ? createPortal((
    <div className={`${styles.InfoDialog} ${className || ''}`}>
      <div className={styles.InfoDialogContainer}>
        {closable && (
          <div className={styles.InfoDialogHeader}>
            <button className={styles.InfoDialogClose} onClick={onClose}>
              <img src={CloseIcon.src} alt="Close" />
            </button>
          </div>
        )}
        <div className={styles.InfoDialogMain}>
          {emoji && <div className={styles.InfoDialogEmoji}>{emoji}</div>}
          {children}
        </div>
      </div>
    </div>
  ), document.body) : null;
};

export default InfoDialog;
