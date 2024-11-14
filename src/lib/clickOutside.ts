// clickOutside.ts
export function clickOutside(
	node: HTMLElement,
	params: { enabled: boolean; callback: () => void }
) {
	const { enabled, callback } = params;

	function onClick(event: MouseEvent) {
		if (!enabled) return;
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			callback();
		}
	}

	document.addEventListener('click', onClick, true);

	return {
		update(newParams: { enabled: boolean; callback: () => void }) {
			params = newParams;
		},
		destroy() {
			document.removeEventListener('click', onClick, true);
		}
	};
}
