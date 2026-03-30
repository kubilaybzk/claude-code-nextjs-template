'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { BoldIcon, CodeIcon, Heading1Icon, ItalicIcon, ListIcon, ListOrderedIcon, Redo2Icon, Undo2Icon } from 'lucide-react';

/**
 * Zengin metin editoru — Tiptap tabanli
 *
 * Temel formatlama destekler: bold, italic, baslik, liste,
 * sirali liste, kod blogu, geri al, ileri al.
 *
 * @example
 * <RichTextEditor
 *   content={htmlString}
 *   onChange={(html) => setContent(html)}
 *   placeholder="Icerik yazin..."
 * />
 */

interface RichTextEditorProps {
  /** HTML icerik */
  content: string;
  /** Icerik degistiginde cagrilir — HTML string doner */
  onChange: (html: string) => void;
  /** Placeholder metni */
  placeholder?: string;
  /** Ek CSS class'lari */
  className?: string;
}

export function RichTextEditor({ content, onChange, placeholder = 'Write content...', className }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class: cn('prose prose-sm max-w-none min-h-32 px-3 py-2 text-foreground', 'prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground', 'prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:text-primary', 'focus:outline-none'),
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className={cn('rounded-md border border-input bg-transparent', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-1 py-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          aria-label="Bold"
        >
          <BoldIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          aria-label="Italic"
        >
          <ItalicIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          aria-label="Heading"
        >
          <Heading1Icon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          aria-label="Code"
        >
          <CodeIcon className="size-3.5" />
        </ToolbarButton>

        <Separator
          orientation="vertical"
          className="mx-0.5 h-5"
        />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          aria-label="Bullet list"
        >
          <ListIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          aria-label="Ordered list"
        >
          <ListOrderedIcon className="size-3.5" />
        </ToolbarButton>

        <Separator
          orientation="vertical"
          className="mx-0.5 h-5"
        />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          aria-label="Undo"
        >
          <Undo2Icon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          aria-label="Redo"
        >
          <Redo2Icon className="size-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}

/** Toolbar butonu */
function ToolbarButton({ children, isActive, ...props }: React.ComponentProps<typeof Button> & { isActive?: boolean }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn('size-7', isActive && 'bg-muted text-foreground')}
      {...props}
    >
      {children}
    </Button>
  );
}
