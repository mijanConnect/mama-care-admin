'use client';

import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import toast from 'react-hot-toast';

export function TermsSettings() {
  const [termsContent, setTermsContent] = useState<string>('');

  const handleSaveTerms = () => {
    // Here you would typically save to your backend/database
    toast.success('Terms & Conditions saved successfully!');
  };

  return (
    <RichTextEditor
      title="Terms & Conditions"
      description="Edit your application's terms and conditions"
      content={termsContent}
      onContentChange={setTermsContent}
      onSave={handleSaveTerms}
      placeholder="Enter your terms and conditions here..."
    />
  );
}