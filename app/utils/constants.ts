// Chat File Upload allowed file extensions
// export const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain'];

export const ALLOWED_FILE_TYPES = [
  // Documents & Text Files
  '.txt',
  '.pdf',
  '.docx',
  '.rtf',
  '.doc',
  '.odt',
  '.html',
  '.htm',
  '.eml',
  '.msg',
  // Spreadsheets & Data
  '.csv',
  '.xls',
  '.xlsx',
  '.ods',
  '.tsv',
  '.xml',
  // Images
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.tiff',
  '.tif',
  '.bmp',
  '.heic',
];

// Chat File Upload 1 mb chunk size
export const FILE_UPLOAD_CHUNK_SIZE = 500 * 1024;

// Document Type Uploaded File
export const documentType = [
  { image: '/images/pdf.svg', type: ['pdf'] },
  {
    image: '/images/image.svg',
    type: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'tiff', 'tif', 'bmp', 'heic'],
  },
  {
    image: '/images/txt.svg',
    type: ['txt', 'md', 'rtf', 'odt', 'html', 'htm', 'eml', 'msg'],
  },
  { image: '/images/doc.svg', type: ['docx', 'doc'] },
  {
    image: '/images/excel.svg',
    type: ['xls', 'xlsx', 'csv', 'ods', 'tsv', 'xml'],
  },
];

// Convert DD-MM-YYYY To MM-DD-YYYY
export const convertDateFormat = (date: string): string => {
  const [day, month, year] = date.split('-');
  return `${month}-${day}-${year}`;
};

// Convert YYYY-MM-DD To MM-DD-YYYY
export const convertDateFormatForIncident = (date: string): string => {
  const [year, month, day] = date.split('-');
  return `${month}-${day}-${year}`;
};

// Uploaded document Status
export const DOCUMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
};

// Socket send message payload
export const QUESTION_TYPES = {
  COMBINED_SUMMARY: 'combined_summary',
  QUESTION: 'question',
} as const;

export const processText = (text: string) => {
  if (text) {
    // Step 1: Double asterisk to bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Step 2: Single asterisk to bullet points
    // text = text.replace(/\*(.*?)\*/g, "- $1");
    text = text.replace(/\*(.*?)/g, '- $1');
    // text = text.replace(/^\* (.*)/gm, "- $1"); // Replace with dash bullet points
    // Alternatively, to replace with dot bullet points, use:
    // text = text.replace(/^\* (.*)/gm, '. $1');

    // Step 4: Hashes to heading tags
    text = text.replace(/^###### (.*)/gm, '<h6>$1</h6>');
    text = text.replace(/^##### (.*)/gm, '<h5>$1</h5>');
    text = text.replace(/^#### (.*)/gm, '<h4>$1</h4>');
    text = text.replace(/^### (.*)/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*)/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*)/gm, '<h1>$1</h1>');

    // Step 3: Newline to <br>
    text = text.replace(/\\n/g, '<br>');
    text = text.replace(/\n/g, '<br>');
  }

  return text;
};
