import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function UpgradeYourPlan() {
  return (
    <div className='flex flex-col justify-center items-center gap-6 text-center'>
        <p className="mt-2 text-lg text-gray-600 leading-8 max-w-2xl text-center border-2 border-red-200 bg-red-200 rounded-lg border-dashed p-4">
        You need to upgrade to the Basic Plan or the Pro Plan to create blog
        posts with the power of AI 💖.
        </p>
        <Link href={"/#pricing"} className='flex justify-center items-center gap-2 text-purple-600 font-semibold'>
            Go to Pricing <ArrowRight className='w-4 h-4'/>
        </Link>
    </div>
  )
}
