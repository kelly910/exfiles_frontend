'use client';
import styles from './logincident.module.scss';
import * as React from 'react';
import Box from '@mui/material/Box';
import {
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
import Sidebar from '../Common/Sidebar';
import PageHeader from '../Common/PageHeader';
import DeleteDialog from '../LogoutDialog/DeleteDialog';
import { useState, useEffect } from 'react';
import { fetchLogIncidents } from '@/app/redux/slices/logIncident';
import { useAppDispatch } from '@/app/redux/hooks';
import { setLoader } from '@/app/redux/slices/loader';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import LogincidentEmpty from './LogincidentEmpty';
import { PinnedAnswerMessage } from '@/app/redux/slices/Chat/chatTypes';
import { useRouter } from 'next/navigation';
import { setPageHeaderData } from '@/app/redux/slices/login';
import LogDetailsModel from '../LogModel/LogDetailsModel';
import LogModel from '../LogModel/LogModel';
import dayjs from 'dayjs';

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
  const isMobile = useMediaQuery('(max-width:768px)');
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
  const { incidents, count } = useSelector(
    (state: RootState) => state.logIncidents
  );
  const router = useRouter();
  const open = Boolean(anchorEl);
  const [openAddIncident, setOpenAddIncident] = useState(false);
  const [editLogIncidentData, setEditLogIncidentData] =
    useState<LogIncidentDetails | null>(null);

  const handleOpenAddIncident = () => {
    setOpenAddIncident(true);
  };

  const editLogIncident = () => {
    handleOpenAddIncident();
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
              subTitle: `No. of Incidents : ${resp.payload.count}`,
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
          />
          {count ? (
            <>
              <Box
                sx={{
                  height: 'calc(100vh - 65px)',
                  position: 'relative',
                  overflowY: 'auto',
                  width: '100%',
                  backgroundColor: '#11101B',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                  '& .MuiDataGrid-root': {
                    backgroundColor: '#11101B',
                    color: '#DADAE1',
                    borderRadius: '8px',
                    border: 'none',
                  },
                  '& .MuiDataGrid-row:nth-of-type(even)': {
                    backgroundColor: '#11101B',
                    color: '#DADAE1',
                  },
                  '& .MuiDataGrid-row:nth-of-type(odd)': {
                    backgroundColor: '#1B1A25',
                    color: '#DADAE1',
                    borderRadius: '10px',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#11101B',
                    color: '#DADAE1',
                    fontSize: '16px',
                    fontWeight: 'bold',
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
                    fontSize: '14px',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    backgroundColor: '#1B1A25',
                    borderTop: 'none',
                    color: '#DADAE1',
                    borderRadius: '10px',
                  },
                  '& .MuiTablePagination-root': {
                    color: '#DADAE1',
                  },
                  '& .MuiSelect-select': {
                    color: '#DADAE1',
                    backgroundColor: '#11101B',
                    borderRadius: '8px',
                  },
                  '& .MuiTablePagination-actions button': {
                    color: '#DADAE1',
                  },
                  '& .Mui-disabled': {
                    color: '#666',
                  },
                  '& .MuiDataGrid-container': {
                    backgroundColor: '#11101B',
                  },
                  '& .MuiDataGrid-row': {
                    backgroundColor: '#11101B',
                  },
                  '& .MuiDataGrid-container--top [role=row]': {
                    backgroundColor: '#11101B !important',
                    color: '#FFF',
                    fontWeight: 'bold',
                  },
                }}
              >
                <Box component="div" className={styles.logIncidentSearch}>
                  <Input
                    id="input-with-icon-adornment"
                    className={styles.searchInput}
                    placeholder="Search here..."
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
                  <Button
                    className="btn btn-pluse"
                    onClick={handleOpenAddIncident}
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
                <Box component="div" className={styles.logListingBox}>
                  {incidents.map((item, index) => (
                    <Box
                      component="div"
                      className={styles.logListing}
                      key={index}
                    >
                      <Box component="div" className={styles.logListHeader}>
                        <Typography
                          variant="body1"
                          className={styles.logTitle}
                          onClick={() => viewDetails(item)}
                        >
                          {item.description}
                        </Typography>
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
                      <Box component="div" className={styles.logListBody}>
                        {item?.tags_data.map((tag, index) => (
                          <Box className={styles.logListBodyTag} key={index}>
                            {tag?.file_data?.file_url ? (
                              <Image
                                src={tag?.file_data?.file_url}
                                alt={tag.name}
                                width={16}
                                height={16}
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
                            >
                              {tag?.name}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      <Box component="div" className={styles.logListFooter}>
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
                            ? dayjs(item.incident_time).format(
                                'MM/DD/YYYY hh:mm A'
                              )
                            : '-'}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Box
                  component="div"
                  className="pagination-box"
                  sx={{
                    padding: '19px 24px 28px 24px',
                    marginBottom: '-28px',
                  }}
                >
                  <Pagination
                    count={Math.ceil(count / 16)}
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
      />
    </>
  );
}
