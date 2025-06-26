import React, { useEffect, useRef, useState } from 'react';
import LogStyle from './logmodel.module.scss';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { createTheme, ThemeProvider, Theme } from '@mui/material/styles';
import { DesktopDateTimePicker } from '@mui/x-date-pickers';
import '@mui/x-date-pickers/themeAugmentation';
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { useAppDispatch } from '@/app/redux/hooks';
import { fetchCategories } from '@/app/redux/slices/categoryListing';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import * as Yup from 'yup';
import { fetchDocumentsByCategory } from '@/app/redux/slices/documentByCategory';
import { fetchTagList } from '@/app/redux/slices/tagListing';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { setLoader } from '@/app/redux/slices/loader';
import {
  addIncident,
  fetchLogIncidents,
  updateIncident,
} from '@/app/redux/slices/logIncident';
import { LogIncidentDetails } from '../LogIncident/LogIncident';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { ALLOWED_FILE_TYPES } from '@/app/utils/constants';
import UploadFileItem from '../AI-Chat/components/FileUpload/UploadFileItem';
import { gtagEvent } from '@/app/utils/functions';
import { useThemeMode } from '@/app/utils/ThemeContext';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid var(--Stroke-Color)',
    borderRadius: '16px',
    minWidth: '650px',
    maxHeight: '100%',

    '@media (max-width: 768px)': {
      maxWidth: '80vw',
      minWidth: '480px',
    },
    '@media (max-width: 500px)': {
      maxWidth: '80vw',
      minWidth: '450px',
    },
    '@media (max-width: 480px)': {
      maxWidth: '95vw',
      minWidth: '90%', // Almost full width
    },
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const newTheme = (theme: Theme) =>
  createTheme({
    ...theme,
    components: {
      MuiPickersCalendarHeader: {
        styleOverrides: {
          root: {
            backgroundColor: 'none',
            color: 'var(--Primary-Text-Color)',
            borderBottom: '1px solid var(--Stroke-Color)',
            '& button': {
              svg: {
                color: 'var(--Primary-Text-Color)',
              },
            },
          },
          label: {
            fontSize: 'var(--SubTitle-2)',
            fontWeight: 'var(--Medium)',
          },
        },
      },
      MuiYearCalendar: {
        styleOverrides: {
          root: {
            maxWidth: '100%',
          },
        },
      },
      MuiPickersFadeTransitionGroup: {
        styleOverrides: {
          root: {
            '& .MuiDayCalendar-header': {
              span: {
                color: 'var(--Primary-Text-Color)',
              },
            },
            button: {
              backgroundColor: 'var(--Card-Color)',
              padding: '5px 10px',
              fontSize: 'var(--SubTitle-3)',
              color: 'var(--Primary-Text-Color)',
              border: '1px solid transparent',
              '&:hover': {
                borderColor: 'var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
              },
              '&[aria-checked="true"].Mui-selected': {
                backgroundColor: 'var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
                '&:hover': {
                  backgroundColor: 'var(--Card-Border)',
                  color: 'var(--Primary-Text-Color)',
                },
              },
              '&.MuiPickersDay-today': {
                backgroundColor: 'var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
              },
            },
            '& .Mui-disabled:not(.Mui-selected)': {
              color: 'var(--Primary-Text-Color) !important',
              opacity: '0.5',
            },
          },
        },
      },
      MuiPickersDay: {
        styleOverrides: {
          root: {
            color: 'var(--Primary-Text-Color)',
            fontWeight: 'var(--Bold)',
            '&:hover': {
              border: '1px solid var(--Card-Border)',
              color: 'var(--Primary-Text-Color)',
            },
            '&[aria-selected="true"].Mui-selected': {
              backgroundColor: 'var(--Card-Border)',
              color: 'var(--Primary-Text-Color)',
              '&:hover': {
                backgroundColor: 'var(--Card-Border)',
                border: '1px solid var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
              },
            },
            '&[aria-current="date"].MuiPickersDay-today': {
              border: '1px solid var(--Card-Border)',
              backgroundColor: 'transparent',
              color: 'var(--Primary-Text-Color)',
            },
          },
        },
      },
      MuiDateCalendar: {
        styleOverrides: {
          root: {
            color: 'inset',
            // borderRadius: '12px 0 0 0',
            // border: '1px solid var(--Stroke-Color)',
            borderRight: '1px solid var(--Stroke-Color)',
            backgroundColor: 'var(--Card-Color)',
            maxWidth: '100%',
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            color: 'inset',
            // borderRadius: '0 0 12px 12px',
            // border: '1px solid var(--Stroke-Color)',
            borderTop: '1px solid var(--Stroke-Color)',
            backgroundColor: 'var(--Card-Color)',
            maxWidth: '100%',
            button: {
              color: 'var(--Card-Border)',
              fontSize: 'var(--SubTitle-3)',
              fontWeight: 'var(--Bold)',
              '&:first-child': {
                color: 'var(--Primary-Text-Color)',
                fontWeight: 'var(--Lighter)',
              },
            },
          },
        },
      },
      MuiMultiSectionDigitalClock: {
        styleOverrides: {
          root: {
            color: 'inset',
            // borderRadius: '0 12px 0 0',
            backgroundColor: 'var(--Card-Color)',
            maxWidth: '100%',
            ul: {
              overflowY: 'auto',
              width: '100%',
              '&:after': {
                content: 'none',
              },
            },
            li: {
              backgroundColor: 'var(--Card-Color)',
              padding: '5px 10px',
              fontSize: 'var(--SubTitle-3)',
              color: 'var(--Primary-Text-Color)',
              border: '1px solid transparent',
              borderRadius: 12,
              '&:hover': {
                borderColor: 'var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
              },
              '&[aria-selected="true"].Mui-selected': {
                backgroundColor: 'var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
                '&:hover': {
                  backgroundColor: 'var(--Card-Border)',
                  color: 'var(--Primary-Text-Color)',
                },
              },
              '&.MuiPickersDay-today': {
                backgroundColor: 'var(--Card-Border)',
                color: 'var(--Primary-Text-Color)',
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            '&.MuiPickerPopper-paper': {
              backgroundColor: 'transparent',
              maxWidth: '100%',
              overflowX: 'auto',
              border: '1px solid var(--Stroke-Color)',
              borderRadius: '12px',
            },
            '&.MuiPickersLayout-contentWrapper': {
              backgroundColor: 'var(--Card-Color)',
              borderRadius: '120px',
              padding: '0px',
              margin: '0px',
            },
          },
        },
      },
      MuiPickerPopper: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            backdropFilter: 'blur(10px)',
            inset: '0 auto auto 0 !important',
            width: '100vw',
            height: '100vh',
            paddingTop: '20px',
            paddingBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: 'unset !important',

            [theme.breakpoints.down('md')]: {
              inset: 'auto 0 0 0px !important',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              height: '100dvh',
              maxHeight: '100dvh',
              overflowY: 'auto',
              maxWidth: '100%',
              overflowX: 'auto',
            },
          },
        },
      },
    },
  });

interface LogIncidentDialogProps {
  open: boolean;
  handleClose: () => void;
  editedData: LogIncidentDetails | null;
  handleClearFilter?: () => void;
}
const newThemeSelect = createTheme({
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 'var(--SubTitle-3)',
          padding: '8px 16px',
          color: 'var(--Primary-Text-Color)',
          borderRadius: '12px',
          margin: '4px 0',
          '&:hover': {
            backgroundColor: 'var(--Stroke-Color)',
          },
          '&[aria-selected="true"]': {
            background: 'var(--Stroke-Color)',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          padding: '5px',
          backgroundColor: 'var(--Card-Color)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          borderRadius: '12px',
          marginTop: '4px',
          border: '1px solid var(--Stroke-Color)',
        },
      },
    },
  },
});

export interface LogIncidentFormValues {
  description: string;
  incident_time: string;
  location: string;
  involved_person_name: string;
  category: string;
  document: string;
  other_tag: string;
  tags: string[];
  evidence: string | null;
  otherChecked?: boolean;
}

export default function LogModel({
  open,
  handleClose,
  editedData,
  handleClearFilter,
}: LogIncidentDialogProps) {
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories } = useSelector(
    (state: RootState) => state.categoryListing
  );
  const { documents } = useSelector(
    (state: RootState) => state.documentListing
  );
  const { tags } = useSelector((state: RootState) => state.tagList);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleOpenUserFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (editedData?.evidence && editedData?.id) {
      setSelectedFile(null);
    }
  }, [editedData?.evidence, editedData?.id]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: string | File | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue('evidence', file);
      setSelectedFile(file);
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLElement>,
    setFieldValue: (field: string, value: string | File) => void
  ) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setFieldValue('evidence', file);
      setSelectedFile(file);
    }
  };

  const initialValues: LogIncidentFormValues = {
    description: editedData?.description || '',
    incident_time: editedData?.incident_time
      ? dayjs(
          editedData.incident_time.replace(/([+-]\d{2}:\d{2}):\d{2}$/, '$1')
        ).format('YYYY-MM-DD HH:mm')
      : dayjs().format('YYYY-MM-DD HH:mm'),
    location: editedData?.location || '',
    involved_person_name: editedData?.involved_person_name || '',
    category: editedData?.category_id?.toString() || '',
    document: editedData?.document?.toString() || '',
    other_tag: editedData?.other_tag_name || '',
    tags: Array.isArray(editedData?.tags) ? editedData.tags : [],
    evidence: editedData?.evidence || '',
    otherChecked: editedData?.other_tag_name ? true : false,
  };

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, page_size: 50 }));
    dispatch(fetchTagList());
  }, [dispatch]);

  const handleFetchCategoryDocuments = (
    categoryId: number,
    setFieldValue: (
      field: string,
      value: string | number | boolean | null
    ) => void
  ) => {
    dispatch(
      fetchDocumentsByCategory({
        categoryId: categoryId,
        page_size: 50,
      })
    );
    setFieldValue('document', '');
  };

  useEffect(() => {
    if (editedData?.category_id) {
      dispatch(
        fetchDocumentsByCategory({
          categoryId: Number(editedData.category_id),
          page_size: 50,
        })
      );
    }
  }, [dispatch, editedData?.category_id]);

  useEffect(() => {
    if (editedData?.other_tag_name && editedData.other_tag_name !== '') {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [editedData?.other_tag_name]);

  // const handleOtherCheckboxChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   setFieldValue: (
  //     field: string,
  //     value: string | number | boolean | null
  //   ) => void
  // ) => {
  //   const newCheckedState = e.target.checked;
  //   setIsChecked(newCheckedState);

  //   if (!newCheckedState) {
  //     setFieldValue('other_tag', '');
  //   }
  // };

  const addUpdateLogIncident = async (
    values: LogIncidentFormValues
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('description', values.description);
      formData.append('incident_time', values.incident_time);
      formData.append('location', values.location || '');
      formData.append(
        'involved_person_name',
        values.involved_person_name || ''
      );
      formData.append('category', String(values.category));
      formData.append('document', String(values.document));
      formData.append('other_tag', values.other_tag || '');

      values.tags.forEach((tagId) => {
        formData.append('tags', String(tagId));
      });

      if (values.evidence) {
        if (typeof values.evidence === 'string') {
          try {
            const response = await fetch(values.evidence);
            const blob = await response.blob();
            const fileName = values.evidence.split('/').pop() || 'evidence';
            const file = new File([blob], fileName, { type: blob.type });
            formData.append('evidence', file);
          } catch (error) {
            console.log(error, 'error');
            formData.append('evidence', '');
          }
        } else {
          formData.append('evidence', values.evidence);
        }
      } else {
        formData.append('evidence', '');
      }

      dispatch(setLoader(true));

      if (editedData?.id) {
        await dispatch(
          updateIncident({ id: Number(editedData.id), formData })
        ).unwrap();
      } else {
        await dispatch(addIncident(formData)).unwrap();
        gtagEvent({
          action: 'log_incident',
          category: 'Documentation',
          label: 'Incident logged',
        });
      }
      handleClearFilter?.();
      dispatch(fetchLogIncidents({ page: 1 }));
      router.push('/log-incident');
      handleClose();
    } catch (error) {
      handleError(error as ErrorResponse);
    } finally {
      dispatch(setLoader(false));
    }
  };

  const logIncidentValidationSchema = Yup.object().shape({
    description: Yup.string()
      .max(200, 'Description must be at most 200 characters')
      .required('Description is required'),
    incident_time: Yup.string()
      .required('Incident time is required')
      .test(
        'is-not-in-future',
        'Date & time cannot be in the future',
        (value) => {
          if (!value) return false;
          const selected = dayjs(value, 'YYYY-MM-DD HH:mm');
          return selected.isBefore(dayjs()) || selected.isSame(dayjs());
        }
      ),
    location: Yup.string().max(200, 'Location must be at most 200 characters'),
    involved_person_name: Yup.string().max(
      200,
      'Involved person name must be at most 200 characters'
    ),
    tags: Yup.array().when('otherChecked', {
      is: true,
      then: (schema) => schema,
      otherwise: (schema) => schema.min(1, 'Please select at least one tag'),
    }),
    other_tag: Yup.string().when('otherChecked', {
      is: true,
      then: (schema) => schema.required('Please specify other tag'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const { theme } = useThemeMode();

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={() => {
          if (!editedData?.id) {
            setIsChecked(false);
          }
          handleClose();
        }}
        aria-labelledby="customized-dialog-title"
        open={open}
        className={LogStyle.headerDialogBox}
        sx={{
          background: 'rgb(17 16 27 / 0%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <Box className={LogStyle.dialogHeader}>
          <DialogTitle
            sx={{ m: 0, p: 2 }}
            id="customized-dialog-title"
            className={LogStyle.dialogHeaderInner}
          >
            <Box component="div" className={LogStyle.dialogIcon}>
              <Image
                src="/images/log-model.svg"
                alt="logout"
                width={28}
                height={28}
              />
            </Box>
            <Box>
              <Typography variant="h6" className={LogStyle.dialogTitle}>
                Log as Incident
              </Typography>
              <Typography variant="body1" className={LogStyle.dialogSemiTitle}>
                Your thoughts are valuable in helping improve our products.
              </Typography>
            </Box>
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.1 18.3C6.7134 18.6866 6.0866 18.6866 5.7 18.3C5.3134 17.9134 5.3134 17.2866 5.7 16.9L9.89289 12.7071C10.2834 12.3166 10.2834 11.6834 9.89289 11.2929L5.7 7.1C5.3134 6.7134 5.3134 6.0866 5.7 5.7C6.0866 5.3134 6.7134 5.3134 7.1 5.7L11.2929 9.89289C11.6834 10.2834 12.3166 10.2834 12.7071 9.89289L16.9 5.7C17.2866 5.3134 17.9134 5.3134 18.3 5.7C18.6866 6.0866 18.6866 6.7134 18.3 7.1L14.1071 11.2929C13.7166 11.6834 13.7166 12.3166 14.1071 12.7071L18.3 16.9C18.6866 17.2866 18.6866 17.9134 18.3 18.3C17.9134 18.6866 17.2866 18.6866 16.9 18.3L12.7071 14.1071C12.3166 13.7166 11.6834 13.7166 11.2929 14.1071L7.1 18.3Z"
                fill="var(--Primary-Text-Color)"
              />
            </svg>
          </IconButton>
        </Box>
        <Formik
          initialValues={initialValues}
          // enableReinitialize={true}
          validationSchema={logIncidentValidationSchema}
          onSubmit={addUpdateLogIncident}
        >
          {({ values, errors, touched, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <DialogContent className={LogStyle.dialogFormContentBox}>
                <Box>
                  <div className={LogStyle.dialogFormGroup}>
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="description"
                      className={LogStyle.dialogFormLabel}
                      sx={{
                        color:
                          errors.description && touched.description
                            ? 'var(--Red-Color)'
                            : 'var(--Placeholder-Text)',
                      }}
                    >
                      Description (Required)
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      rows={3}
                      multiline
                      type="text"
                      id="description"
                      name="description"
                      placeholder="Enter the incident description"
                      error={Boolean(errors.description && touched.description)}
                      sx={{
                        marginTop: '4px',
                        padding: '0',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          borderWidth: '0px',
                          color: 'var(--Primary-Text-Color)',
                          backgroundColor:
                            theme === 'dark'
                              ? 'var(--Background-Color)'
                              : 'var(--Input-Box-Colors)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            top: '-10px !important',
                          },
                          '& .MuiOutlinedInput-input': {
                            fontSize: 'var(--SubTitle-2)',
                            color: 'var(--Primary-Text-Color)',
                            padding: '0',
                            fontWeight: 'var(--Regular)',
                            borderRadius: '0',
                            '&::placeholder': {
                              color: 'var(--Placeholder-Text)',
                              fontWeight: 'var(--Lighter)',
                            },
                          },
                          '& fieldset': {
                            borderColor: 'var(--Stroke-Color)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--Primary-Text-Color)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--Primary-Text-Color)',
                            borderWidth: '1px',
                            color: 'var(--Txt-On-Gradient)',
                          },
                        },
                        '& .MuiFormHelperText-root': {
                          color:
                            errors.description && touched.description
                              ? 'var(--Red-Color)'
                              : 'var(--Placeholder-Text)',
                        },
                      }}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="error-input-field"
                    />
                  </div>
                  <div className={LogStyle.dialogFormGroup}>
                    <Typography
                      variant="body2"
                      className={LogStyle.dialogFormLabel}
                      sx={{
                        display: 'block',
                        fontSize: 'var(--SubTitle-3)',
                        fontWeight: 'var(--Regular)',
                      }}
                    >
                      Support Evidence
                    </Typography>
                    {!values?.evidence && (
                      <Box
                        className={`${LogStyle.dialogContent}`}
                        role="button"
                        tabIndex={0}
                        style={{
                          cursor: 'pointer',
                          userSelect: 'none',
                          backgroundColor:
                            theme === 'dark'
                              ? 'var(--Background-Color)'
                              : 'var(--Input-Box-Colors)',
                        }}
                        onClick={handleOpenUserFileInput}
                        onDrop={(e) => handleDrop(e, setFieldValue)}
                        onDragOver={(e) => e.preventDefault()}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleOpenUserFileInput();
                          }
                        }}
                      >
                        <Box>
                          <Image
                            src="/images/upload-img-new.png"
                            alt="Upload-img"
                            width={51}
                            height={55}
                          />
                          <Typography gutterBottom>
                            Click here to upload Supported Evidences
                          </Typography>
                        </Box>

                        <VisuallyHiddenInput
                          id="chat-file-uploads"
                          type="file"
                          name="file-uploads"
                          accept={ALLOWED_FILE_TYPES.join(',')}
                          multiple
                          ref={fileInputRef}
                          onChange={(e) => handleFileChange(e, setFieldValue)}
                        />
                      </Box>
                    )}
                    <Box component="div" className={LogStyle.fileBoxBody}>
                      {values?.evidence && (
                        <UploadFileItem
                          fileName={
                            selectedFile
                              ? selectedFile.name
                              : editedData?.evidence?.split('/').pop() ||
                                'Uploaded_File'
                          }
                          fileId={''}
                          fileSize={selectedFile ? selectedFile.size : 0}
                          progress={100}
                          isUploading={false}
                          hasUploaded={true}
                          fileErrorMsg={''}
                          hasError={false}
                          onRemove={() => {
                            setSelectedFile(null);
                            setFieldValue('evidence', '');
                          }}
                          type={'LogIncident'}
                          handleFileDesc={() => {}}
                        />
                      )}
                    </Box>
                  </div>
                  <div className={LogStyle.dialogFormGroup}>
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="incident_time"
                      className={LogStyle.dialogFormLabel}
                      sx={{
                        color:
                          errors.incident_time && touched.incident_time
                            ? 'var(--Red-Color)'
                            : 'var(--Placeholder-Text)',
                      }}
                    >
                      Date & Time (Required)
                    </Typography>
                    <ThemeProvider theme={newTheme}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'stretch',
                            border: '1px solid var(--Stroke-Color)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            backgroundColor:
                              theme === 'dark'
                                ? 'var(--Background-Color)'
                                : 'var(--Input-Box-Colors)',
                            width: '100%',
                          }}
                        >
                          <DesktopDateTimePicker
                            slots={{
                              openPickerIcon: () => (
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 13 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M1.4 14C1.02522 14 0.698167 13.8603 0.418833 13.581C0.139611 13.3018 0 12.9748 0 12.6V2.46667C0 2.09189 0.139611 1.76489 0.418833 1.48567C0.698167 1.20633 1.02522 1.06667 1.4 1.06667H1.98883V0.716667C1.98883 0.519444 2.05972 0.350722 2.2015 0.2105C2.34317 0.0701668 2.51372 0 2.71317 0C2.91561 0 3.08811 0.0701668 3.23067 0.2105C3.37311 0.350722 3.44433 0.519444 3.44433 0.716667V1.06667H9.26667V0.716667C9.26667 0.519444 9.3375 0.350722 9.47917 0.2105C9.62094 0.0701668 9.7915 0 9.99083 0C10.1934 0 10.3659 0.0701668 10.5083 0.2105C10.6509 0.350722 10.7222 0.519444 10.7222 0.716667V1.06667H11.311C11.6858 1.06667 12.0128 1.20633 12.2922 1.48567C12.5714 1.76489 12.711 2.09189 12.711 2.46667V12.6C12.711 12.9748 12.5714 13.3018 12.2922 13.581C12.0128 13.8603 11.6858 14 11.311 14H1.4ZM1.4 12.6H11.311V5.33333H1.4V12.6ZM6.35333 8.4C6.15111 8.4 5.97867 8.328 5.836 8.184C5.69344 8.04 5.62217 7.86683 5.62217 7.6645C5.62217 7.46228 5.69417 7.28983 5.83817 7.14717C5.98217 7.00461 6.15533 6.93333 6.35767 6.93333C6.55989 6.93333 6.73233 7.00533 6.875 7.14933C7.01756 7.29333 7.08883 7.4665 7.08883 7.66883C7.08883 7.87106 7.01683 8.0435 6.87283 8.18617C6.72883 8.32872 6.55567 8.4 6.35333 8.4ZM3.68667 8.4C3.48444 8.4 3.312 8.328 3.16933 8.184C3.02678 8.04 2.9555 7.86683 2.9555 7.6645C2.9555 7.46228 3.0275 7.28983 3.1715 7.14717C3.3155 7.00461 3.48867 6.93333 3.691 6.93333C3.89322 6.93333 4.06567 7.00533 4.20833 7.14933C4.35089 7.29333 4.42217 7.4665 4.42217 7.66883C4.42217 7.87106 4.35017 8.0435 4.20617 8.18617C4.06217 8.32872 3.889 8.4 3.68667 8.4ZM9.02 8.4C8.81778 8.4 8.64533 8.328 8.50267 8.184C8.36011 8.04 8.28883 7.86683 8.28883 7.6645C8.28883 7.46228 8.36083 7.28983 8.50483 7.14717C8.64883 7.00461 8.822 6.93333 9.02433 6.93333C9.22656 6.93333 9.399 7.00533 9.54167 7.14933C9.68422 7.29333 9.7555 7.4665 9.7555 7.66883C9.7555 7.87106 9.6835 8.0435 9.5395 8.18617C9.3955 8.32872 9.22233 8.4 9.02 8.4ZM6.35333 11.0667C6.15111 11.0667 5.97867 10.9947 5.836 10.8507C5.69344 10.7067 5.62217 10.5335 5.62217 10.3312C5.62217 10.1289 5.69417 9.9565 5.83817 9.81383C5.98217 9.67128 6.15533 9.6 6.35767 9.6C6.55989 9.6 6.73233 9.672 6.875 9.816C7.01756 9.96 7.08883 10.1332 7.08883 10.3355C7.08883 10.5377 7.01683 10.7102 6.87283 10.8528C6.72883 10.9954 6.55567 11.0667 6.35333 11.0667ZM3.68667 11.0667C3.48444 11.0667 3.312 10.9947 3.16933 10.8507C3.02678 10.7067 2.9555 10.5335 2.9555 10.3312C2.9555 10.1289 3.0275 9.9565 3.1715 9.81383C3.3155 9.67128 3.48867 9.6 3.691 9.6C3.89322 9.6 4.06567 9.672 4.20833 9.816C4.35089 9.96 4.42217 10.1332 4.42217 10.3355C4.42217 10.5377 4.35017 10.7102 4.20617 10.8528C4.06217 10.9954 3.889 11.0667 3.68667 11.0667ZM9.02 11.0667C8.81778 11.0667 8.64533 10.9947 8.50267 10.8507C8.36011 10.7067 8.28883 10.5335 8.28883 10.3312C8.28883 10.1289 8.36083 9.9565 8.50483 9.81383C8.64883 9.67128 8.822 9.6 9.02433 9.6C9.22656 9.6 9.399 9.672 9.54167 9.816C9.68422 9.96 9.7555 10.1332 9.7555 10.3355C9.7555 10.5377 9.6835 10.7102 9.5395 10.8528C9.3955 10.9954 9.22233 11.0667 9.02 11.0667Z"
                                    fill="var(--Icon-Color)"
                                  />
                                </svg>
                              ),
                            }}
                            className={LogStyle['data-input']}
                            format="MM/DD/YYYY - hh:mm A"
                            name="incident_time"
                            value={dayjs(values.incident_time)}
                            onChange={(newValue) => {
                              const formattedDate = newValue
                                ? newValue.format('YYYY-MM-DD HH:mm')
                                : '';
                              setFieldValue('incident_time', formattedDate);
                            }}
                            disableFuture
                            slotProps={{
                              textField: {
                                placeholder: 'MM/DD/YYYY - hh:mm AM/PM',
                                sx: {
                                  width: '100%',
                                  textTransform: 'uppercase',
                                  '& .MuiPickersInputBase-root': {
                                    padding: '4px',
                                  },
                                  '& .MuiPickersSectionList-root': {
                                    color: 'var(--Primary-Text-Color)',
                                    borderRadius: '8px',
                                    padding: '10px 0 10px 8px',
                                    fontSize: 'var(--SubTitle-2)',
                                    fontWeight: 'var(--Regular)',

                                    '& span': {
                                      fontFamily: 'var(--font-fustat)',
                                    },
                                  },
                                  '& .MuiInputAdornment-root': {
                                    padding: '6px',
                                    backgroundColor: 'var(--Card-Color)',
                                    color: 'var(--Primary-Text-Color)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--Stroke-Color)',
                                    maxHeight: 'unset',
                                    width: '28px',
                                    height: '28px',
                                    flex: '0 0 auto',
                                  },
                                  '& .MuiInputAdornment-root button': {
                                    padding: '0',
                                    color: 'var(--Primary-Text-Color)',
                                    // backgroundImage:
                                    //   'url(/images/calendar_month.svg)',
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center center',
                                    borderRadius: '0',
                                    width: '13px',
                                    height: '14px',
                                    flex: '0 0 auto',
                                  },
                                  '& fieldset': {
                                    display: 'none',
                                  },
                                },
                              },
                            }}
                          />
                        </Box>
                        <ErrorMessage
                          name="incident_time"
                          component="div"
                          className="error-input-field"
                        />
                      </LocalizationProvider>
                    </ThemeProvider>
                  </div>
                  <div className={LogStyle.dialogFormGroup}>
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="tags"
                      className={LogStyle.dialogFormLabel}
                      sx={{
                        display: 'block',
                        fontSize: 'var(--SubTitle-3)',
                        fontWeight: 'var(--Regular)',
                      }}
                    >
                      Quick Tags (Required)
                    </Typography>
                    <Box className={LogStyle['card-options']}>
                      <FieldArray name="tags">
                        {({ push, remove, form }) => (
                          <>
                            {tags.map((tag, index) => {
                              const isChecked = form.values.tags.includes(
                                tag.id
                              );
                              const checkboxId = `tag-${index}`;

                              return (
                                <div
                                  className={LogStyle['checkbox-card']}
                                  key={index}
                                >
                                  <input
                                    type="checkbox"
                                    id={checkboxId}
                                    name="tags"
                                    value={tag.name}
                                    checked={isChecked}
                                    onChange={() => {
                                      if (isChecked) {
                                        remove(
                                          form.values.tags.indexOf(tag.id)
                                        );
                                      } else {
                                        push(tag.id);
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={checkboxId}
                                    style={{
                                      backgroundColor:
                                        theme === 'dark'
                                          ? 'var(--Background-Color)'
                                          : 'var(--Input-Box-Colors)',
                                    }}
                                  >
                                    {tag.file_data?.file_url && (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={tag.file_data.file_url}
                                        width="20"
                                        height="20"
                                        alt={tag.name}
                                        className={LogStyle['checkbox-icon']}
                                      />
                                    )}
                                    <div>{tag.name}</div>
                                  </label>
                                </div>
                              );
                            })}
                          </>
                        )}
                      </FieldArray>
                      <div className={LogStyle['checkbox-card']}>
                        <input
                          type="checkbox"
                          id="Other"
                          // checked={isChecked}
                          // onChange={(e) =>
                          //   handleOtherCheckboxChange(e, setFieldValue)
                          // }
                          name="otherChecked"
                          checked={values.otherChecked}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setFieldValue('otherChecked', e.target.checked);
                            setIsChecked(e.target.checked);
                            if (!e.target.checked)
                              setFieldValue('other_tag', '');
                          }}
                        />
                        <label
                          htmlFor="Other"
                          style={{
                            backgroundColor:
                              theme === 'dark'
                                ? 'var(--Background-Color)'
                                : 'var(--Input-Box-Colors)',
                          }}
                        >
                          <Image
                            src="/images/other.svg"
                            alt="close icon"
                            width={20}
                            height={20}
                            className={LogStyle['checkbox-icon']}
                          />
                          <div>Other</div>
                        </label>
                      </div>
                      <ErrorMessage
                        name="tags"
                        component="div"
                        className="error-input-field"
                      />
                      <div
                        className={`${LogStyle['specify-input']} ${
                          isChecked ? LogStyle['specify-input-show'] : ''
                        }`}
                      >
                        <Field
                          as={TextField}
                          fullWidth
                          type="text"
                          id="other_tag"
                          name="other_tag"
                          placeholder="Please Specify"
                          error={Boolean(errors.other_tag && touched.other_tag)}
                          value={values.other_tag}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setFieldValue('other_tag', e.target.value);
                          }}
                          sx={{
                            marginTop: '4px',
                            padding: '0',
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              borderWidth: '0px',
                              color: 'var(--Primary-Text-Color)',
                              backgroundColor:
                                theme === 'dark'
                                  ? 'var(--Background-Color)'
                                  : 'var(--Input-Box-Colors)',
                              '& .MuiOutlinedInput-notchedOutline': {
                                top: '-10px !important',
                              },
                              '& .MuiOutlinedInput-input': {
                                fontSize: 'var(--SubTitle-3)',
                                color: 'var(--Primary-Text-Color)',
                                padding: '14px 16px',
                                fontWeight: 'var(--Regular)',
                                borderRadius: '12px',
                                '&::placeholder': {
                                  color: 'var(--Placeholder-Text)',
                                  fontWeight: 'var(--Lighter)',
                                },
                              },
                              '& fieldset': {
                                borderColor: 'var(--Stroke-Color)',
                              },
                              '&:hover fieldset': {
                                borderColor: 'var(--Primary-Text-Color)',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'var(--Primary-Text-Color)',
                                borderWidth: '1px',
                                color: 'var(--Txt-On-Gradient)',
                              },
                            },
                            '& .MuiFormHelperText-root': {
                              color:
                                errors.other_tag && touched.other_tag
                                  ? 'var(--Red-Color)'
                                  : 'var(--Placeholder-Text)',
                            },
                          }}
                        />
                      </div>
                      {isChecked && !values.other_tag && (
                        <div className="error-input-field">
                          Please specify other tag
                        </div>
                      )}
                    </Box>
                  </div>
                  <div className={LogStyle.dialogFormGroup}>
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="location"
                      className={LogStyle.dialogFormLabel}
                      sx={{
                        color:
                          errors.location && touched.location
                            ? 'var(--Red-Color)'
                            : 'var(--Placeholder-Text)',
                      }}
                    >
                      Location
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      type="text"
                      id="location"
                      name="location"
                      placeholder="Enter Location"
                      error={Boolean(errors.location && touched.location)}
                      sx={{
                        marginTop: '4px',
                        padding: '0',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          borderWidth: '0px',
                          color: 'var(--Primary-Text-Color)',
                          backgroundColor:
                            theme === 'dark'
                              ? 'var(--Background-Color)'
                              : 'var(--Input-Box-Colors)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            top: '-10px !important',
                          },
                          '& .MuiOutlinedInput-input': {
                            fontSize: 'var(--SubTitle-3)',
                            color: 'var(--Primary-Text-Color)',
                            padding: '14px 16px',
                            fontWeight: 'var(--Regular)',
                            borderRadius: '12px',
                            '&::placeholder': {
                              color: 'var(--Placeholder-Text)',
                              fontWeight: 'var(--Lighter)',
                            },
                          },
                          '& fieldset': {
                            borderColor: 'var(--Stroke-Color)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--Primary-Text-Color)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--Primary-Text-Color)',
                            borderWidth: '1px',
                            color: 'var(--Txt-On-Gradient)',
                          },
                        },
                        '& .MuiFormHelperText-root': {
                          color:
                            errors.location && touched.location
                              ? 'var(--Red-Color)'
                              : 'var(--Placeholder-Text)',
                        },
                      }}
                    />
                    <ErrorMessage
                      name="location"
                      component="div"
                      className="error-input-field"
                    />
                  </div>
                  <div className={LogStyle.dialogFormGroup}>
                    <Typography
                      variant="body2"
                      component="label"
                      htmlFor="involved_person_name"
                      className={LogStyle.dialogFormLabel}
                      sx={{
                        color:
                          errors.involved_person_name &&
                          touched.involved_person_name
                            ? 'var(--Red-Color)'
                            : 'var(--Placeholder-Text)',
                      }}
                    >
                      Person Involved
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      type="text"
                      id="involved_person_name"
                      name="involved_person_name"
                      placeholder="Enter Names of persons involved in this incident "
                      error={Boolean(
                        errors.involved_person_name &&
                          touched.involved_person_name
                      )}
                      sx={{
                        marginTop: '4px',
                        padding: '0',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          borderWidth: '0px',
                          color: 'var(--Primary-Text-Color)',
                          backgroundColor:
                            theme === 'dark'
                              ? 'var(--Background-Color)'
                              : 'var(--Input-Box-Colors)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            top: '-10px !important',
                          },
                          '& .MuiOutlinedInput-input': {
                            fontSize: 'var(--SubTitle-3)',
                            color: 'var(--Primary-Text-Color)',
                            padding: '14px 16px',
                            fontWeight: 'var(--Regular)',
                            borderRadius: '12px',
                            '&::placeholder': {
                              color: 'var(--Placeholder-Text)',
                              fontWeight: 'var(--Lighter)',
                            },
                          },
                          '& fieldset': {
                            borderColor: 'var(--Stroke-Color)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--Primary-Text-Color)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--Primary-Text-Color)',
                            borderWidth: '1px',
                            color: 'var(--Txt-On-Gradient)',
                          },
                        },
                        '& .MuiFormHelperText-root': {
                          color:
                            errors.involved_person_name &&
                            touched.involved_person_name
                              ? 'var(--Red-Color)'
                              : 'var(--Placeholder-Text)',
                        },
                      }}
                    />
                    <ErrorMessage
                      name="involved_person_name"
                      component="div"
                      className="error-input-field"
                    />
                  </div>
                  <div className={LogStyle.dialogFormGroupMain}>
                    <div className={LogStyle.dialogFormGroup}>
                      <Typography
                        variant="body2"
                        component="label"
                        htmlFor="category"
                        className={LogStyle.dialogFormLabel}
                      >
                        Document Category
                      </Typography>
                      <ThemeProvider theme={newThemeSelect}>
                        <Field
                          as={Select}
                          id="category"
                          name="category"
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>
                          ) => {
                            setFieldValue('category', e.target.value);
                            handleFetchCategoryDocuments(
                              Number(e.target.value),
                              setFieldValue
                            );
                          }}
                          value={values.category}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Person Involved' }}
                          sx={{
                            backgroundColor:
                              theme === 'dark'
                                ? 'var(--Background-Color)'
                                : 'var(--Input-Box-Colors)',
                            borderRadius: '12px',
                            fontSize: 'var(--SubTitle-3)',
                            fontWeight: 'var(--Regular)',
                            color: 'var(--Primary-Text-Color)',
                            width: '100%',
                            '& .MuiOutlinedInput-notchedOutline': {
                              top: '-8px !important',
                              borderColor: 'var(--Stroke-Color)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'var(--Primary-Text-Color)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'var(--Primary-Text-Color)',
                              borderWidth: '1px',
                            },
                            '& .MuiSelect-select': {
                              padding: '14px 16px',
                              display: 'block',
                            },
                            '& .MuiSelect-placeholder': {
                              color: 'var(--Placeholder-Text)',
                              fontWeight: 'var(--Lighter)',
                            },
                          }}
                        >
                          <MenuItem
                            value=""
                            disabled
                            style={{ opacity: '0.38' }}
                          >
                            Choose Category
                          </MenuItem>
                          {categories
                            ?.filter((cat) => cat?.no_of_docs > 0)
                            ?.map((cat, index) => (
                              <MenuItem key={index} value={cat.id}>
                                {cat.name}
                              </MenuItem>
                            ))}
                        </Field>
                      </ThemeProvider>
                    </div>
                    <div className={LogStyle.dialogFormGroup}>
                      <Typography
                        variant="body2"
                        component="label"
                        htmlFor="document"
                        className={LogStyle.dialogFormLabel}
                      >
                        Document
                      </Typography>
                      <ThemeProvider theme={newThemeSelect}>
                        <Field
                          as={Select}
                          id="document"
                          name="document"
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>
                          ) => {
                            setFieldValue('document', e.target.value);
                          }}
                          value={values.document}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Person Involved' }}
                          sx={{
                            backgroundColor:
                              theme === 'dark'
                                ? 'var(--Background-Color)'
                                : 'var(--Input-Box-Colors)',
                            borderRadius: '12px',
                            fontSize: 'var(--SubTitle-3)',
                            fontWeight: 'var(--Regular)',
                            color: 'var(--Primary-Text-Color)',
                            width: '100%',
                            '& .MuiOutlinedInput-notchedOutline': {
                              top: '-8px !important',
                              borderColor: 'var(--Stroke-Color)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'var(--Primary-Text-Color)',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'var(--Primary-Text-Color)',
                              borderWidth: '1px',
                            },
                            '& .MuiSelect-select': {
                              padding: '14px 16px',
                              display: 'block',
                            },
                            '& .MuiSelect-placeholder': {
                              color: 'var(--Placeholder-Text)',
                              fontWeight: 'var(--Lighter)',
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            Choose Document
                          </MenuItem>
                          {documents?.map((doc, index) => (
                            <MenuItem key={index} value={doc.id}>
                              {doc.file_name}
                            </MenuItem>
                          ))}
                        </Field>
                      </ThemeProvider>
                    </div>
                  </div>
                </Box>
              </DialogContent>

              <DialogActions className={LogStyle.dialogFormButtonBoxMain}>
                <Box component="div" className={LogStyle.dialogFormButtonBox}>
                  <Button
                    className={LogStyle.formCancelBtn}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button className="btn btn-primary" type="submit">
                    Save
                  </Button>
                </Box>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </BootstrapDialog>
    </React.Fragment>
  );
}
