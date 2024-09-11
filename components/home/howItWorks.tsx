import { BracesIcon, BrainIcon, MoveRight } from 'lucide-react'
import React from 'react'

export default function HowItWorks() {
    return (
        <section className='py-24 overflow-hidden relative'>
            <div
                aria-hidden="true"
                className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
                <div
                    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>
            <div className="flex justify-center items-center w-full pb-6">
                <h2 className='font-bold text-xl uppercase mb-8 text-purple-600'>
                    How it works
                </h2>
            </div>
            <h3 className='flex items-center justify-center text-purple-600 mb-24 font-bold'>
                Easily repurpose your content into SEO focused blog posts
            </h3>

            <div className='flex items-center justify-center gap-4 lg:gap-24'>
                <div className='flex flex-col gap-4'>
                    <p className='text-7xl text-center'>🎥</p>
                    <p className='text-center font-medium'>Upload Video</p>
                </div>
                <MoveRight strokeWidth={0.5} size={64} className='text-purple-600' />
                <div className="flex flex-col gap-4">
                    <p className="flex items-center justify-center">
                        <BrainIcon size={64} className='text-purple-600' />
                    </p>
                    <p className='text-center font-medium'>
                        AI Magic ✨
                    </p>
                </div>
                <MoveRight strokeWidth={0.5} size={64} className='text-purple-600' />
                <div className='flex flex-col gap-4'>
                    <p className='text-7xl text-center'>📜</p>
                    <p className='text-center font-medium'>Blog </p>
                </div>
            </div>
        </section>
    )
}
