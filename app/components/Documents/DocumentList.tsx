'use client';

import React from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Menu,
  MenuItem,
  Pagination,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import styles from './document.module.scss';
import { convertDateFormat, documentType } from '@/app/utils/constants';
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
  const [page, setPage] = useState(1);

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
    setPage(newPage);

    await dispatch(
      fetchDocumentsByCategory({
        categoryId: catId as number,
        search: searchParams.length > 3 ? searchParams : '',
        page: newPage,
      })
    ).unwrap();
  };

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <div className={styles.docsListing}>
        {/* <Box component="div" className={styles.categoryBox}>
          <Box className={styles.categoryBoxInner}>
            <Button
              // onClick={handleCloseDrawer}
              className={styles.backButton}
              sx={{ marginBottom: '24px' }}
            >
              <Image
                src="/images/arrow-left.svg"
                alt="user"
                width={16}
                height={16}
              />
            </Button>
            <Typography variant="body1" className={styles.categoriesTitle}>
              Categories
            </Typography>
          </Box>
          <Typography variant="body1" className={styles.categoriesSemiTitle}>
            No. of Docs : <span>112</span>
          </Typography>
        </Box> */}
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
                      {/* <Image
                        src="/images/more.svg"
                        alt="more"
                        width={16}
                        height={16}
                        className={styles.moreImg}
                      /> */}
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Image
                          src="/images/more.svg"
                          alt="more"
                          width={16}
                          height={16}
                          className={styles.moreImg}
                        />
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        className={styles.mainDropdown}
                        sx={{
                          '& .MuiPaper-root': {
                            backgroundColor: 'var(--Input-Box-Colors)',
                            marginTop: '70px',
                            boxShadow: 'none',
                            borderRadius: '12px',
                          },
                        }}
                      >
                        <MenuItem
                          onClick={handleCloseUserMenu}
                          className={`${styles.menuDropdown} ${styles.menuDropdownDelete}`}
                        >
                          <Image
                            src="/images/trash.svg"
                            alt="tras"
                            width={18}
                            height={18}
                          />
                          <Typography>Delete Document</Typography>
                        </MenuItem>
                      </Menu>
                    </div>
                    <div className={styles.docDateBox}>
                      <div className={styles.docTagBox}>
                        {doc?.tags?.slice(0, 1)?.map((tag) => (
                          <span key={tag?.id} className={styles.docTag}>
                            {tag?.name}
                          </span>
                        ))}
                        {doc?.tags?.length > 1 && (
                          <span className={styles.docTagCount}>
                            +{doc?.tags?.length - 1}
                          </span>
                        )}
                      </div>
                      <Typography variant="body1">
                        {convertDateFormat(doc?.upload_on)}
                      </Typography>
                    </div>
                  </div>
                </Grid>
              ))
            ) : (
              <></>
            )}
          </Grid>
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
            count={Math.ceil(count / 12)}
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
    </>
  );
};

export default DocumentList;
