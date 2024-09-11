import Stripe from "stripe";
import getDbConnetion from "./db";

export async function handleCubscriptionDeleted({
	subscriptionId,
	stripe,
}: {
	subscriptionId: string;
	stripe: Stripe;
}) {

    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const sql = await getDbConnetion();

        await sql`UPDATE users SET status = 'canceled' WHERE customer_id = ${subscription.customer}`;
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        throw error;
    }
}   

export async function handleCheckoutSessionCompleted({
	session,
	stripe,
}: {
	session: Stripe.Checkout.Session;
	stripe: Stripe;
}) {
	const customerID = session.customer as string;
	const customer = await stripe.customers.retrieve(customerID);
	const priceId = session.line_items?.data[0].price?.id;
	console.log("customer : ", { customer });

	const sql = await getDbConnetion();
	if ("email" in customer && priceId) {
		await createOrUpdateUser(sql, customer, customerID);

		await updateUserSubsciption(sql, priceId, customer.email as string);

		await insertPayment(sql, session, customer.email as string, priceId);
	}
}
async function insertPayment(
	sql: any,
	session: Stripe.Checkout.Session,
	email: string,
	priceId: string,
) {
	try {
		await sql`INSERT INTO payments (amount,status,stripe_payment_id,price_id,user_email) VALUES (${session.amount_total},${session.status},${session.id},${priceId},${email})`;
	} catch (error) {
        console.error("Inserting payments : ", error);
        throw error;
    }
}

async function createOrUpdateUser(
	sql: any,
	customer: Stripe.Customer,
	customerId: string,
) {
	try {
		const user =
			await sql`SELECT * FROM users WHERE email = ${customer.email}`;
		if (user.length === 0) {
			await sql`INSERT INTO users (email,full_name,customer_id) VALUES (${customer.email},${customer.name},${customerId})`;
		}
	} catch (error) {
		console.error("Inserting User in db", error);
        throw error;
	}
}

async function updateUserSubsciption(sql: any, priceId: string, email: string) {
	try {
		await sql`UPDATE users SET price_id = ${priceId},status = 'active' WHERE email = ${email}`;
	} catch (error) {
        console.error("Updating User in db", error);
        throw error
    }
}
