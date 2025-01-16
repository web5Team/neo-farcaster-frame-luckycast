import React, { useRef, useState } from 'react';
import styles from './InfoDialog.module.css';
import { createPortal } from 'react-dom';
import CloseIcon from '@/image/close square.svg'
import AccountUrlDisplayer from './AccountUrlDisplayer';
import DisconnectButton from './DisconnectButton';
import { useAccount } from 'wagmi';

interface InfoDialogProps {
  emoji?: string;
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string
  closable?: boolean
  disconnective?: boolean
}

const InfoDialog: React.FC<InfoDialogProps> = ({ emoji, isOpen, disconnective, closable, onClose, className, children }) => {

  const wrapperRef = useRef(null);
  const { address } = useAccount()
  const [isVisible, setIsVisible] = useState(false);

  const handleClickOutside = () => {
    setIsVisible(false)
  };
  // @ts-expect-error nextline
  useOnClickOutside(wrapperRef, handleClickOutside);

  return isOpen ? createPortal((
    <div className={`${styles.InfoDialog} ${className || ''}`}>
      {disconnective && (
        <>
          <div onClick={() => setIsVisible(true)} className="UserPage-Displayer">
            <AccountUrlDisplayer text={address || ''} />
          </div>
          {/* <div onClick={()=>router.push('/rank')}>Rank</div> */}
          <div ref={wrapperRef} style={{ display: isVisible ? '' : 'none' }} className="UserPage-Disconnection" >
            <DisconnectButton />
            {/* <Button>Disconnect</Button> */}
          </div ></>
      )}

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
