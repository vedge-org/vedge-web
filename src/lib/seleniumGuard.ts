const possibleElements = [
	'div',
	'span',
	'article',
	'section',
	'main',
	'aside',
	'vedge-container',
	'vedge-custom-elements',
	'vedge-1'
] as const;

const possibleAttributes = [
	'data-test',
	'data-id',
	'data-value',
	'data-type',
	'data-section',
	'data-group',
	'data-ref'
] as const;

type Options = {
	minLayers?: number;
	maxLayers?: number;
	addClasses?: boolean;
	addAttributes?: boolean;
};

const generateRandomClassName = () => `c${Math.random().toString(36).slice(2, 8)}`;

const generateRandomAttributes = () => {
	const attrs: Record<string, string> = {};
	const numAttrs = Math.floor(Math.random() * 3);
	const attrValue = Math.random().toString(36).slice(2, 8);

	for (let i = 0; i < numAttrs; i++) {
		attrs[possibleAttributes[Math.floor(Math.random() * possibleAttributes.length)]] = attrValue;
	}
	return attrs;
};

const copyComputedStyles = (sourceNode: Element, targetNode: Element) => {
	const computedStyle = window.getComputedStyle(sourceNode);
	const importantStyles = [
		'display',
		'position',
		'top',
		'right',
		'bottom',
		'left',
		'width',
		'height',
		'margin',
		'padding',
		'border',
		'flex',
		'flex-direction',
		'flex-wrap',
		'flex-flow',
		'justify-content',
		'align-items',
		'align-content',
		'grid',
		'grid-template',
		'grid-column',
		'grid-row'
	];

	importantStyles.forEach((style) => {
		(targetNode as HTMLElement).style[style as any] = computedStyle.getPropertyValue(style);
	});
};

export function seleniumGuard(
	node: Element,
	{ minLayers = 2, maxLayers = 5, addClasses = true, addAttributes = true }: Options = {}
) {
	const numLayers = minLayers + Math.floor(Math.random() * (maxLayers - minLayers + 1));
	let currentNode = node;
	const originalStyles = window.getComputedStyle(node);
	const wrappers: Element[] = [];

	for (let i = 0; i < numLayers; i++) {
		const wrapper = document.createElement(
			possibleElements[Math.floor(Math.random() * possibleElements.length)]
		);

		if (addClasses) {
			wrapper.className = generateRandomClassName();
		}

		if (addAttributes) {
			Object.entries(generateRandomAttributes()).forEach(([key, value]) => {
				wrapper.setAttribute(key, value);
			});
		}

		// 원본 노드의 스타일 복사
		copyComputedStyles(currentNode, wrapper);

		// display: inline 요소를 감쌀 때는 wrapper도 inline으로 설정
		if (originalStyles.display === 'inline') {
			(wrapper as HTMLElement).style.display = 'inline';
		}

		currentNode.parentNode!.insertBefore(wrapper, currentNode);
		wrapper.appendChild(currentNode);
		wrappers.push(wrapper);
		currentNode = wrapper;
	}

	return {
		destroy() {
			wrappers.reverse().forEach((wrapper) => {
				const parent = wrapper.parentNode!;
				const child = wrapper.firstChild!;
				parent.insertBefore(child, wrapper);
				parent.removeChild(wrapper);
			});
		}
	};
}
