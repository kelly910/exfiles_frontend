'use client';
import styles from './logincident.module.scss';
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
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
import { convertDateFormatForIncident } from '@/app/utils/constants';

export default function LogIncident() {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useState('');
  const [page, setPage] = useState(1);
  const { incidents, count, no_of_incident } = useSelector(
    (state: RootState) => state.logIncidents
  );

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
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
        await dispatch(fetchLogIncidents({ search: searchParams }));
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

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '#',
      width: 90,
    },
    {
      field: 'name',
      headerName: 'DESCRIPTION',
      flex: 1,
      minWidth: 500,
    },
    {
      field: 'created',
      headerName: 'DATE CREATED',
      width: 200,
    },
    {
      field: 'actions',
      headerName: '',
      width: 70,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={(event) => handleOpenMenu(event, params.row.uuid)}
          >
            <Image src="/images/more.svg" alt="more" width={20} height={20} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRowId === params.row.uuid}
            onClose={handleCloseMenu}
            className={styles.mainDropdown}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <MenuItem
              className={styles.menuDropdown}
              onClick={deleteDialogOpen}
            >
              <Image
                src="/images/trash.svg"
                alt="delet"
                width={18}
                height={18}
              />
              <Typography>Delete</Typography>
            </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  const rows = incidents?.map((item) => ({
    id: item?.id,
    name: item?.name,
    uuid: item?.uuid,
    created: convertDateFormatForIncident(item?.created?.split('T')[0]),
  }));

  return (
    <>
      <main className="chat-body">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleThreadClick={(threadUUID: string) => {
            console.log(`Thread clicked: ${threadUUID}`);
          }}
          title="Log Incident"
        />
        <section className="main-body">
          <PageHeader
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            title="Log Incident"
          />
          {no_of_incident ? (
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
                <Button className="btn btn-pluse">
                  <Image
                    src="/images/add-icon.svg"
                    alt="re"
                    width={20}
                    height={20}
                  />
                  Add Incident{' '}
                </Button>
              </Box>
              <DataGrid
                rows={rows}
                columns={columns}
                getRowClassName={(params: GridRowClassNameParams) =>
                  selectedRowId === params.id ? 'active-menu-row' : ''
                }
                sx={{
                  '.MuiDataGrid-row': { border: '1px solid transparent' },
                  '.active-menu-row': {
                    border: '1px solid var(--Stroke-Color)',
                  },
                  '.MuiDataGrid-footerContainer': { display: 'none' },
                  '.MuiDataGrid-filler': { display: 'none' },
                  '.MuiDataGrid-columnHeader:focus': { outline: 'none' },
                  '.MuiDataGrid-columnHeader::focus-within': {
                    outline: 'none',
                  },
                  '.MuiDataGrid-columnHeader:focus-within': { outline: 'none' },
                  '.MuiDataGrid-cell:focus-within': { outline: 'none' },
                  '.MuiDataGrid-cell::focus': { outline: 'none' },
                  '.MuiDataGrid-row .MuiDataGrid-cell': {
                    fontSize: 'var(--SubTitle-3)',
                    fontWeight: 'var(--Regular)',
                    color: 'var(--Primary-Text-Color)',
                  },
                  '.MuiDataGrid-sortIcon': {
                    fill: 'var(--Subtext-Color)',
                  },
                  '.MuiDataGrid-columnHeaderTitle': {
                    fontSize: 'var(--SubTitle-5)',
                    fontWeight: 'var(--Regular)',
                    color: 'var(--Subtext-Color)',
                  },
                  '.MuiDataGrid-overlay': {
                    backgroundColor: 'var(--Background-Color)',
                    color: 'var(--Subtext-Color)',
                    fontSize: 'var(--SubTitle-2)',
                  },
                }}
                localeText={{
                  noRowsLabel: 'No Logs found',
                }}
                className={styles.loIncidentTable}
                sortingOrder={['asc', 'desc']}
                disableVirtualization={true}
                disableColumnResize={true}
                disableColumnMenu={true}
                disableRowSelectionOnClick={true}
              />
              <Box
                component="div"
                className="pagination-box"
                sx={{
                  padding: '19px 24px 28px 24px',
                  marginBottom: '-28px',
                }}
              >
                <Pagination
                  count={Math.ceil(count / 12)}
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
    </>
  );
}
