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

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid #3a3948',
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
            fontWeight: 'bold',
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
          fontSize: '14px',
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
            <Image
              src="/images/close.svg"
              alt="close-icon"
              width={24}
              height={24}
            />
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
                            ? '#ff4d4d'
                            : '#676972',
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
                          backgroundColor: '#252431',
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
                            errors.description && touched.description
                              ? '#ff4d4d'
                              : '#b0b0b0',
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
                            ? '#ff4d4d'
                            : '#676972',
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
                            border: '1px solid #444',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            backgroundColor: 'var(--Input-Box-Colors)',
                            width: '100%',
                          }}
                        >
                          <DesktopDateTimePicker
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
                                    border: '0.72px solid var(--Stroke-Color)',
                                    maxHeight: 'unset',
                                    width: '28px',
                                    height: '28px',
                                    flex: '0 0 auto',
                                  },
                                  '& .MuiInputAdornment-root button': {
                                    padding: '0',
                                    color: 'var(--Primary-Text-Color)',
                                    backgroundImage:
                                      'url(/images/calendar_month.svg)',
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center center',
                                    borderRadius: '0',
                                    width: '13px',
                                    height: '14px',
                                    flex: '0 0 auto',
                                  },
                                  '& .MuiInputAdornment-root button svg': {
                                    display: 'none',
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
                                  <label htmlFor={checkboxId}>
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
                        <label htmlFor="Other">
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
                              backgroundColor: '#252431',
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
                                errors.other_tag && touched.other_tag
                                  ? '#ff4d4d'
                                  : '#b0b0b0',
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
                              ? '#ff4d4d'
                              : '#676972',
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
                            backgroundColor: '#252431',
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
                              errors.location && touched.location
                                ? '#ff4d4d'
                                : '#b0b0b0',
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
                              ? '#ff4d4d'
                              : '#676972',
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
                            backgroundColor: '#252431',
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
                              errors.involved_person_name &&
                              touched.involved_person_name
                                ? '#ff4d4d'
                                : '#b0b0b0',
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
                              backgroundColor: '#252431',
                              borderRadius: '12px',
                              fontSize: 'var(--SubTitle-3)',
                              fontWeight: 'var(--Regular)',
                              color: 'var(--Primary-Text-Color)',
                              width: '100%',
                              '& .MuiOutlinedInput-notchedOutline': {
                                top: '-8px !important',
                                borderColor: '#3A3948',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#fff',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#fff',
                                borderWidth: '1px',
                              },
                              '& .MuiSelect-select': {
                                padding: '14px 16px',
                                display: 'block',
                              },
                              '& .MuiSelect-placeholder': {
                                color: '#888',
                                fontWeight: 400,
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
                              backgroundColor: '#252431',
                              borderRadius: '12px',
                              fontSize: 'var(--SubTitle-3)',
                              fontWeight: 'var(--Regular)',
                              color: 'var(--Primary-Text-Color)',
                              width: '100%',
                              '& .MuiOutlinedInput-notchedOutline': {
                                top: '-8px !important',
                                borderColor: '#3A3948',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#fff',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#fff',
                                borderWidth: '1px',
                              },
                              '& .MuiSelect-select': {
                                padding: '14px 16px',
                                display: 'block',
                              },
                              '& .MuiSelect-placeholder': {
                                color: '#888',
                                fontWeight: 400,
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
