import isNull from 'lodash/isNull'

class ToggleTechnologies {
	constructor() {
		this.techToggles = document.querySelectorAll('.technology-toggle')

		if (!isNull(this.techToggles)) {
			console.log('init');
			this.initToggles();
		}
	}

	initToggles() {
		Array.prototype.forEach.call(this.techToggles, toggle => {
			const summary = toggle.querySelector('.technology-summary')
			const content = toggle.querySelector('.technology-content')
			const btn = toggle.querySelector('.technology-read-more')

			btn.addEventListener('click', e => {
				e.preventDefault();

				if (summary.classList.contains('hidden')) {
					this.closeToggle(summary, content, btn)
				} else {
					this.openToggle(summary, content, btn)
				}
			})
		})
	}

	openToggle(summary, content, btn) {
		summary.classList.add('hidden')
		content.classList.remove('hidden')
		btn.innerHTML = 'Show Less'
	}

	closeToggle(summary, content, btn) {
		summary.classList.remove('hidden')
		content.classList.add('hidden')
		btn.innerHTML = 'Read More'
	}
}

new ToggleTechnologies()
