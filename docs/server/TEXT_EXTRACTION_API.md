# Text Extraction API Documentation

This document describes the text extraction API endpoints for extracting text from PDF and DOCX files.

## Base URL
```
/api/text-extraction
```

## Endpoints

### 1. Extract Text from File
**POST** `/extract`

Extract text from uploaded PDF or DOCX file.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `file`: PDF or DOCX file (max 10MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "originalName": "document.pdf",
    "mimeType": "application/pdf",
    "fileSize": 1234567,
    "extractedText": "Extracted text content...",
    "metadata": {
      "title": "Document Title",
      "author": "Author Name",
      "pages": 5
    },
    "extractionInfo": {
      "timestamp": "2024-01-01T00:00:00.000Z",
      "mimeType": "application/pdf",
      "fileSize": 1234567,
      "extractionMethod": "pdf-parse"
    }
  }
}
```

### 2. Extract Text from Specific PDF Pages
**POST** `/extract-pdf-pages`

Extract text from specific pages of a PDF file.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `file`: PDF file (max 10MB)
  - `pages`: JSON string of page numbers (e.g., "[1,2,3]" or "[1-5]")

**Response:**
```json
{
  "success": true,
  "data": {
    "originalName": "document.pdf",
    "mimeType": "application/pdf",
    "fileSize": 1234567,
    "extractedText": "Text from specified pages...",
    "pages": 5,
    "metadata": {
      "title": "Document Title",
      "author": "Author Name"
    },
    "extractionInfo": {
      "timestamp": "2024-01-01T00:00:00.000Z",
      "mimeType": "application/pdf",
      "fileSize": 1234567,
      "extractionMethod": "pdf-parse",
      "pageRange": [1, 2, 3]
    }
  }
}
```

### 3. Extract Text and HTML from DOCX
**POST** `/extract-docx-html`

Extract both text and HTML from DOCX file.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `file`: DOCX or DOC file (max 10MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "originalName": "document.docx",
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 1234567,
    "extractedText": "Plain text content...",
    "extractedHTML": "<h1>HTML content...</h1>",
    "metadata": {
      "hasErrors": false,
      "warnings": [],
      "errors": []
    },
    "extractionInfo": {
      "timestamp": "2024-01-01T00:00:00.000Z",
      "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "fileSize": 1234567,
      "extractionMethod": "mammoth-html"
    }
  }
}
```

### 4. Get Supported File Types
**GET** `/supported-types`

Get list of supported file types for text extraction.

**Response:**
```json
{
  "success": true,
  "data": {
    "supportedTypes": [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword"
    ],
    "descriptions": {
      "application/pdf": "PDF documents",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Microsoft Word documents (DOCX)",
      "application/msword": "Microsoft Word documents (DOC)"
    }
  }
}
```

### 5. Health Check
**GET** `/health`

Check if the text extraction service is healthy.

**Response:**
```json
{
  "success": true,
  "message": "Text extraction service is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "supportedTypes": [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword"
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "file",
      "message": "File is required"
    }
  ]
}
```

### 400 Unsupported File Type
```json
{
  "success": false,
  "error": "Unsupported file type",
  "supportedTypes": [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword"
  ]
}
```

### 400 File Too Large
```json
{
  "success": false,
  "error": "File too large",
  "message": "File size must be less than 10MB"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Text extraction failed",
  "message": "Detailed error message"
}
```

## Usage Examples

### cURL Examples

#### Extract text from PDF:
```bash
curl -X POST http://localhost:3000/api/text-extraction/extract \
  -F "file=@document.pdf"
```

#### Extract text from specific PDF pages:
```bash
curl -X POST http://localhost:3000/api/text-extraction/extract-pdf-pages \
  -F "file=@document.pdf" \
  -F "pages=[1,2,3]"
```

#### Extract text and HTML from DOCX:
```bash
curl -X POST http://localhost:3000/api/text-extraction/extract-docx-html \
  -F "file=@document.docx"
```

### JavaScript/Fetch Examples

#### Extract text from file:
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/text-extraction/extract', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.data.extractedText);
```

#### Extract text from specific PDF pages:
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('pages', JSON.stringify([1, 2, 3]));

const response = await fetch('/api/text-extraction/extract-pdf-pages', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.data.extractedText);
```

## File Size Limits

- Maximum file size: 10MB
- Supported formats: PDF, DOCX, DOC
- Memory usage: Files are processed in memory

## Notes

- The service uses `pdf-parse` for PDF files and `mammoth` for DOCX/DOC files
- All text extraction is performed server-side
- Files are processed in memory and not stored on disk
- The API includes comprehensive error handling and validation
- All endpoints are documented with Swagger/OpenAPI specifications
