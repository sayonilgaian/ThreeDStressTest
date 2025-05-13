export default function generateRandomNumber(range) {
	const crypto = window.crypto;
	let array = new Uint32Array(1);
	crypto.getRandomValues(array);
	if (range === 0) return 0;
	return array[0] % parseInt(range);
}
