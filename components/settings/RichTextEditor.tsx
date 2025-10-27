'use client';

import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

// Dynamically import Jodit Editor to avoid SSR issues
const JoditEditor = dynamic(() => import('jodit-react'), { 
  ssr: false,
  loading: () => <div>Loading editor...</div>
});

// Jodit styles are included with the component

interface RichTextEditorProps {
  title: string;
  description: string;
  content: string;
  onContentChange: (content: string) => void;
  onSave: () => void;
  placeholder?: string;
}

export default function RichTextEditor({
  title,
  description,
  content,
  onContentChange,
  onSave,
  placeholder = 'Enter your content here...'
}: RichTextEditorProps) {
  const editor = useRef(null);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: placeholder,
    height: 300,
    toolbar: true,
    spellcheck: true,
    language: 'en',
    toolbarButtonSize: 'medium',
    theme: 'default',
    enableDragAndDropFileToEditor: true,
    uploader: {
      insertImageAsBase64URI: true
    },
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'superscript', 'subscript', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'link', 'table', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'symbol', 'fullsize', 'print', 'about'
    ],
    // Prevent cursor jumping issues
    processPasteHTML: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html'
  }), [placeholder]);

  // Local state to manage content without causing re-renders
  const [localContent, setLocalContent] = useState(content);
  
  // Update local content when prop changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  // Debounced content change handler
  const handleContentChange = useCallback((newContent: string) => {
    setLocalContent(newContent);
  }, []);

  // Handle blur event to save content
  const handleBlur = useCallback((newContent: string) => {
    onContentChange(newContent);
  }, [onContentChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`content-${title.toLowerCase().replace(/\s+/g, '-')}`}>Content</Label>
            {JoditEditor ? (
              <div className="min-h-[300px] border rounded-md overflow-hidden">
                <JoditEditor
                  ref={editor}
                  value={localContent}
                  config={{
                    ...config,
                    toolbarButtonSize: 'middle' as const
                  }}
                  onBlur={handleBlur}
                  onChange={handleContentChange}
                />
              </div>
            ) : (
              <Textarea
                id={`content-${title.toLowerCase().replace(/\s+/g, '-')}`}
                placeholder={placeholder}
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                rows={15}
                className="resize-none min-h-[300px]"
              />
            )}
          </div>
          <div className="flex justify-end pt-4">
            <Button
              onClick={onSave}
              className="bg-[#CD671C] hover:bg-[#B85A18] text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              Save {title}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}