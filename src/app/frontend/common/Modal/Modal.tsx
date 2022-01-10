import { FC } from 'react';
import ReactModal from 'react-modal';
import styles from './style.module.css';

ReactModal.setAppElement('[data-reactroot]');

type Props = {
  isOpen: boolean;
  onClose?: () => void;
};

export const Modal: FC<Props> = ({ children, isOpen, onClose }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      bodyOpenClassName="overflow-hidden"
      onRequestClose={onClose}
      className={styles.content}
    >
      {children}
    </ReactModal>
  );
};
