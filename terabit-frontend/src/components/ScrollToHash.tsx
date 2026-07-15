import * as React from 'react';
import { useLocation } from 'react-router';

export default function ScrollToHash() {
  const { hash } = useLocation();

  React.useEffect(() => {
    if (!hash) {
      return;
    }

    const id = hash.replace('#', '');
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash]);

  return null;
}