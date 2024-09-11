'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { useUploadThing } from '@/utils/uploadthing'
import { generateBlogPostAction, transcribeUploadedFile } from '@/actions/upload-actions'


const schema = z.object({
    file: z
        .instanceof(File, { message: "Invalid file" })
        .refine(
            (file) => file.size <= 20 * 1024 * 1024,
            "File size must not exceed 20MB"
        )
        .refine(
            (file) =>
                file.type.startsWith("audio/") || file.type.startsWith("video/"),
            "File must be an audio or a video file"
        ),
});


export default function UploadForm() {
    const { toast } = useToast();

    const { startUpload } = useUploadThing("videoOrImageUploader", {
        onClientUploadComplete: () => {
            toast(
                {
                    title: "uploaded successfully!"
                })
        },
        onUploadError: (error) => {
            console.error("upload error", error);
        },
        onUploadBegin: () => {
            toast({
                title: "Upload has begun 🚀..."
            })
        },
    })

    const handleTranscribe = async (formData: FormData) => {
        const file = formData.get('file') as File;
        if (!file) {
            console.log("No file selected");
            return;
        }


        const validatedFields = schema.safeParse({ file });

        if (!validatedFields.success) {
            console.log("validation error", validatedFields.error.flatten().fieldErrors);
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: validatedFields.error?.flatten().fieldErrors.file?.[0] ??
                    "Something went wrong",
            })
        }

        if (file) {
            const response: any = await startUpload([file]);
            // console.log("response : nlksfnkln", { response })
            if (!response) {
                toast({
                    title: "somthing went wrong",
                    description: "Error uploading file",
                    variant: "destructive",
                })
            }
            toast({
                title: "🎙️ Transcription is in progress...",
                description:
                    "Hang tight! Our digital wizards are sprinkling magic dust on your file! ✨",
            });

            const result = await transcribeUploadedFile(response);
            console.log(result);
            const { data = null, message = null } = result || {};

            if (!result || (!data && !message)) {
                toast({
                    title: "An unexpected error occurred",
                    description:
                        "An error occurred during transcription. Please try again.",
                });
            }

            if (data) {
                toast({
                    title: "🤖 Generating AI blog post...",
                    description: "Please wait while we generate your blog post.",
                });

                await generateBlogPostAction({
                    transcriptions: { text: data.transcriptions },
                    userId: data.userId,
                })

                toast({
                    title : "🎉 Woohoo! Your AI blog is created! 🎊",
                    description : "Time to put on your editor hat, Click the post and edit it"
                })
            }
        }


    }


    return (
        <form className="flex flex-col gap-6" action={handleTranscribe}>
            <div className="flex justify-end items-center gap-1.5">
                <Input
                    id="file"
                    name="file"
                    type="file"
                    accept="audio/*,video/*"
                    required
                />
                <Button className="bg-purple-600">Transcribe</Button>
            </div>
        </form>
    )
}
