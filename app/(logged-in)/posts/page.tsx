import BgGradient from '@/components/common/BgGradient';
import { Button } from '@/components/ui/button';
import getDbConnetion from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server'
import { ArrowRight } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'
import Link from 'next/link';

export default async function Posts() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const sql = await getDbConnetion();
    const posts = await sql`SELECT * FROM posts WHERE user_id = ${user.id}`;

    const title = posts[0].title.split(" ")[1];
    console.log(title);
    return (
        <div>
            <main className='mx-auto max-w-screen-xl w-full mb-12 px-2.5 mt--28 lg:px-0'>
                <h2 className='text-3xl font-semibold mb-2 text-gray-800'>
                    Your posts ✍️
                </h2>
                {
                    posts.length === 0 && (
                        <div>
                            <p className="text-gray-600 text-lg lg:text-xl mb-4 line-clamp-3">
                                You have no posts yet. Upload a video or audio to get started.
                            </p>

                            <Link href={"/dashboard"}
                                className='flex items-center gap-2 text-purple-600 hover:text-purple-800'>
                                Go to Dashboard <ArrowRight w-4 h-4 />
                            </Link>
                        </div>
                    )
                }

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        posts.map((post) => (
                            <BgGradient key={post.id}>
                                <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {post.content.split("\n").slice(1).join("\n")}
                                    </p>
                                    <Link
                                        href={`/posts/${post.id}`}
                                        className='flex gap-1 text-purple-600 hover:text-purple-800 font-medium items-center'
                                    >
                                        Read more <ArrowRight className="w-5 h-5 pt-1" />
                                    </Link>
                                </div>
                            </BgGradient>
                        ))
                    }
                </div>
            </main>
        </div>
    )
}
