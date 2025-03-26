'use client';
import {
  Box,
  Button,
  Grid,
  Input,
  InputAdornment,
  Typography,
} from '@mui/material';
import styles from './style.module.scss';
import Image from 'next/image';
import Header from '@/app/components/Header/Header';
import Sidebar from '@/app/components/Sidebar/Sidebar';

export default function Page() {
  return (
    <>
      <Sidebar />
      <Header />
      <main className={styles.docsPageMain}>
        <div className={styles.docsMain}>
          {/* ==== */}
          <Box component="div" className={styles.categories}>
            <Box component="div" className={styles.categoryBox}>
              <Typography variant="body1" className={styles.categoriesTitle}>
                Categories
              </Typography>
            </Box>
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
            <DocFolder />
          </Box>
          {/* ==== */}

          <div className={styles.docsListing}>
            <Box component="div" className={styles.searchBoard}>
              <Box component="div" className={styles.docBoard}>
                <Input
                  id="input-with-icon-adornment"
                  className={styles.searchInput}
                  placeholder="Search your documents"
                  endAdornment={
                    <InputAdornment
                      position="end"
                      className={styles.searchIcon}
                    >
                      <span className={styles.search}></span>
                    </InputAdornment>
                  }
                />
                {/* <Button
                    type="button"
                    variant="contained"
                    className={`btn-arrow`}
                    color="primary"
                    fullWidth
                    sx={{ gap: '4px' }}
                  >
                    <span className='arrow'></span>
                    Upload
                  </Button> */}
              </Box>
            </Box>

            <Box className={styles.docBoxMain} component="div">
              <Grid
                container
                spacing={2}
                justifyContent="start"
                alignItems="stretch"
              >
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
                <DocCard />
              </Grid>
            </Box>
          </div>
          {/* ==== */}
          <Box component={'div'} className={styles.docsBoard}>
            <div className={styles.docsBoardHeader}>
              <div className={styles.docsInner}>
                <Typography variant="body1" className={styles.docsTitle}>
                  Neon Insights
                </Typography>
                <Typography variant="body1" className={styles.docsDate}>
                  Uploaded On : <span>12-03-2025</span>
                </Typography>
              </div>
              <div className={styles.docsInnerTag}>
                <span>Biotech</span>
                <span>Biotech</span>
                <span>Biotech</span>
                <span>Biotech</span>
                <span>Biotech</span>
                <span>Biotech</span>
              </div>
            </div>

            <div className={styles.docsBoardBody}>
              <Typography variant="body1" className={styles.docsBodyTitle}>
                Description (Added by User)
              </Typography>
              <div className={styles.docsBodyText}>
                <Typography variant="body1">
                  One of the primary functions of paragraphs is to create a
                  logical flow in writing. Each paragraph should be organized
                  around a single main idea or topic, which is typically
                  introduced in the opening sentence. The subsequent sentences
                  within the paragraph
                </Typography>
              </div>
              <Typography variant="body1" className={styles.docsBodyTitle}>
                Description (Added by User)
              </Typography>
              <div className={styles.docsBodyText}>
                <Typography variant="body1">
                  One of the primary functions of paragraphs is to create a
                  logical flow in writing. Each paragraph should be organized
                  around a single main idea or topic, which is typically
                  introduced in the opening sentence. The subsequent sentences
                  within the paragraph
                </Typography>
              </div>
              <Typography variant="body1" className={styles.docsBodyTitle}>
                Description (Added by User)
              </Typography>
              <div className={styles.docsBodyText}>
                <Typography variant="body1">
                  One of the primary functions of paragraphs is to create a
                  logical flow in writing. Each paragraph should be organized
                  around a single main idea or topic, which is typically
                  introduced in the opening sentence. The subsequent sentences
                  within the paragraph
                </Typography>
              </div>
              <Typography variant="body1" className={styles.docsBodyTitle}>
                Summary Generated
              </Typography>
              <div className={styles.docsBodyText}>
                <Typography variant="body1">
                  One of the primary functions of paragraphs is to create a
                  logical flow in writing. Each paragraph should be organized
                  around a single main idea or topic, which is typically
                  introduced in the opening sentence. The subsequent sentences
                  within the paragraph provide supporting details, examples, or
                  explanations to bolster the main idea. This structural
                  arrangement enhances coherence and allows readers to follow
                  the author&apos;s train of thought effortlessly. A
                  well-structured paragraph helps to ensure that ideas are
                  presented in a logical and sequential manner. By focusing on a
                  single main idea, the writer can provide a clear and concise
                  argument or explanation. The opening sentence of a paragraph
                  serves as a guidepost, introducing the central theme and
                  setting the stage for the supporting sentences that follow.
                  These supporting sentences provide evidence, examples, or
                  explanations that expand upon the main idea, lending
                  credibility and depth to the writer&apos;s argument.One of the
                  primary functions of paragraphs is to create a logical flow in
                  writing. Each paragraph should be organized around a single
                  main idea or topic, which is typically introduced in the
                  opening sentence.
                </Typography>
              </div>
            </div>
            <Box component={'div'} className={styles.docsButtonBox}>
              <Button className={styles.docsButton}>
                <Image
                  src="/images/copy.svg"
                  alt="Download"
                  width={24}
                  height={24}
                />
                Copy
              </Button>
              <span className={styles.docsDas}></span>
              <Button className={styles.docsButton}>
                <Image
                  src="/images/edit.svg"
                  alt="Download"
                  width={24}
                  height={24}
                />
                Edit Summary
              </Button>
            </Box>
          </Box>

          {/* ==== */}
        </div>
      </main>
    </>
  );
}

function DocCard() {
  return (
    <Grid item xs={12} sm={12} md={6} lg={4} className={styles.docBoxInner}>
      <div className={styles.docGridBox}>
        <div className={styles.docBox}>
          <Image
            src="/images/pdf.svg"
            alt="pdf"
            width={19}
            height={24}
            className={styles.pdfImg}
          />
          <Typography variant="body1" className={styles.docTitle}>
            Neon Insights
          </Typography>
          <Image
            src="/images/more.svg"
            alt="more"
            width={16}
            height={16}
            className={styles.moreImg}
          />
        </div>
        <div className={styles.docDateBox}>
          <div className={styles.docTagBox}>
            <span className={styles.docTag}>Biotech</span>
            <span className={styles.docTag}>Biotech</span>
            <span className={styles.docTag}>+2</span>
          </div>
          <Typography variant="body1">12-03-2025</Typography>
        </div>
      </div>
    </Grid>
  );
}

function DocFolder() {
  return (
    <Box component="div" className={`${styles.docsFolder} ${styles.active}`}>
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
            Financial
          </Typography>
          <Typography variant="body1" className={styles.folderNo}>
            No. of Docs : <span>18</span>
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
  );
}
