import cors from "../_shared/cors.ts"
import supabase from "../_shared/supabase.ts"

Deno.serve(async (req) => {
	const { id } = await req.json()
	const { data, error } = await supabase(req.headers.get("Authorization")!)
		.from("donation_centers").select("*")
		.eq("id", id).limit(1).single()

	try {
		if (error) throw error

		return new Response(
			JSON.stringify(data),
			{ status: 200, headers: { ...cors, "Content-Type": "application/json" } }
		)
	} catch (error) {
		return new Response(
			String(error?.message ?? error),
			{ status: 500, headers: { ...cors } }
		)
	}
})
