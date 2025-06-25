import React, { useState } from 'react';
import styles from './setting.module.scss';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import MyProfile from '@/app/components/UserSetting/MyProfile';
import ChangeUserPassword from '@/app/components/UserSetting/ChangeUserPassword';
import DeleteAccount from '@/app/components/UserSetting/DeleteAccount';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--Card-Color)',
    margin: '0px',
    border: '1px solid var(--Stroke-Color)',
    borderRadius: '16px',
    minWidth: '850px',
    minHeight: '550px',

    '@media (max-width: 1024px)': {
      maxWidth: '80vw',
      minWidth: '700px',
      minHeight: '500px',
    },
    '@media (max-width: 768px)': {
      maxWidth: '80vw',
      minWidth: '480px', // 90% of the viewport width
      minHeight: '400px',
    },
    '@media (max-width: 500px)': {
      maxWidth: '80vw',
      minWidth: '450px', // 90% of the viewport width
      minHeight: '400px',
    },
    '@media (max-width: 480px)': {
      maxWidth: '95vw',
      minWidth: '100%', // Almost full width
      minHeight: 'auto',
    },
  },
}));

interface SettingDialogProps {
  openSettingDialogProps: boolean;
  onClose: () => void;
}

export default function SettingDialog({
  openSettingDialogProps,
  onClose,
}: SettingDialogProps) {
  const [activeTab, setActiveTab] = useState('setting');
  const storedUser = localStorage.getItem('loggedInUser');
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const googleLogin = loggedInUser?.data?.google_login;

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={openSettingDialogProps}
        className={styles.headerDialogBox}
        sx={{
          background: 'rgb(17 16 27 / 0%)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <Box component="div" className={styles.dialogHeader}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Settings
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.1 18.3C6.7134 18.6866 6.0866 18.6866 5.7 18.3C5.3134 17.9134 5.3134 17.2866 5.7 16.9L9.89289 12.7071C10.2834 12.3166 10.2834 11.6834 9.89289 11.2929L5.7 7.1C5.3134 6.7134 5.3134 6.0866 5.7 5.7C6.0866 5.3134 6.7134 5.3134 7.1 5.7L11.2929 9.89289C11.6834 10.2834 12.3166 10.2834 12.7071 9.89289L16.9 5.7C17.2866 5.3134 17.9134 5.3134 18.3 5.7C18.6866 6.0866 18.6866 6.7134 18.3 7.1L14.1071 11.2929C13.7166 11.6834 13.7166 12.3166 14.1071 12.7071L18.3 16.9C18.6866 17.2866 18.6866 17.9134 18.3 18.3C17.9134 18.6866 17.2866 18.6866 16.9 18.3L12.7071 14.1071C12.3166 13.7166 11.6834 13.7166 11.2929 14.1071L7.1 18.3Z"
                fill="var(--Primary-Text-Color)"
              />
            </svg>
          </IconButton>
        </Box>
        <DialogContent dividers className={styles.dialogBody}>
          <Box component="div" className={styles.dialogSidebar}>
            <Box component="div" className={styles.dialogSidebarHeader}>
              <Typography variant="h6" className={styles.dialogSemiTitle}>
                General settings
              </Typography>
              <Box component="div" className={styles.dialogSidebarContent}>
                <Button
                  onClick={() => setActiveTab('setting')}
                  className={` ${activeTab === 'setting' ? styles.active : ''}`}
                >
                  <Image
                    src="/images/profile.svg"
                    alt="profile.svg"
                    width={18}
                    height={18}
                  />
                  <Typography>My Profile</Typography>
                  <Image
                    src="/images/arrow-down-right.svg"
                    alt="user"
                    width={16}
                    height={16}
                  />
                </Button>
                {!googleLogin && (
                  <Button
                    onClick={() => setActiveTab('password')}
                    className={` ${activeTab === 'password' ? styles.active : ''}`}
                  >
                    <Image
                      src="/images/password-change.svg"
                      alt="password-change.svg"
                      width={18}
                      height={18}
                    />
                    <Typography>Change Password</Typography>
                    <Image
                      src="/images/arrow-down-right.svg"
                      alt="user"
                      width={16}
                      height={16}
                    />
                  </Button>
                )}
              </Box>
            </Box>
            <Box component="div" className={styles.dialogSidebarHeader}>
              <Typography variant="h6" className={styles.dialogSemiTitle}>
                Danger Zone
              </Typography>
              <Box component="div" className={styles.dialogSidebarContent}>
                <Button
                  onClick={() => setActiveTab('delete')}
                  className={` ${activeTab === 'delete' ? styles.active : ''}`}
                >
                  <Image
                    src="/images/trash-white.svg"
                    alt="trash-white.svg"
                    width={18}
                    height={18}
                  />
                  <Typography>Delete Account</Typography>
                  <Image
                    src="/images/arrow-down-right.svg"
                    alt="user"
                    width={16}
                    height={16}
                  />
                </Button>
              </Box>
            </Box>
          </Box>

          <>
            {activeTab === 'setting' && <MyProfile closeDialog={onClose} />}
            {activeTab === 'password' && (
              <ChangeUserPassword closeDialog={onClose} mobileView={false} />
            )}
            {activeTab === 'delete' && <DeleteAccount closeDialog={onClose} />}
          </>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
