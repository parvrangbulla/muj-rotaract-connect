import { useEffect } from 'react';

/**
 * Custom hook that scrolls to the top of the page when the component mounts
 * This ensures that when users navigate to a new page, they start at the top
 */
export const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};
