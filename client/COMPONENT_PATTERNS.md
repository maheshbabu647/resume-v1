# React Component Patterns & Best Practices

## Overview
This document outlines the component patterns and best practices used in the CareerForge resume builder application. Following these patterns ensures consistency, maintainability, and optimal performance.

## Component Categories

### 1. Page Components
**Location**: `src/pages/`  
**Purpose**: Top-level route components that compose smaller components

**Pattern**:
```javascript
/**
 * @fileoverview [Page Name] - [Description]
 * @component
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout/MainLayout';
import SectionOne from '@/components/[Page]/SectionOne';
import SectionTwo from '@/components/[Page]/SectionTwo';

const PageName = () => {
    return (
        <>
            <Helmet>
                <title>Page Title | CareerForge</title>
                <meta name="description" content="Page description" />
            </Helmet>
            
            <Layout>
                <SectionOne />
                <SectionTwo />
            </Layout>
        </>
    );
};

export default PageName;
```

**Characteristics**:
- Handle routing and SEO
- Compose smaller components
- Minimal business logic
- Use layout components

### 2. Container Components
**Location**: `src/components/[Feature]/`  
**Purpose**: Smart components that handle state and business logic

**Pattern**:
```javascript
/**
 * @fileoverview [Component Name] - Business logic container
 * @component
 */

import React, { useState, useEffect } from 'react';
import { useCustomHook } from '@/hooks/useCustomHook';
import PresentationalComponent from './PresentationalComponent';

/**
 * Container component description
 * @component
 * @param {Object} props
 * @returns {JSX.Element}
 */
const ContainerComponent = (props) => {
    // State management
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Custom hooks for business logic
    const { handler } = useCustomHook();
    
    // Effects
    useEffect(() => {
        // Side effects
    }, []);
    
    // Event handlers
    const handleAction = () => {
        // Logic
    };
    
    // Pass data and handlers to presentational component
    return (
        <PresentationalComponent 
            data={data}
            isLoading={isLoading}
            onAction={handleAction}
        />
    );
};

export default ContainerComponent;
```

**Characteristics**:
- Manage state and side effects
- Use custom hooks
- Pass data and handlers to children
- Minimal UI rendering

### 3. Presentational Components
**Location**: `src/components/[Feature]/`  
**Purpose**: Pure UI components with no business logic

**Pattern**:
```javascript
/**
 * @fileoverview [Component Name] - UI presentation
 * @component
 */

import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Presentational component description
 * @component
 * @param {Object} props
 * @param {string} props.title - Title text
 * @param {boolean} [props.isActive] - Active state
 * @param {Function} props.onClick - Click handler
 * @returns {JSX.Element}
 */
const PresentationalComponent = ({ 
    title, 
    isActive = false, 
    onClick 
}) => {
    return (
        <div 
            className={cn(
                "base-classes",
                isActive && "active-classes"
            )}
            onClick={onClick}
        >
            <h2>{title}</h2>
        </div>
    );
};

export default PresentationalComponent;
```

**Characteristics**:
- Pure functions of props
- No state management
- No side effects
- Highly reusable
- Easy to test

### 4. UI Components
**Location**: `src/components/ui/`  
**Purpose**: Reusable, atomic UI elements (buttons, inputs, cards)

**Pattern**:
```javascript
/**
 * @fileoverview [UI Component] - Reusable UI element
 * @component
 */

import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    "base classes",
    {
        variants: {
            variant: {
                default: "default classes",
                outline: "outline classes",
                ghost: "ghost classes",
            },
            size: {
                default: "default size",
                sm: "small size",
                lg: "large size",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

/**
 * Button component
 * @component
 * @param {Object} props
 * @param {string} [props.variant='default'] - Button variant
 * @param {string} [props.size='default'] - Button size
 * @param {string} [props.className] - Additional classes
 * @returns {JSX.Element}
 */
const Button = React.forwardRef(
    ({ variant, size, className, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

**Characteristics**:
- Highly reusable
- Variant-based styling
- Forward refs when needed
- Composable

### 5. Form Components
**Location**: `src/components/[Feature]/`  
**Purpose**: Handle form state and validation

**Pattern**:
```javascript
/**
 * @fileoverview [Form Component] - Form with validation
 * @component
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Validation schema
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
});

/**
 * Form component with validation
 * @component
 * @param {Object} props
 * @param {Function} props.onSubmit - Submit handler
 * @returns {JSX.Element}
 */
const FormComponent = ({ onSubmit }) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
        },
    });
    
    const handleSubmit = form.handleSubmit((data) => {
        onSubmit(data);
    });
    
    return (
        <form onSubmit={handleSubmit}>
            <input {...form.register('name')} />
            {form.formState.errors.name && (
                <span>{form.formState.errors.name.message}</span>
            )}
            
            <button type="submit">Submit</button>
        </form>
    );
};

export default FormComponent;
```

**Characteristics**:
- Use validation libraries
- Handle form state
- Show error messages
- Type-safe with schemas

## Common Patterns

### 1. Conditional Rendering

```javascript
// Early return pattern
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return null;

// Ternary operator
{isVisible ? <Component /> : null}

// Logical AND
{isVisible && <Component />}

// Multiple conditions
{isLoading ? (
    <LoadingSpinner />
) : error ? (
    <ErrorMessage error={error} />
) : (
    <Content data={data} />
)}
```

### 2. List Rendering

```javascript
// With keys
{items.map((item) => (
    <ListItem 
        key={item.id} 
        item={item} 
    />
))}

// With index (only if no stable ID)
{items.map((item, index) => (
    <ListItem 
        key={`item-${index}`} 
        item={item} 
    />
))}

// With conditional rendering
{items.length > 0 ? (
    items.map((item) => <ListItem key={item.id} item={item} />)
) : (
    <EmptyState />
)}
```

### 3. Event Handling

```javascript
// Inline handler (simple cases)
<button onClick={() => setCount(count + 1)}>
    Increment
</button>

// Named handler (complex logic)
const handleClick = (event) => {
    event.preventDefault();
    // Complex logic
};

<button onClick={handleClick}>Click</button>

// With parameters
const handleItemClick = (itemId) => () => {
    // Handle click
};

<button onClick={handleItemClick(item.id)}>
    Click
</button>

// Memoized handler
const handleClick = useCallback(() => {
    // Logic
}, [dependencies]);
```

### 4. Props Patterns

```javascript
// Destructuring with defaults
const Component = ({ 
    title, 
    subtitle = 'Default subtitle',
    isActive = false,
    onClick = () => {},
    ...rest 
}) => {
    // Component logic
};

// Prop spreading
<Component {...commonProps} />

// Children prop
const Container = ({ children, className }) => (
    <div className={className}>
        {children}
    </div>
);

// Render props
const DataProvider = ({ render, data }) => (
    <div>{render(data)}</div>
);

<DataProvider 
    data={data} 
    render={(data) => <Display data={data} />} 
/>
```

### 5. Composition Patterns

```javascript
// Compound components
const Card = ({ children, ...props }) => (
    <div {...props}>{children}</div>
);

Card.Header = ({ children }) => (
    <div className="header">{children}</div>
);

Card.Body = ({ children }) => (
    <div className="body">{children}</div>
);

// Usage
<Card>
    <Card.Header>Title</Card.Header>
    <Card.Body>Content</Card.Body>
</Card>

// Higher-Order Components (use sparingly)
const withAuth = (Component) => {
    return (props) => {
        const { isAuthenticated } = useAuth();
        
        if (!isAuthenticated) {
            return <LoginPrompt />;
        }
        
        return <Component {...props} />;
    };
};

// Render props
const MouseTracker = ({ render }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    
    useEffect(() => {
        const handleMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };
        
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);
    
    return render(position);
};
```

### 6. Performance Optimization

```javascript
// Memoize expensive calculations
const processedData = useMemo(() => {
    return data.map(item => expensiveTransform(item));
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
    doSomething(id);
}, [id]);

// Memoize components
const MemoizedComponent = React.memo(Component, (prevProps, nextProps) => {
    // Return true if passing nextProps would return same result
    return prevProps.id === nextProps.id;
});

// Code splitting
const HeavyComponent = React.lazy(() => 
    import('./HeavyComponent')
);

<Suspense fallback={<Loading />}>
    <HeavyComponent />
</Suspense>
```

### 7. Error Handling

```javascript
// Error boundary class component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
        console.error('Error caught:', error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return this.props.fallback || <ErrorMessage />;
        }
        
        return this.props.children;
    }
}

// Usage
<ErrorBoundary fallback={<ErrorFallback />}>
    <App />
</ErrorBoundary>

// Try-catch in async operations
const fetchData = async () => {
    try {
        const data = await api.getData();
        setData(data);
    } catch (error) {
        setError(error.message);
    } finally {
        setIsLoading(false);
    }
};
```

### 8. Accessibility Patterns

```javascript
// Semantic HTML
<button onClick={handleClick}>Click me</button>  // ✅
<div onClick={handleClick}>Click me</div>         // ❌

// ARIA labels
<button 
    aria-label="Close dialog" 
    onClick={handleClose}
>
    <X />
</button>

// Keyboard navigation
const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        handleClick();
    }
};

<div 
    role="button" 
    tabIndex={0}
    onClick={handleClick}
    onKeyDown={handleKeyDown}
>
    Click me
</div>

// Focus management
useEffect(() => {
    if (isOpen) {
        inputRef.current?.focus();
    }
}, [isOpen]);
```

## Anti-Patterns to Avoid

### 1. ❌ Mutating State Directly
```javascript
// ❌ Bad
state.items.push(newItem);
setState(state);

// ✅ Good
setState({
    ...state,
    items: [...state.items, newItem]
});
```

### 2. ❌ Missing Keys in Lists
```javascript
// ❌ Bad
{items.map(item => <Item {...item} />)}

// ✅ Good
{items.map(item => <Item key={item.id} {...item} />)}
```

### 3. ❌ Props Drilling
```javascript
// ❌ Bad - passing props through many levels
<Parent prop={value}>
    <Child prop={value}>
        <GrandChild prop={value}>
            <GreatGrandChild prop={value} />
        </GrandChild>
    </Child>
</Parent>

// ✅ Good - use Context or state management
const MyContext = createContext();

<MyContext.Provider value={value}>
    <Parent>
        <Child>
            <GrandChild>
                <GreatGrandChild />
            </GrandChild>
        </Child>
    </Parent>
</MyContext.Provider>
```

### 4. ❌ Inline Functions in JSX (when causing re-renders)
```javascript
// ❌ Bad (creates new function on every render)
<Component onChange={(e) => handleChange(e)} />

// ✅ Good (memoized)
const handleChange = useCallback((e) => {
    // logic
}, [dependencies]);

<Component onChange={handleChange} />
```

### 5. ❌ Large Components
```javascript
// ❌ Bad - 500+ line component
const GiantComponent = () => {
    // Lots of state
    // Lots of logic
    // Lots of JSX
    // ...
};

// ✅ Good - break into smaller components
const Feature = () => {
    return (
        <>
            <Header />
            <Content />
            <Footer />
        </>
    );
};
```

## Testing Patterns

### Unit Testing Components
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
    it('renders correctly', () => {
        render(<Component title="Test" />);
        expect(screen.getByText('Test')).toBeInTheDocument();
    });
    
    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<Component onClick={handleClick} />);
        
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
```

## Conclusion

Following these component patterns ensures:
- **Consistency** across the codebase
- **Maintainability** for future updates
- **Performance** optimization
- **Accessibility** compliance
- **Testability** for quality assurance

Always consider these patterns when building or refactoring components.

---
**Last Updated**: October 22, 2025
**Reference**: React 18+ Best Practices

