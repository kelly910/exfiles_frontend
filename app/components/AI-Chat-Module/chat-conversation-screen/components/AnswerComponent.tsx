import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material';
import chatMessagesStyles from '@components/AI-Chat-Module/styles/ChatMessagesStyle.module.scss';
import {
  ChatMessage,
  ThumbReaction,
  UploadedDocument,
} from '@store/slices/Chat/chatTypes';
import {
  formatTo12HourTimeManually,
  getDocumentImage,
} from '@/app/utils/functions';
import {
  highlightText,
  processText,
  QUESTION_TYPES,
} from '@/app/utils/constants';
import { showToast } from '@/app/shared/toast/ShowToast';
// import striptags from 'striptags';
import {
  fetchPinnedMessagesList,
  saveUserAnswerReaction,
  setUpdateMessageList,
  togglePinMessages,
} from '@/app/redux/slices/Chat';
import { useAppDispatch } from '@/app/redux/hooks';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { useState } from 'react';
import { useSearch } from '../../context/SearchContext';
import { selectFetchedUser } from '@/app/redux/slices/login';
import { useSelector } from 'react-redux';
import { useThemeMode } from '@/app/utils/ThemeContext';
import LimitOver from '@/app/components/Limit-Over/LimitOver';
import { SocketPayload } from '@components/AI-Chat-Module/types/aiChat.types';

const DynamicEditCombineSummaryModal = dynamic(
  () => import('@/app/components/AI-Chat-Module/modals/EditCombinedSummaryAns')
);

export default function AnswerComponent({
  messageObj,
  handleGenerateCombinedSummary,
}: {
  messageObj: ChatMessage;
  handleGenerateCombinedSummary: (questionPayload: SocketPayload) => void;
}) {
  const dispatch = useAppDispatch();
  const [limitDialog, setLimitDialog] = useState(false);

  const [isOpenEditSummary, setIsOpenEditSummary] = useState(false);
  const { searchingChat } = useSearch();

  const fetchedUser = useSelector(selectFetchedUser);
  const expiredStatus = fetchedUser?.active_subscription?.status;

  const summaryUsedCheck =
    fetchedUser?.summary_used?.split('/')[0] ===
      fetchedUser?.summary_used?.split('/')[1] &&
    fetchedUser?.summary_grace_point_used === true;
  // Copy Message
  const handleCopyThread = async (messageObj: ChatMessage) => {
    let targetData;
    if (messageObj.combined_summary_data) {
      targetData = processText(messageObj.combined_summary_data.summary);
    } else {
      targetData = processText(messageObj.message);
    }

    const cleanHtml = targetData
      .replace(/<br\s*\/?>/gi, '<br>')
      .replace(/<(i|em)[^>]*>([\s\S]*?)<\/\1>/gi, '<em>$2</em>')
      .replace(
        /<li[^>]*>\s*<b>(.*?)<\/b>:(.*?)<\/li>/gi,
        '<li><strong>$1</strong>:$2</li>'
      )
      .replace(
        /<li[^>]*>\s*<strong>(.*?)<\/strong>:(.*?)<\/li>/gi,
        '<li><strong>$1</strong>:$2</li>'
      )
      .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, '<h$1>$2</h$1>')
      .replace(/<\/?(ul|ol)[^>]*>/gi, (tag) => tag.toLowerCase())
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '<p>$1</p>')
      .trim();

    const plainText = cleanHtml
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&');

    try {
      const clipboardItem = new ClipboardItem({
        'text/plain': new Blob([plainText], { type: 'text/plain' }),
        'text/html': new Blob([cleanHtml], { type: 'text/html' }),
      });

      await navigator.clipboard.write([clipboardItem]);
      showToast('success', 'Message copied successfully!');
    } catch (err) {
      console.warn(err);
      showToast('error', 'Failed to copy content');
    }
  };

  // const handleCopyThread = async (messageObj: ChatMessage) => {
  //   let targetData;
  //   if (messageObj.combined_summary_data) {
  //     targetData = processText(messageObj.combined_summary_data.summary);
  //   } else {
  //     targetData = processText(messageObj.message);
  //   }

  //   try {
  //     await navigator.clipboard.writeText(striptags(targetData));
  //     showToast('success', 'Message copied successfully!');
  //   } catch (err) {
  //     console.warn(err);
  //     showToast('error', 'Failed to copy content');
  //   }
  // };

  const getPinnedMessagesList = async (page = 1) => {
    const resultData = await dispatch(
      fetchPinnedMessagesList({
        page,
      })
    );

    if (fetchPinnedMessagesList.fulfilled.match(resultData)) {
      // seIsFetching(false);
    }

    if (fetchPinnedMessagesList.rejected.match(resultData)) {
      // handleError(error as ErrorResponse);
    }
  };

  const togglePinMessage = async (messageObj: ChatMessage) => {
    const payload = {
      message_uuid: messageObj.uuid,
    };
    const resultData = await dispatch(togglePinMessages(payload));

    if (togglePinMessages.fulfilled.match(resultData)) {
      // Need to udpate the Left Sidebar Pinned Chats List
      dispatch(
        setUpdateMessageList({
          ...messageObj,
          is_pinned: !messageObj.is_pinned,
        })
      );
      getPinnedMessagesList(1);
      showToast(
        'success',
        resultData.payload.messages[0] || 'Answer message successfully updated'
      );
    }

    if (togglePinMessages.rejected.match(resultData)) {
      handleError(resultData.payload as ErrorResponse);
    }
  };

  const handleAnswerReaction = async (
    messageObj: ChatMessage,
    slug: ThumbReaction
  ) => {
    if (!messageObj?.thumb_reaction || messageObj?.thumb_reaction !== slug) {
      const payload = {
        message_uuid: messageObj.uuid,
        thumb_reaction: slug,
      };
      const resultData = await dispatch(saveUserAnswerReaction(payload));

      if (saveUserAnswerReaction.fulfilled.match(resultData)) {
        dispatch(
          setUpdateMessageList({
            ...messageObj,
            thumb_reaction: slug,
          })
        );
        showToast(
          'success',
          resultData.payload.messages[0] ||
            'Answer message successfully updated'
        );
      }

      if (saveUserAnswerReaction.rejected.match(resultData)) {
        handleError(resultData.payload as ErrorResponse);
      }
    }
  };

  const handleClickOpenEditSummary = () => {
    setIsOpenEditSummary(true);
  };

  const handleCloseEditSummary = () => {
    setIsOpenEditSummary(false);
  };

  const { theme } = useThemeMode();

  return (
    <>
      <Box component="div" className={chatMessagesStyles.chatAl}>
        <Box component="div" className={chatMessagesStyles.chatAlImg}>
          <IconButton sx={{ p: 0 }}>
            <Image
              alt="Logo"
              width={40}
              height={40}
              src="/images/close-sidebar-logo.svg"
              style={{
                filter: theme === 'dark' ? 'brightness(0) invert(0)' : '',
              }}
            />
          </IconButton>
        </Box>
        <Box component="div" className={chatMessagesStyles.chatAlContent}>
          {(messageObj.message == 'Generating combined summary' ||
            messageObj.message == 'Generating summaries for documents') &&
          !messageObj.combined_summary_data ? (
            <>
              <Typography
                variant="body1"
                className={chatMessagesStyles.chatAlContentText}
              >
                Hold on a second...
              </Typography>
              <Box
                component="div"
                className={chatMessagesStyles.chatAlCategory}
              >
                <Box
                  component="div"
                  className={`${chatMessagesStyles.chatAlCategoryInner} ${chatMessagesStyles.bgAnimation}`}
                >
                  <Image
                    src="/gif/infinite-loader.gif"
                    alt="loading-gif"
                    width={18}
                    height={18}
                    unoptimized
                    style={{ scale: 3 }}
                  />
                  <Typography
                    variant="body1"
                    className={chatMessagesStyles.chatAlText}
                    dangerouslySetInnerHTML={{
                      __html:
                        processText(messageObj.message) ||
                        'Generating Summary Links',
                    }}
                  ></Typography>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Typography
                variant="body1"
                className={chatMessagesStyles.chatAlContentText}
              >
                {messageObj.combined_summary_data ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: processText(
                        highlightText(
                          messageObj.combined_summary_data.summary,
                          searchingChat
                        )
                      ),
                    }}
                  />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: processText(
                        highlightText(messageObj.message, searchingChat)
                      ),
                    }}
                  />
                )}
              </Typography>

              {messageObj.uploaded_documents &&
                messageObj.uploaded_documents.length > 1 && (
                  <Grid
                    container
                    spacing={1.5}
                    justifyContent="start"
                    alignItems="stretch"
                    // max-width="100%"
                    padding="2px 12px 8px 12px"
                    sx={{ background: 'var(--Card-Color)' }}
                  >
                    {messageObj.uploaded_documents &&
                      messageObj.uploaded_documents?.length > 0 &&
                      messageObj.uploaded_documents.map(
                        (documentItem: UploadedDocument) => {
                          const {
                            file_data,
                            uuid,
                            // summary,
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
                                  className={
                                    chatMessagesStyles.chatAlFileHeader
                                  }
                                >
                                  <Box
                                    component="div"
                                    className={
                                      chatMessagesStyles.chatAlFileIcon
                                    }
                                  >
                                    <Image
                                      src={getDocumentImage(
                                        file_data?.file_extension
                                      )}
                                      alt="pdf"
                                      width={13}
                                      height={16}
                                      className={chatMessagesStyles.pdfImg}
                                    />
                                  </Box>
                                  <Typography
                                    variant="body1"
                                    className={chatMessagesStyles.chatAlText}
                                    dangerouslySetInnerHTML={{
                                      __html: highlightText(
                                        file_data.file_name,
                                        searchingChat
                                      ),
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Grid>
                          );
                        }
                      )}
                  </Grid>
                )}

              {messageObj.uploaded_documents &&
                messageObj.uploaded_documents?.length > 1 && (
                  <Box className={chatMessagesStyles.chatAlSummaryButtonMain}>
                    {messageObj.all_doc_summarized ? (
                      <Button
                        disabled={
                          expiredStatus === 0 && !fetchedUser?.staff_user
                        }
                        className={`${chatMessagesStyles.chatAlSummaryButton} ${expiredStatus === 0 && !fetchedUser?.staff_user ? 'limitation' : ''}`}
                        onClick={() => {
                          if (summaryUsedCheck && !fetchedUser?.staff_user) {
                            setLimitDialog(true);
                          } else {
                            handleGenerateCombinedSummary({
                              thread_uuid: '',
                              message_type: QUESTION_TYPES.COMBINED_SUMMARY,
                              chat_msg_uuid: messageObj.uuid,
                              message: 'Generating combined summary',
                            });
                          }
                        }}
                      >
                        <Image
                          src="/images/combined.svg"
                          alt="combined"
                          width={18}
                          height={18}
                        />
                        Generate Combined Summary
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className={`${chatMessagesStyles.chatAlSummaryButton} limitation`}
                        style={{
                          minWidth: 200,
                          minHeight: 40,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <Skeleton variant="circular" width={18} height={18} />
                        <Box
                          component="div"
                          className={chatMessagesStyles.chatAlFileSummary}
                        >
                          <Skeleton
                            variant="text"
                            width={200}
                            height={20}
                            sx={{
                              bgcolor:
                                theme !== 'dark'
                                  ? 'rgb(255, 255, 255)'
                                  : 'rgba(0, 0, 0, 0.05)',
                            }}
                          />
                        </Box>
                      </Button>
                    )}
                  </Box>
                )}
            </>
          )}
          <span className={chatMessagesStyles.chatTime}>
            {formatTo12HourTimeManually(messageObj.created)}
          </span>
          <Box component="div" className={chatMessagesStyles.chatAlIcon}>
            <Button
              disabled={expiredStatus === 0 && !fetchedUser?.staff_user}
              className={
                expiredStatus === 0 && !fetchedUser?.staff_user
                  ? 'limitation-icon'
                  : ''
              }
            >
              {/* Like */}
              <svg
                className={
                  messageObj.thumb_reaction == 'thumbs_up'
                    ? chatMessagesStyles.active
                    : ''
                }
                onClick={() => handleAnswerReaction(messageObj, 'thumbs_up')}
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
              >
                <path d="M4.89429 10.7859V4.85925C4.89429 4.62592 4.96429 4.39842 5.09262 4.20592L6.68512 1.83759C6.93595 1.45842 7.56012 1.19009 8.09095 1.38842C8.66262 1.58092 9.04179 2.22259 8.91929 2.79425L8.61595 4.70175C8.59262 4.87675 8.63929 5.03425 8.73845 5.15675C8.83762 5.26759 8.98345 5.33759 9.14095 5.33759H11.5385C11.9993 5.33759 12.396 5.52425 12.6293 5.85092C12.851 6.16592 12.8918 6.57425 12.746 6.98842L11.311 11.3576C11.1301 12.0809 10.3426 12.6701 9.56095 12.6701H7.28595C6.89512 12.6701 6.34679 12.5359 6.09595 12.2851L5.34929 11.7076C5.06345 11.4918 4.89429 11.1476 4.89429 10.7859Z" />
                <path d="M3.03925 3.72168H2.43841C1.53425 3.72168 1.16675 4.07168 1.16675 4.93501V10.8033C1.16675 11.6667 1.53425 12.0167 2.43841 12.0167H3.03925C3.94341 12.0167 4.31091 11.6667 4.31091 10.8033V4.93501C4.31091 4.07168 3.94341 3.72168 3.03925 3.72168Z" />
              </svg>
            </Button>
            <Button
              disabled={expiredStatus === 0 && !fetchedUser?.staff_user}
              className={
                expiredStatus === 0 && !fetchedUser?.staff_user
                  ? 'limitation-icon'
                  : ''
              }
            >
              {/* dislike */}
              <svg
                className={
                  messageObj.thumb_reaction == 'thumbs_down'
                    ? chatMessagesStyles.active
                    : ''
                }
                onClick={() => handleAnswerReaction(messageObj, 'thumbs_down')}
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
              >
                <path d="M9.10571 3.21408V9.14075C9.10571 9.37408 9.03571 9.60158 8.90738 9.79408L7.31488 12.1624C7.06405 12.5416 6.43988 12.8099 5.90905 12.6116C5.33738 12.4191 4.95821 11.7774 5.08071 11.2057L5.38405 9.29825C5.40738 9.12325 5.36071 8.96575 5.26155 8.84325C5.16238 8.73241 5.01655 8.66241 4.85905 8.66241H2.46155C2.00071 8.66241 1.60405 8.47575 1.37071 8.14908C1.14905 7.83408 1.10821 7.42575 1.25405 7.01158L2.68905 2.64241C2.86988 1.91908 3.65738 1.32991 4.43905 1.32991H6.71405C7.10488 1.32991 7.65321 1.46408 7.90405 1.71491L8.65071 2.29241C8.93655 2.50825 9.10571 2.85241 9.10571 3.21408Z" />
                <path d="M10.9608 10.2783H11.5616C12.4658 10.2783 12.8333 9.92832 12.8333 9.06499V3.19665C12.8333 2.33332 12.4658 1.98332 11.5616 1.98332H10.9608C10.0566 1.98332 9.68909 2.33332 9.68909 3.19665V9.06499C9.68909 9.92832 10.0566 10.2783 10.9608 10.2783Z" />
              </svg>
            </Button>
            <Button
              onClick={() => handleCopyThread(messageObj)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <Image
                src="/images/chat-copy.svg"
                alt="Reply"
                width={18}
                height={18}
              />
            </Button>
            {messageObj.combined_summary_data &&
              messageObj.combined_summary_data.summary && (
                <Button
                  onClick={handleClickOpenEditSummary}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                  disabled={expiredStatus === 0 && !fetchedUser?.staff_user}
                  className={
                    expiredStatus === 0 && !fetchedUser?.staff_user
                      ? 'limitation-icon'
                      : ''
                  }
                >
                  <Image
                    src="/images/chat-edit.svg"
                    alt="edit-combine-chat-icon"
                    width={18}
                    height={18}
                  />
                </Button>
              )}
            <Button
              onClick={() => togglePinMessage(messageObj)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              disabled={expiredStatus === 0 && !fetchedUser?.staff_user}
              className={
                expiredStatus === 0 && !fetchedUser?.staff_user
                  ? 'limitation-icon'
                  : ''
              }
            >
              {/* pin */}
              <svg
                className={`${chatMessagesStyles.pin} ${messageObj.is_pinned ? chatMessagesStyles.active : ''} `}
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
              >
                <path d="M2.94243 6.44208L5.2501 8.74975L7.55777 11.0574C7.62521 11.1248 7.70813 11.1746 7.79927 11.2025C7.89042 11.2304 7.98701 11.2355 8.0806 11.2174C8.17419 11.1994 8.26193 11.1586 8.33614 11.0988C8.41034 11.039 8.46875 10.9619 8.50626 10.8743L9.82168 7.80533C9.85185 7.73486 9.8956 7.67103 9.95045 7.61748C10.0053 7.56393 10.0702 7.52172 10.1413 7.49325L12.0121 6.74483C12.1017 6.70898 12.181 6.65147 12.2428 6.57745C12.3047 6.50342 12.3473 6.41521 12.3667 6.3207C12.3861 6.22619 12.3818 6.12833 12.3541 6.03591C12.3265 5.94348 12.2763 5.85936 12.2081 5.79109L8.20876 1.79175C8.14049 1.72357 8.05637 1.6734 7.96394 1.64571C7.87151 1.61803 7.77366 1.6137 7.67915 1.63313C7.58464 1.65255 7.49643 1.69511 7.4224 1.757C7.34838 1.81889 7.29087 1.89818 7.25501 1.98775L6.5066 3.8585C6.47813 3.92968 6.43592 3.99454 6.38237 4.04939C6.32882 4.10425 6.26499 4.148 6.19451 4.17817L3.1256 5.49359C3.03797 5.5311 2.96087 5.58951 2.90104 5.66371C2.84121 5.73792 2.80048 5.82565 2.7824 5.91925C2.76433 6.01284 2.76947 6.10943 2.79736 6.20058C2.82526 6.29172 2.87507 6.37464 2.94243 6.44208Z" />
                <path
                  d="M2.33343 11.6665L5.2501 8.74984M5.2501 8.74984L2.94243 6.44217C2.87507 6.37473 2.82526 6.29181 2.79736 6.20066C2.76947 6.10952 2.76433 6.01292 2.7824 5.91933C2.80048 5.82574 2.84121 5.738 2.90104 5.6638C2.96087 5.58959 3.03797 5.53118 3.1256 5.49367L6.19451 4.17825C6.26499 4.14809 6.32882 4.10433 6.38237 4.04948C6.43592 3.99463 6.47813 3.92976 6.5066 3.85859L7.25501 1.98784C7.29087 1.89826 7.34838 1.81898 7.4224 1.75709C7.49643 1.6952 7.58464 1.65264 7.67915 1.63321C7.77366 1.61379 7.87151 1.61811 7.96394 1.6458C8.05637 1.67348 8.14049 1.72366 8.20876 1.79184L12.2081 5.79117C12.2763 5.85944 12.3265 5.94356 12.3541 6.03599C12.3818 6.12842 12.3861 6.22627 12.3667 6.32078C12.3473 6.41529 12.3047 6.50351 12.2428 6.57753C12.181 6.65155 12.1017 6.70907 12.0121 6.74492L10.1413 7.49334C10.0702 7.5218 10.0053 7.56401 9.95045 7.61756C9.8956 7.67111 9.85185 7.73495 9.82168 7.80542L8.50626 10.8743C8.46875 10.962 8.41034 11.0391 8.33614 11.0989C8.26193 11.1587 8.17419 11.1995 8.0806 11.2175C7.98701 11.2356 7.89042 11.2305 7.79927 11.2026C7.70813 11.1747 7.62521 11.1249 7.55776 11.0575L5.2501 8.74984Z"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Button>
          </Box>
        </Box>
      </Box>
      <LimitOver
        open={limitDialog}
        onClose={() => setLimitDialog(false)}
        title={
          'Your Document Summaries Limit is Over so you cannot upload new document.'
        }
        subtitle={'Summary'}
        stats={fetchedUser?.summary_used || ''}
      />
      {isOpenEditSummary && (
        <DynamicEditCombineSummaryModal
          open={isOpenEditSummary}
          handleClose={handleCloseEditSummary}
          messageData={messageObj}
        />
      )}
    </>
  );
}
