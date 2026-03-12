'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-sm sm:prose-base max-w-none text-gray-800 prose-headings:text-gray-900 prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-code:text-rose-600 prose-code:bg-rose-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:text-gray-800 prose-pre:border prose-pre:border-gray-200 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:text-gray-600 prose-blockquote:bg-gray-50 prose-blockquote:py-1 prose-blockquote:pr-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}