import { Button } from '@mui/material';
import Image from 'next/image';
import { toast, ToastContent, ToastOptions, Slide, Id } from 'react-toastify';

export const defaultToastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
  transition: Slide,
};

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

/**
 * Display toast
 *
 * @param {ToastType} type
 * @param {ToastContent} content
 * @param {ToastOptions} [options=defaultToastOption]
 * @return {Id}
 */

export const showToast = (
  type: ToastType,
  content: ToastContent,
  options: Partial<ToastOptions> = {}
): Id => {
  const optionsToApply = { ...defaultToastOptions, ...options };

  switch (type) {
    case 'success':
      return toast.success(content, {
        ...optionsToApply,
        className: 'success-toast toast',
        icon: (
          <Image
            src="/images/toast-tick.svg"
            alt="success-icon"
            width={24}
            height={24}
          />
        ),
        closeButton: ({ closeToast }) => (
          <Button onClick={closeToast}>
            <Image
              src="/images/close.svg"
              width={12}
              height={12}
              alt="close-icon"
            />
          </Button>
        ),
      });
    case 'error':
      return toast.error(content, {
        ...optionsToApply,
        className: 'error-toast toast',
        icon: (
          <Image
            src="/images/toast-danger.svg"
            alt="success-icon"
            width={24}
            height={24}
          />
        ),
        closeButton: ({ closeToast }) => (
          <Button onClick={closeToast}>
            <Image
              src="/images/close.svg"
              width={12}
              height={12}
              alt="close-icon"
            />
          </Button>
        ),
      });
    case 'info':
      return toast.info(content, {
        ...optionsToApply,
        className: 'info-toast toast',
        icon: (
          <Image
            src="/images/toast-info.svg"
            alt="success-icon"
            width={24}
            height={24}
          />
        ),
        closeButton: ({ closeToast }) => (
          <Button onClick={closeToast}>
            <Image
              src="/images/close.svg"
              width={12}
              height={12}
              alt="close-icon"
            />
          </Button>
        ),
      });
    case 'warning':
      return toast.warn(content, optionsToApply);
    case 'default':
    default:
      return toast(content, optionsToApply);
  }
};
