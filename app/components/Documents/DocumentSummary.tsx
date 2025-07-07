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
import {
  downloadSummaryById,
  fetchDocumentSummaryById,
} from '@/app/redux/slices/documentSummary';
import { RootState } from '@/app/redux/store';
import { useSelector } from 'react-redux';
import { setLoader } from '@/app/redux/slices/loader';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import {
  convertDateFormat,
  highlightText,
  processText,
} from '@/app/utils/constants';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { editSummaryByDocId } from '@/app/redux/slices/editSummary';
import { showToast } from '@/app/shared/toast/ShowToast';
import { editSummaryValidation } from '@/app/utils/validationSchema/formValidationSchemas';
import { useRouter } from 'next/navigation';
import { selectFetchedUser } from '@/app/redux/slices/login';
import { useThemeMode } from '@/app/utils/ThemeContext';

interface DocumentSummaryProps {
  docId: string;
  selectedDocIdNull: () => void;
  catId: number | null;
  searchParams: string;
}

export interface DocumentEditSummary {
  summary: string;
  docId: string;
}

const DocumentSummary: React.FC<DocumentSummaryProps> = ({
  docId,
  selectedDocIdNull,
  catId,
  searchParams,
}) => {
  const mobileView = useMediaQuery('(min-width:800px)');
  const dispatch = useAppDispatch();
  const documentSummary = useSelector(
    (state: RootState) => state.documentSummary.documentSummary
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadingSummaryLoading, setDownloadingSummaryLoading] =
    useState(false);
  const router = useRouter();

  const editSummary = () => {
    setEditMode(true);
  };

  const cancelEditMode = () => {
    setEditMode(false);
  };

  const fetchedUser = useSelector(selectFetchedUser);
  const expiredStatus = fetchedUser?.active_subscription?.status;

  useEffect(() => {
    if (!docId) return;
    dispatch(setLoader(true));
    setTimeout(async () => {
      try {
        await dispatch(fetchDocumentSummaryById(docId))
          .unwrap()
          .then((res) => {
            if (res?.uuid && catId) {
              // use docId or res.uuid
              router.replace(`/documents/${catId}?docId=${res?.uuid}`, {
                scroll: false,
              });
            }
          });
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

  const downloadSummary = () => {
    setDownloadingSummaryLoading(true);
    setTimeout(async () => {
      try {
        await dispatch(downloadSummaryById(docId)).unwrap();
      } catch (error) {
        handleError(error as ErrorResponse);
      } finally {
        setDownloadingSummaryLoading(false);
      }
    }, 1000);
  };

  const { theme } = useThemeMode();

  return (
    <>
      {mobileView ? (
        <Box
          component={'div'}
          className={docId ? styles.docsBoard : styles.docsBoardHide}
        >
          {documentSummary && documentSummary.id && (
            <>
              <div className={styles.docsBoardHeader}>
                <Box component="div" className={styles.docsBoardHeaderInner}>
                  <div className={styles.docsInner}>
                    <Typography
                      variant="body1"
                      className={styles.docsTitle}
                      dangerouslySetInnerHTML={{
                        __html: processText(
                          highlightText(
                            documentSummary?.file_name,
                            searchParams
                          )
                        ),
                      }}
                    />
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
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.1 18.3C6.7134 18.6866 6.0866 18.6866 5.7 18.3C5.3134 17.9134 5.3134 17.2866 5.7 16.9L9.89289 12.7071C10.2834 12.3166 10.2834 11.6834 9.89289 11.2929L5.7 7.1C5.3134 6.7134 5.3134 6.0866 5.7 5.7C6.0866 5.3134 6.7134 5.3134 7.1 5.7L11.2929 9.89289C11.6834 10.2834 12.3166 10.2834 12.7071 9.89289L16.9 5.7C17.2866 5.3134 17.9134 5.3134 18.3 5.7C18.6866 6.0866 18.6866 6.7134 18.3 7.1L14.1071 11.2929C13.7166 11.6834 13.7166 12.3166 14.1071 12.7071L18.3 16.9C18.6866 17.2866 18.6866 17.9134 18.3 18.3C17.9134 18.6866 17.2866 18.6866 16.9 18.3L12.7071 14.1071C12.3166 13.7166 11.6834 13.7166 11.2929 14.1071L7.1 18.3Z"
                        fill="var(--Primary-Text-Color)"
                      />
                    </svg>
                  </Button>
                </Box>
                <div className={styles.docsInnerTag}>
                  {documentSummary?.tags?.map((tag) => (
                    <span
                      key={tag?.id}
                      dangerouslySetInnerHTML={{
                        __html: highlightText(tag?.name, searchParams),
                      }}
                      style={{
                        background:
                          theme === 'dark'
                            ? 'var(--Background-Color)'
                            : 'var(--Card-Image)',
                      }}
                    ></span>
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
                          __html: processText(
                            highlightText(
                              documentSummary?.ai_description,
                              searchParams
                            )
                          ),
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
                                    color: 'var(--Primary-Text-Color)',
                                    backgroundColor:
                                      theme === 'dark'
                                        ? 'var(--Card-Color)'
                                        : 'var(--Input-Box-Colors)',
                                    padding: '14px 16px',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      top: '-10px !important',
                                    },
                                    '& .MuiOutlinedInput-input': {
                                      fontSize: 'var(--SubTitle-3)',
                                      color: 'var(--Primary-Text-Color)',
                                      fontWeight: 'var(--Regular)',
                                      borderRadius: '12px',
                                      padding: '2px',
                                      maxHeight: '350px',
                                      overflowY: 'auto !important',
                                      '&::placeholder': {
                                        color: 'var(--Placeholder-Text)',
                                        fontWeight: 'var(--Lighter)',
                                      },
                                    },
                                    '& fieldset': {
                                      borderColor: 'var(--Stroke-Color)',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: 'var(--Txt-On-Gradient)',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: 'var(--Txt-On-Gradient)',
                                      borderWidth: '1px',
                                      color: 'var(--Txt-On-Gradient)',
                                    },
                                  },
                                  '& .MuiFormHelperText-root': {
                                    color:
                                      errors.summary && touched.summary
                                        ? 'var(--Red-Color)'
                                        : 'var(--Placeholder-Text)',
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
                            __html: processText(
                              highlightText(
                                documentSummary?.summary,
                                searchParams
                              )
                            ),
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
              {documentSummary?.summary && !editMode && (
                <Box className={styles.docsButtonBoxMain}>
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
                    {documentSummary?.can_download_summary_pdf && (
                      <>
                        <span className={styles.docsDas}></span>
                        <Button
                          className={styles.docsButton}
                          onClick={downloadSummary}
                          disabled={downloadingSummaryLoading}
                        >
                          {downloadingSummaryLoading ? (
                            <CircularProgress size={18} color="inherit" />
                          ) : (
                            <Image
                              src="/images/download_summary.svg"
                              alt="Download"
                              width={24}
                              height={24}
                            />
                          )}
                          Download Summary
                        </Button>
                      </>
                    )}
                    <span className={styles.docsDas}></span>
                    <Button
                      className={`${styles.docsButton} ${expiredStatus === 0 ? 'limitation-icon' : ''}`}
                      onClick={editSummary}
                      disabled={expiredStatus === 0}
                    >
                      <Image
                        src="/images/edit.svg"
                        alt="Download"
                        width={24}
                        height={24}
                      />
                      Edit
                    </Button>
                  </Box>
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
            maxHeight: 'calc(100dvh - 65px)',
            '& .MuiPaper-root': {
              top: '0',
              width: '100%',
              maxHeight: 'calc(100dvh - 65px)',
              background: 'var(--Background-Color)',
              borderLeft: '1px solid  var(--Stroke-Color)',
            },
            '& .MuiBackdrop-root': {
              top: '65px',
              maxHeight: 'calc(100dvh - 65px)',
            },
          }}
        >
          <Box
            component={'div'}
            className={docId ? styles.docsBoard : styles.docsBoardHide}
          >
            {documentSummary && documentSummary.id && (
              <>
                <div className={styles.docsBoardHeader}>
                  <Box component="div" className={styles.docsBoardHeaderInner}>
                    <Button
                      onClick={handleCloseDrawer}
                      className={styles.backButton}
                      sx={{ marginBottom: '24px' }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.0333 2.72027L5.68666 7.06694C5.17332 7.58027 5.17332 8.42027 5.68666 8.93361L10.0333 13.2803"
                          stroke="var(--Primary-Text-Color)"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </Button>
                    <div className={styles.docsInner}>
                      <Typography
                        variant="body1"
                        className={styles.docsTitle}
                        dangerouslySetInnerHTML={{
                          __html: processText(
                            highlightText(
                              documentSummary?.file_name,
                              searchParams
                            )
                          ),
                        }}
                      />
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
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.1 18.3C6.7134 18.6866 6.0866 18.6866 5.7 18.3C5.3134 17.9134 5.3134 17.2866 5.7 16.9L9.89289 12.7071C10.2834 12.3166 10.2834 11.6834 9.89289 11.2929L5.7 7.1C5.3134 6.7134 5.3134 6.0866 5.7 5.7C6.0866 5.3134 6.7134 5.3134 7.1 5.7L11.2929 9.89289C11.6834 10.2834 12.3166 10.2834 12.7071 9.89289L16.9 5.7C17.2866 5.3134 17.9134 5.3134 18.3 5.7C18.6866 6.0866 18.6866 6.7134 18.3 7.1L14.1071 11.2929C13.7166 11.6834 13.7166 12.3166 14.1071 12.7071L18.3 16.9C18.6866 17.2866 18.6866 17.9134 18.3 18.3C17.9134 18.6866 17.2866 18.6866 16.9 18.3L12.7071 14.1071C12.3166 13.7166 11.6834 13.7166 11.2929 14.1071L7.1 18.3Z"
                          fill="var(--Primary-Text-Color)"
                        />
                      </svg>
                    </Button>
                  </Box>
                  <div className={styles.docsInnerTag}>
                    {documentSummary?.tags?.map((tag) => (
                      <span
                        key={tag?.id}
                        dangerouslySetInnerHTML={{
                          __html: highlightText(tag?.name, searchParams),
                        }}
                        style={{
                          background:
                            theme === 'dark'
                              ? 'var(--Background-Color)'
                              : 'var(--Card-Image)',
                        }}
                      ></span>
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
                            __html: processText(
                              highlightText(
                                documentSummary?.ai_description,
                                searchParams
                              )
                            ),
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
                                      color: 'var(--Primary-Text-Color)',
                                      backgroundColor:
                                        'var(--Input-Box-Colors)',
                                      padding: '14px 16px',
                                      '& .MuiOutlinedInput-notchedOutline': {
                                        top: '-10px !important',
                                      },
                                      '& .MuiOutlinedInput-input': {
                                        fontSize: 'var(--SubTitle-3)',
                                        color: 'var(--Primary-Text-Color)',
                                        fontWeight: 'var(--Regular)',
                                        borderRadius: '12px',
                                        padding: '2px',
                                        maxHeight: '350px',
                                        overflowY: 'auto !important',
                                        '&::placeholder': {
                                          color: 'var(--Placeholder-Text)',
                                          fontWeight: 'var(--Lighter)',
                                        },
                                      },
                                      '& fieldset': {
                                        borderColor: 'var(--Stroke-Color)',
                                      },
                                      '&:hover fieldset': {
                                        borderColor: 'var(--Txt-On-Gradient)',
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: 'var(--Txt-On-Gradient)',
                                        borderWidth: '1px',
                                        color: 'var(--Txt-On-Gradient)',
                                      },
                                    },
                                    '& .MuiFormHelperText-root': {
                                      color:
                                        errors.summary && touched.summary
                                          ? 'var(--Red-Color)'
                                          : 'var(--Placeholder-Text)',
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
                              __html: processText(
                                highlightText(
                                  documentSummary?.summary,
                                  searchParams
                                )
                              ),
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
                {documentSummary?.summary && !editMode && (
                  <Box className={styles.docsButtonBoxMain}>
                    <Box component={'div'} className={styles.docsButtonBox}>
                      <Button
                        className={styles.docsButton}
                        onClick={copySummary}
                      >
                        <Image
                          src="/images/copy.svg"
                          alt="Download"
                          width={24}
                          height={24}
                        />
                        Copy
                      </Button>
                      {documentSummary?.can_download_summary_pdf && (
                        <>
                          <span className={styles.docsDas}></span>
                          <Button
                            className={styles.docsButton}
                            onClick={downloadSummary}
                            disabled={downloadingSummaryLoading}
                          >
                            {downloadingSummaryLoading ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : (
                              <Image
                                src="/images/download_summary.svg"
                                alt="Download"
                                width={24}
                                height={24}
                              />
                            )}
                            Download Summary
                          </Button>
                        </>
                      )}
                      <span className={styles.docsDas}></span>
                      <Button
                        className={`${styles.docsButton} ${expiredStatus === 0 ? 'limitation-icon' : ''}`}
                        onClick={editSummary}
                      >
                        <Image
                          src="/images/edit.svg"
                          alt="Download"
                          width={24}
                          height={24}
                        />
                        Edit
                      </Button>
                    </Box>
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
