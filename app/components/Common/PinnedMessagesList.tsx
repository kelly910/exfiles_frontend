import { useAppDispatch } from '@/app/redux/hooks';
import Image from 'next/image';
import Style from './Sidebar.module.scss';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { showToast } from '@/app/shared/toast/ShowToast';
import {
  PinnedAnswerMessage,
  PinnedAnswerMessagesResponse,
} from '@/app/redux/slices/Chat/chatTypes';
import { useEffect, useRef, useState } from 'react';
import { togglePinMessages } from '@/app/redux/slices/Chat';

interface PinnedMessagesListProps {
  initialAllChatsData: PinnedAnswerMessage[];
  fetchPinnedAnswerList: (
    page?: number
  ) => Promise<PinnedAnswerMessagesResponse>;
  totalCount: number;
  updateTotalCount: (count: number) => void;
  handlePinnedAnswerClick: (pinnedObj: PinnedAnswerMessage) => void;
}

export default function PinnedMessagesList(props: PinnedMessagesListProps) {
  const {
    initialAllChatsData,
    fetchPinnedAnswerList,
    totalCount,
    updateTotalCount,
    handlePinnedAnswerClick,
  } = props;
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [pinnedChats, setPinnedChats] =
    useState<PinnedAnswerMessage[]>(initialAllChatsData);
  const [page, setPage] = useState(2); // already loaded page 1
  const [hasMore, setHasMore] = useState(
    initialAllChatsData?.length < totalCount
  );
  const [isFetching, setIsFetching] = useState(false);
  const pageRef = useRef(page);
  const containerRef = useRef<HTMLDivElement>(null);
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

    const data = await fetchPinnedAnswerList(pageRef.current);

    if (data?.results?.length) {
      setPinnedChats((prev) => [...prev, ...data.results]);

      const nextPage = currentPage + 1;

      setPage(nextPage);
      pageRef.current = nextPage;

      if (pinnedChats.length + data.results.length >= totalCount) {
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

  const handleTogglePin = async (selectedPinnedAns: PinnedAnswerMessage) => {
    if (selectedPinnedAns?.uuid) {
      setIsLoading(true);

      const payload = {
        message_uuid: selectedPinnedAns.uuid,
      };

      const resultData = await dispatch(togglePinMessages(payload));

      if (togglePinMessages.fulfilled.match(resultData)) {
        const updatedThreadList = pinnedChats.filter(
          (thread) => thread.uuid !== selectedPinnedAns.uuid
        );
        setPinnedChats(updatedThreadList);
        updateTotalCount(updatedThreadList.length);
        showToast(
          'success',
          resultData.payload.messages[0] ||
            'Answer message successfully unpinned'
        );
      }
      if (togglePinMessages.rejected.match(resultData)) {
        handleError(resultData.payload as ErrorResponse);
      }

      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className={Style['accordion-content-infinite']}>
      {pinnedChats.map((chat) => (
        <div
          key={chat.uuid}
          className={Style['accordion-content']}
          onClick={() => handlePinnedAnswerClick(chat)}
        >
          <div className={Style['left']}>
            <p>{chat.message}</p>
          </div>
          <div className={Style['right']}>
            <div className={Style['pin-img']}>
              {isLoading && ''}
              <Image
                src="/images/sidebar-Pin.svg"
                alt="pin"
                width={18}
                height={18}
                onClick={() => handleTogglePin(chat)}
              />
            </div>
          </div>
        </div>
      ))}
      {isFetching && <div className="p-4 text-center">Loading more...</div>}
    </div>
  );
}
