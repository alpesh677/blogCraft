import { handleCheckoutSessionCompleted, handleCubscriptionDeleted } from "@/lib/payment-hepler";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

export async function POST(req: NextRequest) {
	const payload = await req.text();
	const sig = req.headers.get("stripe-signature");

	let event;

	try {
		if (!process.env.STRIPE_WEHOOK_KEY) {
			throw new Error("STRIPE_WEBHOOK_SECRET is not set");
		}

		event = stripe.webhooks.constructEvent(
			payload,
			sig!,
			process.env.STRIPE_WEHOOK_KEY!,
		);

		// Handle the event
		switch (event.type) {
			case "checkout.session.completed":
				const session = await stripe.checkout.sessions.retrieve(
					event.data.object.id,
					{
						expand: ["line_items"],
					},
				);
				console.log("session : ",{ session });
				//connect the db and add the user to the db

				await handleCheckoutSessionCompleted({session,stripe})
				break;

			case "customer.subscription.deleted":
				//connect the db and delete the user
				const subscriptionId = event.data.object.id;
				const subscription = await stripe.subscriptions.retrieve(
					subscriptionId
				);

				console.log("subscription : ",subscription);

				await handleCubscriptionDeleted({subscriptionId,stripe});
				break;
			default:
				console.log(`Unhandled event type ${event.type}`);
		}
	} catch (err: any) {
		console.error("Error processing webhook:", err);
		return NextResponse.json({ status: "failed", error: err.message });
	}

	// Return a 200 response to acknowledge receipt of the event
	return NextResponse.json({ stauts: "success" });
}
