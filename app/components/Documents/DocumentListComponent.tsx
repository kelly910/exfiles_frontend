'use client';

import styles from './document.module.scss';
import Sidebar from '@/app/components/Common/Sidebar';
import { useEffect, useState } from 'react';
import CategoryList from './CategoryList';
import DocumentList from './DocumentList';
import DocumentSummary from './DocumentSummary';
import { useRouter, useSearchParams } from 'next/navigation';
import PageHeader from '../Common/PageHeader';
import DocumentsEmpty from '../DocumentsEmpty/DocumentsEmpty';
import { useAppDispatch } from '@/app/redux/hooks';
import { fetchCategories } from '@/app/redux/slices/categoryListing';
import { PinnedAnswerMessage } from '@/app/redux/slices/Chat/chatTypes';
import { useMediaQuery } from '@mui/material';
import { setPageHeaderData } from '@/app/redux/slices/login';

export default function DocumentListComponent({ catId }: { catId: number }) {
  const mobileView = useMediaQuery('(min-width:800px)');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDocId, setSelectedsDocId] = useState<string>('');
  const dispatch = useAppDispatch();
  const [showEmptyCategoryComponent, setShowEmptyCategoryComponent] =
    useState(false);

  useEffect(() => {
    const urlDocId = searchParams.get('docId');
    if (urlDocId) {
      setSelectedsDocId(urlDocId);
    }
  }, [searchParams]);

  useEffect(() => {
    dispatch(fetchCategories({ page: 1 }))
      .unwrap()
      .then((res) => {
        if (res?.count > 0) {
          setShowEmptyCategoryComponent(true);
          dispatch(
            setPageHeaderData({
              title: 'Documents',
              subTitle: `No. of Documents : ${res?.no_of_docs}`,
            })
          );
        }
      });
  }, [dispatch]);

  const handleSelectedDocSummary = (docId: string) => {
    setSelectedsDocId(docId);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('docId', docId.toString());
    router.replace(`/documents/${catId}?${searchParams.toString()}`, {
      scroll: false,
    });
  };

  // const isSmallScreen = useMediaQuery('(max-width:1100px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    if (!selectedDocId) {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    if (mobileView) {
      if (!selectedDocId) {
        setIsSidebarOpen((prev) => !prev);
      } else {
        setIsSidebarOpen(false);
      }
    }
  }, [selectedDocId]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1100) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Call on mount to ensure it sets correctly
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleThreadClick = (thread: string) => {
    router.push(`/ai-chats/${thread}`); // Navigate to thread page
  };

  const handlePinnedAnswerClick = (selectedMessage: PinnedAnswerMessage) => {
    if (selectedMessage.thread && selectedMessage.uuid) {
      router.push(
        `/ai-chats/${selectedMessage.thread.uuid}/?message=${selectedMessage.uuid}`
      );
    }
  };

  const closeSummaryDrawer = () => {
    setSelectedsDocId('');
  };

  const [openCategoryDrawerMobile, setOpenCategoryDrawerMobile] =
    useState(true);

  const openCategoryDrawer = (value: boolean) => {
    setOpenCategoryDrawerMobile(value);
  };

  const handleOpenSidebar = (value: boolean) => {
    setOpenCategoryDrawerMobile(false);
    setIsSidebarOpen(value);
  };

  return (
    <main className={`chat-body ${styles.docsPageMain}`}>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleThreadClick={handleThreadClick}
        handlePinnedAnswerClick={handlePinnedAnswerClick}
        title="Documents"
      />
      <section className="main-body">
        <PageHeader
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          title="Documents"
        />
        <div className={styles.docsMain}>
          {showEmptyCategoryComponent ? (
            <>
              <CategoryList
                catId={catId}
                openCategoryDrawerMobile={openCategoryDrawerMobile}
                handleCloseDrawer={() => setOpenCategoryDrawerMobile(false)}
                openMainSidebar={(value) => handleOpenSidebar(value)}
              />
              <DocumentList
                catId={catId}
                handleOpenDocumentSummary={handleSelectedDocSummary}
                selectedDoc={selectedDocId}
                handleOpenCategoryDrawer={(value) => openCategoryDrawer(value)}
              />
              {selectedDocId && (
                <DocumentSummary
                  catId={catId}
                  docId={selectedDocId}
                  selectedDocIdNull={closeSummaryDrawer}
                />
              )}
            </>
          ) : (
            <DocumentsEmpty />
          )}
        </div>
      </section>
    </main>
  );
}
