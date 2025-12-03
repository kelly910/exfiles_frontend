import Image from 'next/image';
import Style from './Sidebar.module.scss';
import { Button } from '@mui/material';
import { Thread, ThreadType } from '@/app/redux/slices/Chat/chatTypes';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  deleteThread,
  deleteThreadByUuid,
  fetchThreadList,
  renameNewThread,
  selectThreadsList,
  setUpdateThreadListKeyValChange,
} from '@/app/redux/slices/Chat';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { showToast } from '@/app/shared/toast/ShowToast';
const ThreadActionMenu = dynamic(() => import('./ThreadActionMenu'));
const DynamicRenameModal = dynamic(() => import('./RenameThreadModal'));
const DynamicConfirmDeleteModal = dynamic(() => import('./ConfirmationDialog'));
import { selectActiveThread } from '@/app/redux/slices/Chat';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { useRouter } from 'next/navigation';
import { Dayjs } from 'dayjs';
import { highlightText } from '@/app/utils/constants';
import { selectFetchedUser } from '@/app/redux/slices/login';
import { useSelector } from 'react-redux';
import { useThemeMode } from '@/app/utils/ThemeContext';
const NoRecordFound = dynamic(() => import('@components/Common/NoRecordFound'));
interface DynamicThreadsListProps {
  handleThreadClick: (threadUUID: string) => void;
  searchVal: string;
  fromDateVal: Dayjs | null;
  toDateVal: Dayjs | null;
  resetTrigger: number;
}

export default function DynamicThreadsList({
  handleThreadClick,
  searchVal,
  fromDateVal,
  toDateVal,
  resetTrigger,
}: DynamicThreadsListProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const selectedActiveChat = useAppSelector(selectActiveThread);
  const threadList = useAppSelector(selectThreadsList);

  const containerRef = useRef<HTMLDivElement>(null);

  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetching, seIsFetching] = useState(false);
  const [page, setPage] = useState(1); // already loaded page 1
  const [hasMore, setHasMore] = useState(
    threadList.results.length < threadList.count
  );

  const previousScrollTopRef = useRef(0); // Ref to store the previous scroll position
  const previousScrollHeightRef = useRef(0); // Store the scroll height before data append

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpenActionModal = Boolean(anchorEl);
  const [currentSelectedItem, setCurrentSelectedItem] = useState<Thread | null>(
    null
  );

  const fetchedUser = useSelector(selectFetchedUser);
  const expiredStatus = fetchedUser?.active_subscription?.status;

  // Rename Thread
  const [isOpenRenameModal, setIsOpenRenameModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isFetching || !isInitialLoading) {
      setHasMore(threadList.results.length < threadList.count);
    }
  }, [threadList]);

  useEffect(() => {
    setPage(1); // reset page to 1 whenever resetTrigger changes
    const createdAfter = fromDateVal?.format('YYYY-MM-DD');
    const createdBefore = toDateVal?.format('YYYY-MM-DD');

    getThreadsList(1, searchVal, createdAfter, createdBefore);
  }, [resetTrigger]);

  const getThreadsList = async (
    page = 1,
    search = '',
    created_after = '',
    created_before = '',
    thread_type: ThreadType = 'chat'
  ) => {
    if (page === 1) {
      setIsInitialLoading(true);
    } else {
      seIsFetching(true);
    }

    const resultData = await dispatch(
      fetchThreadList({
        page,
        search,
        created_after,
        created_before,
        thread_type,
      })
    );

    if (fetchThreadList.fulfilled.match(resultData)) {
      seIsFetching(false);
    }

    if (fetchThreadList.rejected.match(resultData)) {
      // handleError(error as ErrorResponse);
    }

    if (page === 1) {
      setIsInitialLoading(false);
    } else {
      seIsFetching(false);
    }
  };

  const handleScroll = async () => {
    const el = containerRef.current;
    if (!el || isInitialLoading || isFetching || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = el;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      seIsFetching(true);

      try {
        const current = containerRef.current;
        if (!current) return;
        const { scrollTop, scrollHeight } = current;

        // Save the current scroll position before making the API call
        previousScrollTopRef.current = scrollTop;
        previousScrollHeightRef.current = scrollHeight;

        const nextPage = page + 1;
        setPage(nextPage);
        const createdAfter = fromDateVal?.format('YYYY-MM-DD');
        const createdBefore = toDateVal?.format('YYYY-MM-DD');
        await getThreadsList(nextPage, searchVal, createdAfter, createdBefore);
      } catch (e) {
        console.error(e);
      } finally {
        seIsFetching(false);

        // Scroll back to the previous position after the API call finishes
        const container = containerRef.current;
        if (container) {
          // Wait until DOM updates to restore scroll position
          setTimeout(() => {
            // Keep the scroll at same position relative to content
            container.scrollTop = previousScrollTopRef.current;
          }, 0); // This can be adjusted if necessary
        }
      }
    }
  };

  const handleActionMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    data: Thread
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentSelectedItem(data);
  };

  const handleActionMenuClose = () => {
    setAnchorEl(null);
    setCurrentSelectedItem(null);
  };

  const handleRenameThread = () => {
    setIsOpenRenameModal(true);
  };

  const handleDeleteThread = () => {
    setIsOpenDeleteModal(true);
  };

  const renameThread = async (values: { name: string }) => {
    const { name } = values;
    if (currentSelectedItem?.uuid) {
      setIsLoading(true);
      const payload = {
        thread_uuid: currentSelectedItem.uuid,
        name,
      };
      const resultData = await dispatch(renameNewThread(payload));
      if (renameNewThread.fulfilled.match(resultData)) {
        dispatch(
          setUpdateThreadListKeyValChange({
            uuid: currentSelectedItem.uuid,
            name: name,
          })
        );
        setIsOpenRenameModal(false);
        handleActionMenuClose();
        showToast('success', 'Thread rename successfully');
      }
      if (renameNewThread.rejected.match(resultData)) {
        handleError(resultData.payload as ErrorResponse);
      }
      setIsLoading(false);
    }
  };

  const deleteThreadId = async () => {
    if (currentSelectedItem?.uuid) {
      setIsLoading(true);
      const payload = {
        thread_uuid: currentSelectedItem.uuid,
      };
      const resultData = await dispatch(deleteThread(payload));
      if (deleteThread.fulfilled.match(resultData)) {
        if (selectedActiveChat?.uuid == currentSelectedItem?.uuid) {
          router.push('/ai-chats');
        }
        dispatch(
          deleteThreadByUuid({
            uuid: currentSelectedItem.uuid,
          })
        );
        setIsOpenDeleteModal(false);
        handleActionMenuClose();
        showToast('success', 'Thread deleted successfully');
      }
      if (deleteThread.rejected.match(resultData)) {
        handleError(resultData.payload as ErrorResponse);
      }
      setIsLoading(false);
    }
  };

  const { theme } = useThemeMode();

  return (
    <div
      ref={containerRef}
      className={Style['accordion-content-infinite']}
      onScroll={handleScroll}
    >
      {isInitialLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src="/gif/infinite-loader.gif"
            alt="loading-gif"
            width={18}
            height={18}
            unoptimized
            style={{ scale: 3 }}
          />
        </div>
      )}

      {!isInitialLoading &&
        !isFetching &&
        threadList?.count == 0 &&
        !(searchVal || fromDateVal || toDateVal) && (
          <NoRecordFound title={'Your chats will show up here.'} />
        )}

      {!isInitialLoading &&
        !isFetching &&
        threadList?.count == 0 &&
        (searchVal || fromDateVal || toDateVal) && (
          <NoRecordFound title={'No Match Found.'} />
        )}

      {!isInitialLoading &&
        threadList.results.map((chat) => (
          <div
            key={chat.uuid}
            className={`${Style['accordion-content']} ${selectedActiveChat?.uuid == chat.uuid ? Style['active'] : ''}`}
          >
            <div className={Style['left']} style={{ cursor: 'pointer' }}>
              <p
                onClick={() => handleThreadClick(chat.uuid)}
                dangerouslySetInnerHTML={{
                  __html: highlightText(
                    chat.name ? chat.name : 'New Thread',
                    searchVal
                  ),
                }}
              ></p>
            </div>
            <div className={Style['right']}>
              {(expiredStatus !== 0 || fetchedUser?.staff_user) && (
                <div>
                  <Button
                    id="fade-button"
                    aria-controls={'fade-menu'}
                    aria-haspopup="true"
                    aria-expanded={'true'}
                    onClick={(e) => handleActionMenuClick(e, chat)}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.55539 4.44434C2.0665 4.44434 1.6665 4.84434 1.6665 5.33322C1.6665 5.82211 2.0665 6.22211 2.55539 6.22211C3.04428 6.22211 3.44428 5.82211 3.44428 5.33322C3.44428 4.84434 3.04428 4.44434 2.55539 4.44434Z"
                        stroke={
                          theme !== 'dark'
                            ? 'var(--Primary-Text-Color)'
                            : 'var(--Subtext-Color)'
                        }
                        strokeWidth="0.8"
                      />
                      <path
                        d="M8.77756 4.44434C8.28867 4.44434 7.88867 4.84434 7.88867 5.33322C7.88867 5.82211 8.28867 6.22211 8.77756 6.22211C9.26645 6.22211 9.66645 5.82211 9.66645 5.33322C9.66645 4.84434 9.26645 4.44434 8.77756 4.44434Z"
                        stroke={
                          theme !== 'dark'
                            ? 'var(--Primary-Text-Color)'
                            : 'var(--Subtext-Color)'
                        }
                        strokeWidth="0.8"
                      />
                      <path
                        d="M5.66672 4.44434C5.17783 4.44434 4.77783 4.84434 4.77783 5.33322C4.77783 5.82211 5.17783 6.22211 5.66672 6.22211C6.15561 6.22211 6.55561 5.82211 6.55561 5.33322C6.55561 4.84434 6.15561 4.44434 5.66672 4.44434Z"
                        stroke={
                          theme !== 'dark'
                            ? 'var(--Primary-Text-Color)'
                            : 'var(--Subtext-Color)'
                        }
                        strokeWidth="0.8"
                      />
                    </svg>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

      {isFetching && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src="/gif/infinite-loader.gif"
            alt="loading-gif"
            width={18}
            height={18}
            unoptimized
            style={{ scale: 3 }}
          />
        </div>
      )}

      {isOpenActionModal && (
        <ThreadActionMenu
          anchorEl={anchorEl}
          open={isOpenActionModal}
          data={currentSelectedItem}
          handleClose={handleActionMenuClose}
          handleRename={handleRenameThread}
          handleDelete={handleDeleteThread}
        />
      )}

      {isOpenRenameModal && (
        <DynamicRenameModal
          open={isOpenRenameModal}
          handleClose={() => {
            setIsOpenRenameModal(false);
            handleActionMenuClose();
          }}
          handleSubmitProp={renameThread}
          threadValues={currentSelectedItem}
          isLoading={isLoading}
        />
      )}

      {isOpenDeleteModal && (
        <DynamicConfirmDeleteModal
          open={isOpenDeleteModal}
          handleClose={() => {
            setIsOpenDeleteModal(false);
            handleActionMenuClose();
          }}
          handleSubmit={deleteThreadId}
          modalTitle={'Delete Thread'}
          modalContent={`Are you sure you want to delete thread. This action cannot be undo.`}
          CancelBtnTitle={'No'}
          SubmitBtnTitle={'Yes, Delete'}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
