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
