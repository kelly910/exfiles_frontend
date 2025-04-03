'use client';

import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import styles from './document.module.scss';
import { useAppDispatch } from '@/app/redux/hooks';
import { useEffect } from 'react';
import { fetchDocumentSummaryById } from '@/app/redux/slices/documentSummary';
import { RootState } from '@/app/redux/store';
import { useSelector } from 'react-redux';
import { setLoader } from '@/app/redux/slices/loader';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { convertDateFormat } from '@/app/utils/constants';

interface DocumentSummaryProps {
  docId: number;
}

const DocumentSummary: React.FC<DocumentSummaryProps> = ({ docId }) => {
  const dispatch = useAppDispatch();
  const documentSummary = useSelector(
    (state: RootState) => state.documentSummary.documentSummary
  );

  useEffect(() => {
    if (docId) {
      dispatch(setLoader(true));
      setTimeout(async () => {
        try {
          await dispatch(fetchDocumentSummaryById(docId)).unwrap();
        } catch (error) {
          handleError(error as ErrorResponse);
          dispatch(setLoader(false));
        } finally {
          dispatch(setLoader(false));
        }
      }, 2000);
    }
  }, [dispatch, docId]);

  return (
    <Box component={'div'} className={styles.docsBoard}>
      {documentSummary && documentSummary.id && (
        <>
          <div className={styles.docsBoardHeader}>
            <div className={styles.docsInner}>
              <Typography variant="body1" className={styles.docsTitle}>
                {documentSummary?.file_name}
              </Typography>
              <Typography variant="body1" className={styles.docsDate}>
                Uploaded On :{' '}
                <span>{convertDateFormat(documentSummary?.upload_on)}</span>
              </Typography>
            </div>
            <div className={styles.docsInnerTag}>
              {documentSummary?.tags?.map((tag) => (
                <span key={tag?.id}>{tag?.name}</span>
              ))}
            </div>
          </div>
          <div className={styles.docsBoardBody}>
            {documentSummary?.ai_description && (
              <>
                <Typography variant="body1" className={styles.docsBodyTitle}>
                  Description (Added by User)
                </Typography>
                <div className={styles.docsBodyText}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: (documentSummary?.ai_description ?? '')
                        .replace(/\n/g, '<br />')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                    }}
                  />
                </div>
              </>
            )}
            <Typography variant="body1" className={styles.docsBodyTitle}>
              Summary Generated
            </Typography>
            <div className={styles.docsBodyText}>
              <div
                dangerouslySetInnerHTML={{
                  __html: (documentSummary?.summary ?? '')
                    .replace(/\n/g, '<br />')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                }}
              />
            </div>
          </div>
          <Box component={'div'} className={styles.docsButtonBox}>
            <Button className={styles.docsButton}>
              <Image
                src="/images/copy.svg"
                alt="Download"
                width={24}
                height={24}
              />
              Copy
            </Button>
            <span className={styles.docsDas}></span>
            <Button className={styles.docsButton}>
              <Image
                src="/images/edit.svg"
                alt="Download"
                width={24}
                height={24}
              />
              Edit Summary
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DocumentSummary;
