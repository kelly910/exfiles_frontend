import * as React from 'react';
import styles from './logincident.module.scss';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: 'id', headerName: '#', width: 90 },
  {
    field: 'firstName',
    headerName: 'DISCRIPTION',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'DATE CREATED',
    width: 150,
    editable: true,
  },
  // {
  //   field: 'age',
  //   headerName: 'Age',
  //   type: 'number',
  //   width: 110,
  //   editable: true,
  // },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  // },
];

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
];

export default function LogIncident() {
  return (
    <Box
      sx={{
        height: 'auto',
        width: '100%',
        backgroundColor: '#11101B',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        padding: '24px 24px 28px 24px',
        '& .MuiDataGrid-root': {
          backgroundColor: '#11101B', // Grid background
          color: '#DADAE1', // Text color
          borderRadius: '8px',
          border: 'none',
        },
        '& .MuiDataGrid-row:nth-of-type(odd)': {
          backgroundColor: '#11101B', // Odd rows: White
          color: '#DADAE1',
        },
        '& .MuiDataGrid-row:nth-of-type(even)': {
          backgroundColor: '#1B1A25', // Even rows: Black
          color: '#DADAE1',
          borderRadius: '10px',
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#11101B', // Header background
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
          border: 'none', // Removes cell border
          borderTop: 'none !important', // Removes cell border
          fontSize: '14px',
        },
        '& .MuiDataGrid-footerContainer': {
          backgroundColor: '#1B1A25', // Style pagination container
          borderTop: 'none',
          color: '#DADAE1',
          borderRadius: '10px',
        },
        '& .MuiTablePagination-root': {
          color: '#DADAE1', // Pagination text color
        },
        '& .MuiSelect-select': {
          // Fixes Dropdown Styling (was .MuiTablePagination-select)
          color: '#DADAE1',
          backgroundColor: '#11101B',
          borderRadius: '8px',
        },
        '& .MuiTablePagination-actions button': {
          color: '#DADAE1', // Pagination buttons color
        },
        '& .Mui-disabled': {
          color: '#666', // Disabled button color
        },
        '& .MuiDataGrid-container': {
          backgroundColor: '#11101B', // Ensures the top container background changes
        },
        '& .MuiDataGrid-row': {
          backgroundColor: '#11101B', // Ensures all rows have the background
        },
        '& .MuiDataGrid-container--top [role=row]': {
          backgroundColor: '#11101B !important',
          color: '#FFF',
          fontWeight: 'bold',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        sx={{ background: 'black', color: 'white' }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        // pageSizeOptions={[5]}
        // checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
