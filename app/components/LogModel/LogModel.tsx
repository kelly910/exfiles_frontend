import React, { useEffect, useState } from 'react';
import LogStyle from './logmodel.module.scss';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid #3a3948',
    borderRadius: '16px',
    minWidth: '650px',
    maxHeight: '95dvh',
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
            borderRadius: '12px 0 0 0',
            border: '1px solid var(--Stroke-Color)',
            borderBottom: '0',
            backgroundColor: 'var(--Card-Color)',
            maxWidth: '100%',
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            color: 'inset',
            borderRadius: '0 0 12px 12px',
            border: '1px solid var(--Stroke-Color)',
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
            borderRadius: '0 12px 0 0',
            border: '1px solid var(--Stroke-Color)',
            borderLeft: '0',
            borderBottom: '0',
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
            },
          },
        },
      },
      MuiPickerPopper: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        },
      },
    },
  });

interface LogIncidentDialogProps {
  open: boolean;
  handleClose: () => void;
  editedData: LogIncidentDetails | null;
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

const peopleOptions = ['John Doe', 'Jane Smith', 'Other'];

export interface LogIncidentFormValues {
  description: string;
  incident_time: string;
  location: string;
  involved_person_name: string;
  category: string;
  document: string;
  other_tag: string;
  tags: string[];
  // evidence: string;
}

export default function LogModel({
  open,
  handleClose,
  editedData,
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

  const initialValues: LogIncidentFormValues = {
    description: editedData?.description || '',
    incident_time: editedData?.incident_time
      ? dayjs(editedData.incident_time).format('YYYY-MM-DD HH:mm')
      : '',
    location: editedData?.location || '',
    involved_person_name: editedData?.involved_person_name || '',
    category: editedData?.category_id?.toString() || '',
    document: editedData?.document?.toString() || '',
    other_tag: editedData?.other_tag_name || '',
    tags: Array.isArray(editedData?.tags) ? editedData.tags : [],
    // evidence: editedData?.evidence || '',
  };

  useEffect(() => {
    dispatch(fetchCategories({ page: 1, page_size: 30 }));
    dispatch(fetchTagList());
  }, [dispatch]);

  const handleFetchCategoryDocuments = (categoryId: number) => {
    dispatch(
      fetchDocumentsByCategory({
        categoryId: categoryId,
        page_size: 50,
      })
    );
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
    if (editedData?.other_tag_name) {
      setIsChecked(true);
    }
  }, [dispatch, editedData?.category_id, editedData?.other_tag_name]);

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
      // if (values.evidence instanceof File) {
      //   formData.append('evidence', values.evidence);
      // }

      dispatch(setLoader(true));

      if (editedData?.id) {
        await dispatch(
          updateIncident({ id: Number(editedData.id), formData })
        ).unwrap();
      } else {
        await dispatch(addIncident(formData)).unwrap();
      }
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
    incident_time: Yup.string().required('Incident time is required'),
    location: Yup.string().max(200, 'Location must be at most 200 characters'),
    involved_person_name: Yup.string().max(
      200,
      'Involved person name must be at most 200 characters'
    ),
    tags: Yup.array().min(1, 'Please select at least one tag'),
  });

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
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
          enableReinitialize={true}
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
                      Description
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
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
                      Date & Time
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
                            format="MM/DD/YYYY & HH:mm:ss"
                            name="incident_time"
                            value={dayjs(values.incident_time)}
                            onChange={(newValue) => {
                              const formattedDate = newValue
                                ? newValue.format('YYYY-MM-DD HH:mm')
                                : '';
                              setFieldValue('incident_time', formattedDate);
                            }}
                            slotProps={{
                              textField: {
                                placeholder: 'MM/DD/YYYY & HH:MM:SS',
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
                      Quick Tags
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
                                      <Image
                                        src={tag.file_data.file_url}
                                        alt={tag.name}
                                        width={20}
                                        height={20}
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
                      <div
                        className={LogStyle['checkbox-card']}
                        onChange={(e) => {
                          setIsChecked((e.target as HTMLInputElement).checked);
                        }}
                      >
                        <input
                          type="checkbox"
                          id="Other"
                          checked={isChecked}
                          onChange={(e) => setIsChecked(e.target.checked)}
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
                          isChecked || editedData?.other_tag_name
                            ? LogStyle['specify-input-show']
                            : ''
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
                    </Box>
                  </div>
                </Box>
                <Accordion className={LogStyle.accordionBox}>
                  <AccordionSummary
                    expandIcon={
                      <Image
                        className={LogStyle['img-none']}
                        src="/images/arrow-down.svg"
                        alt="expand-collapse"
                        width={16}
                        height={16}
                      />
                    }
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Typography component="span">Optional Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
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
                              setFieldValue('document', '');
                              handleFetchCategoryDocuments(
                                Number(e.target.value)
                              );
                            }}
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
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                {
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
                            {categories?.map((cat, index) => (
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
                            // value={initialValues.document}
                            onChange={(
                              e: React.ChangeEvent<HTMLSelectElement>
                            ) => {
                              setFieldValue('document', e.target.value);
                            }}
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
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                {
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
                      <Box
                        className={`${LogStyle.dialogContent}`}
                        role="button"
                        tabIndex={0}
                        style={{
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                      >
                        <Box>
                          <Image
                            src="/images/Upload-img.png"
                            alt="Upload-img"
                            width={51}
                            height={55}
                          />
                          <Typography gutterBottom>
                            Click here to upload Supported Evidences
                          </Typography>
                        </Box>
                      </Box>
                    </div>
                  </AccordionDetails>
                </Accordion>
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
