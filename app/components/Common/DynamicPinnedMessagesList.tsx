import Image from 'next/image';
import dynamic from 'next/dynamic';

import Style from './Sidebar.module.scss';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  fetchPinnedMessagesList,
  selectPinnedMessagesList,
  togglePinMessages,
  unPinMessageFromList,
} from '@/app/redux/slices/Chat';
import { useEffect, useRef, useState } from 'react';
import { ErrorResponse, handleError } from '@/app/utils/handleError';
import { showToast } from '@/app/shared/toast/ShowToast';
import { PinnedAnswerMessage } from '@/app/redux/slices/Chat/chatTypes';
import { Dayjs } from 'dayjs';
import { highlightText } from '@/app/utils/constants';
import { selectFetchedUser } from '@/app/redux/slices/login';
import { useSelector } from 'react-redux';
const NoRecordFound = dynamic(() => import('@components/Common/NoRecordFound'));

interface DynamicPinnedMessagesListProps {
  handlePinnedAnswerClick: (pinnedObj: PinnedAnswerMessage) => void;
  searchVal: string;
  fromDateVal: Dayjs | null;
  toDateVal: Dayjs | null;
  resetTrigger: number;
}

export default function DynamicPinnedMessagesList({
  handlePinnedAnswerClick,
  searchVal,
  fromDateVal,
  toDateVal,
  resetTrigger,
}: DynamicPinnedMessagesListProps) {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const pinnedChats = useAppSelector(selectPinnedMessagesList);

  const containerRef = useRef<HTMLDivElement>(null);
  const previousScrollTopRef = useRef(0); // Ref to store the previous scroll position
  const previousScrollHeightRef = useRef(0); // Store the scroll height before data append

  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetching, seIsFetching] = useState(false);
  const [page, setPage] = useState(1); // already loaded page 1
  const [hasMore, setHasMore] = useState(
    pinnedChats.results.length < pinnedChats.count
  );

  const fetchedUser = useSelector(selectFetchedUser);
  const expiredStatus = fetchedUser?.active_subscription?.status;

  useEffect(() => {
    if (!isFetching || !isInitialLoading) {
      setHasMore(pinnedChats.results.length < pinnedChats.count);
    }
  }, [pinnedChats]);

  useEffect(() => {
    setPage(1); // reset page to 1 whenever resetTrigger changes
    const createdAfter = fromDateVal?.format('YYYY-MM-DD');
    const createdBefore = toDateVal?.format('YYYY-MM-DD');

    getPinnedMessagesList(1, searchVal, createdAfter, createdBefore);
  }, [resetTrigger]);

  const getPinnedMessagesList = async (
    page = 1,
    search = '',
    created_after = '',
    created_before = ''
  ) => {
    if (page === 1) {
      setIsInitialLoading(true);
    } else {
      seIsFetching(true);
    }
    const resultData = await dispatch(
      fetchPinnedMessagesList({
        page,
        search,
        created_after,
        created_before,
      })
    );

    if (fetchPinnedMessagesList.fulfilled.match(resultData)) {
      seIsFetching(false);
    }

    if (fetchPinnedMessagesList.rejected.match(resultData)) {
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
        const { scrollTop, scrollHeight } = containerRef.current;

        // Save the current scroll position before making the API call
        previousScrollTopRef.current = scrollTop;
        previousScrollHeightRef.current = scrollHeight;

        const nextPage = page + 1;
        setPage(nextPage);
        const createdAfter = fromDateVal?.format('YYYY-MM-DD');
        const createdBefore = toDateVal?.format('YYYY-MM-DD');
        await getPinnedMessagesList(
          nextPage,
          searchVal,
          createdAfter,
          createdBefore
        );
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

  const handleTogglePin = async (selectedPinnedAns: PinnedAnswerMessage) => {
    if (selectedPinnedAns?.uuid) {
      setIsLoading(true);

      const payload = {
        message_uuid: selectedPinnedAns.uuid,
      };

      const resultData = await dispatch(togglePinMessages(payload));

      if (togglePinMessages.fulfilled.match(resultData)) {
        dispatch(unPinMessageFromList({ uuid: selectedPinnedAns.uuid }));
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
        pinnedChats?.count == 0 &&
        !(searchVal || fromDateVal || toDateVal) && (
          <NoRecordFound title={'No Chats are pinned yet.'} />
        )}

      {!isInitialLoading &&
        !isFetching &&
        pinnedChats?.count == 0 &&
        (searchVal || fromDateVal || toDateVal) && (
          <NoRecordFound title={'No Match Found.'} />
        )}

      {!isInitialLoading &&
        pinnedChats.results.map((chat) => (
          <div
            key={chat.uuid}
            className={Style['accordion-content']}
            onClick={() => handlePinnedAnswerClick(chat)}
          >
            <div className={Style['left']}>
              <p
                dangerouslySetInnerHTML={{
                  __html: highlightText(chat.message, searchVal),
                }}
              ></p>
            </div>
            <div className={Style['right']}>
              {expiredStatus !== 0 && (
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
    </div>
  );
}
