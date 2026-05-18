import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { Link as TiptapLink } from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import { JSONContent } from "@tiptap/react";

interface PostContentProps {
  content: JSONContent;
}

export function PostContent({ content }: PostContentProps) {
  const html = generateHTML(content, [StarterKit, TiptapLink, TiptapImage]);

  return (
    <div
      className="prose prose-stone prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
