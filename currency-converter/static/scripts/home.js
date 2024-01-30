var convertButtonClicked = false;

async function convertCurrency() {
	event.preventDefault();
	try {
		const amountInput = document.getElementById('amount');
		const amount = parseFloat(amountInput.value);
		const fromCurrency = document.getElementById('from').value;	
		const toCurrency = document.getElementById('to').value;

		if (isNaN(amount) || amount < 0) {
			alert('Please enter a valid amount greater than or equal to 0.');
			return;
		}

		if (fromCurrency === "none" || toCurrency === "none") {
			showResult(null, "Please select the currencies");
			return;
		}

		const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
		const data = await response.json();

		if (!data || !data.rates || !data.rates[toCurrency]) {
			console.error('Invalid response data:', data);
			return;
		}

		const rate = data.rates[toCurrency];
		const convertedAmount = (amount * rate).toFixed(2);

		showResult(`${amount} ${fromCurrency} is equal to ${convertedAmount} ${toCurrency}`);

	} catch (error) {
		console.error('Error in convertCurrency:', error);
	}
	document.getElementById("swap-button").disabled = false;
	convertButtonClicked = true;
	document.getElementById("result-box").style.display = "block";
}

function showResult(message) {
	const resultElement = document.getElementById('result');
	resultElement.textContent = message;
}

function swapCurrencies() {

	if (!convertButtonClicked) {
		alert("Please convert atleast once first.");
		return;
	}
	var fromCurrency = document.getElementById("from").value;
	var toCurrency = document.getElementById("to").value;

	document.getElementById("from").value = toCurrency;
	document.getElementById("to").value = fromCurrency;

	convertCurrency();
}

var tabs = $('.tabs');
var selector = $('.tabs').find('a').length;
var selector = $(".tabs").find(".selector")
var activeItem = tabs.find('.active');
var activeWidth = activeItem.innerWidth();
$(".selector").css({
	"left": activeItem.position.left + "px",
	"width": activeWidth + "px"
});

$(".tabs").on("click", "a", function (e) {
	e.preventDefault();
	$('.tabs a').removeClass("active");
	$(this).addClass('active');
	var activeWidth = $(this).innerWidth();
	var itemPos = $(this).position();
	$(".selector").css({
		"left": itemPos.left + "px",
		"width": activeWidth + "px"
	});
});

document.addEventListener("DOMContentLoaded", () => {
	const from = new SelectDropdown({ id: "from" }),
		to = new SelectDropdown({ id: "to" });
});

class SelectDropdown {
	constructor(args) {
		this.isOpening = false;
		this.select = document.querySelector(`select[id=${args.id}]`);
		this.selectBtn = document.createElement("button");
		this.options = document.createElement("div");
		this.buildDropdown();
	}
	buildDropdown() {
		if (this.select !== null) {
			let wrapper = document.createElement("div");
			wrapper.setAttribute("class", "select");
			this.select.parentElement.insertBefore(wrapper, this.select);
			wrapper.appendChild(this.select);

			let id = this.select.id,
				selectBtnAttrs = {
					"class": "select__button select__button--pristine",
					"type": "button",
					"id": `${id}-options`,
					"aria-haspopup": "listbox",
					"aria-expanded": "false"
				};

			for (let a in selectBtnAttrs)
				this.selectBtn.setAttribute(a, selectBtnAttrs[a]);

			let selectBtnText = document.createTextNode(this.select.options[0].innerHTML);
			this.selectBtn.appendChild(selectBtnText);
			wrapper.appendChild(this.selectBtn);

			let optionsAttrs = {
				"class": "select__options",
				"aria-labelledby": selectBtnAttrs.id
			};
			for (let a in optionsAttrs)
				this.options.setAttribute(a, optionsAttrs[a]);

			for (let o of this.select.options) {
				let option = document.createElement("a"),
					optionText = document.createTextNode(o.innerHTML),
					optionAttrs = {
						"href": "#",
						"class": "select__option",
						"data-value": o.value,
						"role": "option",
						"aria-selected": "false"
					};

				for (let a in optionAttrs)
					option.setAttribute(a, optionAttrs[a]);

				option.appendChild(optionText);
				this.options.appendChild(option);
			}
			wrapper.appendChild(this.options);

			let preselected = this.options.querySelector(`[data-value=${this.select.value}]`);
			preselected.setAttribute("aria-selected", true);
			this.selectBtn.innerHTML = preselected.innerHTML;

			let selects = document.querySelectorAll(".select"),
				selectCount = 0;
			while (selectCount < selects.length) {
				selects[selectCount].style.zIndex = selects.length - selectCount;
				++selectCount;
			}

			document.querySelector(`label[for=${id}]`).addEventListener("click", () => {
				if (!this.isExpanded())
					this.selectBtn.focus();
				else
					this.closeSelect();
			});
			this.selectBtn.addEventListener("click", () => { this.openSelect(); });
			this.options.addEventListener("click", e => { this.closeSelect(e); });

			document.addEventListener("click", () => {
				let el = document.activeElement;
				if (el.parentElement.getAttribute("aria-labelledby") !== selectBtnAttrs.id)
					this.closeSelect();
			});
			window.addEventListener("keydown", e => {
				switch (e.keyCode) {
					case 27: // Esc
						this.closeSelect();
						break;
					case 32: // Spacebar
						this.closeSelect(e);
						break;
					case 38: // Up
						this.goToOption("previous");
						break;
					case 40: // Down
						this.goToOption("next");
						break;
					default:
						break;
				}
			});
		}
	}
	isExpanded() {
		return this.selectBtn.getAttribute("aria-expanded") === "true";
	}
	openSelect(e) {
		if (!this.isExpanded()) {
			let foldDur = window.getComputedStyle(this.options);
			foldDur = foldDur.getPropertyValue("transition-delay").split("");
			if (foldDur.indexOf("m") > -1) {
				foldDur.splice(foldDur.length - 2, 2);
				foldDur = parseInt(foldDur.join(""));

			} else if (foldDur.indexOf("s") > -1) {
				foldDur.pop();
				foldDur = parseFloat(foldDur.join("")) * 1e3;
			}
			this.isOpening = true;
			setTimeout(() => { this.isOpening = false; }, foldDur);

			this.selectBtn.setAttribute("aria-expanded", true);

			let btnClasses = this.selectBtn.classList,
				pristineClass = "select__button--pristine",
				animClass = `select__button--fold${this.select.options.length}`;

			if (btnClasses.contains(pristineClass)) {
				btnClasses.remove(pristineClass);
			} else {
				btnClasses.remove(animClass);
				void this.selectBtn.offsetWidth;
			}
			btnClasses.add(animClass);

			let selected = this.options.querySelector("[aria-selected=true]");
			if (selected !== null)
				selected.focus();
			else
				this.options.childNodes[0].focus();
		}
	}
	closeSelect(e) {
		if (this.isExpanded() && !this.isOpening) {
			if (e && e.target !== this.options.childNodes[0]) {
				this.select.value = e.target.getAttribute("data-value");
				this.selectBtn.innerHTML = e.target.innerHTML;

				for (let n of this.options.childNodes)
					n.setAttribute("aria-selected", false);

				e.target.setAttribute("aria-selected", true);
				e.preventDefault();
			}
			this.selectBtn.setAttribute("aria-expanded", false);
			this.selectBtn.focus();

			let btnClasses = this.selectBtn.classList,
				animClass = `select__button--fold${this.select.options.length}`;

			btnClasses.remove(animClass);
			void this.selectBtn.offsetWidth;
			btnClasses.add(animClass);
		}
	}
	goToOption(goTo) {
		if (this.isExpanded()) {
			let optionLinks = this.options.querySelectorAll("a"),
				activeEl = document.activeElement,
				linkFound = false;

			for (let l of optionLinks) {
				if (activeEl === l) {
					linkFound = true;
					break;
				}
			}

			if (linkFound) {
				if (goTo === "previous" && activeEl !== optionLinks[0])
					activeEl.previousSibling.focus();

				else if (goTo === "next" && activeEl !== optionLinks[optionLinks.length - 1])
					activeEl.nextSibling.focus();
			}
		}
	}
}