import mongoose from 'mongoose';
import templateModel from './model/template-model.js';

const sampleTemplates = [
  {
    templateName: "Professional Classic",
    templateImage: "https://via.placeholder.com/400x565/4F46E5/FFFFFF?text=Professional+Classic",
    templateImageId: "professional-classic",
    isAtsRecommended: true,
    presets: [
      {
        key: "professional-classic-preset",
        name: "Professional Classic",
        industry: "General",
        sectionPresetKey: "standard-order",
        stylePackKey: "professional-blue",
        isPrimary: true
      }
    ],
    layoutSlots: ["main_column"],
    templateComponents: {
      htmlShell: `
        <div class="resume-container">
          <div class="header-section">
            <h1 class="name">{{personalInfo.fullName}}</h1>
            <div class="contact-info">
              <span>{{personalInfo.email}}</span>
              <span>{{personalInfo.phone}}</span>
              <span>{{personalInfo.location}}</span>
            </div>
          </div>
          <div class="main-content">
            <div class="section">
              <h2>Professional Summary</h2>
              <p>{{professionalSummary.summary}}</p>
            </div>
            <div class="section">
              <h2>Experience</h2>
              {{#each experience}}
              <div class="experience-item">
                <h3>{{jobTitle}} - {{company}}</h3>
                <p class="duration">{{startDate}} - {{endDate}}</p>
                <p>{{description}}</p>
              </div>
              {{/each}}
            </div>
            <div class="section">
              <h2>Education</h2>
              {{#each education}}
              <div class="education-item">
                <h3>{{degree}} - {{institution}}</h3>
                <p class="duration">{{graduationYear}}</p>
              </div>
              {{/each}}
            </div>
          </div>
        </div>
      `,
      baseCss: `
        .resume-container {
          font-family: 'Arial', sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }
        .header-section {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #4F46E5;
          padding-bottom: 20px;
        }
        .name {
          font-size: 2.5em;
          color: #4F46E5;
          margin: 0;
        }
        .contact-info {
          margin-top: 10px;
        }
        .contact-info span {
          margin: 0 10px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section h2 {
          color: #4F46E5;
          border-bottom: 1px solid #E5E7EB;
          padding-bottom: 5px;
        }
        .experience-item, .education-item {
          margin-bottom: 15px;
        }
        .duration {
          color: #6B7280;
          font-style: italic;
        }
      `,
      sections: [
        {
          key: "personalInfo",
          name: "Personal Information",
          html: "<div class='header-section'><h1 class='name'>{{fullName}}</h1><div class='contact-info'><span>{{email}}</span><span>{{phone}}</span><span>{{location}}</span></div></div>"
        },
        {
          key: "professionalSummary",
          name: "Professional Summary",
          html: "<div class='section'><h2>Professional Summary</h2><p>{{summary}}</p></div>"
        },
        {
          key: "experience",
          name: "Work Experience",
          html: "<div class='section'><h2>Experience</h2>{{#each experience}}<div class='experience-item'><h3>{{jobTitle}} - {{company}}</h3><p class='duration'>{{startDate}} - {{endDate}}</p><p>{{description}}</p></div>{{/each}}</div>"
        },
        {
          key: "education",
          name: "Education",
          html: "<div class='section'><h2>Education</h2>{{#each education}}<div class='education-item'><h3>{{degree}} - {{institution}}</h3><p class='duration'>{{graduationYear}}</p></div>{{/each}}</div>"
        }
      ],
      stylePacks: [
        {
          key: "professional-blue",
          name: "Professional Blue",
          css: `
            .resume-container { color: #1F2937; }
            .name, .section h2 { color: #4F46E5; }
            .contact-info span { color: #6B7280; }
          `
        }
      ],
      sectionPresets: [
        {
          key: "standard-order",
          name: "Standard Order",
          order: ["personalInfo", "professionalSummary", "experience", "education"]
        }
      ]
    },
    templateFieldDefinition: [
      {
        key: "personalInfo",
        type: "group",
        label: "Personal Information",
        fields: [
          { key: "fullName", type: "text", label: "Full Name", required: true },
          { key: "email", type: "email", label: "Email", required: true },
          { key: "phone", type: "text", label: "Phone", required: true },
          { key: "location", type: "text", label: "Location", required: true }
        ]
      },
      {
        key: "professionalSummary",
        type: "group",
        label: "Professional Summary",
        fields: [
          { key: "summary", type: "textarea", label: "Summary", required: true }
        ]
      },
      {
        key: "experience",
        type: "group",
        label: "Work Experience",
        repeatable: true,
        fields: [
          { key: "jobTitle", type: "text", label: "Job Title", required: true },
          { key: "company", type: "text", label: "Company", required: true },
          { key: "startDate", type: "date", label: "Start Date", required: true },
          { key: "endDate", type: "date", label: "End Date", required: false },
          { key: "description", type: "textarea", label: "Description", required: true }
        ]
      },
      {
        key: "education",
        type: "group",
        label: "Education",
        repeatable: true,
        fields: [
          { key: "degree", type: "text", label: "Degree", required: true },
          { key: "institution", type: "text", label: "Institution", required: true },
          { key: "graduationYear", type: "text", label: "Graduation Year", required: true }
        ]
      }
    ],
    tags: {
      style: "Professional",
      level: ["Entry", "Mid", "Senior"],
      industry: ["General", "Technology", "Business"]
    }
  },
  {
    templateName: "Modern Creative",
    templateImage: "https://via.placeholder.com/400x565/10B981/FFFFFF?text=Modern+Creative",
    templateImageId: "modern-creative",
    isAtsRecommended: false,
    presets: [
      {
        key: "modern-creative-preset",
        name: "Modern Creative",
        industry: "Creative",
        sectionPresetKey: "creative-order",
        stylePackKey: "modern-green",
        isPrimary: true
      }
    ],
    layoutSlots: ["main_column"],
    templateComponents: {
      htmlShell: `
        <div class="resume-container modern">
          <div class="header-section">
            <h1 class="name">{{personalInfo.fullName}}</h1>
            <div class="contact-info">
              <span>{{personalInfo.email}}</span>
              <span>{{personalInfo.phone}}</span>
              <span>{{personalInfo.location}}</span>
            </div>
          </div>
          <div class="main-content">
            <div class="section">
              <h2>About Me</h2>
              <p>{{professionalSummary.summary}}</p>
            </div>
            <div class="section">
              <h2>Experience</h2>
              {{#each experience}}
              <div class="experience-item">
                <h3>{{jobTitle}} - {{company}}</h3>
                <p class="duration">{{startDate}} - {{endDate}}</p>
                <p>{{description}}</p>
              </div>
              {{/each}}
            </div>
            <div class="section">
              <h2>Education</h2>
              {{#each education}}
              <div class="education-item">
                <h3>{{degree}} - {{institution}}</h3>
                <p class="duration">{{graduationYear}}</p>
              </div>
              {{/each}}
            </div>
          </div>
        </div>
      `,
      baseCss: `
        .resume-container.modern {
          font-family: 'Helvetica', sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: white;
        }
        .header-section {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .name {
          font-size: 2.5em;
          color: white;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .contact-info {
          margin-top: 10px;
        }
        .contact-info span {
          margin: 0 10px;
          background: rgba(255, 255, 255, 0.2);
          padding: 5px 10px;
          border-radius: 15px;
        }
        .main-content {
          background: white;
          color: #1F2937;
          padding: 20px;
          border-radius: 10px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section h2 {
          color: #10B981;
          border-bottom: 2px solid #10B981;
          padding-bottom: 5px;
        }
        .experience-item, .education-item {
          margin-bottom: 15px;
        }
        .duration {
          color: #6B7280;
          font-style: italic;
        }
      `,
      sections: [
        {
          key: "personalInfo",
          name: "Personal Information",
          html: "<div class='header-section'><h1 class='name'>{{fullName}}</h1><div class='contact-info'><span>{{email}}</span><span>{{phone}}</span><span>{{location}}</span></div></div>"
        },
        {
          key: "professionalSummary",
          name: "About Me",
          html: "<div class='section'><h2>About Me</h2><p>{{summary}}</p></div>"
        },
        {
          key: "experience",
          name: "Work Experience",
          html: "<div class='section'><h2>Experience</h2>{{#each experience}}<div class='experience-item'><h3>{{jobTitle}} - {{company}}</h3><p class='duration'>{{startDate}} - {{endDate}}</p><p>{{description}}</p></div>{{/each}}</div>"
        },
        {
          key: "education",
          name: "Education",
          html: "<div class='section'><h2>Education</h2>{{#each education}}<div class='education-item'><h3>{{degree}} - {{institution}}</h3><p class='duration'>{{graduationYear}}</p></div>{{/each}}</div>"
        }
      ],
      stylePacks: [
        {
          key: "modern-green",
          name: "Modern Green",
          css: `
            .resume-container.modern { background: linear-gradient(135deg, #10B981 0%, #059669 100%); }
            .section h2 { color: #10B981; border-bottom: 2px solid #10B981; }
          `
        }
      ],
      sectionPresets: [
        {
          key: "creative-order",
          name: "Creative Order",
          order: ["personalInfo", "professionalSummary", "experience", "education"]
        }
      ]
    },
    templateFieldDefinition: [
      {
        key: "personalInfo",
        type: "group",
        label: "Personal Information",
        fields: [
          { key: "fullName", type: "text", label: "Full Name", required: true },
          { key: "email", type: "email", label: "Email", required: true },
          { key: "phone", type: "text", label: "Phone", required: true },
          { key: "location", type: "text", label: "Location", required: true }
        ]
      },
      {
        key: "professionalSummary",
        type: "group",
        label: "About Me",
        fields: [
          { key: "summary", type: "textarea", label: "Summary", required: true }
        ]
      },
      {
        key: "experience",
        type: "group",
        label: "Work Experience",
        repeatable: true,
        fields: [
          { key: "jobTitle", type: "text", label: "Job Title", required: true },
          { key: "company", type: "text", label: "Company", required: true },
          { key: "startDate", type: "date", label: "Start Date", required: true },
          { key: "endDate", type: "date", label: "End Date", required: false },
          { key: "description", type: "textarea", label: "Description", required: true }
        ]
      },
      {
        key: "education",
        type: "group",
        label: "Education",
        repeatable: true,
        fields: [
          { key: "degree", type: "text", label: "Degree", required: true },
          { key: "institution", type: "text", label: "Institution", required: true },
          { key: "graduationYear", type: "text", label: "Graduation Year", required: true }
        ]
      }
    ],
    tags: {
      style: "Creative",
      level: ["Entry", "Mid", "Senior"],
      industry: ["Creative", "Design", "Marketing"]
    }
  }
];

const seedTemplates = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017');
    console.log('Connected to MongoDB');
    
    // Clear existing templates
    await templateModel.deleteMany({});
    console.log('Cleared existing templates');
    
    // Insert sample templates
    const insertedTemplates = await templateModel.insertMany(sampleTemplates);
    console.log(`Inserted ${insertedTemplates.length} templates`);
    
    console.log('Templates seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding templates:', error);
    process.exit(1);
  }
};

seedTemplates();
