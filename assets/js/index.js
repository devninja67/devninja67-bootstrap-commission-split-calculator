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
                    "per-month",
                    "per-commission",
                    "per-transaction",
                    "pre-paid",
                  ];
  let description = [
                      {unit: "", suffix: " transactions closed by year end"},
                      {unit: "$", suffix: " per Month"},
                      {unit: "", suffix: "% per Commission"},
                      {unit: "$", suffix: " per Transaction"},
                      {unit: "$", suffix: " Pre-Paid"},
  ];

  let sliders;

  const generateSliders = () => {
    sliders = sliderIds.map((sliderName) => new Slider('#' + sliderName, {}));
    sliders[4].disable();
  }

  // editable area
  $(".editable").click(function() {
    $(this).children().focus();
  });

  $("#avg-sale-price, #avg-commission-rate").keypress(function(e) {
    if(String.fromCharCode(e.which) != '.' && isNaN(String.fromCharCode(e.which)))
      e.preventDefault();
  });

  $("#avg-sale-price, #avg-commission-rate").on("input", (e) => {
    let tmp = parseFloat(e.target.innerHTML.replace(/,/g, ''));
    tmp = tmp > 1000000? 1000000 : tmp;
    if(e.target.id === "avg-commission-rate") tmp = tmp > 100? 100 : tmp;
    e.target.innerHTML = addComma(tmp);
  });

  // update digs
  $(".paid-to-digs .unlock, .paid-to-digs .lock").each((idx, elem) => {
    elem.addEventListener("click", () => {
      if(elem.className === "lock") {
        elem.className = "unlock";
        sliders[idx + 1].enable();
      }else {
        elem.className = "lock";
        sliders[idx + 1].disable();
      }
    });
  });

  const updatePaidDigs = () => {
    let a = sliders[0].getValue();
    let b = sliders[1].getValue();
    let c = 2.5;
    let d;
    let e = sliders[1].getValue();
    let f = sliders[2].getValue();
    let g = sliders[3].getValue();
    let h = sliders[4].getValue();
    let te = e * 12;
    let tf = f / 100 * a * b * c; tf = tf > 6000 ? 6000 : tf; tf = tf.toFixed(0);
    let tg = g * a;               tg = tg > 6000 ? 6000 : tg; tg = tg.toFixed(0);
    d = te + tf.to_f + tg.to_f + h.to_f;         d  = d  > 6000 ? 6000 : d;  d  = d.toFixed(0);

    $("#paid-to-giddy-digs")[0].innerHTML = "Paid to Giddy Digs: $"+ addComma(d);
    $("#" + sliderIds[1] + " + span")[0].innerHTML = "$" + addComma(te) + " per Year";
    $("#" + sliderIds[2] + " + span")[0].innerHTML = "$" + addComma(tf) + " per Year";
    $("#" + sliderIds[3] + " + span")[0].innerHTML = "$" + addComma(tg) + " per Year";
    $("#" + sliderIds[4] + " + span")[0].innerHTML = "$" + addComma(h) + " per Year";
  }

  generateSliders();

  sliders.forEach((slider, idx) => {
    slider.on('slide', (value)=> {
      slider.setValue(value);
      $("#" + sliderIds[idx] + "-description")[0].innerHTML = description[idx].unit + addComma(value) + description[idx].suffix;
      updatePaidDigs();
    });
  });

});