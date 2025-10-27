'use client';

import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import toast from 'react-hot-toast';

export function AboutUsSettings() {
  const [aboutContent, setAboutContent] = useState<string>('');

  const handleSaveAbout = () => {
    // Here you would typically save to your backend/database
    toast.success('About Us content saved successfully!');
  };

  return (
    <RichTextEditor
      title="About Us"
      description="Edit your application's about us content"
      content={aboutContent}
      onContentChange={setAboutContent}
      onSave={handleSaveAbout}
      placeholder="Enter your about us content here..."
    />
  );
}