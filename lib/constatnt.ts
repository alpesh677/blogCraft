export const plansMap = [
	{
		id: "basic",
		name: "Basic",
		description: "Get started with SpeakEasy!",
		price: "10",
		items: ["3 Blog Posts", "3 Transcription"],
		paymentLink: "https://buy.stripe.com/test_dR6bMz1n8012fN6cMN",
		priceId:
			process.env.NODE_ENV === "development"
				? "price_1PvbduJiASeaoaHLsZxovpS5"
				: "",
	},
	{
		id: "pro",
		name: "Pro",
		description: "All Blog Posts, let’s go!",
		price: "19.99",
		items: ["Unlimited Blog Posts", "Unlimited Transcriptions"],
		paymentLink: "https://buy.stripe.com/test_14kaIvd5Q5lm8kE9AC",
		priceId:
			process.env.NODE_ENV === "development"
				? "price_1PvbduJiASeaoaHLXgwC7PEt"
				: "",
	},
];

export const ORIGIN_URL =
	process.env.NODE_ENV === "development"
		? "http://localhost:3000"
		: "https://speakeasyai-demo.vercel.app";
