import React from 'react';
import ReactMarkdown from 'react-markdown';
import { formatMathText } from '../utils/mathFormatter';

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

export const FormattedMarkdown: React.FC<FormattedMarkdownProps> = ({
  content,
  className = '',
}) => {
  const cleanFormatted = formatMathText(content || '');

  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none leading-relaxed break-words ${className}`}>
      <ReactMarkdown>{cleanFormatted}</ReactMarkdown>
    </div>
  );
};
