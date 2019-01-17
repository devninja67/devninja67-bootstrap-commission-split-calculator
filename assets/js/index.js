$(document).ready(function() {
  let sliderIds = [
                    "transaction-count", 
                    "avg-sale-price",
                    "per-month",
                    "per-commission",
                    "per-transaction",
                    "pre-paid-count",
                  ];

  let sliders;

  const generateSliders = () => {
    sliders = sliderIds.map((sliderName) => new Slider('#' + sliderName, {}));
  }

  generateSliders();

});