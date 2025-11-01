import React from 'react';
import Card from './Card';
import { WarningIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  const { t } = useTranslations();
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <Card className="border-yellow-500/30">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border-2 border-red-500/20">
                <WarningIcon className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-gray-400 mb-8">{message}</p>
            <div className="flex justify-center gap-4 w-full">
              <button
                onClick={onClose}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-300"
              >
                {t('cancelButton')}
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-300"
              >
                {t('confirmDeleteButton')}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmationModal;