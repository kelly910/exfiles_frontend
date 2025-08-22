'use client';

import styles from './style.module.scss';
import * as React from 'react';
import Box from '@mui/material/Box';
import { Pagination, Typography } from '@mui/material';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { setLoader } from '@/app/redux/slices/loader';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { fetchAllDocuments } from '@/app/redux/slices/documentByCategory';
import { getDocumentImage } from '@/app/utils/functions';
import { convertDateFormat, highlightText } from '@/app/utils/constants';
import { useThemeMode } from '@/app/utils/ThemeContext';

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

const DownloadDocReport = ({
  searchParamsCommon,
  handleOpenDocClick,
}: {
  handleOpenDocClick: (docId: string) => void;
  searchParamsCommon: string;
}) => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);

  const { allDocuments, count } = useSelector(
    (state: RootState) => state.documentListing
  );

  useEffect(() => {
    dispatch(setLoader(true));
    setTimeout(async () => {
      try {
        await dispatch(
          fetchAllDocuments({ page: 1, search: searchParamsCommon })
        ).unwrap();
      } catch (error) {
        handleError(error as ErrorResponse);
        dispatch(setLoader(false));
      } finally {
        dispatch(setLoader(false));
      }
    }, 1000);
  }, [dispatch]);

  const handlePageChange = async (
    _: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    if (searchParamsCommon && searchParamsCommon.length > 3) {
      await dispatch(
        fetchAllDocuments({
          page: newPage,
        })
      ).unwrap();
      setPage(newPage);
    }
  };

  const { theme } = useThemeMode();

  return (
    <>
      <main className="chat-body">
        <div className={styles.docsMain}>
          <div className={styles.docsListing}>
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
                          style={{
                            background:
                              theme == 'dark'
                                ? 'var(--Txt-On-Gradient)'
                                : 'var(--Card-Color)',
                          }}
                        />
                        <Typography
                          variant="body1"
                          className={styles.docTitle}
                          dangerouslySetInnerHTML={{
                            __html: highlightText(
                              doc?.file_name,
                              searchParamsCommon
                            ),
                          }}
                          onClick={() => handleOpenDocClick(String(doc?.uuid))}
                        />
                      </div>
                      <div className={styles.docDateBox}>
                        <div className={styles.docTagBox}>
                          <span
                            className={styles.docTag}
                            dangerouslySetInnerHTML={{
                              __html: highlightText(
                                doc?.category?.name || '',
                                searchParamsCommon || ''
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
                  <Typography variant="body1" className={styles.noRecordsFound}>
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
      </main>
    </>
  );
};

export default DownloadDocReport;
