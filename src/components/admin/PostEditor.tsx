"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  PlayCircle as YoutubeIcon,
  Undo,
  Redo,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PostEditorProps {
  value: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export function PostEditor({ value, onChange }: PostEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false }),
      Youtube.configure({ width: 640, height: 360 }),
      Placeholder.configure({ placeholder: "Comece a escrever seu post..." }),
    ],
    content: value && Object.keys(value).length > 0 ? value : undefined,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON() as Record<string, unknown>);
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[400px] p-4",
      },
    },
  });

  const uploadImage = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !editor) return;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "images");

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const { url } = await res.json();
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        toast.error("Erro ao enviar imagem");
      }
    };
    input.click();
  }, [editor]);

  const insertLink = useCallback(() => {
    const url = window.prompt("URL do link:");
    if (!url || !editor) return;
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const insertYoutube = useCallback(() => {
    const url = window.prompt("URL do YouTube:");
    if (!url || !editor) return;
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }, [editor]);

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "p-2 rounded-lg transition-colors hover:bg-stone-100",
        active ? "bg-amber-100 text-amber-700" : "text-stone-600"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-stone-100 bg-stone-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Negrito"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Itálico"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Código"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px bg-stone-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Título H2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Título H3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px bg-stone-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Lista"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Citação"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px bg-stone-200 mx-1" />

        <ToolbarButton onClick={insertLink} title="Inserir link" active={editor.isActive("link")}>
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={uploadImage} title="Inserir imagem">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={insertYoutube} title="Inserir vídeo YouTube">
          <YoutubeIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px bg-stone-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Desfazer"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Refazer"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} className="tiptap-editor" />

      {/* Word count */}
      <div className="px-4 py-2 border-t border-stone-100 bg-stone-50 text-xs text-stone-400">
        {editor.storage.characterCount?.characters?.() ?? 0} caracteres
      </div>
    </div>
  );
}
