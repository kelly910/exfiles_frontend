'use client';

import styles from './style.module.scss';
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  Button,
  Checkbox,
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
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { setLoader } from '@/app/redux/slices/loader';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { PinnedAnswerMessage } from '@/app/redux/slices/Chat/chatTypes';
import { useRouter } from 'next/navigation';
import { setPageHeaderData } from '@/app/redux/slices/login';
import {
  // downloadSelectedDocsReport,
  fetchAllDocuments,
} from '@/app/redux/slices/documentByCategory';
import { getDocumentImage } from '@/app/utils/functions';
import {
  convertDateFormat,
  convertDateFormatForIncident,
} from '@/app/utils/constants';
import FilterModal from './FilterModal';
import { Dayjs } from 'dayjs';

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

const DownloadDocReport = () => {
  const isMobile = useMediaQuery('(max-width:768px)');
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

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
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
                  title: 'Document Report',
                  subTitle: `No. of Document Report : ${res?.no_of_docs}`,
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

  const downloadSelectedDocReport = () => {
    if (selectedDocsDownload.length) {
      // const payload = {
      //   document_uuid: selectedDocsDownload.join(','),
      // };
      // dispatch(downloadSelectedDocsReport(payload));
      console.log('selected document');
    } else {
      // const payload = {
      //   created_before: filters.createdBefore || '',
      //   created_after: filters.createdAfter || '',
      //   category: filters.category.length > 0 ? filters.category.join(',') : '',
      //   search: searchParams.length > 3 ? searchParams : '',
      //   type: 'all',
      // };
      // dispatch(downloadSelectedDocsReport(payload));
      console.log('all document');
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
                        width={24}
                        height={24}
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
                  >
                    Generate Report ({selectedDocsDownload.length || 'ALL'})
                    <Image
                      src="/images/document-download.svg"
                      alt="re"
                      width={20}
                      height={20}
                    />
                  </Button>
                </Box>
                <Box className={styles.allSelect}>
                  <div className={`${styles['date-chip-box']}`}>
                    {filters.category.map((id) => {
                      const category = categories.find((cat) => cat.id === id);
                      if (!category) return null;
                      return (
                        <div key={id} className={styles['date-chip-inner']}>
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
                                const updatedCategories = prev.category.filter(
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
                            alt="pdf"
                            width={19}
                            height={24}
                            className={styles.pdfImg}
                          />
                          <Typography
                            variant="body1"
                            className={styles.docTitle}
                          >
                            {doc?.file_name}
                          </Typography>
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
                                        width: 24,
                                        height: 24,
                                        border: '2px solid #3A3A4B',
                                        borderRadius: '8px',
                                        backgroundColor: 'transparent',
                                      }}
                                    />
                                  }
                                  checkedIcon={
                                    <Box
                                      sx={{
                                        width: 24,
                                        height: 24,
                                        background: 'var(--Main-Gradient)',
                                        borderRadius: '8px',
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
                        </div>
                        <div className={styles.docDateBox}>
                          <div className={styles.docTagBox}>
                            <span className={styles.docTag}>
                              {doc?.category?.name}
                            </span>
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
                  marginBottom: '-24px',
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
    </>
  );
};

export default DownloadDocReport;
