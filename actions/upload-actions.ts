"use server";
import getDbConnection from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@deepgram/sdk";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export async function transcribeUploadedFile(
	resp: {
		serverData: { userId: string; file: any };
	}[],
) {
	if (!resp) {
		return {
			success: false,
			message: "File upload failed",
			data: null,
		};
	}

	const {
		serverData: {
			userId,
			file: { url: fileUrl, name: fileName },
		},
	} = resp[0];

	if (!fileUrl || !fileName) {
		return {
			success: false,
			message: "File upload failed",
			data: null,
		};
	}

	const response = await fetch(fileUrl);
	const url = response.url;

	try {
		const { result, error } =
			await deepgram.listen.prerecorded.transcribeUrl(
				{ url },
				{ smart_format: true, model: "base", language: "en" },
			);

		if (error) {
			console.error("Deepgram transcription error:", error);
			return {
				success: false,
				message: "Transcription failed",
				error: error.message || "Unknown Deepgram error",
				data: null,
			};
		}

		// console.dir(result, { depth: null });
		// console.log(result?.channels?.[0]?.alternatives?.[0]?.transcript);
		console.log(result?.results.channels[0].alternatives[0].transcript);
		const transcriptions =
			result?.results.channels[0].alternatives[0].transcript;
		return {
			success: true,
			message: "File uploaded successfully!",
			data: { transcriptions, userId },
		};
	} catch (error) {
		console.error("Error processing file", error);

		if (error) {
			return {
				success: false,
				message: "Something went wrong!!!",
				data: null,
			};
		}
	}
}

async function getUserBlogPosts(userId: string) {
	try {
		const sql = await getDbConnection();
		const posts = await sql`
		SELECT content FROM posts 
		WHERE user_id = ${userId} 
		ORDER BY created_at DESC 
		LIMIT 3
		`;
		return posts.map((post) => post.content).join("\n\n");
	} catch (error) {
		console.error("Error getting user blog posts", error);
		throw error;
	}
}

async function generateBlogPost({
	transcription,
	userPosts,
}: {
	transcription: string;
	userPosts: string;
}) {
	if (userPosts === undefined) {
		return "";
	}

	const google = createGoogleGenerativeAI({
		apiKey: process.env.GOOGLE_GENERATIVE_API_KEY,
	});

	const { text } = await generateText({
		model: google.languageModel("gemini-1.5-flash"),
		system: "You are a skilled content writer that converts audio transcriptions into well-structured, engaging blog posts in Markdown format. Create a comprehensive blog post with a catchy title, introduction, main body with multiple sections, and a conclusion. Analyze the user's writing style from their previous posts and emulate their tone and style in the new post. Keep the tone casual and professional.",
		temperature: 0.7,
		prompt: `
		Here are some of my previous blog posts for reference:${userPosts}

		Please convert the following transcription into a well-structured blog post using Markdown formatting. Follow this structure:

		1. Start with a SEO friendly catchy title on the first line.
		2. Add two newlines after the title.
		3. Write an engaging introduction paragraph.
		4. Create multiple sections for the main content, using appropriate headings (##, ###).
		5. Include relevant subheadings within sections if needed.
		6. Use bullet points or numbered lists where appropriate.
		7. Add a conclusion paragraph at the end.
		8. Ensure the content is informative, well-organized, and easy to read.
		9. Emulate my writing style, tone, and any recurring patterns you notice from my previous posts.

		Here's the transcription to convert: ${transcription}`,
	});

	console.log(text);
	return text;
}

async function saveBlogPost(userId: string, title: string, blogPost: string) {
	try {
		const sql = await getDbConnection();
		console.log("In saveBlog function : ",blogPost)
		const [insertedBlog] = await sql`
			INSERT INTO posts (user_id,title,content) 
			VALUES (${userId},${title},${blogPost})
			RETURNING id
		`;
		return insertedBlog.id;
	} catch (error) {
		console.error("Error saving blog post", error);
		throw error;
	}
}

export async function generateBlogPostAction({
	transcriptions,
	userId,
}: {
	transcriptions: { text: string };
	userId: string;
}) {
	const userPosts = await getUserBlogPosts(userId);

	let postId = null;

	if (transcriptions) {
		const blogPost = await generateBlogPost({
			transcription: transcriptions.text,
			userPosts,
		});

		if (!blogPost) {
			return {
				success: false,
				message: "Blog post generation failed , please try again",
			};
		}

		const [rawTitle, ...contentArray] = blogPost?.split("\n\n") || [];
		const title = rawTitle.replace(/^##\s*/, '');
		if (blogPost) {
			postId = await saveBlogPost(userId, title, blogPost);
		}
	}

	//navigate
	revalidatePath(`/posts/${postId}`);
	redirect(`/posts/${postId}`);
}
