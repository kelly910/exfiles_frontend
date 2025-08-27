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
import { convertDateFormat, highlightText } from '@/app/utils/constants';
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
import RenameDocDialog from './Dialog/RenameDocDialog';
import { useSearchParams } from 'next/navigation';
import { fetchDocumentSummaryById } from '@/app/redux/slices/documentSummary';
import { selectFetchedUser } from '@/app/redux/slices/login';
import { useThemeMode } from '@/app/utils/ThemeContext';

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
  uuid?: string | string;
  can_download_summary_pdf?: string;
};

type DocumentListProps = {
  catId: number | null;
  handleOpenDocumentSummary: (docId: string) => void;
  selectedDoc: string | '';
  handleOpenCategoryDrawer: (value: boolean) => void;
  searchParams: string;
  setSearchParams: React.Dispatch<React.SetStateAction<string>>;
};

const DocumentList: React.FC<DocumentListProps> = ({
  catId,
  handleOpenDocumentSummary,
  selectedDoc,
  handleOpenCategoryDrawer,
  searchParams,
  setSearchParams,
}) => {
  const mobileView = useMediaQuery('(min-width:800px)');
  const dispatch = useAppDispatch();
  const { documents, count } = useSelector(
    (state: RootState) => state.documentListing
  );
  const { categories } = useSelector(
    (state: RootState) => state.categoryListing
  );

  const findSelectedCategoryDocs = categories.find(
    (category) => category.id === Number(catId)
  );

  const [page, setPage] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleletDocId, setDeleletDocId] = useState<string>('');
  const [menuDocUUID, setMenuDocUUID] = useState<string | null>(null);
  const [renameDocDialog, setRenameDocDialog] = useState(false);
  const [renameDoc, setRenameDoc] = useState<{
    file_name: string;
    uuid: string | number;
  } | null>(null);
  const docid = useSearchParams();
  const paramsDocId = docid.get('docId');
  const fetchedUser = useSelector(selectFetchedUser);
  const expiredStatus = fetchedUser?.active_subscription?.status;

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

  const handleViewDocument = () => {
    const doc = documents.find((doc) => doc.uuid === menuDocUUID);
    if (doc?.file_path) {
      window.open(doc.file_path, '_blank');
    }
    handleCloseUserMenu();
  };

  const handleRenameDocument = () => {
    setRenameDocDialog(true);
    const doc = documents.find((doc) => doc.uuid === menuDocUUID);
    if (doc?.uuid) {
      setRenameDoc(doc as { file_name: string; uuid: string | number });
    }
    handleCloseUserMenu();
  };

  const handleCallCategoryDocs = async () => {
    if (catId) {
      await dispatch(
        fetchDocumentsByCategory({
          categoryId: catId,
          search: searchParams,
        })
      ).unwrap();
      if (paramsDocId) {
        await dispatch(fetchDocumentSummaryById(String(paramsDocId)));
      }
    }
  };

  const { theme } = useThemeMode();

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
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.0333 2.72027L5.68666 7.06694C5.17332 7.58027 5.17332 8.42027 5.68666 8.93361L10.0333 13.2803"
                    stroke="var(--Primary-Text-Color)"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Button>
              <Typography variant="body1" className={styles.categoriesTitle}>
                {findSelectedCategoryDocs?.name}
              </Typography>
            </Box>
            <Typography variant="body1" className={styles.categoriesSemiTitle}>
              No. of Docs :{' '}
              <span>{findSelectedCategoryDocs?.no_of_docs || 0}</span>
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
                  placeholder="Search Category Documents"
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
                          onClick={() =>
                            handleOpenDocumentSummary(String(doc?.uuid))
                          }
                          dangerouslySetInnerHTML={{
                            __html: highlightText(doc?.file_name, searchParams),
                          }}
                        ></Typography>
                        <IconButton
                          onClick={(e) =>
                            handleOpenUserMenu(e, String(doc?.uuid))
                          }
                          sx={{ p: 0 }}
                        >
                          {theme !== 'dark' ? (
                            <Image
                              src="/images/more.svg"
                              alt="more"
                              width={16}
                              height={16}
                              className={styles.moreImg}
                            />
                          ) : (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 11 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2.55539 4.44434C2.0665 4.44434 1.6665 4.84434 1.6665 5.33322C1.6665 5.82211 2.0665 6.22211 2.55539 6.22211C3.04428 6.22211 3.44428 5.82211 3.44428 5.33322C3.44428 4.84434 3.04428 4.44434 2.55539 4.44434Z"
                                stroke={
                                  selectedDoc === doc?.uuid
                                    ? 'var(--Primary-Text-Color)'
                                    : 'var(--Subtext-Color)'
                                }
                                stroke-width="0.8"
                              />
                              <path
                                d="M8.77756 4.44434C8.28867 4.44434 7.88867 4.84434 7.88867 5.33322C7.88867 5.82211 8.28867 6.22211 8.77756 6.22211C9.26645 6.22211 9.66645 5.82211 9.66645 5.33322C9.66645 4.84434 9.26645 4.44434 8.77756 4.44434Z"
                                stroke={
                                  selectedDoc === doc?.uuid
                                    ? 'var(--Primary-Text-Color)'
                                    : 'var(--Subtext-Color)'
                                }
                                stroke-width="0.8"
                              />
                              <path
                                d="M5.66672 4.44434C5.17783 4.44434 4.77783 4.84434 4.77783 5.33322C4.77783 5.82211 5.17783 6.22211 5.66672 6.22211C6.15561 6.22211 6.55561 5.82211 6.55561 5.33322C6.55561 4.84434 6.15561 4.44434 5.66672 4.44434Z"
                                stroke={
                                  selectedDoc === doc?.uuid
                                    ? 'var(--Primary-Text-Color)'
                                    : 'var(--Subtext-Color)'
                                }
                                stroke-width="0.8"
                              />
                            </svg>
                          )}
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
                            onClick={handleViewDocument}
                            className={`${styles.menuDropdown}`}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.1425 1.5H5.8575C3.1275 1.5 1.5 3.1275 1.5 5.8575V12.135C1.5 14.8725 3.1275 16.5 5.8575 16.5H12.135C14.865 16.5 16.4925 14.8725 16.4925 12.1425V5.8575C16.5 3.1275 14.8725 1.5 12.1425 1.5ZM12.9375 9.2475C12.9375 9.555 12.6825 9.81 12.375 9.81C12.0675 9.81 11.8125 9.555 11.8125 9.2475V6.9825L6.0225 12.7725C5.91 12.885 5.7675 12.9375 5.625 12.9375C5.4825 12.9375 5.34 12.885 5.2275 12.7725C5.01 12.555 5.01 12.195 5.2275 11.9775L11.0175 6.1875H8.7525C8.445 6.1875 8.19 5.9325 8.19 5.625C8.19 5.3175 8.445 5.0625 8.7525 5.0625H12.375C12.6825 5.0625 12.9375 5.3175 12.9375 5.625V9.2475Z"
                                fill="var(--Primary-Text-Color)"
                              />
                            </svg>
                            <Typography>View Document</Typography>
                          </MenuItem>
                          {(expiredStatus !== 0 || fetchedUser?.staff_user) && (
                            <>
                              <MenuItem
                                onClick={handleRenameDocument}
                                className={`${styles.menuDropdown}`}
                              >
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M15 22C14.59 22 14.25 21.66 14.25 21.25V2.75C14.25 2.34 14.59 2 15 2C15.41 2 15.75 2.34 15.75 2.75V21.25C15.75 21.66 15.41 22 15 22Z"
                                    fill="var(--Primary-Text-Color)"
                                  />
                                  <path
                                    d="M18 20H15V4H18C20.21 4 22 5.79 22 8V16C22 18.21 20.21 20 18 20Z"
                                    fill="var(--Primary-Text-Color)"
                                  />
                                  <path
                                    d="M6 4C3.79 4 2 5.79 2 8V16C2 18.21 3.79 20 6 20H11C11.55 20 12 19.55 12 19V5C12 4.45 11.55 4 11 4H6ZM7.75 15.5C7.75 15.91 7.41 16.25 7 16.25C6.59 16.25 6.25 15.91 6.25 15.5V8.5C6.25 8.09 6.59 7.75 7 7.75C7.41 7.75 7.75 8.09 7.75 8.5V15.5Z"
                                    fill="var(--Primary-Text-Color)"
                                  />
                                </svg>

                                <Typography>Rename Document</Typography>
                              </MenuItem>
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
                            </>
                          )}
                        </Menu>
                      </div>
                      <div className={styles.docDateBox}>
                        <div className={styles.docTagBox}>
                          {doc?.tags?.slice(0, 1)?.map((tag) => (
                            <span
                              key={tag?.id}
                              className={styles.docTag}
                              style={{
                                background:
                                  theme == 'dark'
                                    ? 'var(--Txt-On-Gradient)'
                                    : 'var(--Card-Image)',
                              }}
                            >
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
      <RenameDocDialog
        open={renameDocDialog}
        onClose={() => setRenameDocDialog(false)}
        document={renameDoc}
        getCategoryDocument={handleCallCategoryDocs}
      />
    </>
  );
};

export default DocumentList;
