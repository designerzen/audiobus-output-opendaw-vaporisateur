/**
 * audiobus-output-opendaw-vaporisateur
 * openDAW's Vaporisateur synthesiser as an audiobus instrument and output.
 *
 * Importing this entry is side-effect free: openDAW (which needs a browser) loads only when an
 * instrument is created.
 */
import type { VaporisateurOptions } from "./opendaw-vaporisateur.ts"

export type { VaporisateurOptions } from "./opendaw-vaporisateur.ts"
export type OpenDAWVaporisateur = import("./opendaw-vaporisateur.ts").default

export const VAPORISATEUR_ID = "opendaw-vaporisateur"

const name = "openDAW Vaporisateur"
const description = "Vaporisateur instrument using openDAW framework"

/** Load the instrument class on demand. */
export async function loadVaporisateur() {
	return (await import("./opendaw-vaporisateur.ts")).default
}

/** Create a Vaporisateur and start its engine. Needs a cross-origin isolated page. */
export async function createVaporisateur(
	audioContext: BaseAudioContext,
	options: VaporisateurOptions = {}
): Promise<OpenDAWVaporisateur> {
	const Vaporisateur = await loadVaporisateur()
	const instrument = new Vaporisateur(audioContext, options)
	await instrument.connect()
	return instrument
}

const isAvailable = () =>
	typeof window !== "undefined" &&
	typeof AudioWorkletNode !== "undefined" &&
	typeof SharedArrayBuffer !== "undefined"

/** Pass to audiobus's registerInstrument() to add Vaporisateur to its instruments. */
export const vaporisateurInstrument = {
	id: VAPORISATEUR_ID,
	name,
	description,
	category: "synthesis",
	create: createVaporisateur
} as const

/** Pass to audiobus's registerOutput() to add Vaporisateur to its outputs. */
export const vaporisateurOutput = {
	definition: {
		id: VAPORISATEUR_ID,
		type: "engine",
		subtype: "instrument",
		name,
		description,
		category: "Synthesis"
	},
	isAvailable,
	async create({
		audioContext,
		destination,
		...options
	}: VaporisateurOptions & { audioContext?: AudioContext; destination?: AudioNode }) {
		const instrument = await createVaporisateur(audioContext ?? new AudioContext(), options)
		instrument.output.connect(destination ?? instrument.audioContext.destination)
		return instrument
	}
} as const
