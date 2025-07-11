import React from 'react';
import Style from '@components/Plan-Expired-MG/PlanExpiredMG.module.scss';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function PlanExpiredMG() {
  const router = useRouter();
  return (
    <>
      <Box component="div" className={Style.PlanExpiredMG}>
        <Box component="div" className={Style.MainContentBox}>
          <Box component="div" className={Style.ContentBox}>
            <Box component="figure" className={Style.BinImage}>
              <Image
                src="/images/PlanExpired.svg"
                alt="user"
                width={32}
                height={32}
              />
            </Box>
            <Box component="div" className={Style.ContentText}>
              <Typography variant="h3" color="initial">
                Your Plan has Expired{' '}
              </Typography>
              <Typography variant="body1" color="initial">
                It’s Time for Your Upgrade!
              </Typography>
            </Box>
          </Box>
          <Box component="div">
            <Button
              className="btn-primary btn"
              onClick={() => router.push('/plans')}
            >
              Upgrade Now
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
