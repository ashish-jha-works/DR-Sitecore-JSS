'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleLoader = (e: any) => setIsLoading(e.detail);
    window.addEventListener('toggle-global-loader', handleLoader);
    return () => window.removeEventListener('toggle-global-loader', handleLoader);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="loader-full">
      <Image src={'/assets/images/loader.svg'} alt="loader" width={75} height={75} />
    </div>
  );
}
