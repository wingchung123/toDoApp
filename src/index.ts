export function add(num: string): number {
	let integers = num.split(',')
	console.log(integers)
	let integers_array = .map(x => parseInt(x));
	console.log(integersyyyyy)
	console.log(integers)
	return integers.reduce((a,b) => a+b, 0);
}

console.log(`Total sum: ${ add("") }`)