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
import { useState } from 'react';

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime' },
  { id: 4, lastName: 'Stark', firstName: 'Arya' },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys' },
  { id: 6, lastName: 'Melisandre', firstName: null },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara' },
  { id: 8, lastName: 'Frances', firstName: 'Rossini' },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 10, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 11, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 12, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 13, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 14, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 15, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 16, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 17, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 18, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 19, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 20, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 21, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 22, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 23, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 24, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 25, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 26, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 27, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 28, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 29, lastName: 'Roxie', firstName: 'Harvey' },
  { id: 30, lastName: 'Roxie', firstName: 'Harvey' },
];

export default function LogIncident() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const isMobile = useMediaQuery('(max-width:768px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const deleteDialogOpen = () => {
    setAnchorEl(null);
    setOpenDeleteDialog(true);
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '#',
      width: 90,
    },
    {
      field: 'firstName',
      headerName: 'DISCRIPTION',
      flex: 1,
    },
    {
      field: 'lastName',
      headerName: 'DATE CREATED',
      width: 200,
    },
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={(event) => handleOpenMenu(event, params.row.id)}>
            <Image src="/images/more.svg" alt="more" width={20} height={20} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedRowId === params.row.id}
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
          <PageHeader title="Log Incident" />
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
                endAdornment={
                  <InputAdornment position="end" className={styles.searchIcon}>
                    <span className={styles.search}></span>
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
              rows={rows.slice((page - 1) * pageSize, page * pageSize)}
              columns={columns}
              getRowClassName={(params: GridRowClassNameParams) =>
                selectedRowId === params.id ? 'active-menu-row' : ''
              }
              sx={{
                '.MuiDataGrid-row': { border: '1px solid transparent' },
                '.active-menu-row': { border: '1px solid var(--Stroke-Color)' },
                '.MuiDataGrid-footerContainer': { display: 'none' },
                '.MuiDataGrid-filler': { display: 'none' },
                '.MuiDataGrid-columnHeader:focus': { outline: 'none' },
                '.MuiDataGrid-columnHeader::focus-within': { outline: 'none' },
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
                count={Math.ceil(rows.length / pageSize)}
                page={page}
                onChange={handlePageChange}
                shape="rounded"
                className="pagination"
                siblingCount={isMobile ? 0 : 2} // Mobile: Show fewer page numbers
                boundaryCount={1} // Always show first and last page
                sx={{
                  padding: '8px 24px',
                }}
              />
            </Box>
          </Box>
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
