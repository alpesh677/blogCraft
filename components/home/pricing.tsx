import React from 'react'
import { plansMap } from '@/lib/constatnt'
import { cn } from '@/lib/utils'
import { ArrowRight, CheckIcon } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
export default function Pricing() {
    return (
        <section
            className='relative overflow-hidden'
            id='pricing'
        >
            <div className="max-w-5xl py-12 lg:py-24 mx-auto px-12 lg:px-0">
                <div className="flex items-center justify-center w-full pb-12">
                    <h2 className='font-bold text-xl uppercase text-purple-600 mb-8'>
                        Pricing
                    </h2>
                </div>
                <div className="relative flex items-center justify-center flex-col lg:flex-row lg:items-stretch gap-8">

                </div>
            </div>
            <div className='flex flex-col lg:flex-row justify-center items-center gap-8 lg:items-stretch'>
                {
                    plansMap.map(
                        ({ name, price, description, items, id, paymentLink }, idx) => (
                            <div className="relative w-full max-w-lg" key={idx}>
                                <div className={cn(
                                    "flex flex-col h-full gap-4 border-[1px] border-purple-500/20 rounded-2xl p-8 z-10",
                                    id == "pro" && "border-violet-600 gap-5 border-2"
                                )}>
                                    <div className="flex items-center">
                                        <div>
                                            <p className='text-lg lg:text-xl font-bold uppercase'>
                                                {name}
                                            </p>
                                            <p className="text-base/10 mt-2">
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex gap-2'>
                                        <p className="text-5xl tracking-tight font-bold">
                                            {price}
                                        </p>
                                        <div className="flex justify-end flex-col mt-[4px]">
                                            <p className="font-semibold text-xs text-base-content/60 ">USD</p>
                                            <p className="text-xs">/month</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                                        {items.map((item, idx) => (
                                            <li className="flex items-center gap-2" key={idx}>
                                                <CheckIcon size={18}></CheckIcon>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="space-y-2">
                                        <Button
                                            variant={"link"}
                                            className={cn(
                                                "rounded-full flex gap-2 items-center justify-center bg-black border-2 text-gray-200",
                                                id === "pro" && "border-amber-300 px-4"
                                            )}
                                        >
                                            <Link href={paymentLink}
                                                className='flex gap-1 items-center'
                                            >
                                                Get Started <ArrowRight size={18} />
                                            </Link>

                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                }
            </div>

        </section>
    )
}
