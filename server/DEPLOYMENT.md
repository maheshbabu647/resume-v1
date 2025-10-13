# Production Deployment Guide for PDF Generation

## PDF Generation Issues in Production

The PDF generation uses Puppeteer which requires Chrome/Chromium to be installed on the production server.

## Required Dependencies for Production

### 1. Install Chrome/Chromium on Production Server

#### For Ubuntu/Debian:
```bash
# Install Chromium
sudo apt-get update
sudo apt-get install -y chromium-browser

# Or install Google Chrome
wget -q -O - https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb | sudo dpkg -i -
sudo apt-get install -f
```

#### For CentOS/RHEL:
```bash
# Install Chromium
sudo yum install -y chromium

# Or install Google Chrome
sudo yum install -y google-chrome-stable
```

### 2. Environment Variables

Add these to your production environment:

```bash
NODE_ENV=production
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
NODE_OPTIONS=--max-old-space-size=4096
```

### 3. Docker Configuration (if using Docker)

Add to your Dockerfile:
```dockerfile
# Install Chromium
RUN apt-get update && apt-get install -y chromium-browser

# Set environment variables
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

### 4. Vercel/Serverless Deployment

For serverless deployments, you may need to use a different approach:

```bash
# Install puppeteer-core instead of puppeteer
npm install puppeteer-core

# Use a CDN-hosted Chrome
PUPPETEER_EXECUTABLE_PATH=https://github.com/puppeteer/puppeteer/releases/download/v21.0.0/chrome-linux64/chrome
```

## Troubleshooting

### Common Issues:

1. **"Could not find browser"**: Chrome/Chromium not installed
2. **"No usable sandbox"**: Add `--no-sandbox` flag (already included)
3. **Memory issues**: Increase Node.js memory limit
4. **Timeout errors**: Increase timeout values

### Testing PDF Generation:

```bash
# Test if Chrome is accessible
/usr/bin/chromium-browser --version

# Test Puppeteer
node -e "const puppeteer = require('puppeteer'); puppeteer.launch().then(b => { console.log('Success'); b.close(); })"
```

## Alternative Solutions

If Puppeteer doesn't work in production, consider:

1. **HTML2PDF.js**: Client-side PDF generation
2. **jsPDF**: Pure JavaScript PDF generation
3. **External PDF Service**: Use a third-party PDF generation service
4. **Serverless Functions**: Use Vercel Functions or AWS Lambda with Puppeteer

## Monitoring

Monitor these metrics in production:
- PDF generation success rate
- Generation time
- Memory usage
- Error rates
