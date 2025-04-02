// Chat File Upload allowed file extensions
// export const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain'];
export const ALLOWED_FILE_TYPES = ['jpg', 'png', 'pdf', 'docx'];

// Chat File Upload 1 mb chunk size
export const FILE_UPLOAD_CHUNK_SIZE = 500 * 1024;

export const documentType = [
  { image: '/images/pdf.svg', type: ['pdf'] },
  { image: '/images/image.svg', type: ['png', 'jpg', 'jpeg', 'webp'] },
  { image: '/images/txt.svg', type: ['txt', 'md'] },
  { image: '/images/doc.svg', type: ['docx'] },
  { image: '/images/excel.svg', type: ['xls', 'xlsx', 'csv'] },
];
