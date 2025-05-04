"use client";

import { FC } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StaterKit from "@tiptap/starter-kit";
import TiptapMenuBar from "./TiptapMenuBar";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

interface TiptapRichTextEditorProps {
  label: string;
  field: string;
  description: string;
  isTouch: boolean | undefined;
  onChange: (description: string) => void;
  setError: (field: string, value: string | undefined) => void;
  setTouch: (field: string, value: boolean | undefined) => void;
}

const TiptapRichTextEditor: FC<TiptapRichTextEditorProps> = ({
  label,
  field,
  description,
  isTouch,
  onChange,
  setError,
  setTouch,
}) => {
  const editor = useEditor({
    extensions: [StaterKit],
    content: description,
    editorProps: {
      attributes: {
        class: cn(
          "prose dark:prose-invert",
          "border rounded-md",
          "p-3",
          "leading-1.2 min-h-[156px] max-w-none",
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onFocus: () => {
      setTouch(field, true);
    },
    onBlur: () => {
      if (editor?.isEmpty) setError(field, `${label} is required`);
    },
  });

  return (
    <div>
      <Label>{label}</Label>
      <TiptapMenuBar editor={editor} />
      <EditorContent editor={editor} />
      {editor?.isEmpty && isTouch && (
        <p className="text-xs text-red-500">{label} is required</p>
      )}
    </div>
  );
};

export default TiptapRichTextEditor;
