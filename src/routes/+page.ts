import { DateTime } from 'luxon';

export const ssr = false;

export async function load() {
	const today = DateTime.now().toFormat('yyyy-MM-dd');
	const yesterday = DateTime.now().minus({ days: 1 }).toFormat('yyyy-MM-dd');
	const dinners = await (
		await fetch(`/api/getdinners?today=${today}&yesterday=${yesterday}`)
	).json();
	const naps = await (await fetch(`/api/getnaps?today=${today}&yesterday=${yesterday}`)).json();

	return {
		dinners,
		naps: naps.naps
	};
}
