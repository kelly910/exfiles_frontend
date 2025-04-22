'use client';

import React from 'react';
import {
  Box,
  Button,
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
import styles from './document.module.scss';
import { convertDateFormat } from '@/app/utils/constants';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { fetchDocumentsByCategory } from '@/app/redux/slices/documentByCategory';
import { RootState } from '@/app/redux/store';
import { useSelector } from 'react-redux';
import { setLoader } from '@/app/redux/slices/loader';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import DeleteDialog from '../LogoutDialog/DeleteDialog';
import DocumentsEmpty from '../DocumentsEmpty/DocumentsEmpty';
import { getDocumentImage } from '@/app/utils/functions';

type Tag = {
  id: number;
  name: string;
};

type Document = {
  id: number;
  file_name: string;
  // file_path: string;
  file_type: string;
  description?: string;
  tags: Tag[];
  upload_on: string;
  uuid?: string;
};

type DocumentListProps = {
  catId: number | null;
  handleOpenDocumentSummary: (docId: string) => void;
  selectedDoc: string | '';
  handleOpenCategoryDrawer: (value: boolean) => void;
};

const DocumentList: React.FC<DocumentListProps> = ({
  catId,
  handleOpenDocumentSummary,
  selectedDoc,
  handleOpenCategoryDrawer,
}) => {
  const mobileView = useMediaQuery('(min-width:800px)');
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useState('');
  const { documents, count } = useSelector(
    (state: RootState) => state.documentListing
  );
  const { categories, no_of_docs } = useSelector(
    (state: RootState) => state.categoryListing
  );

  const findSelectedCategoryDocs = categories.find(
    (category) => category.id === Number(catId)
  );

  const [page, setPage] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleletDocId, setDeleletDocId] = useState<string>('');
  const [menuDocUUID, setMenuDocUUID] = useState<string | null>(null);

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
    await dispatch(
      fetchDocumentsByCategory({
        categoryId: catId as number,
        search: searchParams.length > 3 ? searchParams : '',
        page: newPage,
      })
    ).unwrap();
    setPage(newPage);
  };

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (
    event: React.MouseEvent<HTMLElement>,
    uuid: string
  ) => {
    setAnchorElUser(event.currentTarget);
    setMenuDocUUID(uuid);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    setMenuDocUUID(null);
  };
  const handleDeleteOption = () => {
    if (menuDocUUID) {
      setDeleletDocId(menuDocUUID);
      console.log('Deleting:', menuDocUUID);
      setOpenDeleteDialog(true);
    }
    handleCloseUserMenu();
  };

  const handleDeleteConfirmed = () => {
    if (selectedDoc === deleletDocId) {
      handleOpenDocumentSummary('');
    }
    if (catId) {
      dispatch(
        fetchDocumentsByCategory({
          categoryId: catId,
          search: searchParams,
          page: page,
        })
      );
    }

    setOpenDeleteDialog(false);
  };

  return (
    <>
      <div className={styles.docsListing}>
        {!mobileView && (
          <Box component="div" className={styles.categoryBox}>
            <Box className={styles.categoryBoxInner}>
              <Button
                onClick={() => handleOpenCategoryDrawer(true)}
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
                {findSelectedCategoryDocs?.name}
              </Typography>
            </Box>
            <Typography variant="body1" className={styles.categoriesSemiTitle}>
              No. of Docs : <span>{no_of_docs || 0}</span>
            </Typography>
          </Box>
        )}
        {findSelectedCategoryDocs?.no_of_docs ? (
          <>
            <Box component="div" className={styles.searchBoard}>
              <Box component="div" className={styles.docBoard}>
                <Input
                  id="input-with-icon-adornment"
                  className={styles.searchInput}
                  placeholder="Search your documents"
                  onChange={(e) => handleSearchInput(e.target.value)}
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
              </Box>
            </Box>
            <Box
              className={`${styles.docBoxMain} ${selectedDoc ? styles.docBoxMainOpen : ''}`}
              component="div"
            >
              <Box component="div" className={styles.docBoxInner}>
                {catId && documents?.length > 0 ? (
                  Array.isArray(documents) &&
                  documents?.map((doc: Document) => (
                    // <Box key={doc?.id} className={styles.docBoxInner}>
                    <Box
                      key={doc?.id}
                      className={`${styles.docGridBox} ${selectedDoc === doc?.uuid ? styles.active : ''}`}
                    >
                      <div className={styles.docBox}>
                        <Image
                          src={getDocumentImage(doc?.file_type)}
                          alt="pdf"
                          width={19}
                          height={24}
                          className={styles.pdfImg}
                          onClick={() =>
                            handleOpenDocumentSummary(String(doc?.uuid))
                          }
                        />
                        <Typography
                          variant="body1"
                          className={styles.docTitle}
                          onClick={() =>
                            handleOpenDocumentSummary(String(doc?.uuid))
                          }
                        >
                          {doc?.file_name}
                        </Typography>
                        <IconButton
                          onClick={(e) =>
                            handleOpenUserMenu(e, String(doc?.uuid))
                          }
                          sx={{ p: 0 }}
                        >
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
                            onClick={handleDeleteOption}
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
                    </Box>
                    // </Box>
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
          </>
        ) : (
          <DocumentsEmpty />
        )}
      </div>
      <DeleteDialog
        openDeleteDialogProps={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        type="Document"
        deletedId={deleletDocId}
        onConfirmDelete={handleDeleteConfirmed}
      />
    </>
  );
};

export default DocumentList;
