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
import RenameDialog from '../ReName/ReName';
import { selectFetchedUser } from '@/app/redux/slices/login';
import { useThemeMode } from '@/app/utils/ThemeContext';

export type Category = {
  name: string;
  no_of_docs: number;
  id: number;
};

export type CategoryRename = {
  name: string;
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
  const mobileView = useMediaQuery('(min-width:800px)');
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
  const fetchedUser = useSelector(selectFetchedUser);
  const expiredStatus = fetchedUser?.active_subscription?.status;

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

  const [renameDialog, setRenameDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryRename | null>(null);
  const [menuCategory, setMenuCategory] = useState<CategoryRename | null>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (
    event: React.MouseEvent<HTMLElement>,
    category: CategoryRename
  ) => {
    event.preventDefault();
    setAnchorElUser(event.currentTarget);
    setMenuCategory(category);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenRenameDialog = () => {
    handleCloseUserMenu();
    setSelectedCategory(menuCategory);
    setRenameDialog(true);
  };

  const { theme } = useThemeMode();

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
                  {theme !== 'dark' ? (
                    <Image
                      src="/images/folder.svg"
                      alt="folder"
                      width={18}
                      height={18}
                      className={styles.folderImg}
                      onClick={() => handleCategoryClick(category?.id)}
                    />
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles.folderImg}
                      onClick={() => handleCategoryClick(category?.id)}
                    >
                      <path
                        d="M15.5458 5.71231C15.9922 6.2415 15.523 6.9375 14.8307 6.9375H2.5C1.94771 6.9375 1.5 6.48978 1.5 5.9375V4.815C1.5 2.985 2.985 1.5 4.815 1.5H6.555C7.7775 1.5 8.16 1.8975 8.6475 2.55L9.6975 3.945C9.93 4.2525 9.96 4.29 10.395 4.29H12.4875C13.7135 4.29 14.8117 4.84206 15.5458 5.71231Z"
                        fill={
                          (Number(catId) || activeCategoryId) === category?.id
                            ? 'var(--Primary-Text-Color)'
                            : 'var(--Placeholder-Text)'
                        }
                      />
                      <path
                        d="M15.4884 8.06251C16.0393 8.06251 16.4865 8.50816 16.4884 9.05912L16.5 12.4877C16.5 14.7002 14.7 16.5002 12.4875 16.5002H5.5125C3.3 16.5002 1.5 14.7002 1.5 12.4877V9.06269C1.5 8.51041 1.94771 8.0627 2.49999 8.06269L15.4884 8.06251Z"
                        fill={
                          (Number(catId) || activeCategoryId) === category?.id
                            ? 'var(--Primary-Text-Color)'
                            : 'var(--Placeholder-Text)'
                        }
                      />
                    </svg>
                  )}

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
                  {expiredStatus !== 0 && (
                    <>
                      <IconButton
                        onClick={(e) => handleOpenUserMenu(e, category)}
                        sx={{ p: 0 }}
                      >
                        {theme !== 'dark' ? (
                          <Image
                            src="/images/more.svg"
                            alt="more"
                            width={16}
                            height={16}
                            className={styles.arrowRightImg}
                          />
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 11 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.55539 4.44434C2.0665 4.44434 1.6665 4.84434 1.6665 5.33322C1.6665 5.82211 2.0665 6.22211 2.55539 6.22211C3.04428 6.22211 3.44428 5.82211 3.44428 5.33322C3.44428 4.84434 3.04428 4.44434 2.55539 4.44434Z"
                              stroke={
                                (Number(catId) || activeCategoryId) ===
                                category?.id
                                  ? 'var(--Primary-Text-Color)'
                                  : 'var(--Subtext-Color)'
                              }
                              stroke-width="0.8"
                            />
                            <path
                              d="M8.77756 4.44434C8.28867 4.44434 7.88867 4.84434 7.88867 5.33322C7.88867 5.82211 8.28867 6.22211 8.77756 6.22211C9.26645 6.22211 9.66645 5.82211 9.66645 5.33322C9.66645 4.84434 9.26645 4.44434 8.77756 4.44434Z"
                              stroke={
                                (Number(catId) || activeCategoryId) ===
                                category?.id
                                  ? 'var(--Primary-Text-Color)'
                                  : 'var(--Subtext-Color)'
                              }
                              stroke-width="0.8"
                            />
                            <path
                              d="M5.66672 4.44434C5.17783 4.44434 4.77783 4.84434 4.77783 5.33322C4.77783 5.82211 5.17783 6.22211 5.66672 6.22211C6.15561 6.22211 6.55561 5.82211 6.55561 5.33322C6.55561 4.84434 6.15561 4.44434 5.66672 4.44434Z"
                              stroke={
                                (Number(catId) || activeCategoryId) ===
                                category?.id
                                  ? 'var(--Primary-Text-Color)'
                                  : 'var(--Subtext-Color)'
                              }
                              stroke-width="0.8"
                            />
                          </svg>
                        )}
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
                          onClick={handleOpenRenameDialog}
                          className={styles.menuDropdown}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15.75 16.5H2.25C1.9425 16.5 1.6875 16.245 1.6875 15.9375C1.6875 15.63 1.9425 15.375 2.25 15.375H15.75C16.0575 15.375 16.3125 15.63 16.3125 15.9375C16.3125 16.245 16.0575 16.5 15.75 16.5Z"
                              fill="var(--Primary-Text-Color)"
                            />
                            <path
                              d="M14.2649 2.60926C12.8099 1.15426 11.3849 1.11676 9.89243 2.60926L8.98493 3.51676C8.90993 3.59176 8.87993 3.71176 8.90993 3.81676C9.47993 5.80426 11.0699 7.39426 13.0574 7.96426C13.0874 7.97176 13.1174 7.97926 13.1474 7.97926C13.2299 7.97926 13.3049 7.94926 13.3649 7.88926L14.2649 6.98176C15.0074 6.24676 15.3674 5.53426 15.3674 4.81426C15.3749 4.07176 15.0149 3.35176 14.2649 2.60926Z"
                              fill="var(--Primary-Text-Color)"
                            />
                            <path
                              d="M11.7075 8.64711C11.49 8.54211 11.28 8.43711 11.0775 8.31711C10.9125 8.21961 10.755 8.11461 10.5975 8.00211C10.47 7.91961 10.32 7.79961 10.1775 7.67961C10.1625 7.67211 10.11 7.62711 10.05 7.56711C9.80249 7.35711 9.52499 7.08711 9.27749 6.78711C9.25499 6.77211 9.21749 6.71961 9.16499 6.65211C9.08999 6.56211 8.96249 6.41211 8.84999 6.23961C8.75999 6.12711 8.65499 5.96211 8.55749 5.79711C8.43749 5.59461 8.33249 5.39211 8.22749 5.18211C8.12249 4.95711 8.03999 4.73961 7.96499 4.53711L3.25499 9.24711C3.1575 9.34461 3.06749 9.53211 3.04499 9.65961L2.63999 12.5321C2.56499 13.0421 2.7075 13.5221 3.0225 13.8446C3.2925 14.1071 3.66749 14.2496 4.07249 14.2496C4.16249 14.2496 4.25249 14.2421 4.34249 14.2271L7.22249 13.8221C7.35749 13.7996 7.54499 13.7096 7.63499 13.6121L12.345 8.90211C12.135 8.82711 11.9325 8.74461 11.7075 8.64711Z"
                              fill="var(--Primary-Text-Color)"
                            />
                          </svg>
                          <Typography>Rename Category</Typography>
                        </MenuItem>
                      </Menu>
                    </>
                  )}
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
            maxHeight: 'calc(100dvh - 65px)',
            '& .MuiPaper-root': {
              top: '65px',
              width: '400px',
              maxWidth: 'calc(100% - 64px)',
              maxHeight: 'calc(100dvh - 65px)',
              background: 'var(--Card-Color)',
              borderLeft: '1px solid  var(--Stroke-Color)',
            },
            '& .MuiBackdrop-root': {
              top: '65px',
              maxHeight: 'calc(100dvh - 65px)',
              backdropFilter: 'blur(24px)',
              backgroundColor: 'unset',
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
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.0333 2.72027L5.68666 7.06694C5.17332 7.58027 5.17332 8.42027 5.68666 8.93361L10.0333 13.2803"
                    stroke="var(--Primary-Text-Color)"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
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
                    {theme !== 'dark' ? (
                      <Image
                        src="/images/folder.svg"
                        alt="folder"
                        width={18}
                        height={18}
                        className={styles.folderImg}
                        onClick={() => handleCategoryClick(category?.id)}
                      />
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.folderImg}
                        onClick={() => handleCategoryClick(category?.id)}
                      >
                        <path
                          d="M15.5458 5.71231C15.9922 6.2415 15.523 6.9375 14.8307 6.9375H2.5C1.94771 6.9375 1.5 6.48978 1.5 5.9375V4.815C1.5 2.985 2.985 1.5 4.815 1.5H6.555C7.7775 1.5 8.16 1.8975 8.6475 2.55L9.6975 3.945C9.93 4.2525 9.96 4.29 10.395 4.29H12.4875C13.7135 4.29 14.8117 4.84206 15.5458 5.71231Z"
                          fill={
                            (Number(catId) || activeCategoryId) === category?.id
                              ? 'var(--Primary-Text-Color)'
                              : 'var(--Placeholder-Text)'
                          }
                        />
                        <path
                          d="M15.4884 8.06251C16.0393 8.06251 16.4865 8.50816 16.4884 9.05912L16.5 12.4877C16.5 14.7002 14.7 16.5002 12.4875 16.5002H5.5125C3.3 16.5002 1.5 14.7002 1.5 12.4877V9.06269C1.5 8.51041 1.94771 8.0627 2.49999 8.06269L15.4884 8.06251Z"
                          fill={
                            (Number(catId) || activeCategoryId) === category?.id
                              ? 'var(--Primary-Text-Color)'
                              : 'var(--Placeholder-Text)'
                          }
                        />
                      </svg>
                    )}
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
                    <IconButton
                      onClick={(e) => handleOpenUserMenu(e, category)}
                      sx={{ p: 0 }}
                    >
                      {theme !== 'dark' ? (
                        <Image
                          src="/images/more.svg"
                          alt="more"
                          width={16}
                          height={16}
                          className={styles.arrowRightImg}
                        />
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 11 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.55539 4.44434C2.0665 4.44434 1.6665 4.84434 1.6665 5.33322C1.6665 5.82211 2.0665 6.22211 2.55539 6.22211C3.04428 6.22211 3.44428 5.82211 3.44428 5.33322C3.44428 4.84434 3.04428 4.44434 2.55539 4.44434Z"
                            stroke={
                              (Number(catId) || activeCategoryId) ===
                              category?.id
                                ? 'var(--Primary-Text-Color)'
                                : 'var(--Subtext-Color)'
                            }
                            stroke-width="0.8"
                          />
                          <path
                            d="M8.77756 4.44434C8.28867 4.44434 7.88867 4.84434 7.88867 5.33322C7.88867 5.82211 8.28867 6.22211 8.77756 6.22211C9.26645 6.22211 9.66645 5.82211 9.66645 5.33322C9.66645 4.84434 9.26645 4.44434 8.77756 4.44434Z"
                            stroke={
                              (Number(catId) || activeCategoryId) ===
                              category?.id
                                ? 'var(--Primary-Text-Color)'
                                : 'var(--Subtext-Color)'
                            }
                            stroke-width="0.8"
                          />
                          <path
                            d="M5.66672 4.44434C5.17783 4.44434 4.77783 4.84434 4.77783 5.33322C4.77783 5.82211 5.17783 6.22211 5.66672 6.22211C6.15561 6.22211 6.55561 5.82211 6.55561 5.33322C6.55561 4.84434 6.15561 4.44434 5.66672 4.44434Z"
                            stroke={
                              (Number(catId) || activeCategoryId) ===
                              category?.id
                                ? 'var(--Primary-Text-Color)'
                                : 'var(--Subtext-Color)'
                            }
                            stroke-width="0.8"
                          />
                        </svg>
                      )}
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
                        onClick={handleOpenRenameDialog}
                        className={styles.menuDropdown}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.75 16.5H2.25C1.9425 16.5 1.6875 16.245 1.6875 15.9375C1.6875 15.63 1.9425 15.375 2.25 15.375H15.75C16.0575 15.375 16.3125 15.63 16.3125 15.9375C16.3125 16.245 16.0575 16.5 15.75 16.5Z"
                            fill="var(--Primary-Text-Color)"
                          />
                          <path
                            d="M14.2649 2.60926C12.8099 1.15426 11.3849 1.11676 9.89243 2.60926L8.98493 3.51676C8.90993 3.59176 8.87993 3.71176 8.90993 3.81676C9.47993 5.80426 11.0699 7.39426 13.0574 7.96426C13.0874 7.97176 13.1174 7.97926 13.1474 7.97926C13.2299 7.97926 13.3049 7.94926 13.3649 7.88926L14.2649 6.98176C15.0074 6.24676 15.3674 5.53426 15.3674 4.81426C15.3749 4.07176 15.0149 3.35176 14.2649 2.60926Z"
                            fill="var(--Primary-Text-Color)"
                          />
                          <path
                            d="M11.7075 8.64711C11.49 8.54211 11.28 8.43711 11.0775 8.31711C10.9125 8.21961 10.755 8.11461 10.5975 8.00211C10.47 7.91961 10.32 7.79961 10.1775 7.67961C10.1625 7.67211 10.11 7.62711 10.05 7.56711C9.80249 7.35711 9.52499 7.08711 9.27749 6.78711C9.25499 6.77211 9.21749 6.71961 9.16499 6.65211C9.08999 6.56211 8.96249 6.41211 8.84999 6.23961C8.75999 6.12711 8.65499 5.96211 8.55749 5.79711C8.43749 5.59461 8.33249 5.39211 8.22749 5.18211C8.12249 4.95711 8.03999 4.73961 7.96499 4.53711L3.25499 9.24711C3.1575 9.34461 3.06749 9.53211 3.04499 9.65961L2.63999 12.5321C2.56499 13.0421 2.7075 13.5221 3.0225 13.8446C3.2925 14.1071 3.66749 14.2496 4.07249 14.2496C4.16249 14.2496 4.25249 14.2421 4.34249 14.2271L7.22249 13.8221C7.35749 13.7996 7.54499 13.7096 7.63499 13.6121L12.345 8.90211C12.135 8.82711 11.9325 8.74461 11.7075 8.64711Z"
                            fill="var(--Primary-Text-Color)"
                          />
                        </svg>

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
      <RenameDialog
        open={renameDialog}
        category={selectedCategory}
        onClose={() => setRenameDialog(false)}
      />
    </>
  );
};

export default CategoryList;
