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
    backgroundColor: '#11101b',
    margin: '0px',
    border: '1px solid #3a3948',
    borderRadius: '16px',
    minWidth: '850px',
    minHeight: '550px',
  },
}));

interface SettingDialogProps {
  openSettingDialogProps: boolean;
  onClose: () => void;
}

export default function HeaderDialog({
  openSettingDialogProps,
  onClose,
}: SettingDialogProps) {
  const [activeTab, setActiveTab] = useState('setting');

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
            <Image
              src="/images/close.svg"
              alt="close-icon"
              width={24}
              height={24}
            />
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
                    src="/images/setting.svg"
                    alt="setting.svg"
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
                <Button
                  onClick={() => setActiveTab('password')}
                  className={` ${activeTab === 'password' ? styles.active : ''}`}
                >
                  <Image
                    src="/images/setting.svg"
                    alt="setting.svg"
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
                    src="/images/setting.svg"
                    alt="setting.svg"
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
              <ChangeUserPassword closeDialog={onClose} />
            )}
            {activeTab === 'delete' && <DeleteAccount closeDialog={onClose} />}
          </>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
