const possibleElements = [
	'div',
	'span',
	'article',
	'section',
	'main',
	'aside',
	'header',
	'vedge-custom-elements',
	'vedge-1'
];

function generateRandomClassName() {
	return `c${Math.random().toString(36).substring(2, 8)}`;
}

function generateRandomAttributes() {
	const possibleAttributes = [
		'data-test',
		'data-id',
		'data-value',
		'data-type',
		'data-section',
		'data-group',
		'data-ref'
	];

	const attrs: { [key: string]: string } = {};
	const numAttrs = Math.floor(Math.random() * 3); // 0-2개의 속성을 랜덤하게 추가

	for (let i = 0; i < numAttrs; i++) {
		const attrName = possibleAttributes[Math.floor(Math.random() * possibleAttributes.length)];
		attrs[attrName] = Math.random().toString(36).substring(2, 8);
	}

	return attrs;
}

export function seleniumGuard(
	node: Element,
	options: {
		minLayers?: number;
		maxLayers?: number;
		addClasses?: boolean;
		addAttributes?: boolean;
	} = {}
) {
	const { minLayers = 2, maxLayers = 5, addClasses = true, addAttributes = true } = options;

	let currentNode = node;
	const numLayers = minLayers + Math.floor(Math.random() * (maxLayers - minLayers + 1));

	const parentNode = currentNode.parentNode;

	for (let i = 0; i < numLayers; i++) {
		const wrapper = document.createElement(
			possibleElements[Math.floor(Math.random() * possibleElements.length)]
		);

		if (addClasses) {
			wrapper.className = generateRandomClassName();
		}

		if (addAttributes) {
			const attrs = generateRandomAttributes();
			Object.entries(attrs).forEach(([key, value]) => {
				wrapper.setAttribute(key, value);
			});
		}

		currentNode.parentNode!.insertBefore(wrapper, currentNode);
		wrapper.appendChild(currentNode);
		currentNode = wrapper;
	}

	return {
		destroy() {
			const current = node;
			while (current.parentNode !== parentNode) {
				const parent = current.parentNode;
				parent!.insertBefore(current, parent!.firstChild);
				parent!.normalize();
			}
		}
	};
}
