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
