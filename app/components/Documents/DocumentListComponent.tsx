'use client';

import styles from './document.module.scss';
import Sidebar from '@/app/components/Common/Sidebar';
import { useEffect, useState } from 'react';
import CategoryList from './CategoryList';
import DocumentList from './DocumentList';
import DocumentSummary from './DocumentSummary';
import { useRouter } from 'next/navigation';
import PageHeader from '../Common/PageHeader';
import DocumentsEmpty from '../DocumentsEmpty/DocumentsEmpty';
import { useAppDispatch } from '@/app/redux/hooks';
import { fetchCategories } from '@/app/redux/slices/categoryListing';

export default function DocumentListComponent({ catId }: { catId: number }) {
  const router = useRouter();
  const [selectedDocId, setSelectedsDocId] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const [showEmptyCategoryComponent, setShowEmptyCategoryComponent] =
    useState(false);

  useEffect(() => {
    dispatch(fetchCategories({ page: 1 }))
      .unwrap()
      .then(async (res) => {
        if (res?.no_of_docs > 0) {
          await setShowEmptyCategoryComponent(true);
        }
      });
  }, [dispatch]);

  const handleSelectedDocSummary = (docId: number) => {
    setSelectedsDocId(docId);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('docId', docId.toString());
    router.replace(`/documents/${catId}?${searchParams.toString()}`, {
      scroll: false,
    });
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    if (!selectedDocId) {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    if (!selectedDocId) {
      setIsSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarOpen(false);
    }
  }, [selectedDocId]);

  const handleThreadClick = () => {
    console.log('handleThreadClick');
  };

  const closeSummaryDrawer = () => {
    setSelectedsDocId(null);
  };

  return (
    <main className={`chat-body ${styles.docsPageMain}`}>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleThreadClick={handleThreadClick}
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
              <CategoryList catId={catId} />
              <DocumentList
                catId={catId}
                handleOpenDocumentSummary={handleSelectedDocSummary}
                selectedDoc={selectedDocId}
              />
              {selectedDocId !== null && (
                <DocumentSummary
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
