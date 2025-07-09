import { LoginResponse } from '../redux/slices/login';
import { documentType } from './constants';

export async function computeChecksum(blob: Blob) {
  // Convert Blob to ArrayBuffer
  const buffer = await blob.arrayBuffer();

  // Generate SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return hashHex;
}

export const formatFileSizeLabel = (size: number): string => {
  if (size >= 1024 * 1024 * 1024) {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' Gb';
  } else if (size >= 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' Mb';
  } else if (size >= 1024) {
    return (size / 1024).toFixed(2) + ' Kb';
  } else {
    return size + ' Bytes';
  }
};

export const formatTo12HourTimeManually = (dateString?: string): string => {
  const date = dateString ? new Date(dateString) : new Date();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;

  return `${hours < 10 ? '0' + hours : hours}:${minutesStr} ${ampm}`;
};

export const getDocumentImage = (fileType: string) => {
  const docType = documentType.find((doc) => doc.type.includes(fileType));
  return docType ? docType.image : '/images/pdf.svg';
};

export const extractFileNames = (text: string): string[] => {
  if (text && text.length > 0) {
    const matches = text.match(/\[([^\]]+)\]/);
    return matches
      ? matches[1].split(',').map((f) => f.trim().replace(/^'|'$/g, ''))
      : [];
  } else {
    return [];
  }
};

export function gtagEvent({
  action,
  category,
  label,
}: {
  action: string;
  category: string;
  label: string;
}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  } else {
    console.warn('GTAG event not fired: gtag not available');
  }
}

const WORDPRESS_API_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2V4ZmlsZXMudHJvb2luYm91bmRkZXZzLmNvbSIsImlhdCI6MTc1MTU0MTgwNiwibmJmIjoxNzUxNTQxODA2LCJleHAiOjE3NTIxNDY2MDYsImRhdGEiOnsidXNlciI6eyJpZCI6IjIifX19.7o5HvU3HvdJqx8okUode1W1lFaUmfKTfRDnfjUXeNrI';

export async function sendDataToWordPressForLogin(
  userData: LoginResponse['data']
): Promise<void> {
  try {
    const wpResponse = await fetch(
      `${process.env.NEXT_PUBLIC_REDIRECT_URL}wp-json/custom/v1/receive-user-data`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${WORDPRESS_API_TOKEN}`,
        },
        body: JSON.stringify(userData),
      }
    );

    const contentType = wpResponse.headers.get('content-type');

    if (!wpResponse.ok) {
      const errorText = await wpResponse.text();
      console.error('WordPress responded with error:', errorText);
      throw new Error('Failed WordPress response');
    }

    if (!contentType || !contentType.includes('application/json')) {
      const rawText = await wpResponse.text();
      console.error('Unexpected content type from WordPress:', rawText);
      throw new Error('Unexpected content type');
    }

    const wpData = await wpResponse.json();
    console.log('WordPress response:', wpData);
  } catch (error) {
    console.error('WordPress API call failed:', error);
  }
}
