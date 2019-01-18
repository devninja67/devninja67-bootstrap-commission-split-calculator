const addComma = (number) => {
  var str = number.toString().split('.');
  if (str[0].length >= 4) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (str[1] && str[1].length >= 5) {
      str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }
  return str.join('.');
}

$(document).ready(function() {
  let sliderIds = [
                    "transaction-count", 
                    "avg-sale-price",
                    "per-month",
                    "per-commission",
                    "per-transaction",
                    "pre-paid",
                  ];
  let description = [
                      {unit: "$", suffix: " transactions closed by year end"},
                      {unit: "$", suffix: " Average Sale Price"},
                      {unit: "$", suffix: " per Month"},
                      {unit: "%", suffix: " per Commission"},
                      {unit: "$", suffix: " per Transaction"},
                      {unit: "$", suffix: " Pre-Paid"},
  ];

  let sliders;

  const generateSliders = () => {
    sliders = sliderIds.map((sliderName) => new Slider('#' + sliderName, {}));
  }

  generateSliders();

  sliders.forEach((slider, idx) => {
    slider.on('slide', (value)=> {
      $("#" + sliderIds[idx] + "-description")[0].innerHTML = description[idx].unit + addComma(value) + description[idx].suffix;
      // lock when current value reach maximum value
      if(slider.options.max <= value) {
        slider.sliderElem.previousElementSibling.classList.remove("unlock");
        slider.sliderElem.previousElementSibling.classList.add("lock");
      } else {
        slider.sliderElem.previousElementSibling.classList.remove("lock");
        slider.sliderElem.previousElementSibling.classList.add("unlock");
      }
    });
  });

});