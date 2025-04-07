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
  selectedDocIdNull: () => void;
}

const DocumentSummary: React.FC<DocumentSummaryProps> = ({
  docId,
  selectedDocIdNull,
}) => {
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

  // const [openDrawer, setOpenDrawer] = useState(true);

  const handleCloseDrawer = () => {
    // setOpenDrawer(false); // Close drawer function
    const url = new URL(window.location.href);
    url.searchParams.delete('docId');
    window.history.replaceState({}, '', url.pathname + url.search);
    selectedDocIdNull();
  };

  return (
    <>
      {/* <Drawer
        anchor="right"
        open={openDrawer}
        onClose={handleCloseDrawer}
        className={styles.docsBoard}
        sx={{
          top: '65px',
          right: '0',
          left: 'auto',
          maxHeight: 'calc(100vh - 65px)',
          '& .MuiPaper-root': {
            top: '65px',
            width: '100%',
            maxHeight: 'calc(100vh - 65px)',
            background: 'var(--Background-Color)',
            borderLeft: '1px solid  #3A3948',
          },
          '& .MuiBackdrop-root': {
            top: '65px',
            maxHeight: 'calc(100vh - 65px)',
          },
        }}
      > */}
      <Box component={'div'} className={styles.docsBoard}>
        {documentSummary && documentSummary.id && (
          <>
            <div className={styles.docsBoardHeader}>
              <Box component="div" className={styles.docsBoardHeaderInner}>
                {/* <Button
                  onClick={handleCloseDrawer}
                  className={styles.backButton}
                  sx={{ marginBottom: '24px' }}
                >
                  <Image
                    src="/images/arrow-left.svg"
                    alt="user"
                    width={16}
                    height={16}
                  />
                </Button> */}
                <div className={styles.docsInner}>
                  <Typography variant="body1" className={styles.docsTitle}>
                    {documentSummary?.file_name}
                  </Typography>
                  <Typography variant="body1" className={styles.docsDate}>
                    Uploaded On :{' '}
                    <span>{convertDateFormat(documentSummary?.upload_on)}</span>
                  </Typography>
                </div>
                <Button
                  onClick={handleCloseDrawer}
                  className={styles.closeButton}
                  sx={{ marginBottom: '24px' }}
                >
                  <Image
                    src="/images/close.svg"
                    alt="user"
                    width={16}
                    height={16}
                  />
                </Button>
              </Box>
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
      {/* </Drawer> */}
    </>
  );
};

export default DocumentSummary;
