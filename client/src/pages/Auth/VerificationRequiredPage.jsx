import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MailCheck, LogOut, Send, Loader2, CheckCircle2 } from 'lucide-react';
import useAuthContext from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { resendVerification as apiResendVerification } from '@/api/authServiceApi';

const VerificationRequiredPage = () => {
    const { userData, signout } = useAuthContext();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const handleLogout = async () => {
        await signout();
        navigate('/');
    };

    const handleResend = async () => {
    if (!userData?.userEmail) {
        setFeedback({ message: "Could not find user email to resend verification.", type: 'error' });
        return;
    }
    setIsLoading(true);
    setFeedback({ message: '', type: '' });

    try {
        const response = await apiResendVerification({ userEmail: userData.userEmail });
        setFeedback({ message: response.message + ' Redirecting to verify page...', type: 'success' });

        // 🧠 Wait 2 seconds, then navigate to verify-email page
        setTimeout(() => {
        navigate('/verify-email');
        }, 2000);
    } catch (error) {
        setFeedback({
        message: error.message || 'An error occurred while resending the verification email.',
        type: 'error'
        });
    } finally {
        setIsLoading(false);
    }
    };


    return (
        <>
            <Helmet>
                <title>Verify Your Email | CareerForge</title>
                <meta name="description" content="Please verify your email address to continue using CareerForge." />
            </Helmet>

            <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-lg"
                >
                    <Card className="bg-card text-card-foreground shadow-2xl rounded-xl">
                        <CardHeader className="text-center p-6 sm:p-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                                className="mx-auto mb-6 text-primary"
                            >
                                <MailCheck className="h-16 w-16" />
                            </motion.div>
                            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">Check Your Inbox</CardTitle>
                            {/* --- MODIFICATION START --- */}
                            {/* Updated description to refer to a code/link generically. */}
                            <CardDescription className="text-muted-foreground pt-2 max-w-sm mx-auto">
                                We've sent a verification email to <strong>{userData?.userEmail || 'your email address'}</strong>. Please follow the instructions to activate your account.
                            </CardDescription>
                            {/* --- MODIFICATION END --- */}
                        </CardHeader>
                        <CardContent className="p-6 sm:p-8 pt-0 text-center">
                            {feedback.message && (
                                <Alert variant={feedback.type === 'error' ? 'destructive' : 'default'} className={feedback.type === 'success' ? 'bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-300 [&>svg]:text-green-500' : ''}>
                                    {feedback.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : null}
                                    <AlertDescription>{feedback.message}</AlertDescription>
                                </Alert>
                            )}
                            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                                <Button onClick={handleLogout} variant="outline">
                                    <LogOut className="mr-2 h-4 w-4" /> Go Back to Login
                                </Button>
                                {/* --- MODIFICATION START --- */}
                                {/* Updated Button text from "Resend Link" to "Resend Email" */}
                                <Button onClick={handleResend} disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                    Resend Email
                                </Button>
                                {/* --- MODIFICATION END --- */}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </>
    );
};

export default VerificationRequiredPage;