'use client';

import { useState } from 'react';
import styles from '../SettingDialog/setting.module.scss';
import {
  MenuItem,
  Avatar,
  Box,
  InputAdornment,
  Select,
  TextField,
  Typography,
  Button,
} from '@mui/material';

const MyProfile = ({ closeDialog }: { closeDialog: () => void }) => {
  const [countryCode, setCountryCode] = useState('+91');
  return (
    <>
      <Box component="div" className={styles.dialogFormContent}>
        <Box>
          <Avatar
            alt="Pravin Lagariya"
            src="/static/images/avatar/2.jpg"
            sx={{
              backgroundColor: '#DADAE1',
              color: '#1B1A25',
              fontSize: '24px',
              fontWeight: 600,
              padding: '13px 15px',
              lineHeight: '140%',
              marginBottom: '28px',
              width: '60px',
              height: '60px',
            }}
          />
        </Box>
        <form className={styles.dialogFormInner}>
          <div className={styles.dialogFormGroup}>
            <Typography
              variant="body2"
              component="label"
              htmlFor="email"
              className={styles.formLabel}
            >
              First Name
            </Typography>
            <TextField
              fullWidth
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Elliot"
              sx={{
                marginTop: '4px',
                padding: '0',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  borderWidth: '0px',
                  color: '#DADAE1',
                  backgroundColor: '#252431',
                  '& .MuiOutlinedInput-notchedOutline': {
                    top: '-10px !important',
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '14px',
                    color: '#DADAE1',
                    padding: '14px 16px',
                    fontWeight: 500,
                    borderRadius: '12px',
                    '&::placeholder': {
                      color: '#888',
                      fontWeight: 400,
                    },
                  },
                  '& fieldset': {
                    borderColor: '#3A3948',
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                    borderWidth: '1px',
                    color: '#fff',
                  },
                },
              }}
            />
          </div>
          <div className={styles.dialogFormGroup}>
            <Typography
              variant="body2"
              component="label"
              htmlFor="email"
              className={styles.formLabel}
            >
              Last Name
            </Typography>
            <TextField
              fullWidth
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Elderson"
              sx={{
                marginTop: '4px',
                padding: '0',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  borderWidth: '0px',
                  color: '#DADAE1',
                  backgroundColor: '#252431',
                  '& .MuiOutlinedInput-notchedOutline': {
                    top: '-10px !important',
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '14px',
                    color: '#DADAE1',
                    padding: '14px 16px',
                    fontWeight: 500,
                    borderRadius: '12px',
                    '&::placeholder': {
                      color: '#888',
                      fontWeight: 400,
                    },
                  },
                  '& fieldset': {
                    borderColor: '#3A3948',
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                    borderWidth: '1px',
                    color: '#fff',
                  },
                },
              }}
            />
          </div>
          <div className={styles.dialogFormGroup}>
            <Typography
              variant="body2"
              component="label"
              htmlFor="email"
              className={styles.formLabel}
            >
              Email Address
            </Typography>
            <TextField
              fullWidth
              type="text"
              id="first_name"
              name="first_name"
              placeholder="samsepiol@ecorp.com"
              sx={{
                marginTop: '4px',
                padding: '0',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  borderWidth: '0px',
                  color: '#DADAE1',
                  backgroundColor: '#252431',
                  '& .MuiOutlinedInput-notchedOutline': {
                    top: '-10px !important',
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '14px',
                    color: '#DADAE1',
                    padding: '14px 16px',
                    fontWeight: 500,
                    borderRadius: '12px',
                    '&::placeholder': {
                      color: '#888',
                      fontWeight: 400,
                    },
                  },
                  '& fieldset': {
                    borderColor: '#3A3948',
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                    borderWidth: '1px',
                    color: '#fff',
                  },
                },
              }}
            />
          </div>
          <div className={styles.dialogFormGroup}>
            <Typography
              variant="body2"
              component="label"
              htmlFor="email"
              className={styles.formLabel}
            >
              Mobile No
            </Typography>
            <TextField
              fullWidth
              type="text"
              id="contact_number"
              name="contact_number"
              placeholder="Enter Mobile Number here"
              sx={{
                marginTop: '5px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  borderWidth: '0px',
                  color: '#fff',
                  backgroundColor: '#252431',
                  '& .MuiOutlinedInput-notchedOutline': {
                    top: '-10px !important',
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '16px',
                    color: '#fff',
                    padding: '14px 16px',
                    fontWeight: 500,
                    borderRadius: '12px',
                    '&::placeholder': {
                      color: '#888',
                      fontWeight: 400,
                    },
                  },
                  '& fieldset': {
                    borderColor: '#3A3948',
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                    borderWidth: '1px',
                    color: '#fff',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Select
                      value={countryCode}
                      className="select-new"
                      onChange={(e) => setCountryCode(e.target.value)}
                      sx={{
                        padding: '0px',
                        color: '#b0b0b0',
                        fontWeight: 'bold',
                        width: '60px',
                        background: 'transparent',
                        paddingRight: '15px !important',
                        '& .MuiSelect-icon': {
                          color: '#fff',
                          position: 'absolute',
                          right: '-10px',
                        },
                      }}
                    >
                      <MenuItem value="+91">+91</MenuItem>
                      <MenuItem value="+1">+1</MenuItem>
                      <MenuItem value="+44">+44</MenuItem>
                      <MenuItem value="+61">+61</MenuItem>
                    </Select>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </form>
      </Box>
      <Box component="div" className={styles.dialogFormButtonBox}>
        <Button className={styles.formCancelBtn} onClick={closeDialog}>
          Cancel
        </Button>
        <Button className={styles.formSaveBtn}>Save Changes</Button>
      </Box>
    </>
  );
};

export default MyProfile;
