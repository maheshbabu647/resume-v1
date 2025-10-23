import { useAuth } from '@/context/AuthContext';
import { getSessionId } from '@/utils/sessionManager';

/**
 * Hook to get sessionId for API calls
 * Returns sessionId only for anonymous users (not authenticated)
 */
export const useSessionId = () => {
  const { user } = useAuth();
  const sessionId = getSessionId(!!user);
  
  return {
    sessionId,
    isAuthenticated: !!user
  };
};

export default useSessionId;

