import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import {
  extractFileNames,
  formatFileSizeLabel,
  formatTo12HourTimeManually,
  getDocumentImage,
} from '@/app/utils/functions';
import NameAvatar from './NameAvatar';
// import { RootState } from '@/app/redux/store';
// import { useSelector } from 'react-redux';
// import { DOCUMENT_STATUS } from '@/app/utils/constants';
import { ChatMessage, UploadedDocument } from '@store/slices/Chat/chatTypes';
import { LoginResponse } from '@store/slices/login';

export default function UploadFilesStatusMessage({
  messageObj,
  userDetails,
}: {
  messageObj: ChatMessage;
  userDetails: LoginResponse;
}) {
  const documementsList = messageObj.uploaded_documents;
  const fileList = extractFileNames(messageObj.message);

  return (
    <Box
      component="div"
      className={`${chatMessagesStyles.chatAl} ${chatMessagesStyles.chatAlUser}`}
    >
      <Box
        component="div"
        className={` ${chatMessagesStyles.chatUserProgress}`}
      >
        {messageObj.message && fileList?.length > 0 ? (
          <Box className={chatMessagesStyles.chatAlContent} component="div">
            <>
              <Box
                component="div"
                className={chatMessagesStyles.chatAlFilesWrapper}
              >
                {fileList.map((fileName) => (
                  <span
                    key={fileName}
                    className={chatMessagesStyles.chatAlFileChip}
                  >
                    {fileName}
                  </span>
                ))}
              </Box>
              <Typography
                variant="body1"
                className={chatMessagesStyles.chatAlMessageText}
              >
                {messageObj.message.split(']')?.[1]}
              </Typography>
            </>
          </Box>
        ) : (
          documementsList &&
          documementsList?.length > 0 &&
          documementsList.map(
            (documentItem: UploadedDocument, index: number) => {
              const { file_data } = documentItem;
              // const { file_data, trained_status, category_data } = documentItem;
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
                  {/* {trained_status === DOCUMENT_STATUS.SUCCESS &&
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
                  )} */}
                  {/* Failed Document */}
                  {/* {trained_status === DOCUMENT_STATUS.FAILED && (
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
                )} */}
                </Box>
              );
            }
          )
        )}

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
