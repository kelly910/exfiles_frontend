'use client';

import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Image from 'next/image';
import styles from './document.module.scss';
import { useAppDispatch } from '@/app/redux/hooks';
import { useEffect, useState } from 'react';
import { fetchDocumentSummaryById } from '@/app/redux/slices/documentSummary';
import { RootState } from '@/app/redux/store';
import { useSelector } from 'react-redux';
import { setLoader } from '@/app/redux/slices/loader';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { convertDateFormat } from '@/app/utils/constants';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { editSummaryByDocId } from '@/app/redux/slices/editSummary';
import { showToast } from '@/app/shared/toast/ShowToast';
import { editSummaryValidation } from '@/app/utils/validationSchema/formValidationSchemas';

interface DocumentSummaryProps {
  docId: string;
  selectedDocIdNull: () => void;
}

export interface DocumentEditSummary {
  summary: string;
  docId: string;
}

const DocumentSummary: React.FC<DocumentSummaryProps> = ({
  docId,
  selectedDocIdNull,
}) => {
  const mobileView = useMediaQuery('(min-width:800px)');
  const dispatch = useAppDispatch();
  const documentSummary = useSelector(
    (state: RootState) => state.documentSummary.documentSummary
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const editSummary = () => {
    setEditMode(true);
  };

  const cancelEditMode = () => {
    setEditMode(false);
  };

  useEffect(() => {
    if (!docId) return;
    dispatch(setLoader(true));
    setTimeout(async () => {
      try {
        await dispatch(fetchDocumentSummaryById(docId)).unwrap();
      } catch (error) {
        handleError(error as ErrorResponse);
      } finally {
        dispatch(setLoader(false));
      }
    }, 2000);
  }, [dispatch, docId]);

  const [openDrawer, setOpenDrawer] = useState(true);

  const handleCloseDrawer = () => {
    setOpenDrawer(false); // Close drawer function
    const url = new URL(window.location.href);
    url.searchParams.delete('docId');
    window.history.replaceState({}, '', url.pathname + url.search);
    selectedDocIdNull();
  };

  const copySummary = () => {
    if (documentSummary?.summary) {
      navigator.clipboard.writeText(documentSummary?.summary);
      showToast('info', 'Copied Summary successfully');
    }
  };

  const initialValues: DocumentEditSummary = {
    summary: documentSummary?.summary ?? '',
    docId: documentSummary?.uuid?.toString() ?? '',
  };

  const newEditedSummary = async (
    values: DocumentEditSummary
  ): Promise<void> => {
    setLoading(true);
    dispatch(setLoader(true));
    try {
      const response = await dispatch(editSummaryByDocId(values)).unwrap();
      await dispatch(fetchDocumentSummaryById(values.docId)).unwrap();
      setTimeout(() => {
        if (response?.id) {
          showToast('success', 'Document Summary updated successfully.');
        }
        dispatch(setLoader(false));
        setEditMode(false);
        setLoading(false);
      }, 1000);
    } catch (error: unknown) {
      setTimeout(() => {
        handleError(error as ErrorResponse);
        dispatch(setLoader(false));
        setEditMode(false);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      {mobileView ? (
        <Box component={'div'} className={styles.docsBoard}>
          {documentSummary && documentSummary.id && (
            <>
              <div className={styles.docsBoardHeader}>
                <Box component="div" className={styles.docsBoardHeaderInner}>
                  <div className={styles.docsInner}>
                    <Typography variant="body1" className={styles.docsTitle}>
                      {documentSummary?.file_name}
                    </Typography>
                    <Typography variant="body1" className={styles.docsDate}>
                      Uploaded On :{' '}
                      <span>
                        {convertDateFormat(documentSummary?.upload_on)}
                      </span>
                    </Typography>
                  </div>
                  <Button
                    onClick={() => handleCloseDrawer()}
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
                {documentSummary?.ai_description && !editMode && (
                  <>
                    <Typography
                      variant="body1"
                      className={styles.docsBodyTitle}
                    >
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
                {documentSummary?.summary && (
                  <>
                    <Typography
                      variant="body1"
                      className={styles.docsBodyTitle}
                    >
                      Summary Generated
                    </Typography>
                    {editMode ? (
                      <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={editSummaryValidation}
                        onSubmit={newEditedSummary}
                      >
                        {({ errors, touched, handleSubmit }) => (
                          <Form
                            onSubmit={handleSubmit}
                            style={{ marginTop: '12px' }}
                          >
                            <Box
                              component="div"
                              className={styles.dialogFormBox}
                            >
                              <Field
                                as={TextField}
                                fullWidth
                                id="summary"
                                name="summary"
                                placeholder="Write your feedback"
                                multiline
                                minRows={4}
                                maxRow={10}
                                error={Boolean(
                                  errors.summary && touched.summary
                                )}
                                sx={{
                                  marginTop: '0px',
                                  padding: '0',
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    borderWidth: '0px',
                                    color: '#DADAE1',
                                    backgroundColor: '#252431',
                                    padding: '14px 16px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      top: '-10px !important',
                                    },
                                    '& .MuiOutlinedInput-input': {
                                      fontSize: '14px',
                                      color: '#DADAE1',
                                      fontWeight: 500,
                                      borderRadius: '12px',
                                      padding: '2px',
                                      maxHeight: '350px',
                                      overflowY: 'auto !important',
                                      '&::placeholder': {
                                        color: '#888',
                                        fontWeight: 400,
                                      },
                                    },
                                    '& fieldset': {
                                      borderColor: '#3A3948',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#fff',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#fff',
                                      borderWidth: '1px',
                                      color: '#fff',
                                    },
                                  },
                                  '& .MuiFormHelperText-root': {
                                    color:
                                      errors.summary && touched.summary
                                        ? '#ff4d4d'
                                        : '#b0b0b0',
                                  },
                                }}
                              />
                              <ErrorMessage
                                name="summary"
                                component="div"
                                className="error-input-field"
                              />
                            </Box>
                            <Box
                              component="div"
                              className={styles.dialogFormButtonBox}
                            >
                              <Button
                                className={styles.formCancelBtn}
                                onClick={cancelEditMode}
                              >
                                Cancel
                              </Button>
                              <Button
                                className={styles.formSaveBtn}
                                type="submit"
                                disabled={loading}
                              >
                                {loading ? (
                                  <CircularProgress size={16} color="inherit" />
                                ) : (
                                  'Save'
                                )}
                              </Button>
                            </Box>
                          </Form>
                        )}
                      </Formik>
                    ) : (
                      <div className={styles.docsBodyText}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: (documentSummary?.summary ?? '')
                              .replace(/\n/g, '<br />')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
              {documentSummary?.summary && !editMode && (
                <Box component={'div'} className={styles.docsButtonBox}>
                  <Button className={styles.docsButton} onClick={copySummary}>
                    <Image
                      src="/images/copy.svg"
                      alt="Download"
                      width={24}
                      height={24}
                    />
                    Copy
                  </Button>
                  <span className={styles.docsDas}></span>
                  <Button className={styles.docsButton} onClick={editSummary}>
                    <Image
                      src="/images/edit.svg"
                      alt="Download"
                      width={24}
                      height={24}
                    />
                    Edit Summary
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      ) : (
        <Drawer
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
        >
          <Box component={'div'} className={styles.docsBoard}>
            {documentSummary && documentSummary.id && (
              <>
                <div className={styles.docsBoardHeader}>
                  <Box component="div" className={styles.docsBoardHeaderInner}>
                    <Button
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
                    </Button>
                    <div className={styles.docsInner}>
                      <Typography variant="body1" className={styles.docsTitle}>
                        {documentSummary?.file_name}
                      </Typography>
                      <Typography variant="body1" className={styles.docsDate}>
                        Uploaded On :{' '}
                        <span>
                          {convertDateFormat(documentSummary?.upload_on)}
                        </span>
                      </Typography>
                    </div>
                    <Button
                      onClick={() => handleCloseDrawer()}
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
                  {documentSummary?.ai_description && !editMode && (
                    <>
                      <Typography
                        variant="body1"
                        className={styles.docsBodyTitle}
                      >
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
                  {documentSummary?.summary && (
                    <>
                      <Typography
                        variant="body1"
                        className={styles.docsBodyTitle}
                      >
                        Summary Generated
                      </Typography>
                      {editMode ? (
                        <Formik
                          initialValues={initialValues}
                          enableReinitialize={true}
                          validationSchema={editSummaryValidation}
                          onSubmit={newEditedSummary}
                        >
                          {({ errors, touched, handleSubmit }) => (
                            <Form
                              onSubmit={handleSubmit}
                              style={{ marginTop: '12px' }}
                            >
                              <Box
                                component="div"
                                className={styles.dialogFormBox}
                              >
                                <Field
                                  as={TextField}
                                  fullWidth
                                  id="summary"
                                  name="summary"
                                  placeholder="Write your feedback"
                                  multiline
                                  minRows={4}
                                  maxRow={10}
                                  error={Boolean(
                                    errors.summary && touched.summary
                                  )}
                                  sx={{
                                    marginTop: '0px',
                                    padding: '0',
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '12px',
                                      borderWidth: '0px',
                                      color: '#DADAE1',
                                      backgroundColor: '#252431',
                                      padding: '14px 16px',
                                      '& .MuiOutlinedInput-notchedOutline': {
                                        top: '-10px !important',
                                      },
                                      '& .MuiOutlinedInput-input': {
                                        fontSize: '14px',
                                        color: '#DADAE1',
                                        fontWeight: 500,
                                        borderRadius: '12px',
                                        padding: '2px',
                                        maxHeight: '350px',
                                        overflowY: 'auto !important',
                                        '&::placeholder': {
                                          color: '#888',
                                          fontWeight: 400,
                                        },
                                      },
                                      '& fieldset': {
                                        borderColor: '#3A3948',
                                      },
                                      '&:hover fieldset': {
                                        borderColor: '#fff',
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: '#fff',
                                        borderWidth: '1px',
                                        color: '#fff',
                                      },
                                    },
                                    '& .MuiFormHelperText-root': {
                                      color:
                                        errors.summary && touched.summary
                                          ? '#ff4d4d'
                                          : '#b0b0b0',
                                    },
                                  }}
                                />
                                <ErrorMessage
                                  name="summary"
                                  component="div"
                                  className="error-input-field"
                                />
                              </Box>
                              <Box
                                component="div"
                                className={styles.dialogFormButtonBox}
                              >
                                <Button
                                  className={styles.formCancelBtn}
                                  onClick={cancelEditMode}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  className={styles.formSaveBtn}
                                  type="submit"
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <CircularProgress
                                      size={16}
                                      color="inherit"
                                    />
                                  ) : (
                                    'Save'
                                  )}
                                </Button>
                              </Box>
                            </Form>
                          )}
                        </Formik>
                      ) : (
                        <div className={styles.docsBodyText}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: (documentSummary?.summary ?? '')
                                .replace(/\n/g, '<br />')
                                .replace(
                                  /\*\*(.*?)\*\*/g,
                                  '<strong>$1</strong>'
                                ),
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
                {documentSummary?.summary && !editMode && (
                  <Box component={'div'} className={styles.docsButtonBox}>
                    <Button className={styles.docsButton} onClick={copySummary}>
                      <Image
                        src="/images/copy.svg"
                        alt="Download"
                        width={24}
                        height={24}
                      />
                      Copy
                    </Button>
                    <span className={styles.docsDas}></span>
                    <Button className={styles.docsButton} onClick={editSummary}>
                      <Image
                        src="/images/edit.svg"
                        alt="Download"
                        width={24}
                        height={24}
                      />
                      Edit Summary
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default DocumentSummary;
