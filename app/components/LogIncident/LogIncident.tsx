'use client';
import styles from './logincident.module.scss';
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Input,
  InputAdornment,
  Menu,
  MenuItem,
  Pagination,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Image from 'next/image';
import Sidebar from '../Common/Sidebar';
import PageHeader from '../Common/PageHeader';
import DeleteDialog from '../LogoutDialog/DeleteDialog';
import { useState, useEffect, useRef } from 'react';
import {
  fetchLogIncidents,
  downloadSelectedLogsReport,
} from '@/app/redux/slices/logIncident';
import { useAppDispatch } from '@/app/redux/hooks';
import { setLoader } from '@/app/redux/slices/loader';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import LogincidentEmpty from './LogincidentEmpty';
import { PinnedAnswerMessage } from '@/app/redux/slices/Chat/chatTypes';
import { useRouter } from 'next/navigation';
import {
  getUserById,
  selectFetchedUser,
  setPageHeaderData,
} from '@/app/redux/slices/login';
import LogDetailsModel from '../LogModel/LogDetailsModel';
import LogModel from '../LogModel/LogModel';
import dayjs, { Dayjs } from 'dayjs';
import FilterModal from './FilterModal';
import {
  convertDateFormatForIncident,
  highlightText,
} from '@/app/utils/constants';
import Slider from 'react-slick';
import { gtagEvent } from '@/app/utils/functions';
import LimitOver from '../Limit-Over/LimitOver';
import { useThemeMode } from '@/app/utils/ThemeContext';

export interface FileDataImage {
  file_url: string;
}

export interface Tag {
  id: number;
  name: string;
  file_data: FileDataImage | null;
}

export interface FileData {
  file_name: string;
  file_size: number;
  file_url: string;
  file_extension: string;
}

export interface CategoryData {
  id: number;
  name: string;
}

export interface DocumentData {
  id: number;
  uuid: string;
  file_data: FileData;
  category_data: CategoryData;
}

export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
}

export interface LogIncidentDetails {
  id: string | number;
  description: string;
  incident_time: string;
  location: string | null;
  involved_person_name: string | null;
  evidence: string | null;
  tags_data: Tag[];
  user_data?: UserData;
  document_data?: DocumentData;
  document?: string | number;
  category_id?: string | number;
  tags?: string[];
  other_tag_name?: string;
}

export default function LogIncident() {
  const isMobile = useMediaQuery('(max-width:1100px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<string>('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [detailsItem, setDetailsItem] = useState<LogIncidentDetails | null>(
    null
  );
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useState('');
  const [page, setPage] = useState(1);
  const { incidents, count, no_of_incident } = useSelector(
    (state: RootState) => state.logIncidents
  );
  const router = useRouter();
  const open = Boolean(anchorEl);
  const [openAddIncident, setOpenAddIncident] = useState(false);
  const [filters, setFilters] = useState({
    createdBefore: '',
    createdAfter: '',
    tags: [] as number[],
  });
  const { tags } = useSelector((state: RootState) => state.tagList);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchedUser = useSelector(selectFetchedUser);
  const expiredStatus = fetchedUser?.active_subscription?.status;
  const [limitDialog, setLimitDialog] = useState(false);
  const [editLogIncidentData, setEditLogIncidentData] =
    useState<LogIncidentDetails | null>(null);

  const loggedInUser = useSelector(
    (state: RootState) => state.login.loggedInUser
  );

  const handleOpenAddIncident = () => {
    setEditLogIncidentData(null);
    setOpenAddIncident(true);
  };

  const editLogIncident = () => {
    setOpenAddIncident(true);
    setAnchorEl(null);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
    item: LogIncidentDetails
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
    setEditLogIncidentData(item);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRowId('');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, []);

  const deleteDialogOpen = () => {
    setAnchorEl(null);
    setOpenDeleteDialog(true);
  };

  useEffect(() => {
    dispatch(setLoader(true));
    setTimeout(async () => {
      try {
        const resp = await dispatch(
          fetchLogIncidents({ search: searchParams })
        );
        if (fetchLogIncidents.fulfilled.match(resp)) {
          dispatch(
            setPageHeaderData({
              title: 'Log Incident',
              subTitle: `No. of Incidents : ${resp.payload.no_of_incident}`,
            })
          );
        }
      } catch (error) {
        handleError(error as ErrorResponse);
        dispatch(setLoader(false));
      } finally {
        dispatch(setLoader(false));
      }
    }, 1000);
  }, [dispatch]);

  const handlePinnedAnswerClick = (selectedMessage: PinnedAnswerMessage) => {
    if (selectedMessage.thread && selectedMessage.uuid) {
      router.push(
        `/ai-chats/${selectedMessage.thread.uuid}/?message=${selectedMessage.uuid}`
      );
    }
  };

  const handlePageChange = async (
    _: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    await dispatch(
      fetchLogIncidents({
        search: searchParams.length > 3 ? searchParams : '',
        page: newPage,
        created_before: filters.createdBefore,
        created_after: filters.createdAfter,
        tags: selectedTags.join(','),
      })
    ).unwrap();
    setPage(newPage);
  };

  const handleSearchInput = (inputValue: string) => {
    setSearchParams(inputValue.length > 3 ? inputValue : '');
  };

  const handleSearch = () => {
    if (searchParams.length > 3 || searchParams.length === 0) {
      dispatch(setLoader(true));
      setTimeout(async () => {
        try {
          await dispatch(
            fetchLogIncidents({
              search: searchParams.length > 3 ? searchParams : '',
              page: 1,
              created_before: filters.createdBefore,
              created_after: filters.createdAfter,
              tags: selectedTags.join(','),
            })
          ).unwrap();
        } catch (error) {
          handleError(error as ErrorResponse);
          dispatch(setLoader(false));
        } finally {
          dispatch(setLoader(false));
        }
      }, 1000);
    }
  };

  const handleThreadClick = (thread: string) => {
    router.push(`/ai-chats/${thread}`); // Navigate to thread page
  };

  const viewDetails = (item: LogIncidentDetails) => {
    const detailsItem: LogIncidentDetails = {
      ...item,
      id: Number(item.id),
    };
    setOpenDetailDialog(true);
    setDetailsItem(detailsItem);
  };

  const [selectedLogsDownload, setSelectedLogsDownload] = useState<string[]>(
    []
  );

  const handleSelectLog = (docId: string) => {
    setSelectedLogsDownload((prevSelected) =>
      prevSelected.includes(docId)
        ? prevSelected.filter((id) => id !== docId)
        : [...prevSelected, docId]
    );
  };

  const downloadLogsReport = async () => {
    if (incidents.length) {
      setLoading(true);
      if (selectedLogsDownload.length) {
        const payload = {
          incidents_id: selectedLogsDownload.join(','),
        };
        await dispatch(downloadSelectedLogsReport(payload))
          .unwrap()
          .then((res) => {
            console.log(res, 'res');
          })
          .catch((error) => {
            console.log(error, 'error');
            setLimitDialog(true);
          });
        if (loggedInUser?.data?.id) {
          dispatch(getUserById(loggedInUser?.data?.id));
        }
        gtagEvent({
          action: 'export_log_incident',
          category: 'Export',
          label: 'Log incident report exported',
        });
        setLoading(false);
      } else {
        const payload = {
          created_before: filters.createdBefore || '',
          created_after: filters.createdAfter || '',
          tags: filters.tags.length > 0 ? filters.tags.join(',') : '',
          search: searchParams.length > 3 ? searchParams : '',
          type: 'all',
        };
        await dispatch(downloadSelectedLogsReport(payload))
          .unwrap()
          .then((res) => {
            console.log(res, 'res');
          })
          .catch((error) => {
            console.log(error, 'error');
            setLimitDialog(true);
          });
        if (loggedInUser?.data?.id) {
          dispatch(getUserById(loggedInUser?.data?.id));
        }
        gtagEvent({
          action: 'export_log_incident',
          category: 'Export',
          label: 'Log incident report exported',
        });
        setLoading(false);
      }
      setLoading(false);
    }
  };

  const handleFilterApply = () => {
    const createdAfter = fromDate?.format('YYYY-MM-DD') || '';
    const createdBefore = toDate?.format('YYYY-MM-DD') || '';
    const chooseTags = selectedTags;
    setFilters({
      createdBefore,
      createdAfter,
      tags: chooseTags,
    });
    dispatch(
      fetchLogIncidents({
        created_before: createdBefore,
        created_after: createdAfter,
        tags: chooseTags.join(','),
        search: searchParams.length > 3 ? searchParams : '',
        page: 1,
      })
    ).unwrap();
  };

  const clearFilter = () => {
    setFilters({
      createdBefore: '',
      createdAfter: '',
      tags: [] as number[],
    });
    setFromDate(null);
    setToDate(null);
    setSelectedTags([]);
  };

  const CustomArrow = ({
    direction,
    onClick,
    disabled,
  }: {
    direction: 'left' | 'right';
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button
      className={`${styles.arrow} ${styles[direction]} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <Image
        src={`/images/arrow-${direction}.svg`}
        alt={`${direction}-arrow`}
        width={20}
        height={20}
      />
    </button>
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    setSlideCount(filters.tags.length);
  }, [filters.tags]);

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };
  const goToPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const settings = {
    infinite: false,
    speed: 500,
    cssEase: 'ease-in-out',
    slidesToScroll: 1,
    swipeToSlide: true,
    variableWidth: true,
    arrows: true,
    dots: false,
    draggable: true,
    touchMove: true,
    afterChange: (index: number) => setCurrentSlide(index),
    nextArrow: (
      <CustomArrow
        direction="right"
        disabled={currentSlide >= slideCount - 1}
        onClick={goToNext}
      />
    ),
    prevArrow: (
      <CustomArrow
        direction="left"
        disabled={currentSlide === 0}
        onClick={goToPrev}
      />
    ),
  };

  const { theme } = useThemeMode();

  return (
    <>
      <main className="chat-body">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleThreadClick={handleThreadClick}
          handlePinnedAnswerClick={handlePinnedAnswerClick}
          title="Log Incident"
        />
        <section className="main-body">
          <PageHeader
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            title="Log Incident"
            handleOpenSidebarFromLogIncident={() => setIsSidebarOpen(true)}
          />
          {no_of_incident ? (
            <>
              <Box
                sx={{
                  height: 'calc(100vh - 65px)',
                  position: 'relative',
                  overflow: 'hidden',
                  width: '100%',
                  backgroundColor: 'var(--Background-Color)',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  '& .MuiDataGrid-root': {
                    backgroundColor: 'var(--Background-Color)',
                    color: 'var(--Primary-Text-Color)',
                    borderRadius: '8px',
                    border: 'none',
                  },
                  '& .MuiDataGrid-row:nth-of-type(even)': {
                    backgroundColor: 'var(--Background-Color)',
                    color: 'var(--Primary-Text-Color)',
                  },
                  '& .MuiDataGrid-row:nth-of-type(odd)': {
                    backgroundColor: 'var(--Card-Color)',
                    color: 'var(--Primary-Text-Color)',
                    borderRadius: '10px',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'var(--Background-Color)',
                    color: 'var(--Primary-Text-Color)',
                    fontSize: 'var(--SubTitle-2)',
                    fontWeight: 'var(--Bold)',
                    borderBottom: 'none !important',
                  },
                  '& .MuiDataGrid-columnHeader': {
                    borderBottom: 'none !important',
                  },
                  '& .MuiDataGrid-filler': {
                    borderBottom: 'none !important',
                  },
                  '& .MuiDataGrid-columnSeparator': {
                    display: 'none !important',
                  },
                  '& .MuiDataGrid-cell': {
                    border: 'none',
                    borderTop: 'none !important',
                    fontSize: 'var(--SubTitle-3)',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    backgroundColor: 'var(--Card-Color)',
                    borderTop: 'none',
                    color: 'var(--Primary-Text-Color)',
                    borderRadius: '10px',
                  },
                  '& .MuiTablePagination-root': {
                    color: 'var(--Primary-Text-Color)',
                  },
                  '& .MuiSelect-select': {
                    color: 'var(--Primary-Text-Color)',
                    backgroundColor: 'var(--Background-Color)',
                    borderRadius: '8px',
                  },
                  '& .MuiTablePagination-actions button': {
                    color: 'var(--Primary-Text-Color)',
                  },
                  '& .Mui-disabled': {
                    color: 'var(--Subtext-Color)',
                  },
                  '& .MuiDataGrid-container': {
                    backgroundColor: 'var(--Background-Color)',
                  },
                  '& .MuiDataGrid-row': {
                    backgroundColor: 'var(--Background-Color)',
                  },
                  '& .MuiDataGrid-container--top [role=row]': {
                    backgroundColor: 'var(--Background-Color) !important',
                    color: 'var(--Txt-On-Gradient)',
                    fontWeight: 'var(--Bold)',
                  },
                }}
              >
                <Box component="div" className={styles.logIncidentSearchMain}>
                  <Box component="div" className={styles.logIncidentSearch}>
                    <Input
                      id="input-with-icon-adornment"
                      className={styles.searchInput}
                      placeholder="Search here..."
                      onChange={(e) => handleSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                      endAdornment={
                        <InputAdornment
                          position="end"
                          className={styles.searchIcon}
                        >
                          <span
                            className={styles.search}
                            onClick={handleSearch}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.53492 11.3413C9.30241 11.3413 11.5459 9.09782 11.5459 6.33033C11.5459 3.56283 9.30241 1.31934 6.53492 1.31934C3.76742 1.31934 1.52393 3.56283 1.52393 6.33033C1.52393 9.09782 3.76742 11.3413 6.53492 11.3413Z"
                                stroke="var(--Icon-Color)"
                                stroke-width="1.67033"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M14.8866 14.6815L11.5459 11.3408"
                                stroke="var(--Icon-Color)"
                                stroke-width="1.67033"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                        </InputAdornment>
                      }
                    />
                    <Box className={styles['filter-btn-box']}>
                      <Button
                        className={`${styles['search-btn']} ${styles['filter-btn']}`}
                        onClick={() => setFilterOpen(true)}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 14 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.32411 9.26749C6.11045 9.26749 5.93128 9.19533 5.78661 9.05099C5.64206 8.90655 5.56978 8.7276 5.56978 8.51416C5.56978 8.30072 5.64295 8.12077 5.78928 7.97433C5.93573 7.82799 6.11534 7.75483 6.32811 7.75483H7.67345C7.88711 7.75483 8.06628 7.82799 8.21095 7.97433C8.3555 8.12077 8.42778 8.30072 8.42778 8.51416C8.42778 8.7276 8.35461 8.90655 8.20828 9.05099C8.06184 9.19533 7.88223 9.26749 7.66945 9.26749H6.32411ZM3.63361 5.75483C3.41984 5.75483 3.24067 5.68266 3.09611 5.53833C2.95156 5.39388 2.87928 5.21494 2.87928 5.00149C2.87928 4.78805 2.95156 4.6081 3.09611 4.46166C3.24067 4.31533 3.41984 4.24216 3.63361 4.24216H10.3599C10.5737 4.24216 10.7529 4.31533 10.8974 4.46166C11.042 4.6081 11.1143 4.78805 11.1143 5.00149C11.1143 5.21494 11.042 5.39388 10.8974 5.53833C10.7529 5.68266 10.5737 5.75483 10.3599 5.75483H3.63361ZM1.61761 2.24216C1.40384 2.24216 1.22467 2.16994 1.08011 2.02549C0.935559 1.88116 0.863281 1.70227 0.863281 1.48883C0.863281 1.27538 0.936448 1.09544 1.08278 0.948992C1.22923 0.802659 1.40884 0.729492 1.62161 0.729492H12.3799C12.5937 0.729492 12.7729 0.802659 12.9174 0.948992C13.062 1.09544 13.1343 1.27538 13.1343 1.48883C13.1343 1.70227 13.0611 1.88116 12.9148 2.02549C12.7683 2.16994 12.5887 2.24216 12.3759 2.24216H1.61761Z"
                            fill="var(--Icon-Color)"
                          />
                        </svg>
                      </Button>
                    </Box>
                    <FilterModal
                      fromDate={fromDate}
                      toDate={toDate}
                      setFromDate={setFromDate}
                      setToDate={setToDate}
                      open={filterOpen}
                      onClose={() => setFilterOpen(false)}
                      onApply={handleFilterApply}
                      selectedTags={selectedTags}
                      setSelectedTags={setSelectedTags}
                    />
                    <Button
                      className={
                        expiredStatus === 0
                          ? 'btn btn-pluse limitation'
                          : 'btn btn-pluse'
                      }
                      onClick={handleOpenAddIncident}
                      disabled={expiredStatus === 0}
                    >
                      <Image
                        src="/images/add-icon.svg"
                        alt="re"
                        width={20}
                        height={20}
                      />
                      Add Incident
                    </Button>
                  </Box>
                  <Box className={styles.allSelect}>
                    <div className={`${styles['date-chip-box']}`}>
                      {filters.createdAfter && filters.createdBefore && (
                        <div className={styles['date-chip-inner']}>
                          <Typography
                            variant="body1"
                            className={styles['date-chip-heading']}
                          >
                            <span>From :</span>
                            <span>
                              {convertDateFormatForIncident(
                                filters.createdAfter
                              )}
                            </span>
                          </Typography>
                          <Typography
                            variant="body1"
                            className={styles['date-chip-heading']}
                          >
                            <span>To :</span>
                            <span>
                              {convertDateFormatForIncident(
                                filters.createdBefore
                              )}
                            </span>
                          </Typography>
                          <Button
                            className={styles['chip-btn']}
                            onClick={() => {
                              setFromDate(null);
                              setToDate(null);
                              setFilters((prev) => ({
                                ...prev,
                                createdAfter: '',
                                createdBefore: '',
                              }));
                              dispatch(
                                fetchLogIncidents({
                                  created_before: '',
                                  created_after: '',
                                  tags: filters.tags.join(','),
                                  search:
                                    searchParams.length > 3 ? searchParams : '',
                                  page: 1,
                                })
                              ).unwrap();
                            }}
                          >
                            <svg
                              width="10"
                              height="10"
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
                        </div>
                      )}
                      <div className={styles.sliderWrapper}>
                        <Slider ref={sliderRef} {...settings}>
                          {filters.tags.map((id) => {
                            const tagDisp = tags.find(
                              (tag) => Number(tag.id) === id
                            );
                            if (!tagDisp) return null;
                            return (
                              <div
                                key={id}
                                className={`${styles['date-chip-inner']} ${styles.slide}`}
                              >
                                <Typography
                                  variant="body1"
                                  className={styles['date-chip-heading']}
                                >
                                  <span>{tagDisp.name} </span>
                                </Typography>
                                <Button
                                  className={styles['chip-btn']}
                                  onClick={() => {
                                    setFilters((prev) => {
                                      const updatedTags = prev.tags.filter(
                                        (tagId) => tagId !== id
                                      );
                                      setSelectedTags(updatedTags);
                                      dispatch(
                                        fetchLogIncidents({
                                          created_before: prev.createdBefore,
                                          created_after: prev.createdAfter,
                                          tags: updatedTags.join(','),
                                          search:
                                            searchParams.length > 3
                                              ? searchParams
                                              : '',
                                          page: 1,
                                        })
                                      ).unwrap();
                                      return {
                                        ...prev,
                                        tags: updatedTags,
                                      };
                                    });
                                  }}
                                >
                                  <svg
                                    width="10"
                                    height="10"
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
                              </div>
                            );
                          })}
                        </Slider>
                      </div>
                    </div>
                    <Button
                      className={`${'btn btn-pluse generate-document-btn'} ${styles.generateDocBtn} ${expiredStatus === 0 ? 'limitation' : ''}`}
                      onClick={downloadLogsReport}
                      disabled={loading || expiredStatus === 0}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <>
                          Generate Report (
                          {selectedLogsDownload.length || 'ALL'})
                          <Image
                            src="/images/document-download.svg"
                            alt="re"
                            width={20}
                            height={20}
                          />
                        </>
                      )}
                    </Button>
                  </Box>
                </Box>
                <Box component="div" className={styles.loIncidentTable}>
                  {incidents?.length ? (
                    <Box component="div" className={styles.logListingBox}>
                      {incidents?.length ? (
                        incidents.map((item, index) => (
                          <Box
                            component="div"
                            className={styles.logListing}
                            key={index}
                          >
                            <Box
                              component="div"
                              className={styles.logListHeader}
                            >
                              {expiredStatus !== 0 && (
                                <Box
                                  component="div"
                                  className={styles.logListHeaderLeft}
                                >
                                  <Box className={styles.allSelect}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={selectedLogsDownload.includes(
                                            item?.id || ''
                                          )}
                                          onChange={() =>
                                            handleSelectLog(item?.id || '')
                                          }
                                          icon={
                                            <Box
                                              sx={{
                                                width: 20,
                                                height: 20,
                                                border:
                                                  theme === 'dark'
                                                    ? '1.2px solid var(--Stroke-Color)'
                                                    : '1.2px solid var(--Subtext-Color)',
                                                // '1px solid var(--Subtext-Color)',
                                                borderRadius: '6px',
                                                backgroundColor:
                                                  theme !== 'dark'
                                                    ? 'transparent'
                                                    : 'var(--Txt-On-Gradient)',
                                              }}
                                            />
                                          }
                                          checkedIcon={
                                            <Box
                                              sx={{
                                                width: 20,
                                                height: 20,
                                                background:
                                                  'var(--Main-Gradient)',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                              }}
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="12"
                                                height="8"
                                                viewBox="0 0 12 8"
                                                fill="none"
                                              >
                                                <path
                                                  d="M1.75 4.00004L4.58 6.83004L10.25 1.17004"
                                                  stroke="white"
                                                  stroke-width="1.8"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                />
                                              </svg>
                                            </Box>
                                          }
                                          sx={{ padding: 0 }}
                                        />
                                      }
                                      label=""
                                    />
                                  </Box>
                                  <>
                                    <IconButton
                                      onClick={(event) =>
                                        handleClick(event, item.id, item)
                                      }
                                    >
                                      {theme !== 'dark' ? (
                                        <Image
                                          src="/images/more.svg"
                                          alt="more"
                                          width={20}
                                          height={20}
                                        />
                                      ) : (
                                        <svg
                                          width="20"
                                          height="20"
                                          viewBox="0 0 11 11"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M2.55539 4.44434C2.0665 4.44434 1.6665 4.84434 1.6665 5.33322C1.6665 5.82211 2.0665 6.22211 2.55539 6.22211C3.04428 6.22211 3.44428 5.82211 3.44428 5.33322C3.44428 4.84434 3.04428 4.44434 2.55539 4.44434Z"
                                            stroke="var(--Subtext-Color)"
                                            stroke-width="0.8"
                                          />
                                          <path
                                            d="M8.77756 4.44434C8.28867 4.44434 7.88867 4.84434 7.88867 5.33322C7.88867 5.82211 8.28867 6.22211 8.77756 6.22211C9.26645 6.22211 9.66645 5.82211 9.66645 5.33322C9.66645 4.84434 9.26645 4.44434 8.77756 4.44434Z"
                                            stroke="var(--Subtext-Color)"
                                            stroke-width="0.8"
                                          />
                                          <path
                                            d="M5.66672 4.44434C5.17783 4.44434 4.77783 4.84434 4.77783 5.33322C4.77783 5.82211 5.17783 6.22211 5.66672 6.22211C6.15561 6.22211 6.55561 5.82211 6.55561 5.33322C6.55561 4.84434 6.15561 4.44434 5.66672 4.44434Z"
                                            stroke="var(--Subtext-Color)"
                                            stroke-width="0.8"
                                          />
                                        </svg>
                                      )}
                                    </IconButton>
                                    <Menu
                                      anchorEl={anchorEl}
                                      open={open}
                                      onClose={handleClose}
                                      MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                      }}
                                      className={styles.mainDropdown}
                                      sx={{
                                        '& .MuiPaper-root': {
                                          backgroundColor: 'transparent',
                                          borderRadius: '12px',
                                          boxShadow:
                                            '-5px 8px 21px 0px #00000010 !important',
                                        },
                                      }}
                                    >
                                      <MenuItem
                                        className={styles.menuDropdown}
                                        onClick={editLogIncident}
                                      >
                                        <svg
                                          width="18"
                                          height="18"
                                          viewBox="0 0 18 18"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M15.75 16.5H2.25C1.9425 16.5 1.6875 16.245 1.6875 15.9375C1.6875 15.63 1.9425 15.375 2.25 15.375H15.75C16.0575 15.375 16.3125 15.63 16.3125 15.9375C16.3125 16.245 16.0575 16.5 15.75 16.5Z"
                                            fill="var(--Primary-Text-Color)"
                                          />
                                          <path
                                            d="M14.2649 2.60926C12.8099 1.15426 11.3849 1.11676 9.89243 2.60926L8.98493 3.51676C8.90993 3.59176 8.87993 3.71176 8.90993 3.81676C9.47993 5.80426 11.0699 7.39426 13.0574 7.96426C13.0874 7.97176 13.1174 7.97926 13.1474 7.97926C13.2299 7.97926 13.3049 7.94926 13.3649 7.88926L14.2649 6.98176C15.0074 6.24676 15.3674 5.53426 15.3674 4.81426C15.3749 4.07176 15.0149 3.35176 14.2649 2.60926Z"
                                            fill="var(--Primary-Text-Color)"
                                          />
                                          <path
                                            d="M11.7075 8.64711C11.49 8.54211 11.28 8.43711 11.0775 8.31711C10.9125 8.21961 10.755 8.11461 10.5975 8.00211C10.47 7.91961 10.32 7.79961 10.1775 7.67961C10.1625 7.67211 10.11 7.62711 10.05 7.56711C9.80249 7.35711 9.52499 7.08711 9.27749 6.78711C9.25499 6.77211 9.21749 6.71961 9.16499 6.65211C9.08999 6.56211 8.96249 6.41211 8.84999 6.23961C8.75999 6.12711 8.65499 5.96211 8.55749 5.79711C8.43749 5.59461 8.33249 5.39211 8.22749 5.18211C8.12249 4.95711 8.03999 4.73961 7.96499 4.53711L3.25499 9.24711C3.1575 9.34461 3.06749 9.53211 3.04499 9.65961L2.63999 12.5321C2.56499 13.0421 2.7075 13.5221 3.0225 13.8446C3.2925 14.1071 3.66749 14.2496 4.07249 14.2496C4.16249 14.2496 4.25249 14.2421 4.34249 14.2271L7.22249 13.8221C7.35749 13.7996 7.54499 13.7096 7.63499 13.6121L12.345 8.90211C12.135 8.82711 11.9325 8.74461 11.7075 8.64711Z"
                                            fill="var(--Primary-Text-Color)"
                                          />
                                        </svg>
                                        <Typography>Edit Incident</Typography>
                                      </MenuItem>
                                      <MenuItem
                                        className={`${styles.menuDropdown} ${styles.menuDropdownDelete}`}
                                        onClick={deleteDialogOpen}
                                      >
                                        <Image
                                          src="/images/trash.svg"
                                          alt="delet"
                                          width={18}
                                          height={18}
                                        />
                                        <Typography>Delete Incident</Typography>
                                      </MenuItem>
                                    </Menu>
                                  </>
                                </Box>
                              )}
                              <Typography
                                variant="body1"
                                className={styles.logTitle}
                                onClick={() => viewDetails(item)}
                                dangerouslySetInnerHTML={{
                                  __html: highlightText(
                                    item.description,
                                    searchParams
                                  ),
                                }}
                              />
                            </Box>
                            <Box
                              component="div"
                              className={styles.logListBodyMain}
                            >
                              <Box
                                component="div"
                                className={styles.logListBody}
                              >
                                {item?.tags_data.map((tag, index) => (
                                  <Box
                                    className={styles.logListBodyTag}
                                    key={index}
                                    sx={{
                                      background:
                                        theme === 'dark'
                                          ? 'var(--Txt-On-Gradient)'
                                          : 'var(--Stroke-Color)',
                                    }}
                                  >
                                    {tag?.file_data?.file_url ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <Image
                                        src={tag?.file_data?.file_url}
                                        alt={tag.name}
                                        width="16"
                                        height="16"
                                      />
                                    ) : (
                                      <Image
                                        src="/images/other.svg"
                                        alt="close icon"
                                        width={16}
                                        height={16}
                                      />
                                    )}
                                    <Typography
                                      variant="body1"
                                      className={styles.logListBodyTagTitle}
                                      dangerouslySetInnerHTML={{
                                        __html: highlightText(
                                          tag?.name,
                                          searchParams
                                        ),
                                      }}
                                      sx={{
                                        color:
                                          theme == 'dark'
                                            ? 'var(--Icon-Color)'
                                            : 'var(--Subtext-Color)',
                                      }}
                                    />
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                            <Box
                              component="div"
                              className={styles.logListFooter}
                            >
                              <Typography
                                variant="body1"
                                className={styles.logListFooterTitle}
                              >
                                Date & Time
                              </Typography>
                              <Typography
                                variant="body1"
                                className={styles.logListFooterDetails}
                              >
                                {item.incident_time
                                  ? dayjs(
                                      item.incident_time.replace(
                                        /([+-]\d{2}:\d{2}):\d{2}$/,
                                        '$1'
                                      )
                                    ).format('MM/DD/YYYY hh:mm A')
                                  : '-'}
                              </Typography>
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <></>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body1" className={styles.noDataFound}>
                      No records found.
                    </Typography>
                  )}
                </Box>
                <Box
                  component="div"
                  className="pagination-box"
                  sx={{
                    padding: '19px 24px 28px 24px',
                  }}
                >
                  <Pagination
                    count={Math.ceil(count / 12)}
                    page={page}
                    onChange={handlePageChange}
                    shape="rounded"
                    className="pagination"
                    siblingCount={isMobile ? 0 : 2}
                    boundaryCount={1}
                    sx={{
                      padding: '8px 24px',
                    }}
                  />
                </Box>
              </Box>
            </>
          ) : (
            <LogincidentEmpty />
          )}
        </section>
      </main>
      <DeleteDialog
        openDeleteDialogProps={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        type="LogIncident"
        deletedId={selectedRowId}
      />
      <LogDetailsModel
        openDetailDialogProps={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        itemDetails={detailsItem}
      />
      <LogModel
        open={openAddIncident}
        handleClose={() => setOpenAddIncident(false)}
        editedData={editLogIncidentData}
        handleClearFilter={clearFilter}
      />
      <LimitOver
        open={limitDialog}
        onClose={() => setLimitDialog(false)}
        title={'Your Report Generation Limit is Over'}
        subtitle={'Reports'}
        stats={fetchedUser?.reports_generated || ''}
      />
    </>
  );
}
