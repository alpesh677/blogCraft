import ContentEditor from '@/components/content/content-editor';
import getDbConnetion from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

export default async function PostPage({
    params: { id }
}: { params: { id: string } }) {
    const user = await currentUser();

    if(!user){
        redirect("/sign-in");
    }

    const sql = await getDbConnetion();

    const post:any = await sql`SELECT * FROM posts WHERE id = ${id} and user_id = ${user.id}`;
    // console.log(post);
    
    return (
        <div className='w-full max-w-screen-xl px-2.5 mx-auto lg:px-0'>
            <ContentEditor posts={post}/>
        </div>
    )
}