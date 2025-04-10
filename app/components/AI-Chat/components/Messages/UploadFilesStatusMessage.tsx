/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';
import { Avatar, Box, Button, LinearProgress, Typography } from '@mui/material';
import Image from 'next/image';
import {
  formatFileSizeLabel,
  formatTo12HourTimeManually,
  getDocumentImage,
} from '@/app/utils/functions';
import NameAvatar from './NameAvatar';
import { RootState } from '@/app/redux/store';
import { useSelector } from 'react-redux';
import { DOCUMENT_STATUS } from '@/app/utils/constants';

export default function UploadFilesStatusMessage({
  messageObj,
  userDetails,
}: {
  messageObj: any;
  userDetails: any;
}) {
  const [progress, setProgress] = useState(0);
  const documementsList = messageObj.uploaded_documents;

  return (
    <Box
      component="div"
      className={`${chatMessagesStyles.chatAl} ${chatMessagesStyles.chatAlUser}`}
    >
      <Box
        component="div"
        className={` ${chatMessagesStyles.chatUserProgress}`}
      >
        {documementsList &&
          documementsList?.length > 0 &&
          documementsList.map((documentItem: any, index: number) => {
            const { file_data, trained_status, category_data } = documentItem;
            return (
              <Box
                key={index}
                component="div"
                className={chatMessagesStyles.chatAlContent}
              >
                <div className={chatMessagesStyles.fileBox}>
                  <span className={chatMessagesStyles.fileIcon}>
                    <Image
                      src={getDocumentImage(file_data.file_extension)}
                      alt="file-extension-img"
                      width={14}
                      height={16}
                      className={chatMessagesStyles.pdfImg}
                    />
                  </span>
                  <Typography
                    variant="body1"
                    className={chatMessagesStyles.fileTitle}
                  >
                    {file_data.file_name}
                    <span>{formatFileSizeLabel(file_data.file_size)}</span>
                  </Typography>
                </div>

                {/*<Box
                  component="div"
                  className={chatMessagesStyles.chatAlProgress}
                >
                  <LinearProgress />
                </Box>*/}

                {/* Assigning Category 
                {trained_status === DOCUMENT_STATUS.PENDING && (
                  <Box
                    component="div"
                    className={chatMessagesStyles.chatAlCategory}
                  >
                    <Image
                      src="/images/category.svg"
                      alt="category"
                      width={14}
                      height={14}
                    />
                    <Typography
                      variant="body1"
                      className={chatMessagesStyles.chatAlText}
                    >
                      Assigning Category
                    </Typography>
                  </Box>
                )}*/}
                {/* With Category */}
                {trained_status === DOCUMENT_STATUS.SUCCESS &&
                  category_data && (
                    <Box
                      component="div"
                      className={chatMessagesStyles.chatAlFolder}
                    >
                      <Image
                        src="/images/folder.svg"
                        alt="category"
                        width={14}
                        height={14}
                      />
                      <Typography
                        variant="body1"
                        className={chatMessagesStyles.chatAlText}
                      >
                        {category_data.name}
                      </Typography>
                      <Image
                        src="/images/open-new.svg"
                        alt="open-new.svg"
                        width={14}
                        height={14}
                      />
                    </Box>
                  )}
                {/* Failed Document */}
                {trained_status === DOCUMENT_STATUS.FAILED && (
                  <Box
                    component="div"
                    className={chatMessagesStyles.chatAlUploadFailed}
                  >
                    <Image
                      src="/images/upload-failed.svg"
                      alt="category"
                      width={14}
                      height={14}
                    />
                    <Typography
                      variant="body1"
                      className={chatMessagesStyles.chatAlText}
                    >
                      Upload Failed
                    </Typography>
                    <Button className={chatMessagesStyles.charAlRetryButton}>
                      <Image
                        src="/images/retry.svg"
                        alt="retry.svg"
                        width={10}
                        height={10}
                      />
                      Retry
                    </Button>
                  </Box>
                )}
              </Box>
            );
          })}

        <span className={chatMessagesStyles.chatTime}>
          {formatTo12HourTimeManually(messageObj.created)}
        </span>
      </Box>
      <Box component="div" className={chatMessagesStyles.chatAlImg}>
        <NameAvatar
          fullName={`${userDetails?.data?.first_name} ${userDetails?.data?.last_name}`}
        />
      </Box>
    </Box>
  );
}
