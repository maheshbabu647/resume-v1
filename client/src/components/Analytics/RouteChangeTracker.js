import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (!id) {
      console.warn("GA Measurement ID missing!");
      return;
    }

    ReactGA.initialize(id);
  }, []);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null;
};

export default RouteChangeTracker;
