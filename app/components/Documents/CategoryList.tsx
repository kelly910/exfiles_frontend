'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import styles from './document.module.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RootState } from '@/app/redux/store';
import { useSelector } from 'react-redux';
import {
  fetchCategories,
  resetCategories,
} from '@/app/redux/slices/categoryListing';
import { useAppDispatch } from '@/app/redux/hooks';
import { useRouter } from 'next/navigation';

export type Category = {
  name: string;
  no_of_docs: number;
  id: number;
};

type CategoryListProps = {
  catId: number | null;
};

const CategoryList: React.FC<CategoryListProps> = ({ catId }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories, nextPage, isFetching } = useSelector(
    (state: RootState) => state.categoryListing
  );
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const initialLoad = useRef(false);

  useEffect(() => {
    dispatch(resetCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!initialLoad.current) {
      dispatch(fetchCategories({ page: 1 }));
      initialLoad.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    if (categories?.length > 0) {
      const newCategoryId = catId ?? categories[0].id;
      setActiveCategoryId(newCategoryId);
      handleCategoryClick(newCategoryId);
    }
  }, [catId, categories]);

  const lastCategoryRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !nextPage || isFetching) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isFetching) {
            dispatch(fetchCategories({ page: nextPage }));
          }
        },
        { threshold: 0.5 }
      );

      observer.current.observe(node);
    },
    [dispatch, nextPage, isFetching]
  );

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/documents/${categoryId}`);
  };

  return (
    <>
      <Box component="div" className={styles.categories}>
        <Box component="div" className={styles.categoryBox}>
          <Typography variant="body1" className={styles.categoriesTitle}>
            Categories
          </Typography>
        </Box>
        {categories?.length > 0 &&
          categories?.map((category, index) => (
            <Box
              component="div"
              key={index}
              ref={index === categories.length - 1 ? lastCategoryRef : null}
              className={`${styles.docsFolder} ${(Number(catId) || activeCategoryId) === category?.id ? styles.active : ''}`}
              onClick={() => handleCategoryClick(category?.id)}
            >
              <div className={styles.folderBox}>
                <Image
                  src="/images/folder.svg"
                  alt="folder"
                  width={18}
                  height={18}
                  className={styles.folderImg}
                />
                <div className={styles.folderTitleBox}>
                  <Typography variant="body1" className={styles.folderTitle}>
                    {category?.name}
                  </Typography>
                  <Typography variant="body1" className={styles.folderNo}>
                    No. of Docs : <span>{category?.no_of_docs}</span>
                  </Typography>
                </div>
                <Image
                  src="/images/arrow-right.svg"
                  alt="folder"
                  width={16}
                  height={16}
                  className={styles.arrowRightImg}
                />
              </div>
            </Box>
          ))}
      </Box>
    </>
  );
};

export default CategoryList;
