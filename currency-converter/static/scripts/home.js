// scripts.js

// scripts.js

async function convertCurrency() {
  try {
    const amountInput = document.getElementById('amount');
    const amount = parseFloat(amountInput.value);
    const fromCurrency = document.getElementById('from').value;
    const toCurrency = document.getElementById('to').value;

    // Validate input amount
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

    // Display the result
    showResult(`${amount} ${fromCurrency} is equal to ${convertedAmount} ${toCurrency}`);

  } catch (error) {
    console.error('Error in convertCurrency:', error);
  }
}

function showResult(message) {
  const resultElement = document.getElementById('result');
  resultElement.textContent = message;
}

function swapCurrencies() {
  var fromCurrency = document.getElementById("from").value;
  var toCurrency = document.getElementById("to").value;

  // Swap the values of the from and to dropdowns
  document.getElementById("from").value = toCurrency;
  document.getElementById("to").value = fromCurrency;
}

// ... (rest of the code remains unchanged)

var tabs = $('.tabs');
var selector = $('.tabs').find('a').length;
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

document.addEventListener("DOMContentLoaded",() => {
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
			// create div to contain <select>
			let wrapper = document.createElement("div");
			wrapper.setAttribute("class","select");
			this.select.parentElement.insertBefore(wrapper,this.select);
			wrapper.appendChild(this.select);

			// create button
			let id = this.select.id,
				selectBtnAttrs = {
					"class": "select__button select__button--pristine",
					"type": "button",
					"id": `${id}-options`,
					"aria-haspopup": "listbox",
					"aria-expanded": "false"
				};

			for (let a in selectBtnAttrs)
				this.selectBtn.setAttribute(a,selectBtnAttrs[a]);

			let selectBtnText = document.createTextNode(this.select.options[0].innerHTML);
			this.selectBtn.appendChild(selectBtnText);
			wrapper.appendChild(this.selectBtn);

			// create options div
			let optionsAttrs = {
				"class": "select__options",
				"aria-labelledby": selectBtnAttrs.id
			};
			for (let a in optionsAttrs)
				this.options.setAttribute(a,optionsAttrs[a]);

			// then each option
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
					option.setAttribute(a,optionAttrs[a]);

				option.appendChild(optionText);
				this.options.appendChild(option);
			}
			wrapper.appendChild(this.options);

			// sync with pre-selected option
			let preselected = this.options.querySelector(`[data-value=${this.select.value}]`);
			preselected.setAttribute("aria-selected",true);
			this.selectBtn.innerHTML = preselected.innerHTML;

			// restack so options can appear over other dropdowns
			let selects = document.querySelectorAll(".select"),
				selectCount = 0;
			while (selectCount < selects.length) {
				selects[selectCount].style.zIndex = selects.length - selectCount;
				++selectCount;
			}

			// assign event listeners
			document.querySelector(`label[for=${id}]`).addEventListener("click",() => {
				if (!this.isExpanded())
					this.selectBtn.focus();
				else
					this.closeSelect();
			});
			this.selectBtn.addEventListener("click",() => { this.openSelect(); });
			this.options.addEventListener("click",e => { this.closeSelect(e); });

			document.addEventListener("click",() => {
				let el = document.activeElement;
				if (el.parentElement.getAttribute("aria-labelledby") !== selectBtnAttrs.id)
					this.closeSelect();
			});
			window.addEventListener("keydown",e => {
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
			// prevent immediate closing to not ruin animation
			let foldDur = window.getComputedStyle(this.options);
			foldDur = foldDur.getPropertyValue("transition-delay").split("");
			if (foldDur.indexOf("m") > -1) {
				foldDur.splice(foldDur.length - 2,2);
				foldDur = parseInt(foldDur.join(""));

			} else if (foldDur.indexOf("s") > -1) {
				foldDur.pop();
				foldDur = parseFloat(foldDur.join("")) * 1e3;
			}
			this.isOpening = true;
			setTimeout(() => {this.isOpening = false;},foldDur);

			// manage states
			this.selectBtn.setAttribute("aria-expanded",true);

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

			// set focus to selected option
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
				// update values of both original and custom dropdowns
				this.select.value = e.target.getAttribute("data-value");
				this.selectBtn.innerHTML = e.target.innerHTML;

				// indicate selected item
				for (let n of this.options.childNodes)
					n.setAttribute("aria-selected",false);

				e.target.setAttribute("aria-selected",true);
				e.preventDefault();
			}
			this.selectBtn.setAttribute("aria-expanded",false);
			this.selectBtn.focus();

			// fire animation
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

			// check for focused option
			for (let l of optionLinks) {
				if (activeEl === l) {
					linkFound = true;
					break;
				}
			}
			// allow movement with arrows until top or bottom option is reached
			if (linkFound) {
				if (goTo === "previous" && activeEl !== optionLinks[0])
					activeEl.previousSibling.focus();

				else if (goTo === "next" && activeEl !== optionLinks[optionLinks.length - 1])
					activeEl.nextSibling.focus();
			}
		}
	}
}