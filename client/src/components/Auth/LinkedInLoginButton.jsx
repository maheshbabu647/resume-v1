import React from 'react';
import { Button } from "@/components/ui/button";

const LinkedInIcon = () => (
	<svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true" focusable="false" role="img">
		<path fill="currentColor" d="M100.28 448H7.4V148.9h92.88zm-46.44-341C24 107 0 83 0 53.64A53.64 53.64 0 1 1 53.64 0 53.64 53.64 0 0 1 53.84 107zM447.9 448h-92.4V302.4c0-34.7-.7-79.2-48.3-79.2-48.4 0-55.8 37.8-55.8 76.8V448h-92.4V148.9h88.8v40.8h1.3c12.4-23.6 42.7-48.3 87.8-48.3 93.9 0 111.2 61.8 111.2 142.3V448z"/>
	</svg>
);

const LinkedInLoginButton = ({ redirectTo = null, onBeforeRedirect = null }) => {
	const currentUrl = redirectTo || window.location.href;

	const handleLinkedInAuth = () => {
		console.log('LinkedIn OAuth initiated, saving form data...');

		if (onBeforeRedirect) {
			console.log('Calling onBeforeRedirect to save form data');
			onBeforeRedirect();
		}

		const currentState = {
			url: window.location.href,
			timestamp: Date.now(),
			formData: null
		};

		try {
			localStorage.setItem('resume_editor_state', JSON.stringify(currentState));
			console.log('Page state saved to localStorage');
		} catch (error) {
			console.warn('Could not save state to localStorage:', error);
		}

		const url = new URL(currentUrl);
		const redirectPath = url.pathname + url.search;
		const encodedRedirectPath = encodeURIComponent(redirectPath);

		console.log('Redirecting to LinkedIn OAuth with path:', redirectPath);
		window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/linkedin?redirect=${encodedRedirectPath}`;
	};

	return (
		<Button variant="outline" type="button" className="w-full" onClick={handleLinkedInAuth}>
			<LinkedInIcon />
			Sign in with LinkedIn
		</Button>
	);
};

export default LinkedInLoginButton;
