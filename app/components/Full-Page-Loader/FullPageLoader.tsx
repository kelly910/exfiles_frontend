'use client';

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Image from 'next/image';

const FullPageLoader = () => {
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fullscreen-loader">
      <div className="loader-container">
        <Image
          src="/gif/loader.gif"
          alt="Loading..."
          width={100}
          height={100}
        />
      </div>
    </div>
  );
};

export default FullPageLoader;
