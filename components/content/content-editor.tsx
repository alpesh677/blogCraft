'use client';
import React, { useCallback, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Editor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; // Import styles for the editor
import remarkGfm from 'remark-gfm';
import { Button } from '../ui/button';
import { Download, Edit2, Loader2 } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { updatePostAction } from '@/actions/edit-actions';

// Function to handle markdown rendering
const MarkdownRenderer = ({ content }: { content: string }) => (
    <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        className="border border-gray-300 rounded p-4"
    />
);

const initialState = {
    success: false,
};

type UploadState = {
    success: boolean;
};

type UploadAction = (
    state: UploadState,
    formData: FormData
) => Promise<UploadState>;

export default function MarkdownEditor({
    posts
}: {
    posts: Array<{ id: string; title: string; content: string }>;
}) {
    const [content, setContent] = useState(posts.length > 0 ? posts[0].content : '');
    const [isChanged, setIsChanged] = useState(false);


    const handleChange = (value: string) => {
        setContent(value);
        setIsChanged(true);
    };

    const updatedPostActionWithId = updatePostAction.bind(null, {
        postId: posts[0].id,
        content,
    });

    const [state, formAction] = useFormState<UploadState, FormData>(
        updatedPostActionWithId as unknown as UploadAction,
        initialState
    );

    const handleExport = useCallback(() => {
        const filename = `${posts[0].title || "blog-post"}.md`;

        const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [content, posts]);

    function SubmitButton() {
        const { pending } = useFormStatus();
        return (
            <Button
                type="submit"
                className={`w-40 bg-gradient-to-r from-purple-900 to-indigo-600 hover:from-purple-600 hover:to-indigo-900 text-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2`}
                disabled={pending}
            >
                {pending ? (
                    <span className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Updating...
                    </span>
                ) : (
                    <span className="flex items-center justify-center">
                        <Edit2 className="w-5 h-5 mr-2" />
                        Update Text
                    </span>
                )}
            </Button>
        );
    }



    return (
        <form action={formAction} className="flex flex-col gap-2 h-screen">
            <div className="flex justify-between items-center border-b-2 border-gray-500/5 pb-4">
                <div>
                    <h2 className="text-2xl mb-2 font-semibold text-gray-800 flex items-center gap-2">
                        📝 Edit Your Post
                    </h2>
                    <p className="text-gray-600">Start editing your post below.....</p>
                </div>
                <div className="flex gap-4">
                    <SubmitButton></SubmitButton>
                    <Button
                        onClick={handleExport}
                        className="w-40 bg-gradient-to-r from-amber-500 to-amber-900 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition duration-200 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            <div className="flex-grow">
                <Editor
                    value={content}
                    onChange={({ text }: { text: string }) => handleChange(text)}
                    renderHTML={(text) => <MarkdownRenderer content={text} />}
                    style={{ height: '100%', overflow: 'auto' }} 
                />
            </div>
        </form>
    );
}
