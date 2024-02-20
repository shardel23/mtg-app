"use client";

export const LineSeperator = ({ content }: { content?: string }) => {
  return content ? (
    <div className="relative flex items-center">
      <div className="flex-grow border-t border-gray-400"></div>
      <span className="flex-shrink mx-4 text-gray-400">{content}</span>
      <div className="flex-grow border-t border-gray-400"></div>
    </div>
  ) : (
    <div className="flex-grow border-t border-gray-400"></div>
  );
};
