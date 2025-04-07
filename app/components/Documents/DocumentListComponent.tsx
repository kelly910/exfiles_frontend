'use client';

import styles from './document.module.scss';
import Sidebar from '@/app/components/Common/Sidebar';
import { useEffect, useState } from 'react';
import CategoryList from './CategoryList';
import DocumentList from './DocumentList';
import DocumentSummary from './DocumentSummary';
import { useRouter } from 'next/navigation';
import PageHeader from '../Common/PageHeader';

export default function DocumentListComponent({ catId }: { catId: number }) {
  const router = useRouter();
  const [selectedDocId, setSelectedsDocId] = useState<number | null>(null);

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
        <PageHeader title="Documents" />
        <div className={styles.docsMain}>
          <CategoryList catId={catId} />
          <DocumentList
            catId={catId}
            handleOpenDocumentSummary={handleSelectedDocSummary}
          />
          {selectedDocId !== null && (
            <DocumentSummary
              docId={selectedDocId}
              selectedDocIdNull={closeSummaryDrawer}
            />
          )}
        </div>
      </section>
    </main>
  );
}
