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
import { useThemeMode } from '@/app/utils/ThemeContext';

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
  const { theme } = useThemeMode();

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
                  {theme === 'dark' ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.5 9C16.5 4.8675 13.1325 1.5 9 1.5C4.8675 1.5 1.5 4.8675 1.5 9C1.5 11.175 2.4375 13.1325 3.9225 14.505C3.9225 14.5125 3.9225 14.5125 3.915 14.52C3.99 14.595 4.08 14.655 4.155 14.7225C4.2 14.76 4.2375 14.7975 4.2825 14.8275C4.4175 14.94 4.5675 15.045 4.71 15.15C4.7625 15.1875 4.8075 15.2175 4.86 15.255C5.0025 15.3525 5.1525 15.4425 5.31 15.525C5.3625 15.555 5.4225 15.5925 5.475 15.6225C5.625 15.705 5.7825 15.78 5.9475 15.8475C6.0075 15.8775 6.0675 15.9075 6.1275 15.93C6.2925 15.9975 6.4575 16.0575 6.6225 16.11C6.6825 16.1325 6.7425 16.155 6.8025 16.17C6.9825 16.2225 7.1625 16.2675 7.3425 16.3125C7.395 16.3275 7.4475 16.3425 7.5075 16.35C7.7175 16.395 7.9275 16.425 8.145 16.4475C8.175 16.4475 8.205 16.455 8.235 16.4625C8.49 16.485 8.745 16.5 9 16.5C9.255 16.5 9.51 16.485 9.7575 16.4625C9.7875 16.4625 9.8175 16.455 9.8475 16.4475C10.065 16.425 10.275 16.395 10.485 16.35C10.5375 16.3425 10.59 16.32 10.65 16.3125C10.83 16.2675 11.0175 16.23 11.19 16.17C11.25 16.1475 11.31 16.125 11.37 16.11C11.535 16.05 11.7075 15.9975 11.865 15.93C11.925 15.9075 11.985 15.8775 12.045 15.8475C12.2025 15.78 12.36 15.705 12.5175 15.6225C12.5775 15.5925 12.63 15.555 12.6825 15.525C12.8325 15.435 12.9825 15.3525 13.1325 15.255C13.185 15.225 13.23 15.1875 13.2825 15.15C13.4325 15.045 13.575 14.94 13.71 14.8275C13.755 14.79 13.7925 14.7525 13.8375 14.7225C13.92 14.655 14.0025 14.5875 14.0775 14.52C14.0775 14.5125 14.0775 14.5125 14.07 14.505C15.5625 13.1325 16.5 11.175 16.5 9ZM12.705 12.7275C10.6725 11.3625 7.3425 11.3625 5.295 12.7275C4.965 12.945 4.695 13.2 4.47 13.4775C3.33 12.3225 2.625 10.74 2.625 9C2.625 5.4825 5.4825 2.625 9 2.625C12.5175 2.625 15.375 5.4825 15.375 9C15.375 10.74 14.67 12.3225 13.53 13.4775C13.3125 13.2 13.035 12.945 12.705 12.7275Z"
                        fill={
                          activeTab === 'setting'
                            ? 'var(--Icon-Color)'
                            : 'var(--Subtext-Color)'
                        }
                      />
                      <path
                        d="M9 5.19775C7.4475 5.19775 6.1875 6.45775 6.1875 8.01025C6.1875 9.53275 7.38 10.7703 8.9625 10.8153C8.985 10.8153 9.015 10.8153 9.03 10.8153C9.045 10.8153 9.0675 10.8153 9.0825 10.8153C9.09 10.8153 9.0975 10.8153 9.0975 10.8153C10.6125 10.7628 11.805 9.53275 11.8125 8.01025C11.8125 6.45775 10.5525 5.19775 9 5.19775Z"
                        fill={
                          activeTab === 'setting'
                            ? 'var(--Icon-Color)'
                            : 'var(--Subtext-Color)'
                        }
                      />
                    </svg>
                  ) : (
                    <Image
                      src="/images/profile.svg"
                      alt="profile.svg"
                      width={18}
                      height={18}
                    />
                  )}
                  <Typography>My Profile</Typography>
                  <Image
                    src="/images/arrow-down-right.svg"
                    alt="user"
                    width={16}
                    height={16}
                    style={{
                      filter:
                        theme !== 'dark'
                          ? 'unset'
                          : activeTab === 'setting'
                            ? 'brightness(0) invert(0)'
                            : 'brightness(0) invert(0.5)',
                    }}
                  />
                </Button>
                {!googleLogin && (
                  <Button
                    onClick={() => setActiveTab('password')}
                    className={` ${activeTab === 'password' ? styles.active : ''}`}
                  >
                    {theme === 'dark' ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.5 3H11.8125V2.0625C11.8125 1.755 11.5575 1.5 11.25 1.5C10.9425 1.5 10.6875 1.755 10.6875 2.0625V15.9375C10.6875 16.245 10.9425 16.5 11.25 16.5C11.5575 16.5 11.8125 16.245 11.8125 15.9375V15H13.5C15.1575 15 16.5 13.6575 16.5 12V6C16.5 4.3425 15.1575 3 13.5 3Z"
                          fill={
                            activeTab === 'password'
                              ? 'var(--Icon-Color)'
                              : 'var(--Subtext-Color)'
                          }
                        />
                        <path
                          d="M4.875 3C3.2175 3 1.875 4.3425 1.875 6V12C1.875 13.6575 3.2175 15 4.875 15H8.625C9.0375 15 9.375 14.6625 9.375 14.25V3.75C9.375 3.3375 9.0375 3 8.625 3H4.875ZM5.0025 9.285C4.965 9.375 4.9125 9.4575 4.845 9.5325C4.77 9.6 4.6875 9.6525 4.5975 9.69C4.5075 9.7275 4.41 9.75 4.3125 9.75C4.215 9.75 4.1175 9.7275 4.0275 9.69C3.9375 9.6525 3.855 9.6 3.78 9.5325C3.7125 9.4575 3.66 9.375 3.615 9.285C3.5775 9.195 3.5625 9.0975 3.5625 9C3.5625 8.805 3.645 8.61 3.78 8.4675C3.8175 8.4375 3.855 8.4075 3.8925 8.3775C3.9375 8.3475 3.9825 8.325 4.0275 8.31C4.0725 8.2875 4.1175 8.2725 4.1625 8.265C4.4175 8.2125 4.6725 8.295 4.845 8.4675C4.98 8.61 5.0625 8.805 5.0625 9C5.0625 9.0975 5.04 9.195 5.0025 9.285ZM7.6275 9.285C7.59 9.375 7.5375 9.4575 7.47 9.5325C7.395 9.6 7.3125 9.6525 7.2225 9.69C7.1325 9.7275 7.035 9.75 6.9375 9.75C6.84 9.75 6.7425 9.7275 6.6525 9.69C6.5625 9.6525 6.48 9.6 6.405 9.5325C6.2625 9.39 6.1875 9.2025 6.1875 9C6.1875 8.9025 6.21 8.805 6.2475 8.715C6.285 8.6175 6.3375 8.5425 6.405 8.4675C6.6825 8.19 7.185 8.19 7.47 8.4675C7.605 8.61 7.6875 8.805 7.6875 9C7.6875 9.0975 7.665 9.195 7.6275 9.285Z"
                          fill={
                            activeTab === 'password'
                              ? 'var(--Icon-Color)'
                              : 'var(--Subtext-Color)'
                          }
                        />
                      </svg>
                    ) : (
                      <Image
                        src="/images/password-change.svg"
                        alt="password-change.svg"
                        width={18}
                        height={18}
                      />
                    )}
                    <Typography>Change Password</Typography>
                    <Image
                      src="/images/arrow-down-right.svg"
                      alt="user"
                      width={16}
                      height={16}
                      style={{
                        filter:
                          theme !== 'dark'
                            ? 'unset'
                            : activeTab === 'password'
                              ? 'brightness(0) invert(0)'
                              : 'brightness(0) invert(0.5)',
                      }}
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
                  {theme === 'dark' ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.8025 3.9225C14.595 3.8025 13.3875 3.7125 12.1725 3.645V3.6375L12.0075 2.6625C11.895 1.9725 11.73 0.9375 9.975 0.9375H8.01C6.2625 0.9375 6.0975 1.9275 5.9775 2.655L5.82 3.615C5.1225 3.66 4.425 3.705 3.7275 3.7725L2.1975 3.9225C1.8825 3.9525 1.6575 4.23 1.6875 4.5375C1.7175 4.845 1.9875 5.07 2.3025 5.04L3.8325 4.89C7.7625 4.5 11.7225 4.65 15.6975 5.0475C15.72 5.0475 15.735 5.0475 15.7575 5.0475C16.0425 5.0475 16.29 4.83 16.32 4.5375C16.3425 4.23 16.1175 3.9525 15.8025 3.9225Z"
                        fill={
                          activeTab === 'delete'
                            ? 'var(--Red-Color)'
                            : 'var(--Subtext-Color)'
                        }
                      />
                      <path
                        d="M14.4226 6.105C14.2426 5.9175 13.9951 5.8125 13.7401 5.8125H4.26006C4.00506 5.8125 3.75006 5.9175 3.57756 6.105C3.40506 6.2925 3.30756 6.5475 3.32256 6.81L3.78756 14.505C3.87006 15.645 3.97506 17.07 6.59256 17.07H11.4076C14.0251 17.07 14.1301 15.6525 14.2126 14.505L14.6776 6.8175C14.6926 6.5475 14.5951 6.2925 14.4226 6.105ZM10.2451 13.3125H7.74756C7.44006 13.3125 7.18506 13.0575 7.18506 12.75C7.18506 12.4425 7.44006 12.1875 7.74756 12.1875H10.2451C10.5526 12.1875 10.8076 12.4425 10.8076 12.75C10.8076 13.0575 10.5526 13.3125 10.2451 13.3125ZM10.8751 10.3125H7.12506C6.81756 10.3125 6.56256 10.0575 6.56256 9.75C6.56256 9.4425 6.81756 9.1875 7.12506 9.1875H10.8751C11.1826 9.1875 11.4376 9.4425 11.4376 9.75C11.4376 10.0575 11.1826 10.3125 10.8751 10.3125Z"
                        fill={
                          activeTab === 'delete'
                            ? 'var(--Red-Color)'
                            : 'var(--Subtext-Color)'
                        }
                      />
                    </svg>
                  ) : (
                    <Image
                      src="/images/trash-white.svg"
                      alt="trash-white.svg"
                      width={18}
                      height={18}
                    />
                  )}
                  <Typography>Delete Account</Typography>
                  <Image
                    src="/images/arrow-down-right.svg"
                    alt="user"
                    width={16}
                    height={16}
                    style={{
                      filter:
                        theme !== 'dark'
                          ? 'unset'
                          : activeTab === 'delete'
                            ? 'brightness(0) invert(0)'
                            : 'brightness(0) invert(0.5)',
                    }}
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
