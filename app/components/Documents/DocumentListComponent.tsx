'use client';

import styles from './document.module.scss';
import Header from '@components/Header/Header';
// import Sidebar from '@/app/components/Common/Sidebar';
import { useState } from 'react';
import CategoryList from './CategoryList';
import DocumentList from './DocumentList';
import DocumentSummary from './DocumentSummary';
import { useRouter } from 'next/navigation';

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

  return (
    <>
      {/* <Sidebar /> */}
      <Header />
      <main className={styles.docsPageMain}>
        <div className={styles.docsMain}>
          <CategoryList catId={catId} />
          <DocumentList
            catId={catId}
            handleOpenDocumentSummary={handleSelectedDocSummary}
          />
          {selectedDocId !== null && <DocumentSummary docId={selectedDocId} />}
        </div>
      </main>
    </>
  );
}
