import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve } from 'path';

// Define the output path relative to the script location
const sitemapPath = resolve(process.cwd(), '../public/sitemap.xml');

const generateSitemap = async () => {
    const sitemap = new SitemapStream({ hostname: 'https://careerforge.pro' }); // Replace with your actual domain

    const links = [
        // Publicly accessible core pages
        { url: '/', changefreq: 'weekly', priority: 1.0 },
        { url: '/home', changefreq: 'weekly', priority: 1.0 },
        { url: '/login', changefreq: 'monthly', priority: 0.7 },
        { url: '/signup', changefreq: 'monthly', priority: 0.7 },
        { url: '/templates', changefreq: 'weekly', priority: 0.9 }, // Templates page is important for acquisition

        { url: '/about', changefreq: 'yearly', priority: 0.5 },
        { url: '/contact', changefreq: 'yearly', priority: 0.4 },
        { url: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
        { url: '/terms-of-service', changefreq: 'yearly', priority: 0.3 },
    ];

    // NOTE: Do not include dynamic, user-specific, or admin-only routes like:
    // - /dashboard
    // - /resume/edit/:id
    // - /admin/*
    // These pages require authentication and are not useful for public search indexing.

    links.forEach(link => {
        sitemap.write(link);
    });

    sitemap.end();

    try {
        const data = await streamToPromise(sitemap);
        createWriteStream(sitemapPath).write(data.toString());
        console.log(`Sitemap successfully generated at ${sitemapPath}`);
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
};

generateSitemap();
