'use client';

import {
  Box,
  Button,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from '@mui/material';
import Image from 'next/image';
import styles from './document.module.scss';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  openCategoryDrawerMobile: boolean;
  handleCloseDrawer: () => void;
  openMainSidebar: (value: boolean) => void;
};

const CategoryList: React.FC<CategoryListProps> = ({
  catId,
  openCategoryDrawerMobile,
  handleCloseDrawer,
  openMainSidebar,
}) => {
  const mobileView = useMediaQuery('(min-width:600px)');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories, nextPage, isFetching } = useSelector(
    (state: RootState) => state.categoryListing
  );
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const initialLoad = useRef(false);
  const [showLoading, setShowLoading] = useState(false);
  const loadedPages = useRef(new Set<number>());
  const categoryRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

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
      if (!node || !nextPage || isFetching || loadedPages.current.has(nextPage))
        return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isFetching) {
            loadedPages.current.add(nextPage);
            setShowLoading(true);
            setTimeout(async () => {
              await dispatch(fetchCategories({ page: nextPage }));
              setShowLoading(false);
            }, 1000);
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
    categoryRefs.current[categoryId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  };

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      {mobileView ? (
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
                ref={(el: HTMLDivElement | null) => {
                  categoryRefs.current[category.id] = el;
                  if (index === categories.length - 1 && el)
                    lastCategoryRef(el);
                }}
                className={`${styles.docsFolder} ${(Number(catId) || activeCategoryId) === category?.id ? styles.active : ''}`}
              >
                <div className={styles.folderBox}>
                  <Image
                    src="/images/folder.svg"
                    alt="folder"
                    width={18}
                    height={18}
                    className={styles.folderImg}
                    onClick={() => handleCategoryClick(category?.id)}
                  />
                  <div className={styles.folderTitleBox}>
                    <Typography
                      variant="body1"
                      className={styles.folderTitle}
                      onClick={() => handleCategoryClick(category?.id)}
                    >
                      {category?.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      className={styles.folderNo}
                      onClick={() => handleCategoryClick(category?.id)}
                    >
                      No. of Docs : <span>{category?.no_of_docs || 0}</span>
                    </Typography>
                  </div>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Image
                      src="/images/more.svg"
                      alt="more"
                      width={16}
                      height={16}
                      className={styles.arrowRightImg}
                    />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    className={styles.mainDropdown}
                    sx={{
                      '& .MuiPaper-root': {
                        backgroundColor: 'var(--Input-Box-Colors)',
                        marginTop: '20px',
                        boxShadow: 'none',
                        borderRadius: '12px',
                      },
                    }}
                  >
                    <MenuItem
                      onClick={handleCloseUserMenu}
                      className={styles.menuDropdown}
                    >
                      <Image
                        src="/images/edit-2.svg"
                        alt="tras"
                        width={18}
                        height={18}
                      />
                      <Typography>Rename Category</Typography>
                    </MenuItem>
                  </Menu>
                </div>
              </Box>
            ))}
          {showLoading && (
            <Box className={styles.infiniteLoader}>
              <Image
                src="/gif/infinite-loader.gif"
                alt="infiniteLoader"
                width={100}
                height={100}
              />
            </Box>
          )}
        </Box>
      ) : (
        <Drawer
          anchor="left"
          open={openCategoryDrawerMobile}
          onClose={handleCloseDrawer}
          className={styles.categoriesDrawer}
          sx={{
            top: '65px',
            right: '0',
            left: 'auto',
            maxHeight: 'calc(100vh - 65px)',
            '& .MuiPaper-root': {
              top: '65px',
              width: 'calc(100% - 64px)',
              maxHeight: 'calc(100vh - 65px)',
              background: 'var(--Card-Color)',
              borderLeft: '1px solid  #3A3948',
            },
            '& .MuiBackdrop-root': {
              top: '65px',
              maxHeight: 'calc(100vh - 65px)',
            },
          }}
        >
          <Box component="div" className={styles.categories}>
            <Box component="div" className={styles.categoryBox}>
              <Button
                onClick={() => openMainSidebar(true)}
                className={styles.backButton}
                sx={{ marginBottom: '24px' }}
              >
                <Image
                  src="/images/arrow-left.svg"
                  alt="user"
                  width={16}
                  height={16}
                />
              </Button>
              <Typography variant="body1" className={styles.categoriesTitle}>
                Categories
              </Typography>
            </Box>
            {categories?.length > 0 &&
              categories?.map((category, index) => (
                <Box
                  component="div"
                  key={index}
                  ref={(el: HTMLDivElement | null) => {
                    categoryRefs.current[category.id] = el;
                    if (index === categories.length - 1 && el)
                      lastCategoryRef(el);
                  }}
                  className={`${styles.docsFolder} ${(Number(catId) || activeCategoryId) === category?.id ? styles.active : ''}`}
                >
                  <div className={styles.folderBox}>
                    <Image
                      src="/images/folder.svg"
                      alt="folder"
                      width={18}
                      height={18}
                      className={styles.folderImg}
                      onClick={() => handleCategoryClick(category?.id)}
                    />
                    <div className={styles.folderTitleBox}>
                      <Typography
                        variant="body1"
                        className={styles.folderTitle}
                        onClick={() => handleCategoryClick(category?.id)}
                      >
                        {category?.name}
                      </Typography>
                      <Typography
                        variant="body1"
                        className={styles.folderNo}
                        onClick={() => handleCategoryClick(category?.id)}
                      >
                        No. of Docs : <span>{category?.no_of_docs}</span>
                      </Typography>
                    </div>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Image
                        src="/images/more.svg"
                        alt="more"
                        width={16}
                        height={16}
                        className={styles.arrowRightImg}
                      />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                      className={styles.mainDropdown}
                      sx={{
                        '& .MuiPaper-root': {
                          backgroundColor: 'var(--Input-Box-Colors)',
                          marginTop: '20px',
                          boxShadow: 'none',
                          borderRadius: '12px',
                        },
                      }}
                    >
                      <MenuItem
                        onClick={handleCloseUserMenu}
                        className={styles.menuDropdown}
                      >
                        <Image
                          src="/images/edit-2.svg"
                          alt="tras"
                          width={18}
                          height={18}
                        />
                        <Typography>Rename Category</Typography>
                      </MenuItem>
                    </Menu>
                  </div>
                </Box>
              ))}
            {showLoading && (
              <Box className={styles.infiniteLoader}>
                <Image
                  src="/gif/infinite-loader.gif"
                  alt="infiniteLoader"
                  width={100}
                  height={100}
                />
              </Box>
            )}
          </Box>
        </Drawer>
      )}
    </>
  );
};

export default CategoryList;
