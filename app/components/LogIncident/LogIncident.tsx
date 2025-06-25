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
                          ></span>
                        </InputAdornment>
                      }
                    />
                    <Box className={styles['filter-btn-box']}>
                      <Button
                        className={`${styles['search-btn']} ${styles['filter-btn']}`}
                        onClick={() => setFilterOpen(true)}
                      >
                        <Image
                          src="/images/filter_list.svg"
                          alt="filter_list"
                          width={20}
                          height={20}
                        />
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
                            <Image
                              src="/images/close.svg"
                              alt="sidebar-hide-icon"
                              width={10}
                              height={10}
                            />
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
                                  <Image
                                    src="/images/close.svg"
                                    alt="sidebar-hide-icon"
                                    width={10}
                                    height={10}
                                  />
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
                                                  '1px solid var(--Subtext-Color)',
                                                borderRadius: '6px',
                                                backgroundColor: 'transparent',
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
                                      <Image
                                        src="/images/more.svg"
                                        alt="more"
                                        width={20}
                                        height={20}
                                      />
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
                                        <Image
                                          src="/images/edit-2.svg"
                                          alt="edit"
                                          width={18}
                                          height={18}
                                        />
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
                                  >
                                    {tag?.file_data?.file_url ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
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
        totalNumber={'3'}
        usedNumber={'3'}
      />
    </>
  );
}
