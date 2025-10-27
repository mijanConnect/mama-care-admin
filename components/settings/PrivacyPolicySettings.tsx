'use client';

import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import toast from 'react-hot-toast';

export function PrivacyPolicySettings() {
  const [privacyContent, setPrivacyContent] = useState<string>('');

  const handleSavePrivacy = () => {
    // Here you would typically save to your backend/database
    toast.success('Privacy Policy saved successfully!');
  };

  return (
    <RichTextEditor
      title="Privacy Policy"
      description="Edit your application's privacy policy"
      content={privacyContent}
      onContentChange={setPrivacyContent}
      onSave={handleSavePrivacy}
      placeholder="Enter your privacy policy here..."
    />
  );
}