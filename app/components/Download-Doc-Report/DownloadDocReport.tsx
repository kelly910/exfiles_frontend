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
import { fetchAllDocuments } from '@/app/redux/slices/documentByCategory';
import { getDocumentImage } from '@/app/utils/functions';
import { convertDateFormat } from '@/app/utils/constants';

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
      setTimeout(async () => {
        try {
          await dispatch(
            fetchAllDocuments({
              search: searchParams.length > 3 ? searchParams : '',
              page: 1,
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
      console.log(selectedDocsDownload, 'downloadSelectedDocReport');
    }
  };

  const handleSelectAllDoc = async () => {
    if (selectedDocsDownload.length === allDocuments.length) {
      setSelectedDocsDownload([]);
    } else {
      const allDocSelect = allDocuments.map((doc) => doc.uuid);
      setSelectedDocsDownload(allDocSelect);
    }
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
                  <Button className="btn btn-pluse filter-date">
                    <Image
                      src="/images/filter_list.svg"
                      alt="re"
                      width={24}
                      height={24}
                    />
                  </Button>
                  <Button
                    className="btn btn-pluse download-document-btn"
                    onClick={downloadSelectedDocReport}
                  >
                    Generate Report ({selectedDocsDownload.length})
                    <Image
                      src="/images/document-download.svg"
                      alt="re"
                      width={20}
                      height={20}
                    />
                  </Button>
                </Box>
                <Box className={styles.allSelect}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          selectedDocsDownload.length === allDocuments.length &&
                          allDocuments.length > 0
                        }
                        onChange={handleSelectAllDoc}
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
                        sx={{ padding: '0' }}
                      />
                    }
                    label="Select All"
                    sx={{
                      paddingTop: '16px',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  />
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
