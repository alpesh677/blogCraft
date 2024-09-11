import BgGradient from '@/components/common/BgGradient';
import { Badge } from '@/components/ui/badge';
import UpgradeYourPlan from '@/components/upload/upgrade-your_plan';
import UploadForm from '@/components/upload/uploadForm';
import getDbConnetion from '@/lib/db'
import { getPlanType, getUser, hasCancelledSubscription, updateUser } from '@/lib/user-helper';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function Dashboard() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? ""

  const sql = await getDbConnetion();
  const hasCancelled = await hasCancelledSubscription(sql, email);

  let userId = null
  let priceId = null;

  const user = await getUser(sql, email);
  if (user) {
    userId = clerkUser?.id;
    if (userId) {
      await updateUser(sql, userId, email);
    }

    priceId = user[0].price_id;
  }

  const { id: planTypeId = "starter", name: planTypeName } =
    getPlanType(priceId);

  const isBasicPlan = planTypeId === "basic";
  return (
    <BgGradient>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Badge className="bg-gradient-to-r from-purple-700 to-pink-800 text-white px-4 py-1 text-lg font-semibold capitalize">
            {planTypeName} Plan
          </Badge>

          <h2 className='capitalize text-3xl font-bold -tracking-tight text-gray-900 sm:text-4xl'>
            Starting creating Amazing Content
          </h2>

          <p className='mt-2 text-lg text-gray-600 max-w-2xl text-center'>
            Upload your audio or video file and our AI do the magic
          </p>

          <p className="mt-2 text-lg leading-8 text-gray-600 max-w-2xl text-center">
            You get <span className='font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md'>{isBasicPlan ? "3" : "unlimited"} blog posts</span> as part of the {" "} <span className='font-bold capitalize'>{planTypeName}</span> plan
          </p>

          {
            hasCancelled ?
              <UpgradeYourPlan /> :
              <BgGradient>
                <UploadForm />
              </BgGradient>
          }


        </div>
      </div>
    </BgGradient>
  )
}
