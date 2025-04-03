'use client';

import { Box, Grid, Input, InputAdornment, Typography } from '@mui/material';
import Image from 'next/image';
import styles from './document.module.scss';
import { documentType } from '@/app/utils/constants';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { fetchDocumentsByCategory } from '@/app/redux/slices/documentByCategory';
import { RootState } from '@/app/redux/store';
import { useSelector } from 'react-redux';
import { setLoader } from '@/app/redux/slices/loader';
import { ErrorResponse, handleError } from '@/app/utils/handleError';

type Tag = {
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
};

type DocumentListProps = {
  catId: number | null;
  handleOpenDocumentSummary: (docId: number) => void;
};

const DocumentList: React.FC<DocumentListProps> = ({
  catId,
  handleOpenDocumentSummary,
}) => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useState('');
  const { documents, count } = useSelector(
    (state: RootState) => state.documentListing
  );

  console.log(count, 'count');

  useEffect(() => {
    if (catId) {
      dispatch(setLoader(true));
      setTimeout(async () => {
        try {
          await dispatch(
            fetchDocumentsByCategory({
              categoryId: catId,
              search: searchParams,
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
  }, [dispatch, catId]);

  const getDocumentImage = (fileType: string) => {
    const docType = documentType.find((doc) => doc.type.includes(fileType));
    return docType ? docType.image : '/images/pdf.svg';
  };

  const handleSearchInput = (inputValue: string) => {
    setSearchParams(inputValue.length > 3 ? inputValue : '');
  };

  const handleSearch = () => {
    if (
      (searchParams.length > 3 || searchParams.length === 0) &&
      catId !== null
    ) {
      dispatch(setLoader(true));
      setTimeout(async () => {
        try {
          await dispatch(
            fetchDocumentsByCategory({
              categoryId: catId,
              search: searchParams.length > 3 ? searchParams : '',
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

  // const [page, setPage] = useState(1);
  // const pageSize = 15;

  // const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
  //   setPage(newPage);
  // };

  return (
    <>
      <div className={styles.docsListing}>
        <Box component="div" className={styles.searchBoard}>
          <Box component="div" className={styles.docBoard}>
            <Input
              id="input-with-icon-adornment"
              className={styles.searchInput}
              placeholder="Search your documents"
              onChange={(e) => handleSearchInput(e.target.value)}
              endAdornment={
                <InputAdornment position="end" className={styles.searchIcon}>
                  <span className={styles.search} onClick={handleSearch}></span>
                </InputAdornment>
              }
            />
          </Box>
        </Box>

        <Box className={styles.docBoxMain} component="div">
          <Grid
            container
            spacing={2}
            justifyContent="start"
            alignItems="stretch"
          >
            {catId ? (
              Array.isArray(documents) &&
              documents?.length > 0 &&
              documents?.map((doc: Document) => (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={4}
                  key={doc?.id}
                  className={styles.docBoxInner}
                  onClick={() => handleOpenDocumentSummary(doc?.id)}
                >
                  <div className={styles.docGridBox}>
                    <div className={styles.docBox}>
                      <Image
                        src={getDocumentImage(doc?.file_type)}
                        alt="pdf"
                        width={19}
                        height={24}
                        className={styles.pdfImg}
                      />
                      <Typography variant="body1" className={styles.docTitle}>
                        {doc?.file_name}
                        {/* <span>general log memory usage</span> */}
                      </Typography>
                      <Image
                        src="/images/more.svg"
                        alt="more"
                        width={16}
                        height={16}
                        className={styles.moreImg}
                      />
                    </div>
                    <div className={styles.docDateBox}>
                      <div className={styles.docTagBox}>
                        {doc?.tags?.slice(0, 1)?.map((tag) => (
                          <span key={tag?.id} className={styles.docTag}>
                            {tag?.name}
                          </span>
                        ))}
                        {doc?.tags?.length > 1 && (
                          <span className={styles.docTag}>
                            +{doc?.tags?.length - 1}
                          </span>
                        )}
                      </div>
                      <Typography variant="body1">{doc?.upload_on}</Typography>
                    </div>
                  </div>
                </Grid>
              ))
            ) : (
              <></>
            )}
          </Grid>
          {/* <Box
            component="div"
            className="pagination-box"
            sx={{
              padding: '19px 0 24px 0',
              marginBottom: '-24px',
            }}
          >
            <Pagination
              count={Math.ceil(rows.length / pageSize)}
              count={10}
              page={page}
              onChange={handlePageChange}
              shape="rounded"
              className="pagination"
              sx={{
                padding: '8px 33px',
              }}
            />
          </Box> */}
        </Box>
      </div>
    </>
  );
};

export default DocumentList;
