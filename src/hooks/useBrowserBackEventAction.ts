import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const useBrowserBackEventAction = () => {
  const router = useRouter();
  useEffect(() => {
    const handlePopState = (event: any) => {
      // Prevent the default browser back behavior initially
      event.preventDefault();

      // Redirect the user to the homepage
      router.push('/dashboard');
      return false;
    };

    // Add the event listener when the component mounts
    window.addEventListener('popstate', handlePopState);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]); // Ensure the effect runs whenever the router instance changes
};

export default useBrowserBackEventAction;
