import api from '@/app/utils/axiosConfig';

export interface PollStatusOptions {
  url: string;
  params: Record<string, unknown>;
  isDone: (status: string) => boolean;
  isError: (status: string) => boolean;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
  intervalMs?: number;
}

export const pollStatus = ({
  url,
  params,
  isDone,
  isError,
  onSuccess,
  onError,
  intervalMs = 18000,
}: PollStatusOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const statusResp = await api.get(url, { params });
        const message = statusResp.data?.messages[0] || '';
        const status = statusResp.data?.data?.status || '';

        if (isDone(status)) {
          clearInterval(interval);
          onSuccess?.(message);
          resolve();
        } else if (isError(status)) {
          clearInterval(interval);
          onError?.(message);
          reject(message);
        }
      } catch (err) {
        console.log(err, 'err');
        clearInterval(interval);
        onError?.('Download Report link generation is failed');
        reject('Download Report link generation is failed');
      }
    }, intervalMs);
  });
};
