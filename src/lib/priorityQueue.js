class QElement {
	constructor(name, weight) {
		this.name = name;
		this.weight = weight;
	}
}

export class PriorityQueue {
	constructor() {
		this.items = [];
	}

	enqueue(name, weight) {
		const qelement = new QElement(name, weight);
		let contains = false;

		// Insert item based upon weight
		for (var i = 0; i < this.items.length; i++) {
			let item = this.items[i];
			if (weight < item.weight) {
				this.items.splice(i, 0, qelement);
				contains = true;
				break;
			}
		}

		// Item has lowest weight
		if (!contains) this.items.push(qelement);
	}

	dequeue() {
		return this.items.shift();
	}

	remove(name) {
		for (var i = 0; i < this.items.length; i++) {
			let item = this.items[i];
			if (item.name === name) {
				this.items.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	front() {
		if (this.isEmpty()) return false;
		return this.items.at(0);
	}

	isEmpty() {
		if (this.items.length == 0) return true;
		return false;
	}

	getElement(name) {
		return this.items.find((v) => {
			if (v.name === name) return v;
		});
	}

	updateWeight(name, weight) {
		return this.items.find((v) => {
			if (v.name === name) v.weight = weight;
			return v;
		});
	}
}
