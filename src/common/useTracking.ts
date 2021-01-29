import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (key: string, trackingId: string, config: { page_path: string }) => void;
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTracking = (trackingId: string | undefined = 'G-1XT7WKVHT9') => {
  const { listen } = useHistory();

  useEffect(() => {
    const unlisten = listen((location) => {
      if (!window.gtag) return;
      if (!trackingId) {
        console.log(
          'Tracking not enabled, as `trackingId` was not given and there is no `GA_MEASUREMENT_ID`.'
        );
        return;
      }

      window.gtag('config', trackingId, { page_path: location.pathname });
    });

    return unlisten;
  }, [trackingId, listen]);
};
