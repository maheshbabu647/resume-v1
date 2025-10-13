import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {

    const GA_MEASUREMENT_ID =  import.meta.env.VITE_GA_MEASUREMENT_ID;
    ReactGA.initialize(GA_MEASUREMENT_ID);

    ReactGA.send({
      hitType: 'pageview',
      page: location.pathname,
      title: document.title, 
    });
  }, [location]);

  return null; 
};

export default AnalyticsTracker;