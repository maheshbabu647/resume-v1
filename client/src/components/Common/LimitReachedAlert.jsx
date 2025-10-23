/**
 * LimitReachedAlert Component
 * Displays user-friendly error messages for rate limits and usage limits
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Clock, UserPlus, AlertCircle, Zap, TrendingUp } from 'lucide-react';
import { getActionButtonText, getDetailedExplanation, getIconForType } from '@/utils/rateLimitHandler';
import { cn } from '@/lib/utils';

const LimitReachedAlert = ({ limitError, onSignUp, onClose }) => {
  if (!limitError) return null;

  const actionText = getActionButtonText(limitError);
  const explanation = getDetailedExplanation(limitError);
  const iconEmoji = getIconForType(limitError.type);

  // Determine the variant and styling based on error type
  const isSignupPrompt = limitError.shouldShowSignup;
  const isSystemCapacity = limitError.type === 'SYSTEM_CAPACITY';

  const handleAction = () => {
    if (isSignupPrompt && onSignUp) {
      onSignUp();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Card
          className={cn(
            'border-2 shadow-xl relative overflow-hidden',
            isSignupPrompt
              ? 'border-primary/50 bg-gradient-to-br from-primary/5 via-background to-accent-purple/5'
              : isSystemCapacity
              ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-background'
              : 'border-orange-500/50 bg-gradient-to-br from-orange-500/5 to-background'
          )}
        >
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Icon Section */}
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    'w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-3xl sm:text-4xl',
                    isSignupPrompt
                      ? 'bg-gradient-to-br from-primary to-accent-purple'
                      : isSystemCapacity
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                      : 'bg-gradient-to-br from-orange-400 to-orange-600'
                  )}
                >
                  {iconEmoji}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3
                      className={cn(
                        'text-xl sm:text-2xl font-bold mb-1',
                        isSignupPrompt ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {limitError.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground font-medium">
                      {limitError.message}
                    </p>
                  </div>
                  
                  {/* Close button */}
                  {onClose && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="flex-shrink-0 h-8 w-8 p-0 hover:bg-muted"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Detailed Explanation */}
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {explanation}
                </p>

                {/* Additional Info */}
                {limitError.resetTime && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Your quota will reset at <strong>{limitError.resetTime}</strong>
                    </span>
                  </div>
                )}

                {limitError.hint && (
                  <Alert className="bg-muted/30 border-muted-foreground/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs sm:text-sm">
                      {limitError.hint}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {isSignupPrompt ? (
                    <>
                      <Button
                        onClick={handleAction}
                        size="lg"
                        className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent-purple hover:from-primary/90 hover:to-accent-purple/90 shadow-lg hover:shadow-xl transition-all"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        {actionText}
                        <Zap className="w-4 h-4 ml-2" />
                      </Button>
                      {onClose && (
                        <Button
                          onClick={onClose}
                          variant="outline"
                          size="lg"
                          className="w-full sm:w-auto"
                        >
                          Maybe Later
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      onClick={handleAction}
                      variant={isSystemCapacity ? 'default' : 'outline'}
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      {actionText}
                    </Button>
                  )}
                </div>

                {/* Benefits callout for signup prompts */}
                {isSignupPrompt && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Higher Limits</div>
                        <div>10x more usage</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-accent-purple" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Save Progress</div>
                        <div>Never lose work</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <UserPlus className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">100% Free</div>
                        <div>No credit card</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          {/* Decorative gradient overlay */}
          <div
            className={cn(
              'absolute inset-0 opacity-10 pointer-events-none',
              isSignupPrompt
                ? 'bg-gradient-to-br from-primary via-transparent to-accent-purple'
                : isSystemCapacity
                ? 'bg-gradient-to-br from-yellow-400 via-transparent to-yellow-600'
                : 'bg-gradient-to-br from-orange-400 via-transparent to-orange-600'
            )}
          />
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default LimitReachedAlert;

