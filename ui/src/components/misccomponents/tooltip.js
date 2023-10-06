import Tooltip from './TooltipFromAction.svelte';

export function tooltip(element) {
	let title;
	let x;
	let y;
	let tooltipComponent;
	let timer;
	let delay = 500;

	function mouseOver(event) {
		x = event.pageX;
		y = event.pageY;
		timer = setTimeout(() => {
			if (!tooltipComponent) {
				// NOTE: remove the `title` attribute, to prevent showing the default browser tooltip
				// remember to set it back on `mouseleave`
				title = element.getAttribute('title');
				element.removeAttribute('title');

				tooltipComponent = new Tooltip({
					props: {
						title: title,
						x,
						y,
					},
					target: document.body,
				});
			}
		}, delay);
	}
	function mouseMove(event) {
		x = event.pageX;
		y = event.pageY;
		tooltipComponent && tooltipComponent.$set({
			x,
			y,
		});
	}
	function mouseLeave() {
		timer && clearTimeout(timer);
		destroy();
		if (title) {
			// NOTE: restore the `title` attribute
			element.setAttribute('title', title);
		}
	}

	function destroy() {
		if (tooltipComponent) {
			tooltipComponent.$destroy();
			tooltipComponent = null;
		}
	}
	
	element.addEventListener('mouseover', mouseOver);
  	element.addEventListener('mouseleave', mouseLeave);
	element.addEventListener('mousemove', mouseMove);
	
	return {
		destroy() {
			element.removeEventListener('mouseover', mouseOver);
			element.removeEventListener('mouseleave', mouseLeave);
			element.removeEventListener('mousemove', mouseMove);
			destroy();
		}
	}
}