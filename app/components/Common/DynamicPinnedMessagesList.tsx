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
import { useThemeMode } from '@/app/utils/ThemeContext';
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
              {(expiredStatus !== 0 || fetchedUser?.staff_user) && (
                <div className={Style['pin-img']}>
                  {isLoading && ''}
                  {/* <Image
                    src="/images/sidebar-Pin.svg"
                    alt="pin"
                    width={18}
                    height={18}
                    onClick={() => handleTogglePin(chat)}
                  /> */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => handleTogglePin(chat)}
                  >
                    <path
                      d="M9.71683 14.217L6.74983 11.25L3.78283 8.28301C3.69622 8.1963 3.63219 8.08969 3.59632 7.9725C3.56045 7.85532 3.55384 7.73112 3.57708 7.61079C3.60032 7.49046 3.65269 7.37766 3.72961 7.28225C3.80654 7.18684 3.90567 7.11174 4.01833 7.06351L7.96408 5.37226C8.05469 5.33348 8.13676 5.27722 8.20561 5.2067C8.27446 5.13618 8.32874 5.05277 8.36533 4.96126L9.32758 2.55601C9.37368 2.44084 9.44763 2.33891 9.5428 2.25934C9.63797 2.17976 9.75139 2.12504 9.8729 2.10007C9.99441 2.0751 10.1202 2.08066 10.2391 2.11625C10.3579 2.15184 10.4661 2.21636 10.5538 2.30401L15.6958 7.44601C15.7835 7.53379 15.848 7.64195 15.8836 7.76078C15.9192 7.87962 15.9247 8.00543 15.8998 8.12694C15.8748 8.24846 15.8201 8.36188 15.7405 8.45705C15.6609 8.55222 15.559 8.62616 15.4438 8.67226L13.0386 9.63451C12.9471 9.67111 12.8637 9.72539 12.7931 9.79423C12.7226 9.86308 12.6664 9.94516 12.6276 10.0358L10.9363 13.9815C10.8881 14.0942 10.813 14.1933 10.7176 14.2702C10.6222 14.3472 10.5094 14.3995 10.3891 14.4228C10.2687 14.446 10.1445 14.4394 10.0273 14.4035C9.91015 14.3677 9.80354 14.3036 9.71683 14.217Z"
                      fill={theme !== 'dark' ? '#DADAE1' : 'var(--Icon-Color)'}
                      // fill="#DADAE1"
                    />
                    <path
                      d="M3 15L6.75 11.25M6.75 11.25L9.717 14.217C9.80371 14.3036 9.91032 14.3677 10.0275 14.4035C10.1447 14.4394 10.2689 14.446 10.3892 14.4228C10.5096 14.3995 10.6224 14.3472 10.7178 14.2702C10.8132 14.1933 10.8883 14.0942 10.9365 13.9815L12.6277 10.0358C12.6665 9.94516 12.7228 9.86308 12.7933 9.79423C12.8638 9.72539 12.9472 9.67111 13.0388 9.63451L15.444 8.67226C15.5592 8.62617 15.6611 8.55222 15.7407 8.45705C15.8202 8.36188 15.875 8.24846 15.8999 8.12694C15.9249 8.00543 15.9194 7.87962 15.8838 7.76078C15.8482 7.64195 15.7837 7.53379 15.696 7.44601L10.554 2.30401C10.4662 2.21636 10.3581 2.15184 10.2392 2.11625C10.1204 2.08066 9.99458 2.0751 9.87307 2.10007C9.75156 2.12504 9.63814 2.17976 9.54296 2.25934C9.44779 2.33891 9.37385 2.44084 9.32775 2.55601L8.3655 4.96126C8.3289 5.05277 8.27463 5.13618 8.20578 5.2067C8.13693 5.27722 8.05486 5.33348 7.96425 5.37226L4.0185 7.06351C3.90583 7.11174 3.8067 7.18684 3.72978 7.28225C3.65286 7.37766 3.60049 7.49046 3.57725 7.61079C3.55401 7.73112 3.56062 7.85532 3.59649 7.9725C3.63235 8.08969 3.69639 8.1963 3.783 8.28301L6.75 11.25Z"
                      stroke={
                        theme !== 'dark' ? '#DADAE1' : 'var(--Icon-Color)'
                      }
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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
