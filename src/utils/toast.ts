import { toast } from 'sonner';

export const toastConfig = {
  position: 'top-right' as const
};

export const showSuccessToast = (message: string) => 
  toast.success(message, toastConfig);

export const showErrorToast = (message: string) => 
  toast.error(message, toastConfig);

export const showInfoToast = (message: string) => 
  toast.info(message, toastConfig); 