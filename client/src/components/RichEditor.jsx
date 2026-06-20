import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Heading2, Heading3, List, ListOrdered, Quote, Link, Trash } from 'lucide-react';

const RichEditor = ({ value, onChange, placeholder = 'Write your story...' }) => {
  const editorRef = useRef(null);

  // Sync initial or outside value change into the editor without resetting cursor
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleAddLink = () => {
    const url = prompt('Enter the link URL (e.g., https://google.com):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const handleClear = () => {
    executeCommand('removeFormat');
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden focus-within:border-primary-500 transition-colors bg-white dark:bg-gray-900 shadow-sm">
      {/* Editor Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-850 dark:hover:text-white rounded-lg transition-colors"
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-850 dark:hover:text-white rounded-lg transition-colors"
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-850 dark:hover:text-white rounded-lg transition-colors"
          title="Underline"
        >
          <Underline size={16} />
        </button>

        <span className="w-[1px] h-6 bg-gray-200 dark:bg-gray-800 mx-1"></span>

        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h2>')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-850 dark:hover:text-white rounded-lg transition-colors"
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h3>')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-850 dark:hover:text-white rounded-lg transition-colors"
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>

        <span className="w-[1px] h-6 bg-gray-200 dark:bg-gray-800 mx-1"></span>

        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-850 dark:hover:text-white rounded-lg transition-colors"
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-850 dark:hover:text-white rounded-lg transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<blockquote>')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-850 dark:hover:text-white rounded-lg transition-colors"
          title="Blockquote"
        >
          <Quote size={16} />
        </button>

        <span className="w-[1px] h-6 bg-gray-200 dark:bg-gray-800 mx-1"></span>

        <button
          type="button"
          onClick={handleAddLink}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-850 dark:hover:text-white rounded-lg transition-colors"
          title="Insert Link"
        >
          <Link size={16} />
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-850 dark:hover:text-white rounded-lg transition-colors"
          title="Clear Formatting"
        >
          <Trash size={16} />
        </button>
      </div>

      {/* Editor Body */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[300px] max-h-[600px] overflow-y-auto focus:outline-none dark:text-white prose dark:prose-invert max-w-none text-sm leading-relaxed"
        data-placeholder={placeholder}
        style={{
          outline: 'none',
        }}
      />

      {/* Placeholder Style */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          cursor: text;
        }
        .dark [contenteditable]:empty:before {
          color: #6b7280;
        }
        /* Custom stylings inside contentEditable */
        [contenteditable] ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        [contenteditable] ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        [contenteditable] blockquote {
          border-left: 4px solid #0ea5e9;
          padding-left: 1rem;
          color: #4b5563;
          font-style: italic;
          margin: 1rem 0;
        }
        .dark [contenteditable] blockquote {
          color: #9ca3af;
        }
        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        [contenteditable] a {
          color: #0ea5e9;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default RichEditor;
