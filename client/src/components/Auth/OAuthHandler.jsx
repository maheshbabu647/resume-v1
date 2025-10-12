import React from 'react';
import { useOAuthReturn } from '@/hooks/useOAuthReturn.js';

/**
 * Component to handle OAuth return and data restoration
 * This component should be placed inside the Router context
 */
const OAuthHandler = () => {
  // Handle OAuth return and data restoration
  useOAuthReturn();
  
  // This component doesn't render anything, it just handles OAuth logic
  return null;
};

export default OAuthHandler;
