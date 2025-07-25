'use client';

import { useState } from 'react';
import PageHeader from '../Common/PageHeader';
import Sidebar from '../Common/Sidebar';
import styles from './style.module.scss';
import { useRouter } from 'next/navigation';
import { PinnedAnswerMessage } from '@/app/redux/slices/Chat/chatTypes';
import Image from 'next/image';
import {
  Box,
  Button,
  LinearProgress,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Field } from 'formik';
import theme from '@/app/theme';
import { useThemeMode } from '@/app/utils/ThemeContext';

const UploadDoc = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleThreadClick = (thread: string) => {
    router.push(`/ai-chats/${thread}`); // Navigate to thread page
  };

  const handlePinnedAnswerClick = (selectedMessage: PinnedAnswerMessage) => {
    if (selectedMessage.thread && selectedMessage.uuid) {
      router.push(
        `/ai-chats/${selectedMessage.thread.uuid}/?message=${selectedMessage.uuid}`
      );
    }
  };

  const { theme } = useThemeMode();

  return (
    <>
      <main className="chat-body">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          handleThreadClick={handleThreadClick}
          handlePinnedAnswerClick={handlePinnedAnswerClick}
          title="Upload Document"
        />
        <section className="main-body">
          <PageHeader
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            title="Upload Document"
            handleOpenSidebarFromLogIncident={() => setIsSidebarOpen(true)}
          />

          <div className={styles['upload-doc-main']}>
            <div className={styles['upload-doc-container']}>
              <div className={styles['upload-doc-head']}>
                <h2>Upload your documents</h2>
                <p>
                  Ex-Files AI will summarize and categorize files automatically.
                </p>
              </div>
              <div className={styles['upload-doc-img']}>
                <Image
                  src="/images/upload-doc-ic.svg"
                  alt="Upload Document"
                  width={93}
                  height={100}
                />
              </div>
              <div className={styles['upload-doc-btn']}>
                <p>Drag your documents here to upload or Click upload. </p>
                {/* <Button
                  variant="contained"
                  className={`${styles['btn-upload']} btn btn-primary`}
                >
                  Upload
                  <Image
                    src="/images/arrow-right-2.svg"
                    alt="arrow"
                    width={24}
                    height={24}
                  />
                </Button> */}
                <label className={`${styles['btn-upload']} btn btn-primary`}>
                  <input type="file" style={{ display: 'none' }} />
                  Upload
                  <Image
                    src="/images/arrow-right-2.svg"
                    alt="arrow"
                    width={24}
                    height={24}
                  />
                </label>
              </div>

              <p className={styles['upload-doc-note']}>
                You can upload upto 10 documents together.
              </p>

              <div className={styles['upload-file-list']}>
                <Image
                  src="/images/doc-file-1.svg"
                  alt="pdf"
                  width={28}
                  height={28}
                />
                <Image
                  src="/images/doc-file-2.svg"
                  alt="pdf"
                  width={28}
                  height={28}
                />
                <Image
                  src="/images/doc-file-3.svg"
                  alt="pdf"
                  width={28}
                  height={28}
                />
                <Image
                  src="/images/doc-file-4.svg"
                  alt="pdf"
                  width={28}
                  height={28}
                />
                <Image
                  src="/images/doc-file-5.svg"
                  alt="pdf"
                  width={28}
                  height={28}
                />
              </div>
              <div className={styles['upload-clipboard']}>
                <p>
                  Paste from Clipboard
                  <Image
                    src="/images/copy-light.svg"
                    alt="copy"
                    width={24}
                    height={24}
                  />
                </p>
              </div>
            </div>
          </div>

          <div
            className={styles['upload-files-main']}
            style={{ display: 'none' }}
          >
            <div className={styles['upload-files-list']}>
              <div className={styles['upload-files-card']}>
                <div className={styles['upload-files-left']}>
                  <span className={styles['upload-files-span']}>
                    <Image
                      src="/images/pdf.svg"
                      alt="pdf"
                      width={27}
                      height={33}
                    />
                  </span>
                  <div className={styles['upload-files-info']}>
                    <h4>Notice of Garnishment.doc</h4>
                    <p>125 kb</p>
                  </div>
                </div>
                <div className={styles['upload-files-right']}>
                  <div className={styles['upload-file-input']}>
                    <TextField
                      fullWidth
                      placeholder="Add Description of this file"
                      sx={{
                        margin: 0,
                        padding: 0,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: 'transparent !important',
                          '& .MuiOutlinedInput-input': {
                            fontSize: '16px',
                            color: 'var(--Primary-Text-Color)',
                            padding: '12px 8px',
                            fontWeight: 'var(--Regular)',
                            borderRadius: '12px',
                            background: 'var(--White-color)',
                            '&::placeholder': {
                              color: 'var(--Primary-Text-Color)',
                              fontWeight: 'var(--Lighter)',
                            },
                          },
                          '& fieldset': {
                            border: 'none',
                          },
                          '&:hover fieldset': {
                            border: 'none',
                          },
                          '&.Mui-focused fieldset': {
                            border: 'none',
                          },
                        },
                        '& .MuiFormHelperText-root': {
                          // optional styling for helper text
                        },
                      }}
                    />
                  </div>
                  <Link href="#" className={styles['upload-file-trash']}>
                    <Image
                      src="/images/trash.svg"
                      alt="pdf"
                      width={24}
                      height={24}
                    />
                  </Link>
                </div>
              </div>
              <div className={styles['upload-files-card']}>
                <div className={styles['upload-files-left']}>
                  <span className={styles['upload-files-span']}>
                    <Image
                      src="/images/doc.svg"
                      alt="doc"
                      width={27}
                      height={33}
                    />
                  </span>
                  <div className={styles['upload-files-info']}>
                    <h4>Notice of Garnishment.doc</h4>
                    <p>125 kb</p>
                  </div>
                </div>
                <div className={styles['upload-files-right']}>
                  <div className={styles['upload-file-input']}>
                    <Box component="div" className={styles.chatAlProgress}>
                      <LinearProgress variant="determinate" value={75} />
                    </Box>
                  </div>
                  <Link href="#" className={styles['upload-file-trash']}>
                    <Image
                      src="/images/trash.svg"
                      alt="pdf"
                      width={24}
                      height={24}
                    />
                  </Link>
                </div>
              </div>
              <div className={styles['upload-files-card']}>
                <div className={styles['upload-files-left']}>
                  <span className={styles['upload-files-span']}>
                    <Image
                      src="/images/txt.svg"
                      alt="txt"
                      width={27}
                      height={33}
                    />
                  </span>
                  <div className={styles['upload-files-info']}>
                    <h4>Notice of Garnishment.doc</h4>
                    <p>125 kb</p>
                  </div>
                </div>
                <div className={styles['upload-files-right']}>
                  <div className={styles['upload-file-input']}>
                    <div className={styles['upload-file-failed']}>
                      <Image
                        src="/images/up-fail.svg"
                        alt="pdf"
                        width={16}
                        height={16}
                      />
                      <div className={styles['upload-fail-text']}>
                        <p>Upload Failed</p>
                        <span>
                          You have surpassed AI Chat limit. Please upgrade to
                          continue using Exfiles AI
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href="#" className={styles['upload-file-trash']}>
                    <Image
                      src="/images/trash.svg"
                      alt="pdf"
                      width={24}
                      height={24}
                    />
                  </Link>
                </div>
              </div>
              <div className={styles['upload-files-card']}>
                <div className={styles['upload-files-left']}>
                  <span className={styles['upload-files-span']}>
                    <Image
                      src="/images/xls.svg"
                      alt="xls"
                      width={27}
                      height={33}
                    />
                  </span>
                  <div className={styles['upload-files-info']}>
                    <h4>Notice of Garnishment.doc</h4>
                    <p>125 kb</p>
                  </div>
                </div>
                <div className={styles['upload-files-right']}>
                  <div className={styles['upload-file-input']}>
                    <div className={styles['upload-file-failed']}>
                      <Image
                        src="/images/up-fail.svg"
                        alt="pdf"
                        width={16}
                        height={16}
                      />
                      <div className={styles['upload-fail-text']}>
                        <p>Upload Failed</p>
                        <span>
                          You have surpassed AI Chat limit. Please upgrade to
                          continue using Exfiles AI
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href="#" className={styles['upload-file-trash']}>
                    <Image
                      src="/images/close-icon.svg"
                      alt="pdf"
                      width={24}
                      height={24}
                      style={{
                        filter:
                          theme === 'dark'
                            ? 'brightness(0) invert(0)'
                            : 'invert(1)',
                      }}
                    />
                  </Link>
                </div>
              </div>
              <p className={styles['upload-file-add-more']}>
                <Image
                  src="/images/add-plus.svg"
                  alt="add-file"
                  width={20}
                  height={20}
                />
                Add More
              </p>
            </div>

            <div className={styles['upload-list-footer']}>
              <Button
                variant="contained"
                className={`${styles['btn-continue']} btn btn-primary `}
              >
                Continue
                <Image
                  src="/images/arrow-right-2.svg"
                  alt="arrow"
                  width={24}
                  height={24}
                />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default UploadDoc;
