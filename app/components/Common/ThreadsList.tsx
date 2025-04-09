import { useAppDispatch } from '@/app/redux/hooks';
import Image from 'next/image';
import Style from './Sidebar.module.scss';
import { Button } from '@mui/material';
import { Thread } from '@/app/redux/slices/Chat/chatTypes';
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { deleteThread, renameNewThread } from '@/app/redux/slices/Chat';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { showToast } from '@/app/shared/toast/ShowToast';
const ThreadActionMenu = dynamic(() => import('./ThreadActionMenu'));
const DynamicRenameModal = dynamic(() => import('./RenameThreadModal'));
const DynamicConfirmDeleteModal = dynamic(() => import('./ConfirmationDialog'));

interface ThreadListProps {
  initialAllChatsData: Thread[];
  fetchChats: (page?: number) => Promise<{ total: number; results: Thread[] }>;
  totalCount: number;
  updateTotalCount: (count: number) => void;
  handleThreadClick: (threadUUID: string) => void;
}

export default function ThreadList({
  initialAllChatsData,
  fetchChats,
  totalCount,
  updateTotalCount,
  handleThreadClick,
}: ThreadListProps) {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isOpenActionModal = Boolean(anchorEl);
  const [currentSelectedItem, setCurrentSelectedItem] = useState(null);

  // Rename Thread
  const [isOpenRenameModal, setIsOpenRenameModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [chats, setChats] = useState<Thread[]>(initialAllChatsData);
  const [page, setPage] = useState(2); // already loaded page 1
  const [hasMore, setHasMore] = useState(
    initialAllChatsData?.length < totalCount
  );
  const [isFetching, setIsFetching] = useState(false);
  const pageRef = useRef(page);
  const containerRef = useRef(null);
  const fetchingRef = useRef(isFetching);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    fetchingRef.current = isFetching;
  }, [isFetching]);

  const loadMore = async () => {
    if (fetchingRef.current || !hasMore) return;

    setIsFetching(true);
    fetchingRef.current = true;

    const currentPage = pageRef.current;

    const data = await fetchChats(pageRef.current);

    if (data?.results?.length) {
      setChats((prev) => [...prev, ...data.results]);

      const nextPage = currentPage + 1;

      setPage(nextPage);
      pageRef.current = nextPage;

      if (chats.length + data.results.length >= totalCount) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
    setIsFetching(false);
    fetchingRef.current = false;
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;

    if (
      scrollTop + clientHeight >= scrollHeight - 50 &&
      !isFetching &&
      hasMore
    ) {
      loadMore();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);

    return () => container.removeEventListener('scroll', handleScroll);
  }, [isFetching, hasMore]);

  const handleActionMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    data: any
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

  const renameThread = async (values) => {
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
    if (currentSelectedItem?.uuid) {
      setIsLoading(true);

      const payload = {
        thread_uuid: currentSelectedItem.uuid,
      };

      const resultData = await dispatch(deleteThread(payload));

      if (deleteThread.fulfilled.match(resultData)) {
        const updatedThreadList = chats.filter(
          (thread) => thread.uuid !== currentSelectedItem.uuid
        );
        setChats(updatedThreadList);
        updateTotalCount(updatedThreadList.length);

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

  return (
    <div ref={containerRef} className={Style['accordion-content-infinite']}>
      {chats.map((chat) => (
        <div
          key={chat.uuid}
          className={Style['accordion-content']}
          onClick={() => handleThreadClick(chat.uuid)}
        >
          <div className={Style['left']}>
            <p>{chat.name ? chat.name : 'New Thread'}</p>
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
      {isFetching && <div className="p-4 text-center">Loading more...</div>}

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
