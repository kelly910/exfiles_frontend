'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import PageHeader from '../Common/PageHeader';
import Sidebar from '../Common/Sidebar';
import styles from './style.module.scss';
import { useRouter } from 'next/navigation';
import { PinnedAnswerMessage } from '@/app/redux/slices/Chat/chatTypes';
import Image from 'next/image';
import { Button, CircularProgress, styled, useMediaQuery } from '@mui/material';
import { useChunkedFileUpload } from '../AI-Chat-Module/hooks/useChunkedFileUpload';
import { useSelector } from 'react-redux';
import { selectFetchedUser, setPageHeaderData } from '@/app/redux/slices/login';
import LimitOver from '../Limit-Over/LimitOver';
import { ALLOWED_FILE_TYPES } from '@/app/utils/constants';
import UploadedFiles from './UploadedFiles';
import {
  removeUploadFile,
  resetUploadedFiles,
  selectUserUploadedFiles,
  updateFileDescription,
} from '@/app/redux/slices/fileUpload';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { gtagEvent } from '@/app/utils/functions';
import { createNewThread, uploadActualDocs } from '@/app/redux/slices/Chat';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { showToast } from '@/app/shared/toast/ShowToast';
import { useThemeMode } from '@/app/utils/ThemeContext';
import PlanExpiredMG from '../Plan-Expired-MG/PlanExpiredMG';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadDoc = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fetchedUser = useSelector(selectFetchedUser);
  const [limitDialog, setLimitDialog] = useState(false);
  const [limitType, setLimitType] = useState('');
  const uploadedFiles = useAppSelector(selectUserUploadedFiles);
  const [isLoading, setIsLoading] = useState(false);
  const expiredStatus = fetchedUser?.active_subscription?.status;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    dispatch(
      setPageHeaderData({
        title: 'Upload Documents',
        subTitle: 'Upload your documents to get your answers and reports',
      })
    );
  }, [dispatch]);

  const handleOpenUserFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current?.click();
    }
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

  useEffect(() => {
    const handleResize = () => {
      //
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = useMediaQuery('(max-width:768px)');
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, []);

  const { handleFiles } = useChunkedFileUpload((limitExceededType: string) => {
    setLimitType(limitExceededType);
    if (!fetchedUser?.staff_user) {
      setLimitDialog(true);
    }
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLElement>
  ) => {
    if ('dataTransfer' in event) {
      handleFiles(event.dataTransfer.files);
    } else {
      handleFiles((event.target as HTMLInputElement).files);
    }
    const target = event.target as HTMLInputElement;
    target.value = '';
  };

  const handleDrop = async (event: React.DragEvent<HTMLElement>) => {
    if (
      fetchedUser?.active_subscription?.status !== 0 ||
      fetchedUser?.staff_user
    ) {
      event.preventDefault();
      handleFileChange(event);
    }
  };

  const handleFileDesc = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fileId: string
  ) => {
    dispatch(
      updateFileDescription({ fileId: fileId, docDesc: e.target.value })
    );
  };

  const uploadActualDocuments = async (
    threadUUID: string,
    payloadData: {
      temp_doc: number;
      description: string;
    }[]
  ) => {
    setIsLoading(true);
    const resultData = await dispatch(
      uploadActualDocs({
        thread_uuid: threadUUID,
        data: payloadData,
        // ...(userInputText && { user_message: userInputText }),
      })
    );
    gtagEvent({
      action: 'upload_document',
      category: 'File Upload',
      label: 'Document uploaded',
    });
    setIsLoading(false);

    if (uploadActualDocs.fulfilled.match(resultData)) {
      showToast(
        'success',
        resultData.payload?.messages[0] || 'Document uploaded successfully.'
      );
      router.push(`/ai-chats/${threadUUID}/`); // Navigate to thread page
      dispatch(resetUploadedFiles());
      return;
    }

    if (uploadActualDocs.rejected.match(resultData)) {
      handleError(resultData.payload as ErrorResponse);
      console.error('failed:', resultData.payload);
      return;
    }
  };

  const handleContinue = async () => {
    const payloadDocs = uploadedFiles
      .filter(({ uploadedFileId }) => typeof uploadedFileId === 'number')
      .map(({ uploadedFileId, docDesc }) => ({
        temp_doc: uploadedFileId as number,
        description: docDesc,
      }));

    if (payloadDocs.length === 0) return false;

    const resultData = await dispatch(createNewThread({}));

    if (createNewThread.rejected.match(resultData)) {
      showToast('error', 'Something went wrong. Please try again!');
      console.error('createNewThread failed:', resultData.payload);
      return;
    }
    const createdThreadID = resultData.payload?.uuid;
    if (!createdThreadID) return;

    // Upload documents
    uploadActualDocuments(createdThreadID, payloadDocs);
  };

  const removeFile = (fileNum: string) => {
    dispatch(removeUploadFile({ fileId: fileNum }));
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    if (
      fetchedUser?.active_subscription?.status !== 0 ||
      fetchedUser?.staff_user
    ) {
      const items = event.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            const isAllowed = ALLOWED_FILE_TYPES.some((ext) =>
              file.name.toLowerCase().endsWith(ext)
            );
            if (isAllowed) {
              files.push(file);
            } else {
              showToast('error', `File type not allowed: ${file.name}`);
            }
          }
        }
      }
      if (files.length > 0) {
        event.preventDefault();
        handleFiles(files);
        showToast('success', `${files.length} file(s) pasted successfully`);
      }
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
          {!uploadedFiles?.length ? (
            <div className={styles['upload-main']}>
              {expiredStatus === 0 && !fetchedUser?.staff_user && (
                <PlanExpiredMG />
              )}
              <div className={styles['upload-doc-child']}>
                <div
                  className={styles['upload-doc-container']}
                  onDrop={(e) => handleDrop(e)}
                  onPaste={handlePaste}
                  tabIndex={0}
                  onDragOver={(event) => event.preventDefault()}
                >
                  <div className={styles['upload-doc-head']}>
                    <h2>Upload your documents</h2>
                    <p>
                      Upload images, emails, or legal files. AI will tag and
                      summarize them for you.
                    </p>
                  </div>
                  <div className={styles['upload-doc-img']}>
                    {theme === 'dark' ? (
                      <Image
                        src="/images/upload-doc-light-1.svg"
                        alt="Upload Document"
                        width={93}
                        height={100}
                      />
                    ) : (
                      <Image
                        src="/images/upload-doc-dark-1.svg"
                        alt="Upload Document"
                        width={93}
                        height={100}
                      />
                    )}
                  </div>
                  <div className={styles['upload-doc-btn']}>
                    <p>Drag a file or click Upload.</p>
                    <label
                      className={
                        expiredStatus === 0 && !fetchedUser?.staff_user
                          ? `${styles['btn-upload']} btn btn-primary limitation`
                          : `${styles['btn-upload']} btn btn-primary`
                      }
                    >
                      <VisuallyHiddenInput
                        id="chat-file-uploads"
                        type="file"
                        name="file-uploads"
                        accept={ALLOWED_FILE_TYPES.join(',')}
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={
                          expiredStatus === 0 && !fetchedUser?.staff_user
                        }
                      />
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
                    <p>Paste from Clipboard</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <VisuallyHiddenInput
              id="chat-file-uploads"
              type="file"
              name="file-uploads"
              accept={ALLOWED_FILE_TYPES.join(',')}
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          )}
          {uploadedFiles && uploadedFiles?.length > 0 && (
            <div className={styles['upload-files-main']}>
              <div className={styles['upload-files-list']}>
                {uploadedFiles.map((upload, index) => (
                  <UploadedFiles
                    isShowDescField={true}
                    key={index}
                    fileName={upload.file.name}
                    fileId={upload.fileId}
                    fileSize={upload.file.size}
                    progress={upload.progress}
                    isUploading={upload.isUploading}
                    hasUploaded={upload.hasUploaded}
                    fileErrorMsg={upload.fileErrorMsg}
                    fileDesc={upload.docDesc}
                    hasError={upload.hasError}
                    onRemove={() => removeFile(upload.fileId)}
                    handleFileDesc={handleFileDesc}
                  />
                ))}

                <Button
                  className={styles['upload-file-add-more']}
                  onClick={handleOpenUserFileInput}
                  disabled={isLoading}
                >
                  <Image
                    src="/images/add-plus.svg"
                    alt="add-file"
                    width={20}
                    height={20}
                  />
                  Add More
                </Button>
              </div>

              <div className={styles['upload-list-footer']}>
                <Button
                  variant="contained"
                  className={`${styles['btn-continue']} btn btn-primary `}
                  onClick={() => handleContinue()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress
                      size={20}
                      style={{ color: 'var(--Txt-On-Gradient)' }}
                    />
                  ) : (
                    <>
                      Continue
                      <Image
                        src="/images/arrow-right-2.svg"
                        alt="arrow"
                        width={24}
                        height={24}
                      />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>
      <LimitOver
        open={limitDialog}
        onClose={() => setLimitDialog(false)}
        title={
          limitType === 'ai-summaries'
            ? 'Your Document Summaries Limit is Over so you cannot upload new document.'
            : limitType === 'storage'
              ? 'Your Storage Limit is Over'
              : 'Your Document Summaries Limit is Over so you cannot upload new document.'
        }
        subtitle={
          limitType === 'ai-summaries'
            ? 'Summary'
            : limitType === 'storage'
              ? 'Storage'
              : 'Summary'
        }
        stats={
          limitType === 'ai-summaries'
            ? fetchedUser?.summary_used
            : limitType === 'storage'
              ? fetchedUser?.storage
              : fetchedUser?.summary_used
        }
      />
    </>
  );
};

export default UploadDoc;
