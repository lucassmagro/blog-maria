"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useCallback } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
};

function ToolbarButton({
  ativo,
  onClick,
  children,
  titulo,
}: {
  ativo?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  titulo: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={titulo}
      aria-label={titulo}
      aria-pressed={ativo}
      className={`min-w-8 rounded px-2 py-1 text-[0.85rem] font-bold transition-colors ${
        ativo
          ? "bg-acento-hover text-fundo"
          : "text-texto-secundario hover:bg-linha/70 hover:text-acento-hover"
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = useCallback(() => {
    const anterior = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Endereço do link (URL):", anterior ?? "https://");
    if (url === null) return; // cancelou
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-linha p-2">
      <ToolbarButton
        titulo="Negrito"
        ativo={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <span className="font-extrabold">B</span>
      </ToolbarButton>
      <ToolbarButton
        titulo="Itálico"
        ativo={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-linha" aria-hidden="true" />
      <ToolbarButton
        titulo="Título (seção)"
        ativo={editor.isActive("heading", { level: 2 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        titulo="Subtítulo"
        ativo={editor.isActive("heading", { level: 3 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        H3
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-linha" aria-hidden="true" />
      <ToolbarButton
        titulo="Lista com marcadores"
        ativo={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •
      </ToolbarButton>
      <ToolbarButton
        titulo="Lista numerada"
        ativo={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </ToolbarButton>
      <ToolbarButton
        titulo="Citação"
        ativo={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        ❝
      </ToolbarButton>
      <span className="mx-1 h-5 w-px bg-linha" aria-hidden="true" />
      <ToolbarButton
        titulo="Link"
        ativo={editor.isActive("link")}
        onClick={setLink}
      >
        Link
      </ToolbarButton>
      <ToolbarButton
        titulo="Remover link"
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        ⛌
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // evita erro de hidratação no Next (SSR)
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "conteudo-artigo corpo-serif min-h-[320px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="overflow-hidden rounded-md border border-linha focus-within:border-acento">
      {editor ? <Toolbar editor={editor} /> : null}
      <EditorContent editor={editor} />
    </div>
  );
}
