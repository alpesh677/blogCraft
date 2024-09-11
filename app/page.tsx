import BgGradient from "@/components/common/BgGradient";
import Banner from "@/components/home/banner";
import HowItWorks from "@/components/home/howItWorks";
import Pricing from "@/components/home/pricing";
import { Dot } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="mx-auto w-full inset-0 h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <BgGradient/>
      <Banner />
      <div className="flex items-center justify-center">
          <Dot className="text-purple-400" />
          <Dot className="text-purple-400" />
          <Dot className="text-purple-400" />
      </div>
      <HowItWorks/>
      <div className="flex items-center justify-center">
          <Dot className="text-purple-400" />
          <Dot className="text-purple-400" />
          <Dot className="text-purple-400" />
      </div>
      <Pricing/>
      <div className="flex items-center justify-center m-20">
          <Dot className="text-purple-400" />
          <Dot className="text-purple-400" />
          <Dot className="text-purple-400" />
      </div>

      <footer className="bg-gray-200/20 flex h-20 py-24 px-12 z-20 relative overflow-hidden flex-col gap-2">
        <p>All Rights Reserved, {new Date().getFullYear()}</p>
        <a href="https://twitter.com/alpesh_baria677" target="_blank">
          Built by Alpesh 🚀
        </a>
      </footer>
    </main>
  );
}
