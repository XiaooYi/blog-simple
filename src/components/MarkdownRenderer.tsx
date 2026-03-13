'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-sm sm:prose-base max-w-none 
      prose-p:text-[#333333] prose-p:leading-[1.8] prose-p:text-[16px]
      prose-headings:text-[#1d2129] prose-headings:font-bold
      prose-a:text-[#1a7af8] prose-a:no-underline hover:prose-a:underline
      prose-strong:text-[#1d2129] prose-strong:font-bold
      prose-blockquote:border-l-4 prose-blockquote:border-[#c9cdd4] prose-blockquote:bg-[#f7f8fa] prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:text-[#86909c] prose-blockquote:not-italic
      prose-code:text-[#eb5757] prose-code:bg-[#f2f3f5] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-[#282c34] prose-pre:text-[#abb2bf] prose-pre:p-4 prose-pre:rounded-md prose-pre:shadow-sm prose-pre:overflow-x-auto
      prose-li:text-[#333333] prose-li:leading-[1.8]
      prose-img:rounded-md prose-img:shadow-sm prose-img:mx-auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}