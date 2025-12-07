'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image'; 
import { Bold, Italic, Heading2, List, ListOrdered, Quote, Undo, Redo, Heading1 } from 'lucide-react';
import { useEffect } from 'react';

export function RichTextEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
    const editor = useEditor({
        immediatelyRender : false,
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: true,
                HTMLAttributes: {
                    class: 'text-gold-primary underline hover:text-white transition-colors cursor-pointer',
                },
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] text-sm leading-relaxed text-gray-300',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });


    if (!editor) {
        return null;
    }

    const ToolbarButton = ({ onClick, isActive, children }: { onClick: () => void, isActive?: boolean, children: React.ReactNode }) => (
        <button
            type="button"
            onClick={onClick}
            className={`p-2 rounded hover:bg-white/10 transition-colors ${isActive ? 'text-gold-primary bg-white/5' : 'text-muted-foreground'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="w-full bg-[#0a0a0a] border border-white/10 flex flex-col">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-black/40">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                >
                    <Bold size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                >
                    <Italic size={16} />
                </ToolbarButton>

                <div className="h-4 w-[1px] bg-white/10 mx-2" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                >
                    <Heading1 size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                >
                    <Heading2 size={16} />
                </ToolbarButton>

                <div className="h-4 w-[1px] bg-white/10 mx-2" />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                >
                    <List size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                >
                    <ListOrdered size={16} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                >
                    <Quote size={16} />
                </ToolbarButton>

                <div className="h-4 w-[1px] bg-white/10 mx-2" />

                <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
                    <Undo size={16} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
                    <Redo size={16} />
                </ToolbarButton>

            </div>

            {/* Content Area */}
            <div className="p-4">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
