// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import ReactGA from 'react-ga4';

// const RouteChangeTracker = () => {
//   const location = useLocation();

//   useEffect(() => {
//     const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
//     if (!id) {
//       console.warn("GA Measurement ID missing!");
//       return;
//     }

//     ReactGA.initialize(id);
//   }, []);

//   useEffect(() => {
//     ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
//   }, [location]);

//   return null;
// };

// export default RouteChangeTracker;



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