# Settings Components

This directory contains modular components for the application settings page. Each settings section has been separated into its own component for better maintainability and reusability.

## Components

### ProfileSettings
- **File**: `ProfileSettings.tsx`
- **Purpose**: Handles user profile information updates
- **Features**: 
  - Avatar upload functionality
  - Name and email editing
  - Role and join date display (read-only)
  - Form validation and error handling

### PasswordSettings
- **File**: `PasswordSettings.tsx`
- **Purpose**: Handles password change functionality
- **Features**:
  - Current password verification
  - New password with confirmation
  - Password strength validation (minimum 8 characters)
  - Form validation and error handling

### RichTextEditor
- **File**: `RichTextEditor.tsx`
- **Purpose**: Reusable rich text editor component
- **Features**:
  - Rich text editing with ReactQuill
  - Fallback to textarea when ReactQuill is not available
  - Customizable toolbar with formatting options
  - Save functionality

### TermsSettings
- **File**: `TermsSettings.tsx`
- **Purpose**: Manages Terms & Conditions content
- **Features**:
  - Rich text editing for terms content
  - Save functionality with success notifications

### PrivacyPolicySettings
- **File**: `PrivacyPolicySettings.tsx`
- **Purpose**: Manages Privacy Policy content
- **Features**:
  - Rich text editing for privacy policy content
  - Save functionality with success notifications

### AboutUsSettings
- **File**: `AboutUsSettings.tsx`
- **Purpose**: Manages About Us content
- **Features**:
  - Rich text editing for about us content
  - Save functionality with success notifications

## Usage

All components are exported from the `index.ts` file for easy importing:

```typescript
import { 
  ProfileSettings, 
  PasswordSettings, 
  TermsSettings, 
  PrivacyPolicySettings, 
  AboutUsSettings 
} from '@/components/settings';
```

## Dependencies

- **react-quill**: Rich text editor (install with `npm install react-quill quill --legacy-peer-deps`)
- **@/components/ui/***: UI components from the project's component library
- **react-hot-toast**: For success/error notifications
- **@/lib/store**: Redux store for API mutations

## Features

1. **Modular Architecture**: Each settings section is a separate component
2. **Rich Text Editing**: Terms, Privacy Policy, and About Us sections use rich text editors
3. **Responsive Design**: All components are mobile-friendly
4. **Error Handling**: Proper error handling and user feedback
5. **Type Safety**: Full TypeScript support
6. **Fallback Support**: Graceful degradation when rich text editor is not available

## Styling

All components use Tailwind CSS classes and follow the existing design system with:
- Primary color: `#CD671C` (orange)
- Hover color: `#B85A18` (darker orange)
- Consistent spacing and typography