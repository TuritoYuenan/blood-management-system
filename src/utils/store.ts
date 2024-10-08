import { reactive } from "vue";
import { DonationCenterSchema, DonorSchema, WorkingHoursSchema } from "../models/sugar";
import supabase from "./supabase";

export default reactive({
	/** Global state indicating whether there is a working task */
	isWorking: false,

	donors: [] as DonorSchema[],

	async loadDonors() {
		this.isWorking = true

		const { data, error } = await supabase()
			.from("donors")
			.select("*")

		if (error) {
			if (error instanceof Error) alert('Error' + error.message)
			return
		}
		this.donors.splice(0, this.donors.length, ...data!)
		this.isWorking = false
	},

	/** List of donation centers */
	donationCenters: [] as DonationCenterSchema[],

	/** Fetch list of donation centers from database */
	async loadDonationCenters() {
		this.isWorking = true

		const { data, error } = await supabase()
			.from("donation_centers")
			.select("*")

		if (error) {
			if (error instanceof Error) alert('Error' + error.message)
			return
		}

		data.forEach((center) => this.workingHours.set(center.center_id, []))
		await this.loadWorkingHours()

		this.donationCenters.splice(0, this.donationCenters.length, ...data!)
		this.isWorking = false
	},

	/** List of each donation center's working hours */
	workingHours: new Map<string, WorkingHoursSchema[]>(),

	/** Fetch the working hours */
	async loadWorkingHours() {
		this.isWorking = true
		console.dir("Loading working hours");

		const { data, error } = await supabase()
			.from("working_hours")
			.select("*")

		if (error) {
			if (error instanceof Error) alert('Error' + error.message)
			return
		}

		data.forEach((range) => this.workingHours.get(range.center_id)!.push(range))
		console.dir(this.workingHours);
		this.isWorking = false
	},

	isLoggedIn: false,

})
