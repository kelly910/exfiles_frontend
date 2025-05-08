import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import chatMessagesStyles from '@components/AI-Chat/styles/ChatMessagesStyle.module.scss';
import { ChatMessage, UploadedDocument } from '@store/slices/Chat/chatTypes';
import { formatTo12HourTimeManually } from '@/app/utils/functions';
import {
  DOCUMENT_STATUS,
  processText,
  QUESTION_TYPES,
} from '@/app/utils/constants';
import { SocketPayload } from '../../types/aiChat.types';
import { getDocumentImage } from '@/app/utils/functions';
import { useState } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { showToast } from '@/app/shared/toast/ShowToast';
import {
  failedDocRetrain,
  setUpdateMessageList,
} from '@/app/redux/slices/Chat';
import { ErrorResponse, handleError } from '@/app/utils/handleError';

const FileSummarySkeleton = () => {
  return (
    <>
      {/* Category Block Skeleton */}
      <Box component="div" className={chatMessagesStyles.chatAlFileSummary}>
        <Skeleton
          variant="circular"
          width={14}
          height={14}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
        />
        <Skeleton
          variant="text"
          width={120}
          height={20}
          sx={{
            mx: 1,
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
          }}
        />
        <Skeleton
          variant="circular"
          width={12}
          height={12}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
        />
      </Box>
      {/* Summary Block Skeleton */}
      <Box component="div" className={chatMessagesStyles.chatAlFileSummary}>
        <Skeleton
          variant="text"
          width={100}
          height={20}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
        />
        <Skeleton
          variant="circular"
          width={12}
          height={12}
          sx={{ ml: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }}
        />
      </Box>
    </>
  );
};

export default function ShowGeneratedSummariesDocs({
  handleDocCategoryClick,
  handleDocSummaryClick,
  handleGenerateCombinedSummary,
  messageObj,
}: {
  handleDocCategoryClick: (docObj: UploadedDocument) => void;
  handleDocSummaryClick: (docObj: UploadedDocument) => void;
  handleGenerateCombinedSummary: (questionPayload: SocketPayload) => void;
  messageObj: ChatMessage;
}) {
  const summaryGeneratedDocList = messageObj.summary_documents;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleRetryDoc = async (docObj: UploadedDocument) => {
    setIsLoading(true);

    const payload = {
      document_uuid: docObj.uuid,
    };
    const resultData = await dispatch(failedDocRetrain(payload));

    if (failedDocRetrain.fulfilled.match(resultData)) {
      setIsLoading(false);

      dispatch(
        setUpdateMessageList({
          ...messageObj,
          summary_documents: messageObj.summary_documents?.map((item) =>
            item.uuid == docObj.uuid
              ? { ...item, trained_status: 'pending' }
              : item
          ),
        })
      );

      showToast(
        'success',
        resultData.payload.messages[0] || 'Answer message successfully updated'
      );
    }

    if (failedDocRetrain.rejected.match(resultData)) {
      setIsLoading(false);

      handleError(resultData.payload as ErrorResponse);
    }
  };

  return (
    <Box component="div" className={chatMessagesStyles.chatAl}>
      <Box component="div" className={chatMessagesStyles.chatAlImg}>
        <IconButton sx={{ p: 0 }}>
          <Image
            alt="Logo"
            width={40}
            height={40}
            src="/images/close-sidebar-logo.svg"
          />
        </IconButton>
      </Box>
      <Box component="div" className={chatMessagesStyles.chatAlContent}>
        {summaryGeneratedDocList && summaryGeneratedDocList?.length !== 1 && (
          <Typography
            variant="body1"
            className={chatMessagesStyles.chatAlContentText}
            dangerouslySetInnerHTML={{
              __html:
                processText(messageObj.message) ||
                'Your summaries are ready! Click below to view them',
            }}
          />
        )}
        <Grid
          container
          spacing={1.5}
          justifyContent="start"
          alignItems="stretch"
          // max-width="100%"
          padding="2px 12px 8px 12px"
          sx={{ background: 'var(--Card-Color)' }}
        >
          {summaryGeneratedDocList &&
            summaryGeneratedDocList?.length > 0 &&
            summaryGeneratedDocList.map((documentItem: UploadedDocument) => {
              const {
                file_data,
                trained_status,
                category_data,
                uuid,
                summary,
              } = documentItem;
              return (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  xl={4}
                  className={chatMessagesStyles.chatAlFile}
                  key={uuid}
                >
                  <Box
                    component="div"
                    className={chatMessagesStyles.chatAlFileInner}
                  >
                    <Box
                      component="div"
                      className={chatMessagesStyles.chatAlFileHeader}
                    >
                      <Box
                        component="div"
                        className={chatMessagesStyles.chatAlFileIcon}
                      >
                        <Image
                          src={getDocumentImage(file_data?.file_extension)}
                          alt="pdf"
                          width={13}
                          height={16}
                          className={chatMessagesStyles.pdfImg}
                        />
                      </Box>
                      <Typography
                        variant="body1"
                        className={chatMessagesStyles.chatAlText}
                      >
                        {file_data.file_name}{' '}
                      </Typography>
                    </Box>

                    <Box>
                      {trained_status === DOCUMENT_STATUS.FAILED && (
                        <Box
                          component="div"
                          className={chatMessagesStyles.chatAlFileSummary}
                        >
                          <Box
                            component="div"
                            className={chatMessagesStyles.chatAlUploadFailed}
                          >
                            <Image
                              src="/images/error.svg"
                              alt="error"
                              width={14}
                              height={14}
                            />
                          </Box>
                          <Box
                            component="div"
                            className={chatMessagesStyles.chatAlUploadFailed}
                          >
                            <Typography
                              variant="body1"
                              className={chatMessagesStyles.chatAlText}
                            >
                              Error in training while processing this document
                            </Typography>
                            <Button
                              className={chatMessagesStyles.charAlRetryButton}
                              onClick={() => handleRetryDoc(documentItem)}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <CircularProgress
                                  size={18}
                                  sx={{ color: '#fff' }}
                                />
                              ) : (
                                <>
                                  <Image
                                    src="/images/retry.svg"
                                    alt="retry.svg"
                                    width={10}
                                    height={10}
                                  />
                                  Retry
                                </>
                              )}
                            </Button>
                          </Box>
                        </Box>
                      )}
                      {trained_status === DOCUMENT_STATUS.PENDING && (
                        <FileSummarySkeleton />
                      )}
                      {trained_status === DOCUMENT_STATUS.SUCCESS &&
                        category_data && (
                          <Box
                            component="div"
                            className={chatMessagesStyles.chatAlFileSummary}
                            onClick={() => handleDocCategoryClick(documentItem)}
                          >
                            <Image
                              src="/images/folder.svg"
                              alt="pdf"
                              width={14}
                              height={14}
                              className={chatMessagesStyles.pdfImg}
                            />
                            <Typography>{category_data.name}</Typography>
                            <Image
                              src="/images/open-new.svg"
                              alt="pdf"
                              width={12}
                              height={12}
                              className={chatMessagesStyles.pdfImg}
                            />
                          </Box>
                        )}
                      {trained_status === DOCUMENT_STATUS.SUCCESS &&
                        !summary && (
                          <Box
                            component="div"
                            className={chatMessagesStyles.chatAlFileSummary}
                            onClick={() => handleDocSummaryClick(documentItem)}
                          >
                            <Typography>View Summary</Typography>
                            <Image
                              src="/images/open-new.svg"
                              alt="pdf"
                              width={12}
                              height={12}
                              className={chatMessagesStyles.pdfImg}
                            />
                          </Box>
                        )}
                    </Box>
                  </Box>
                </Grid>
              );
            })}
        </Grid>

        {summaryGeneratedDocList &&
          summaryGeneratedDocList?.length == 1 &&
          summaryGeneratedDocList[0]?.summary && (
            <Typography
              variant="body1"
              className={chatMessagesStyles.chatAlContentText}
            >
              {summaryGeneratedDocList[0].summary && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: processText(summaryGeneratedDocList[0].summary),
                  }}
                />
              )}
            </Typography>
          )}

        {messageObj.all_doc_summarized &&
          summaryGeneratedDocList &&
          summaryGeneratedDocList?.length > 1 && (
            <Box className={chatMessagesStyles.chatAlSummaryButtonMain}>
              <Button
                className={chatMessagesStyles.chatAlSummaryButton}
                onClick={() =>
                  handleGenerateCombinedSummary({
                    thread_uuid: '',
                    message_type: QUESTION_TYPES.COMBINED_SUMMARY,
                    chat_msg_uuid: messageObj.uuid,
                    message: 'Generating combined summary',
                  })
                }
              >
                <Image
                  src="/images/combined.svg"
                  alt="combined"
                  width={18}
                  height={18}
                />
                Generate Combined Summary
              </Button>
            </Box>
          )}
        <span className={chatMessagesStyles.chatTime}>
          {formatTo12HourTimeManually(messageObj.created)}
        </span>
        {/* <Box component="div" className={chatMessagesStyles.chatAlIcon}>
          <Button>
            <Image
              src="/images/chat-like.svg"
              alt="Reply"
              width={18}
              height={18}
            />
          </Button>
          <Button>
            <Image
              src="/images/chat-dlike.svg"
              alt="Reply"
              width={18}
              height={18}
            />
          </Button>
        </Box> */}
      </Box>
    </Box>
  );
}
