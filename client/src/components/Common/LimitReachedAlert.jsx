import React from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Clock, Sparkles, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { getIconForType } from '../../utils/rateLimitHandler';

/**
 * LimitReachedAlert Component
 * Displays user-friendly messages for rate limits and cost limits
 * 
 * @param {Object} limitError - Parsed limit error from rateLimitHandler
 * @param {Function} onSignUp - Callback when user clicks sign up
 * @param {Function} onClose - Callback when alert is dismissed
 */
const LimitReachedAlert = ({ limitError, onSignUp, onClose }) => {
  if (!limitError) return null;

  const getIcon = () => {
    switch (limitError.type) {
      case 'FREE_RATE_LIMIT':
      case 'FREE_COST_LIMIT':
        return <Sparkles className="h-5 w-5 text-blue-500" />;
      case 'AUTH_RATE_LIMIT':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'AUTH_COST_LIMIT':
        return <TrendingUp className="h-5 w-5 text-orange-500" />;
      case 'SYSTEM_CAPACITY':
        return <RefreshCw className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getVariant = () => {
    if (limitError.shouldShowSignup) return 'default';
    if (limitError.type === 'SYSTEM_CAPACITY') return 'default';
    return 'destructive';
  };

  const getBackgroundColor = () => {
    if (limitError.shouldShowSignup) return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200';
    if (limitError.type === 'AUTH_COST_LIMIT') return 'bg-orange-50 border-orange-200';
    if (limitError.type === 'AUTH_RATE_LIMIT') return 'bg-yellow-50 border-yellow-200';
    if (limitError.type === 'SYSTEM_CAPACITY') return 'bg-gray-50 border-gray-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <Alert className={`${getBackgroundColor()} border-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300`}>
      <div className="flex items-start gap-4">
        <div className="mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 space-y-2">
          {/* Title */}
          <div className="font-semibold text-lg text-gray-900">
            {limitError.title}
          </div>

          {/* Main Message */}
          <AlertDescription className="text-gray-700">
            {limitError.message}
          </AlertDescription>

          {/* Additional Info */}
          {limitError.hint && (
            <div className="text-sm text-gray-600 bg-white/50 p-3 rounded-md border border-gray-200">
              💡 <span className="font-medium">Tip:</span> {limitError.hint}
            </div>
          )}

          {/* Reset Time Info */}
          {limitError.resetTime && limitError.type !== 'FREE_COST_LIMIT' && limitError.type !== 'FREE_RATE_LIMIT' && (
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Your limit will reset at <strong>{limitError.resetTime}</strong></span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {limitError.shouldShowSignup ? (
              <>
                <Button 
                  onClick={onSignUp}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Sign Up Free
                </Button>
                <Button 
                  onClick={onClose}
                  variant="outline"
                >
                  Maybe Later
                </Button>
              </>
            ) : limitError.type === 'SYSTEM_CAPACITY' ? (
              <>
                <Button 
                  onClick={onClose}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  I'll Try Later
                </Button>
                {!limitError.isAuthenticated && (
                  <Button 
                    onClick={onSignUp}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Get Priority Access
                  </Button>
                )}
              </>
            ) : (
              <Button 
                onClick={onClose}
                variant="outline"
              >
                Got It
              </Button>
            )}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Alert>
  );
};

export default LimitReachedAlert;

