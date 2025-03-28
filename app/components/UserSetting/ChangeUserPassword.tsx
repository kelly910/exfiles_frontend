'use client';

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import styles from '../SettingDialog/setting.module.scss';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

const ChangeUserPassword = ({ closeDialog }: { closeDialog: () => void }) => {
  const [currentPassword, setCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const [repeatNewPassword, setRepeatNewPassword] = useState(false);

  return (
    <>
      <Box component="div" className={styles.dialogFormContent}>
        <form className={styles.dialogFormInner}>
          <div className={styles.dialogFormGroup}>
            <Typography
              variant="body2"
              component="label"
              htmlFor="email"
              className={styles.formLabel}
            >
              Current Password
            </Typography>
            <TextField
              fullWidth
              type={currentPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="*******************"
              sx={{
                marginTop: '4px',
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
                    padding: '12px',
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
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setCurrentPassword((prev) => !prev)}
                      edge="end"
                      sx={{
                        padding: '0',
                        width: '20px',
                        margin: '0',
                      }}
                    >
                      {currentPassword ? (
                        <Visibility
                          sx={{
                            color: '#b0b0b0',
                            width: '20px',
                            height: '20px',
                          }}
                        />
                      ) : (
                        <VisibilityOff
                          sx={{
                            color: '#b0b0b0',
                            width: '20px',
                            height: '20px',
                          }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <br />
          <div className={styles.dialogFormGroup}>
            <Typography
              variant="body2"
              component="label"
              htmlFor="email"
              className={styles.formLabel}
            >
              New Password*
            </Typography>
            <TextField
              fullWidth
              type={newPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="*******************"
              sx={{
                marginTop: '4px',
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
                    padding: '12px',
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
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setNewPassword((prev) => !prev)}
                      edge="end"
                      sx={{
                        padding: '0',
                        width: '20px',
                        margin: '0',
                      }}
                    >
                      {newPassword ? (
                        <Visibility
                          sx={{
                            color: '#b0b0b0',
                            width: '20px',
                            height: '20px',
                          }}
                        />
                      ) : (
                        <VisibilityOff
                          sx={{
                            color: '#b0b0b0',
                            width: '20px',
                            height: '20px',
                          }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
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
              Repeat New Password*
            </Typography>
            <TextField
              fullWidth
              type={repeatNewPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="*******************"
              sx={{
                marginTop: '4px',
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
                    padding: '12px',
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
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setRepeatNewPassword((prev) => !prev)}
                      edge="end"
                      sx={{
                        padding: '0',
                        width: '20px',
                        margin: '0',
                      }}
                    >
                      {repeatNewPassword ? (
                        <Visibility
                          sx={{
                            color: '#b0b0b0',
                            width: '20px',
                            height: '20px',
                          }}
                        />
                      ) : (
                        <VisibilityOff
                          sx={{
                            color: '#b0b0b0',
                            width: '20px',
                            height: '20px',
                          }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </form>
      </Box>
      <Box component="div" className={styles.dialogFormButtonBox}>
        <Button className={styles.formSaveBtn} onClick={closeDialog}>
          Update Password
        </Button>
      </Box>
    </>
  );
};

export default ChangeUserPassword;
