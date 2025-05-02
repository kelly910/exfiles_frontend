import Image from 'next/image';
import Style from './Sidebar.module.scss';
import { Button } from '@mui/material';
import {
  GetThreadListResponse,
  Thread,
} from '@/app/redux/slices/Chat/chatTypes';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  deleteThread,
  fetchThreadList,
  renameNewThread,
  selectThreadListLoading,
  selectThreadsList,
} from '@/app/redux/slices/Chat';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { showToast } from '@/app/shared/toast/ShowToast';
const ThreadActionMenu = dynamic(() => import('./ThreadActionMenu'));
const DynamicRenameModal = dynamic(() => import('./RenameThreadModal'));
const DynamicConfirmDeleteModal = dynamic(() => import('./ConfirmationDialog'));
import { selectActiveThread } from '@/app/redux/slices/Chat';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { useRouter } from 'next/navigation';

interface DynamicThreadsListProps {
  handleThreadClick: (threadUUID: string) => void;
  searchVal: string;
  fromDateVal: any;
  toDateVal: any;
}

export default function DynamicThreadsList({
  handleThreadClick,
  searchVal,
  fromDateVal,
  toDateVal,
}: DynamicThreadsListProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const selectedActiveChat = useAppSelector(selectActiveThread);
  const threadList = useAppSelector(selectThreadsList);
  const isFetching = useAppSelector(selectThreadListLoading);
  console.log(searchVal, fromDateVal, toDateVal);

  const isOpenActionModal = Boolean(anchorEl);
  const [currentSelectedItem, setCurrentSelectedItem] = useState<Thread | null>(
    null
  );

  // Rename Thread
  const [isOpenRenameModal, setIsOpenRenameModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const loadingRef = useRef(false);
  const [page, setPage] = useState(1); // already loaded page 1
  const [hasMore, setHasMore] = useState(
    threadList.results.length < threadList.count
  );

  useEffect(() => {
    setHasMore(threadList.results.length < threadList.count);
  }, [threadList]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(isFetching, 'isFetching ');

    if (!isFetching && hasMore) {
      loadingRef.current = true; // Set lock before dispatch
      const payloadData = {
        page,
        search: searchVal,
        thread_type: 'chat',
        created_after: fromDateVal,
        created_before: toDateVal,
      };
      dispatch(fetchThreadList(payloadData));
    }
  }, [page, searchVal]);

  useEffect(() => {
    if (page === 1 && !isFetching) {
      const payloadData = {
        page: 1,
        search: searchVal,
        thread_type: 'chat',
        created_after: fromDateVal,
        created_before: toDateVal,
      };
      dispatch(fetchThreadList(payloadData));
    }
  }, []);

  const handleScroll = () => {
    const container = containerRef.current;

    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    console.log(hasMore);
    if (
      scrollTop + clientHeight >= scrollHeight - 50 &&
      !loadingRef.current &&
      hasMore
    ) {
      loadingRef.current = true;
      setPage((prev) => prev + 1);
    }
  };
  useEffect(() => {
    if (!isFetching) {
      loadingRef.current = false;
    }
  }, [isFetching]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);

    return () => container.removeEventListener('scroll', handleScroll);
  }, [isFetching, hasMore]);

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
        const updatedThreadList = chats.map((thread) => {
          if (thread.uuid == currentSelectedItem.uuid) {
            return { ...thread, name: name };
          } else {
            return thread;
          }
        });
        setChats(updatedThreadList);
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
    // if (currentSelectedItem?.uuid) {
    //   setIsLoading(true);
    //   const payload = {
    //     thread_uuid: currentSelectedItem.uuid,
    //   };
    //   const resultData = await dispatch(deleteThread(payload));
    //   if (deleteThread.fulfilled.match(resultData)) {
    //     if (selectedActiveChat?.uuid == currentSelectedItem?.uuid) {
    //       router.push('/ai-chats');
    //     }
    //     const updatedThreadList = chats.filter(
    //       (thread) => thread.uuid !== currentSelectedItem.uuid
    //     );
    //     // setChats(updatedThreadList);
    //     // updateTotalCount(totalCount - 1);
    //     setIsOpenDeleteModal(false);
    //     handleActionMenuClose();
    //     showToast('success', 'Thread deleted successfully');
    //   }
    //   if (deleteThread.rejected.match(resultData)) {
    //     handleError(resultData.payload as ErrorResponse);
    //   }
    //   setIsLoading(false);
    // }
  };

  return (
    <div ref={containerRef} className={Style['accordion-content-infinite']}>
      {threadList.results.map((chat) => (
        <div
          key={chat.uuid}
          className={`${Style['accordion-content']} ${selectedActiveChat?.uuid == chat.uuid ? Style['active'] : ''}`}
        >
          <div className={Style['left']} style={{ cursor: 'pointer' }}>
            <p onClick={() => handleThreadClick(chat.uuid)}>
              {chat.name ? chat.name : 'New Thread'}
            </p>
          </div>
          <div className={Style['right']}>
            <div>
              <Button
                id="fade-button"
                aria-controls={'fade-menu'}
                aria-haspopup="true"
                aria-expanded={'true'}
                onClick={(e) => handleActionMenuClick(e, chat)}
              >
                <Image
                  src="/images/more.svg"
                  alt="user-icon"
                  height={10}
                  width={10}
                />
              </Button>
            </div>
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
