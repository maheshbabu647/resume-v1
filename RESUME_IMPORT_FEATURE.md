# Resume Import Feature Documentation

## Overview

This feature allows users to import their existing resume (from file or text) when creating a new resume. The system uses Gemini AI to parse and extract structured data from the uploaded resume, which is then used to prefill the resume editor.

## Features

- **Start from Scratch**: Users can create a completely new resume from the ground up
- **Import Existing Resume**: Users can upload their current resume to have it parsed and prefilled
  - Upload resume file (PDF, DOCX, DOC, TXT)
  - Paste resume text directly
  - AI-powered parsing using Gemini 2.0 Flash
  - Automatic data extraction and structuring
  - Prefills the resume editor with parsed data

## Architecture

### Backend

#### 1. Resume Parser Service (`server/service/resume-parser-service.js`)
- **`parseResumeWithAI(resumeText, templateFieldDefinition)`**: Main parsing function that uses Gemini AI to extract structured data from resume text
- **`buildSchemaFromTemplate(templateFieldDefinition)`**: Builds a JSON schema from template field definitions to guide AI parsing
- **`validateParsedResumeData(parsedData)`**: Validates and sanitizes the parsed resume data

#### 2. Resume Parser Controller (`server/controller/resume-parser-controller.js`)
- **`parseResumeFromFile(req, res, next)`**: Handles file upload, extracts text, and parses resume
- **`parseResumeFromText(req, res, next)`**: Handles raw text input and parses resume

#### 3. Resume Parser Router (`server/router/resume-parser-router.js`)
- **POST `/api/resume-parser/parse-file`**: Endpoint for parsing resume from uploaded file
- **POST `/api/resume-parser/parse-text`**: Endpoint for parsing resume from raw text

### Frontend

#### 1. Resume Parser Service API (`client/src/api/resumeParserServiceApi.js`)
- **`parseResumeFromFile(file, templateFieldDefinition)`**: Uploads file and gets parsed data
- **`parseResumeFromText(resumeText, templateFieldDefinition)`**: Sends text and gets parsed data
- Helper methods for file validation and formatting

#### 2. Resume Setup Dialog (`client/src/components/ResumeEditor/ResumeSetupDialog.jsx`)
- Enhanced with import resume functionality
- First step allows user to choose between "Start from Scratch" or "Import Existing Resume"
- If import is selected, shows tabs for file upload or text paste
- Displays parsing progress and success/error messages
- Auto-advances to next step after successful import

#### 3. Resume Editor Page (`client/src/pages/Resume/ResumeEditorPage.jsx`)
- Updated to handle imported resume data
- Prefills editor form data when resume is imported
- Forces preview update after import

## Usage Flow

### For Users

1. **Start Creating a New Resume**: Navigate to create a new resume with a selected template
2. **Choose Import Option**: In the setup dialog, click "Import Existing Resume"
3. **Upload or Paste Resume**:
   - **File Upload**: Click "Upload File" tab and select your resume file (PDF, DOCX, DOC, or TXT)
   - **Text Paste**: Click "Paste Text" tab and paste your resume content
4. **Parse Resume**: Click "Parse Resume with AI" button
5. **Wait for Processing**: AI will extract and structure your resume data (takes a few seconds)
6. **Continue Setup**: After successful import, continue with the remaining setup steps
7. **Edit and Customize**: The editor will be prefilled with your imported data, which you can edit and customize

### For Developers

#### Adding a New Parsing Endpoint

```javascript
// Backend - Controller
export const parseResumeCustom = async (req, res, next) => {
  try {
    const { customData } = req.body;
    const parsedData = await parseResumeWithAI(customData, []);
    return res.status(200).json({ success: true, data: parsedData });
  } catch (error) {
    next(error);
  }
};

// Backend - Router
router.post('/parse-custom', parseResumeCustom);

// Frontend - Service
async parseResumeCustom(customData) {
  const response = await this.api.post('/parse-custom', { customData });
  return { success: true, data: response.data };
}
```

## API Documentation

### Parse Resume from File

**Endpoint**: `POST /api/resume-parser/parse-file`

**Request**:
```
Content-Type: multipart/form-data

file: [Resume File - PDF/DOCX/DOC/TXT]
templateFieldDefinition: [JSON string] (optional)
```

**Response**:
```json
{
  "success": true,
  "data": {
    "originalFileName": "John_Doe_Resume.pdf",
    "fileType": "application/pdf",
    "extractedTextLength": 2456,
    "parsedResumeData": {
      "content": {
        "contact": {
          "name": "John Doe",
          "email": "john.doe@example.com",
          "phone": "+1234567890",
          "location": "San Francisco, CA"
        },
        "experience": [...],
        "education": [...],
        "skills": {...}
      }
    },
    "metadata": {...}
  }
}
```

### Parse Resume from Text

**Endpoint**: `POST /api/resume-parser/parse-text`

**Request**:
```json
{
  "resumeText": "John Doe\nSoftware Engineer...",
  "templateFieldDefinition": [...]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "originalTextLength": 2456,
    "parsedResumeData": {
      "content": {...}
    }
  }
}
```

## Configuration

### Environment Variables

Ensure the following environment variables are set in your `.env` file:

```env
# Google Cloud AI Configuration
GCP_PROJECT_ID=your-project-id
GCP_PROJECT_LOCATION=us-central1

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
```

### Supported File Types

- PDF (`.pdf`)
- Microsoft Word DOCX (`.docx`)
- Microsoft Word DOC (`.doc`)
- Plain Text (`.txt`)

### File Size Limits

- Maximum file size: 10MB
- Recommended for best performance: < 5MB

## AI Parsing Details

The resume parser uses Google's Gemini 2.0 Flash Experimental model to:

1. Extract all information from the resume text
2. Identify and categorize different sections (contact, experience, education, skills, etc.)
3. Structure the data according to the template field definitions
4. Preserve original wording while cleaning up formatting
5. Return structured JSON data that matches the resume template format

### Parsing Quality

The AI parser is designed to:
- Handle various resume formats and styles
- Extract contact information (name, email, phone, location, LinkedIn, portfolio, GitHub)
- Parse work experience with company, position, dates, and achievements
- Extract education details with institution, degree, field, and dates
- Categorize skills into technical, soft skills, and languages
- Identify projects, certifications, awards, and other sections

## Error Handling

The system includes comprehensive error handling:

- File type validation
- File size validation
- Text extraction errors
- AI parsing errors
- Data validation errors

All errors are logged and returned to the user with helpful messages.

## Testing

### Manual Testing

1. Create a new resume
2. Choose "Import Existing Resume"
3. Upload a sample resume file or paste resume text
4. Verify that parsing completes successfully
5. Check that editor is prefilled with correct data
6. Make edits and save the resume

### Test Files

Prepare test resume files in different formats:
- `test-resume.pdf`
- `test-resume.docx`
- `test-resume.doc`
- `test-resume.txt`

## Troubleshooting

### Common Issues

**Issue**: "Unsupported file type"
- **Solution**: Ensure file is PDF, DOCX, DOC, or TXT format

**Issue**: "File size too large"
- **Solution**: Compress or reduce file size to under 10MB

**Issue**: "Failed to parse resume"
- **Solution**: Check that the resume has readable text (not scanned image)

**Issue**: "Parsed data is incomplete"
- **Solution**: The AI does its best to extract data; manually fill in missing information

## Future Enhancements

Potential improvements for this feature:

1. Support for more file formats (RTF, HTML, etc.)
2. OCR support for scanned PDF resumes
3. Multi-language resume parsing
4. Resume format detection and optimization
5. Duplicate detection and merging
6. Batch resume importing
7. Resume comparison and version control

## Contributing

When contributing to this feature:

1. Follow the existing code structure
2. Add tests for new functionality
3. Update documentation
4. Ensure backward compatibility
5. Handle errors gracefully

## License

This feature is part of the main application and follows the same license.

