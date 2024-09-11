import { NeonQueryFunction } from "@neondatabase/serverless";
import { plansMap } from "./constatnt";

export async function hasCancelledSubscription(
	sql: NeonQueryFunction<false, false>,
	email: string,
) {
	const query =
		await sql`SELECT * FROM users WHERE email = ${email} AND status = 'cancelled'`;

	return query && query.length > 0;
}

export function getPlanType(priceId: string) {
	const checkPlanType = plansMap.filter((plan) => plan.priceId === priceId);
	return checkPlanType?.[0];
}

export async function updateUser(
	sql: NeonQueryFunction<false, false>,
	email: string,
	userId: string,
) {
	return sql`UPDATE users SET user_id = ${userId} WHERE email = ${email}`;
}


export async function getUser(
    sql:NeonQueryFunction<false, false>,
    email : string
) {
    const query = await sql`SELECT * FROM users WHERE email = ${email}`;
    if(query && query.length > 0){
        return query
    }

    return null;
}