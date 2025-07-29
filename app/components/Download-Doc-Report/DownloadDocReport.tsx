'use client';

import styles from './style.module.scss';
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Input,
  InputAdornment,
  Pagination,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Image from 'next/image';
import Sidebar from '../Common/Sidebar';
import PageHeader from '../Common/PageHeader';
import { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { setLoader } from '@/app/redux/slices/loader';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { PinnedAnswerMessage } from '@/app/redux/slices/Chat/chatTypes';
import { useRouter } from 'next/navigation';
import {
  getUserById,
  selectFetchedUser,
  setPageHeaderData,
} from '@/app/redux/slices/login';
import {
  downloadSelectedDocsReport,
  fetchAllDocuments,
} from '@/app/redux/slices/documentByCategory';
import { getDocumentImage, gtagEvent } from '@/app/utils/functions';
import {
  convertDateFormat,
  convertDateFormatForIncident,
  highlightText,
} from '@/app/utils/constants';
import FilterModal from './FilterModal';
import { Dayjs } from 'dayjs';
import Slider from 'react-slick';
import { fetchDocumentSummaryById } from '@/app/redux/slices/documentSummary';
import DocumentSummaryPopup from './DocumentSummaryPopup';
import { useThemeMode } from '@/app/utils/ThemeContext';
import LimitOver from '../Limit-Over/LimitOver';

type Tag = {
  id: number;
  name: string;
};

type Category = {
  id: number;
  name: string;
};

type Document = {
  id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  description?: string;
  tags: Tag[];
  upload_on: string;
  uuid?: string;
  can_download_summary_pdf?: string;
  category?: Category;
};

export type DocumentSummary = {
  file_name: string;
  summary: string;
  ai_description: string;
  tags: Tag[];
  upload_on: string;
};

const DownloadDocReport = () => {
  const isMobile = useMediaQuery('(max-width:1100px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useState('');
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [filters, setFilters] = useState({
    createdBefore: '',
    createdAfter: '',
    category: [] as number[],
  });
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const { categories } = useSelector(
    (state: RootState) => state.categoryListing
  );
  const [loading, setLoading] = useState(false);
  const [limitDialog, setLimitDialog] = useState(false);
  const fetchedUser = useSelector(selectFetchedUser);
  const expiredStatus = fetchedUser?.active_subscription?.status;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const loggedInUser = useSelector(
    (state: RootState) => state.login.loggedInUser
  );

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, []);

  const handlePinnedAnswerClick = (selectedMessage: PinnedAnswerMessage) => {
    if (selectedMessage.thread && selectedMessage.uuid) {
      router.push(
        `/ai-chats/${selectedMessage.thread.uuid}/?message=${selectedMessage.uuid}`
      );
    }
  };

  const handleThreadClick = (thread: string) => {
    router.push(`/ai-chats/${thread}`); // Navigate to thread page
  };

  const { allDocuments, count } = useSelector(
    (state: RootState) => state.documentListing
  );

  useEffect(() => {
    dispatch(
      setPageHeaderData({
        title: 'Export Summaries',
        subTitle: `No. of Export Summaries : ${count || 0}`,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(setLoader(true));
    setTimeout(async () => {
      try {
        await dispatch(
          fetchAllDocuments({
            search: searchParams,
          })
        )
          .unwrap()
          .then((res) => {
            if (res?.no_of_docs || res?.count) {
              dispatch(
                setPageHeaderData({
                  title: 'Export Summaries',
                  subTitle: `No. of Export Summaries : ${res?.no_of_docs}`,
                })
              );
            }
          });
      } catch (error) {
        handleError(error as ErrorResponse);
        dispatch(setLoader(false));
      } finally {
        dispatch(setLoader(false));
      }
    }, 1000);
  }, [dispatch]);

  const handleSearchInput = (inputValue: string) => {
    setSearchParams(inputValue.length > 3 ? inputValue : '');
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [passDocumentSummary, setPassDocumentSummary] =
    useState<DocumentSummary | null>(null);
  const [docType, setDocType] = useState('');

  const handleOpenDialog = async (uuid: string, fileType: string) => {
    if (uuid) {
      await dispatch(fetchDocumentSummaryById(uuid))
        .unwrap()
        .then((res) => {
          if (res) {
            setPassDocumentSummary(res);
            setDocType(fileType);
            setOpenDialog(true);
          }
        });
    } else {
      setOpenDialog(false);
    }
  };

  const handleSearch = () => {
    if (searchParams.length > 3 || searchParams.length === 0) {
      dispatch(setLoader(true));
      setSelectedDocsDownload([]);
      setTimeout(async () => {
        try {
          await dispatch(
            fetchAllDocuments({
              search: searchParams.length > 3 ? searchParams : '',
              page: 1,
              created_before: filters.createdBefore,
              created_after: filters.createdAfter,
              category: selectedCategories.join(','),
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

  const handlePageChange = async (
    _: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    await dispatch(
      fetchAllDocuments({
        search: searchParams.length > 3 ? searchParams : '',
        page: newPage,
        created_before: filters.createdBefore,
        created_after: filters.createdAfter,
        category: selectedCategories.join(','),
      })
    ).unwrap();
    setPage(newPage);
  };

  const [selectedDocsDownload, setSelectedDocsDownload] = useState<string[]>(
    []
  );

  const handleSelectDoc = (docId: string) => {
    setSelectedDocsDownload((prevSelected) =>
      prevSelected.includes(docId)
        ? prevSelected.filter((id) => id !== docId)
        : [...prevSelected, docId]
    );
  };

  const downloadSelectedDocReport = async () => {
    if (allDocuments.length) {
      setLoading(true);
      if (selectedDocsDownload.length) {
        const payload = {
          document_uuid: selectedDocsDownload.join(','),
        };
        setTimeout(() => {
          setLoading(false);
        }, 3000);
        await dispatch(downloadSelectedDocsReport(payload))
          .unwrap()
          .then((res) => {
            console.log(res, 'res');
          })
          .catch((error) => {
            console.log(error, 'error');
            if (!fetchedUser?.staff_user) {
              setLimitDialog(true);
            }
          });
        if (loggedInUser?.data?.id) {
          dispatch(getUserById(loggedInUser?.data?.id));
        }
        gtagEvent({
          action: 'export_summary',
          category: 'Export',
          label: 'Summary report exported',
        });
      } else {
        const payload = {
          created_before: filters.createdBefore || '',
          created_after: filters.createdAfter || '',
          category:
            filters.category.length > 0 ? filters.category.join(',') : '',
          search: searchParams.length > 3 ? searchParams : '',
          type: 'all',
        };
        await dispatch(downloadSelectedDocsReport(payload))
          .unwrap()
          .then((res) => {
            console.log(res, 'res');
          })
          .catch((error) => {
            console.log(error, 'error');
            if (!fetchedUser?.staff_user) {
              setLimitDialog(true);
            }
          });
        if (loggedInUser?.data?.id) {
          dispatch(getUserById(loggedInUser?.data?.id));
        }
        gtagEvent({
          action: 'export_summary',
          category: 'Export',
          label: 'Summary report exported',
        });
      }
    }
  };

  const handleFilterApply = () => {
    const createdAfter = fromDate?.format('YYYY-MM-DD') || '';
    const createdBefore = toDate?.format('YYYY-MM-DD') || '';
    const categories = selectedCategories;
    setFilters({
      createdBefore,
      createdAfter,
      category: categories,
    });
    dispatch(
      fetchAllDocuments({
        created_before: createdBefore,
        created_after: createdAfter,
        category: categories.join(','),
        search: searchParams.length > 3 ? searchParams : '',
        page: 1,
      })
    ).unwrap();
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
    setSlideCount(filters.category.length);
  }, [filters.category]);

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
          title="Download Report"
        />
        <section className="main-body">
          <PageHeader
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            title="Download Report"
            handleOpenSidebarFromLogIncident={() => setIsSidebarOpen(true)}
          />
          <div className={styles.docsMain}>
            <div className={styles.docsListing}>
              <Box component="div" className={styles.searchBoard}>
                <Box component="div" className={styles.docBoard}>
                  <Input
                    id="input-with-icon-adornment"
                    className={styles.searchInput}
                    placeholder="Search your documents"
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
                        <span className={styles.search} onClick={handleSearch}>
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
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                  />
                  <Button
                    className={
                      expiredStatus === 0 && !fetchedUser?.staff_user
                        ? 'btn btn-pluse download-document-btn limitation'
                        : 'btn btn-pluse download-document-btn'
                    }
                    onClick={downloadSelectedDocReport}
                    disabled={
                      loading ||
                      (expiredStatus === 0 && !fetchedUser?.staff_user)
                    }
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        Generate Report ({selectedDocsDownload.length || 'ALL'})
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
                            {convertDateFormatForIncident(filters.createdAfter)}
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
                              fetchAllDocuments({
                                created_before: '',
                                created_after: '',
                                category: filters.category.join(','),
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
                        {filters.category.map((id) => {
                          const category = categories.find(
                            (cat) => cat.id === id
                          );
                          if (!category) return null;
                          return (
                            <div
                              key={id}
                              className={`${styles['date-chip-inner']} ${styles.slide}`}
                            >
                              <Typography
                                variant="body1"
                                className={styles['date-chip-heading']}
                              >
                                <span>{category.name} </span>
                              </Typography>
                              <Button
                                className={styles['chip-btn']}
                                onClick={() => {
                                  setFilters((prev) => {
                                    const updatedCategories =
                                      prev.category.filter(
                                        (catId) => catId !== id
                                      );
                                    setSelectedCategories(updatedCategories);
                                    dispatch(
                                      fetchAllDocuments({
                                        created_before: prev.createdBefore,
                                        created_after: prev.createdAfter,
                                        category: updatedCategories.join(','),
                                        search:
                                          searchParams.length > 3
                                            ? searchParams
                                            : '',
                                        page: 1,
                                      })
                                    ).unwrap();
                                    return {
                                      ...prev,
                                      category: updatedCategories,
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
                </Box>
              </Box>
              <Box className={styles.docBoxMain} component="div">
                <Box component="div" className={styles.docBoxInner}>
                  {allDocuments?.length > 0 ? (
                    Array.isArray(allDocuments) &&
                    allDocuments?.map((doc: Document) => (
                      <Box key={doc?.id} className={styles.docGridBox}>
                        <div className={styles.docBox}>
                          <Image
                            src={getDocumentImage(doc?.file_type)}
                            onClick={() =>
                              handleOpenDialog(
                                doc.uuid || '',
                                doc?.file_type || ''
                              )
                            }
                            alt="pdf"
                            width={19}
                            height={24}
                            className={styles.pdfImg}
                            style={{
                              background:
                                theme == 'dark'
                                  ? 'var(--Txt-On-Gradient)'
                                  : 'var(--Card-Color)',
                            }}
                          />
                          <Typography
                            variant="body1"
                            onClick={() =>
                              handleOpenDialog(
                                doc.uuid || '',
                                doc?.file_type || ''
                              )
                            }
                            className={styles.docTitle}
                            dangerouslySetInnerHTML={{
                              __html: highlightText(
                                doc?.file_name,
                                searchParams
                              ),
                            }}
                          />
                          {(expiredStatus !== 0 || fetchedUser?.staff_user) && (
                            <Box className={styles.allSelect}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={selectedDocsDownload.includes(
                                      doc?.uuid || ''
                                    )}
                                    onChange={() =>
                                      handleSelectDoc(doc?.uuid || '')
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
                                          background: 'var(--Main-Gradient)',
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
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
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
                          )}
                        </div>
                        <div className={styles.docDateBox}>
                          <div className={styles.docTagBox}>
                            <span
                              className={styles.docTag}
                              dangerouslySetInnerHTML={{
                                __html: highlightText(
                                  doc?.category?.name || '',
                                  searchParams || ''
                                ),
                              }}
                              style={{
                                background:
                                  theme == 'dark'
                                    ? 'var(--Txt-On-Gradient)'
                                    : 'var(--Card-Image)',
                              }}
                            />
                          </div>
                          <Typography variant="body1">
                            {convertDateFormat(doc?.upload_on)}
                          </Typography>
                        </div>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body1"
                      className={styles.noRecordsFound}
                    >
                      No records found
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box
                component="div"
                className="pagination-box"
                sx={{
                  padding: '19px 33px 24px 33px',
                }}
              >
                <Pagination
                  count={Math.ceil(count / 24)}
                  page={page}
                  onChange={handlePageChange}
                  shape="rounded"
                  className="pagination"
                  sx={{
                    padding: '8px 33px',
                  }}
                />
              </Box>
            </div>
          </div>
        </section>
      </main>
      <DocumentSummaryPopup
        passDocumentSummary={passDocumentSummary}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        docType={docType}
        searchParams={searchParams}
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
};

export default DownloadDocReport;
