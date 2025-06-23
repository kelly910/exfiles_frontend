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
import { setPageHeaderData } from '@/app/redux/slices/login';
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
        await dispatch(downloadSelectedDocsReport(payload));
        gtagEvent({
          action: 'export_summary',
          category: 'Export',
          label: 'Summary report exported',
        });
        setLoading(false);
      } else {
        const payload = {
          created_before: filters.createdBefore || '',
          created_after: filters.createdAfter || '',
          category:
            filters.category.length > 0 ? filters.category.join(',') : '',
          search: searchParams.length > 3 ? searchParams : '',
          type: 'all',
        };
        await dispatch(downloadSelectedDocsReport(payload));
        gtagEvent({
          action: 'export_summary',
          category: 'Export',
          label: 'Summary report exported',
        });
        setLoading(false);
      }
      setLoading(false);
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
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                  />
                  <Button
                    className="btn btn-pluse download-document-btn"
                    onClick={downloadSelectedDocReport}
                    disabled={loading}
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
                                        border: '1px solid #ffffff99',
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
    </>
  );
};

export default DownloadDocReport;
