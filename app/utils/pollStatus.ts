import api from '@/app/utils/axiosConfig';

export interface PollStatusOptions {
  url: string;
  params: Record<string, unknown>;
  isDone: (status: string) => boolean;
  isError: (status: string) => boolean;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
  intervalMs?: number;
  signal?: AbortSignal;
}

export const pollStatus = ({
  url,
  params,
  isDone,
  isError,
  onSuccess,
  onError,
  onComplete,
  intervalMs = 20000,
  signal,
}: PollStatusOptions): Promise<{ finished: boolean }> => {
  return new Promise((resolve, reject) => {
    let stopped = false;

    const poll = async () => {
      if (stopped || (signal && signal.aborted)) {
        onComplete?.();
        return reject({ finished: false, reason: 'Polling cancelled' });
      }

      try {
        const statusResp = await api.get(url, { params });
        const message = statusResp.data?.messages?.[0] || '';
        const status = statusResp.data?.data?.status || '';

        if (isDone(status)) {
          stopped = true;
          onSuccess?.(message);
          onComplete?.();
          return resolve({ finished: true });
        }

        if (isError(status)) {
          stopped = true;
          onError?.(message);
          onComplete?.();
          return resolve({ finished: true });
        }

        setTimeout(poll, intervalMs);
      } catch (err) {
        stopped = true;
        console.error('Polling failed', err);
        onError?.('Download Report link generation failed');
        onComplete?.();
        return reject({ finished: false, reason: 'Polling error' });
      }
    };

    poll();
  });
};
