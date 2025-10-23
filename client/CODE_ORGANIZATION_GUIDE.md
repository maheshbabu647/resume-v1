# Code Organization Guide

## Overview
This guide outlines the organizational patterns, conventions, and best practices used in the frontend codebase. Following these guidelines ensures consistency and maintainability across the project.

## Directory Structure

```
client/src/
├── api/                    # API service functions
│   ├── index.js           # Axios instance configuration
│   ├── resumeServiceApi.js    # Resume CRUD operations
│   ├── atsScoreServiceApi.js  # ATS analysis services
│   ├── authServiceApi.js      # Authentication services
│   └── ...
├── components/            # Reusable UI components
│   ├── Common/           # Shared components (Buttons, Cards, etc.)
│   ├── ResumeEditor/     # Editor-specific components
│   ├── Auth/             # Authentication components
│   ├── ui/               # shadcn/ui components
│   └── ...
├── context/              # React Context providers
│   ├── AuthContext.jsx
│   ├── ResumeContext.jsx
│   ├── TemplateContext.jsx
│   └── index.js          # Central export
├── hooks/                # Custom React hooks
│   ├── useFormHandlers.js
│   ├── useResumeEditorState.jsx
│   ├── useAuth.js
│   └── ...
├── pages/                # Page-level components
│   ├── Resume/
│   ├── ATSChecker/
│   ├── Auth/
│   └── ...
├── utils/                # Utility functions
│   ├── EditorUtils.js
│   └── ...
└── lib/                  # Third-party library configurations
    └── utils.js
```

## File Organization Patterns

### 1. API Service Files

```javascript
/**
 * @fileoverview [Service Name] API - [Brief description]
 * @module api/[serviceName]
 * @description [Detailed description of what this service handles]
 */

import apiServer from './index.js';

// ============================================================================
// [SECTION NAME - e.g., CRUD OPERATIONS]
// ============================================================================

/**
 * [Function description]
 * @async
 * @function functionName
 * @param {Type} param - Description
 * @returns {Promise<Type>} Description
 * @throws {Error} Description
 * @example
 * const result = await functionName(param);
 */
export const functionName = async (param) => {
    // Implementation
};
```

**Key Points:**
- Group related functions under section headers
- Use consistent error handling patterns
- Include usage examples for complex functions
- Document all parameters and return types

### 2. Utility Files

```javascript
/**
 * @fileoverview [Utility Name] - [Brief description]
 * @module utils/[utilityName]
 * @description [Detailed description of utility purpose]
 */

import dependencies...

// ============================================================================
// [LOGICAL GROUPING - e.g., DATA VALIDATION]
// ============================================================================

/**
 * [Function description]
 * @function functionName
 * @param {Type} param - Description
 * @returns {Type} Description
 * @description [Detailed description]
 * @example
 * const result = functionName(input);
 */
export const functionName = (param) => {
    // Implementation
};
```

**Key Points:**
- Organize functions by purpose
- Keep utilities pure and testable
- Add examples for non-obvious behavior
- Use descriptive function names

### 3. Custom Hooks

```javascript
/**
 * @fileoverview [Hook Name] - [Brief description]
 * @module hooks/[hookName]
 * @description [Detailed description of hook purpose]
 */

import React dependencies...

// ============================================================================
// HELPER FUNCTIONS (if needed)
// ============================================================================

/**
 * Helper function description
 * @private
 */
const helperFunction = () => {
    // Implementation
};

// ============================================================================
// HOOK DEFINITION
// ============================================================================

/**
 * Custom hook description
 * @hook
 * @function useHookName
 * @param {Object} config - Hook configuration
 * @returns {Object} Hook return value
 * @description [Detailed description]
 * @example
 * const { value, handler } = useHookName({ config });
 */
export const useHookName = (config) => {
    // Hook implementation
    
    return {
        // Return values
    };
};
```

**Key Points:**
- Mark helper functions as `@private`
- Use the `@hook` tag for custom hooks
- Document all configuration parameters
- Provide usage examples

### 4. Context Providers

```javascript
/**
 * @fileoverview [Context Name] - [Brief description]
 * @module context/[ContextName]
 * @description [Detailed description of context purpose]
 */

import React dependencies...

/**
 * Context object
 * @type {React.Context}
 */
const MyContext = createContext(null);

// ============================================================================
// CONTEXT PROVIDER COMPONENT
// ============================================================================

/**
 * Context Provider Component
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 * @description [Provider description]
 */
const MyContextProvider = ({ children }) => {
    // ========================================================================
    // STATE
    // ========================================================================
    
    /** @type {[Type, Function]} Description */
    const [state, setState] = useState(initialValue);
    
    // ========================================================================
    // OPERATIONS
    // ========================================================================
    
    /**
     * Operation description
     * @async
     * @function operationName
     * @returns {Promise<void>}
     */
    const operationName = useCallback(async () => {
        // Implementation
    }, [dependencies]);
    
    // Context value
    const contextValue = {
        // Values and functions
    };
    
    return (
        <MyContext.Provider value={contextValue}>
            {children}
        </MyContext.Provider>
    );
};

export { MyContext, MyContextProvider };
```

**Key Points:**
- Organize state into logical groups
- Use section comments for clarity
- Document all operations
- Type annotate state variables

### 5. React Components

```javascript
/**
 * @fileoverview [Component Name] - [Brief description]
 * @module components/[category]/[ComponentName]
 * @description [Detailed description]
 */

import dependencies...

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Component description
 * @component
 * @param {Object} props - Component props
 * @param {Type} props.propName - Prop description
 * @returns {JSX.Element}
 * @description [Detailed description]
 * @example
 * <MyComponent propName={value} />
 */
const MyComponent = ({ propName }) => {
    // Component implementation
    
    return (
        // JSX
    );
};

export default MyComponent;
```

**Key Points:**
- Use the `@component` tag
- Document all props
- Provide usage examples
- Export default for page components, named for utilities

## Naming Conventions

### Files
- **Components**: PascalCase (e.g., `ResumeEditor.jsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useFormHandlers.js`)
- **Utilities**: camelCase (e.g., `editorUtils.js`)
- **API Services**: camelCase with 'Api' suffix (e.g., `resumeServiceApi.js`)
- **Context**: PascalCase with 'Context' suffix (e.g., `ResumeContext.jsx`)

### Functions
- **Regular functions**: camelCase (e.g., `calculateProgress`)
- **React components**: PascalCase (e.g., `ResumeEditor`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useFormHandlers`)
- **Event handlers**: camelCase with 'handle' prefix (e.g., `handleSubmit`)

### Variables
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Regular variables**: camelCase (e.g., `resumeData`)
- **Boolean variables**: camelCase with 'is/has/should' prefix (e.g., `isLoading`)
- **Private variables**: camelCase with underscore prefix (e.g., `_internalState`)

### State Variables
- **State**: camelCase (e.g., `isLoading`)
- **Setter**: 'set' + PascalCase (e.g., `setIsLoading`)

## Code Organization Best Practices

### 1. Import Organization
```javascript
// React and third-party libraries
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// UI Components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Custom components
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Hooks
import { useAuth } from '@/hooks/useAuth';
import { useResume } from '@/hooks/useResume';

// Utils and helpers
import { formatDate } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

// API
import { getResumes } from '@/api/resumeServiceApi';

// Assets
import logo from '@/assets/logo.svg';
```

### 2. Component Structure
```javascript
const MyComponent = (props) => {
    // 1. Props destructuring
    const { prop1, prop2, onAction } = props;
    
    // 2. Router hooks
    const navigate = useNavigate();
    const { id } = useParams();
    
    // 3. Context hooks
    const { user } = useAuth();
    const { resume } = useResume();
    
    // 4. State hooks
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    
    // 5. Refs
    const inputRef = useRef(null);
    
    // 6. Custom hooks
    const { handler } = useCustomHook();
    
    // 7. Derived state / Memoized values
    const processedData = useMemo(() => {
        return data ? processData(data) : null;
    }, [data]);
    
    // 8. Event handlers
    const handleClick = useCallback(() => {
        // Handler logic
    }, [dependencies]);
    
    // 9. Effects
    useEffect(() => {
        // Effect logic
    }, [dependencies]);
    
    // 10. Early returns
    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage />;
    
    // 11. Render
    return (
        // JSX
    );
};
```

### 3. Section Separators
Use visual separators for better code organization:

```javascript
// ============================================================================
// MAIN SECTION
// ============================================================================

// ========================================================================
// SUBSECTION
// ========================================================================

// ------------------------------------------------------------------------
// Minor grouping
// ------------------------------------------------------------------------
```

### 4. Comment Guidelines
- Use JSDoc for all exported functions
- Use inline comments for complex logic
- Avoid obvious comments
- Explain "why" not "what"

**Good:**
```javascript
// Debounce to prevent excessive API calls during rapid input
const debouncedSearch = debounce(search, 300);
```

**Bad:**
```javascript
// Set loading to true
setLoading(true);
```

## JSDoc Tags Reference

### Common Tags
- `@fileoverview` - File description
- `@module` - Module path
- `@description` - Detailed description
- `@function` - Function declaration
- `@component` - React component
- `@hook` - Custom hook
- `@param` - Function parameter
- `@returns` - Return value
- `@throws` - Error throws
- `@example` - Usage example
- `@async` - Async function
- `@private` - Private function
- `@deprecated` - Deprecated function
- `@type` - Type annotation

### Type Annotations
```javascript
/** @type {string} */
const name = 'John';

/** @type {Array<Object>} */
const items = [];

/** @type {Object.<string, number>} */
const scores = {};

/** @type {React.RefObject<HTMLInputElement>} */
const inputRef = useRef(null);

/** @type {[boolean, Function]} */
const [isOpen, setIsOpen] = useState(false);
```

## Testing Considerations

### Component Organization for Testing
- Keep components focused (single responsibility)
- Extract business logic to hooks and utilities
- Use dependency injection for testability
- Avoid deep nesting

### Testable Pattern Example
```javascript
// ❌ Hard to test
const Component = () => {
    const data = fetchData();  // Direct API call
    return <div>{data}</div>;
};

// ✅ Easy to test
const Component = ({ data, onFetch }) => {
    useEffect(() => {
        onFetch();
    }, [onFetch]);
    
    return <div>{data}</div>;
};
```

## Error Handling Patterns

### API Calls
```javascript
try {
    const data = await apiCall();
    return data;
} catch (error) {
    console.error('Descriptive error message:', error);
    throw error.response?.data || { 
        message: 'User-friendly error message' 
    };
}
```

### Component Error Boundaries
- Use Error Boundaries for component-level errors
- Provide fallback UI
- Log errors for debugging

## Performance Considerations

### Memoization
```javascript
// Memoize expensive calculations
const processedData = useMemo(() => {
    return expensiveOperation(data);
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
    doSomething();
}, [dependencies]);
```

### Code Splitting
```javascript
// Lazy load components
const HeavyComponent = React.lazy(() => 
    import('./HeavyComponent')
);

// Use with Suspense
<Suspense fallback={<Loading />}>
    <HeavyComponent />
</Suspense>
```

## Conclusion

Following these organizational patterns ensures:
- **Consistency** across the codebase
- **Maintainability** for long-term development
- **Onboarding** ease for new developers
- **Code Quality** through standardization

Always refer to this guide when creating new files or refactoring existing code.

---
**Last Updated**: October 22, 2025
**Status**: Living Document

