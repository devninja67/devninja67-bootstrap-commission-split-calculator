let maxSliderValue = [430, 5, 500, 4000];

 // when key called 'delete' was pressed,1
 // when key called 'BackSpace' was pressed, -1
 // else 0
var pressedKey = 0;

const goToNextPage = () => {
  let a = parseFloat($("#transaction-count")[0].value);
  let b = parseFloat($("#avg-sale-price")[0].innerHTML.replace(/,/g, ''));
  let c = parseFloat($("#avg-commission-rate")[0].innerHTML.replace(/,/g, ''));
  let d;
  let e = parseFloat($("#per-month")[0].value);
  let f = parseFloat($("#per-commission")[0].value);
  let g = parseFloat($("#per-transaction")[0].value);
  let h = parseFloat($("#pre-paid")[0].value);
  let maxH = maxSliderValue[3];
  let te = e * 12;
  let maxTe = maxSliderValue[0] * 12;
  let tf = f / 100 * a * b * c/100;
  let maxTf = maxSliderValue[1] / 100 * a * b * c/100;
  let tg = g * a;
  let maxTg = maxSliderValue[2] * a;
  d = te + tf + tg + h;
  tf = tf > 6000 ? 6000 : tf; tf = tf.toFixed(0); tf = parseFloat(tf);
  maxTf = maxTf > 6000 ? 6000 : maxTf; maxTf = maxTf.toFixed(0); maxTf = parseFloat(maxTf);
  tg = tg > 6000 ? 6000 : tg; tg = tg.toFixed(0); tg = parseFloat(tg);
  maxTg = maxTg > 6000 ? 6000 : maxTg; maxTg = maxTg.toFixed(0); maxTg = parseFloat(maxTg);
  d  = d  > 6000 ? 6000 :  d;  d =  d.toFixed(0);  d = parseFloat(d);
  d = d - te * 0.14 - h / 33.33; d =  d.toFixed(0);  d = parseFloat(d);

  localStorage.setItem("#0", a);
  localStorage.setItem("#1", b);
  localStorage.setItem("#2", c);
  localStorage.setItem("#3", d);
  localStorage.setItem("#4", e);
  localStorage.setItem("#5", maxTe);
  localStorage.setItem("#6", f);
  localStorage.setItem("#7", maxTf);
  localStorage.setItem("#8", g);
  localStorage.setItem("#9", maxTg);
  localStorage.setItem("#10", h);
  localStorage.setItem("#11", maxH);

  window.location = './nextPage.html';
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
  }

  // editable area
  $(".editable").click(function() {
    $(this).children().focus();
  });

  // prevent other key excepted with decimal point or number
  $("#avg-sale-price, #avg-commission-rate").keypress(function(e) {
    if(String.fromCharCode(e.which) != '.' && isNaN(String.fromCharCode(e.which)))
      e.preventDefault();
  });

  // detect if key 'backspace', 'delete' or others
  $("#avg-sale-price, #avg-commission-rate").keydown(function(e) {
    var key = event.keyCode || event.charCode;
    if(key === 8) pressedKey = -1;
    else if(key === 46) pressedKey = 1;
    else pressedKey = 0;
  });

  // when detected inputing, modifying number and set caret position
  $("#avg-sale-price, #avg-commission-rate").on("input", (e) => {
    let caretPos = window.getSelection().anchorOffset;
    let strTotal = e.target.innerHTML;
    let result = getNextCaretPos(strTotal, caretPos);
    e.target.innerHTML = addComma(result[0]);
    setCaret(e.target.id, result[1]);
  });

  // when detected blur, convert complete number and update all descriptions
  $("#avg-sale-price, #avg-commission-rate").blur((e) => {
    let strTotal = e.target.innerHTML;
    let totalNumber = parseFloat(strTotal.replace(/[, ]+/g, ''));
    
    if(totalNumber >= 1000000) totalNumber = 1000000;
    if(e.target.id === "avg-commission-rate" && totalNumber >= 100) totalNumber = 100;
    e.target.innerHTML = addComma(totalNumber);
    updatePaidDigs();
  });

  // when lock, disable slider, when unlock, enable slider
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

  // update digs
  const updatePaidDigs = () => {
    let a = sliders[0].getValue();
    let b = parseFloat($("#avg-sale-price")[0].innerHTML.replace(/,/g, ''));
    let c = parseFloat($("#avg-commission-rate")[0].innerHTML.replace(/,/g, ''));
    let d;
    let e = sliders[1].getValue();
    let f = sliders[2].getValue();
    let g = sliders[3].getValue();
    let h = sliders[4].getValue();
    let maxH = maxSliderValue[3];
    let te = e * 12;
    let maxTe = maxSliderValue[0] * 12;
    let tf = f / 100 * a * b * c/100;
    let maxTf = maxSliderValue[1] / 100 * a * b * c/100;
    let tg = g * a;
    let maxTg = maxSliderValue[2] * a;
    d = te + tf + tg + h;
    tf = tf > 6000 ? 6000 : tf; tf = tf.toFixed(0); tf = parseFloat(tf);
    maxTf = maxTf > 6000 ? 6000 : maxTf; maxTf = maxTf.toFixed(0); maxTf = parseFloat(maxTf);
    tg = tg > 6000 ? 6000 : tg; tg = tg.toFixed(0); tg = parseFloat(tg);
    maxTg = maxTg > 6000 ? 6000 : maxTg; maxTg = maxTg.toFixed(0); maxTg = parseFloat(maxTg);
    d = d  > 6000 ? 6000 :  d;  d =  d.toFixed(0);  d = parseFloat(d);
    d = d - te * 0.14 - h * 0.3333; d =  d.toFixed(0);  d = parseFloat(d);

    $("#paid-to-giddy-digs")[0].innerHTML = "Paid to Giddy Digs: $"+ addComma(d);
    $("#" + sliderIds[1] + " + span")[0].innerHTML = "$" + addComma(maxTe) + " per Year";
    $("#" + sliderIds[2] + " + span")[0].innerHTML = "$" + addComma(maxTf) + " per Year";
    $("#" + sliderIds[3] + " + span")[0].innerHTML = "$" + addComma(maxTg) + " per Year";
    $("#" + sliderIds[4] + " + span")[0].innerHTML = "$" + addComma(maxH)  + " per Year";

    sliderIds.forEach((sliderId, idx) => {
      $("#" + sliderId + "-description")[0].innerHTML = description[idx].unit + addComma(sliders[idx].getValue()) + description[idx].suffix;
    });
  }

  const getPercent = (id) => {return sliders[id + 1].getValue() / maxSliderValue[id] * 100;}

  const percentToValue = (idx, percent) => {return maxSliderValue[idx] * percent / 100;}

  const valueToPercent = (idx, value) => {return value * 100 / maxSliderValue[idx];}

  // sum of all digs's value
  const percentSum = () => {
    return maxSliderValue.reduce((sum, maxValue, id) => {
      return sum + getPercent(id);
    }, 0);
  }

  // change slider by offset value, 'changePercent'
  const changeSliderValue = (idx, changePercent) => {
    currentPercent = getPercent(idx - 1);
    if(changePercent < 0 ) {
      sliders[idx].setValue(
        percentToValue(idx -1, currentPercent + Math.min(100 - currentPercent, Math.abs(changePercent)))
      );
    }
    else {
      sliders[idx].setValue(
        percentToValue(idx-1, currentPercent - Math.min(currentPercent, changePercent))
      );
    }
  }

  // generate sliders
  generateSliders();

  // interactive sliders
  sliders.forEach((slider, idx) => {
    slider.on('change', (param)=> {
      let value = param.newValue;
      slider.setValue(value);
      if(idx > 0) {
        let changePercent = percentSum() - 100;
        let stride = changePercent > 0 ? 1 : -1;
        let nextIdx = idx;
        while(changePercent != 0.0) {
          nextIdx = (nextIdx - 1 + stride + 4) % 4 + 1;
          if(sliders[nextIdx].isEnabled()) {
            changeSliderValue(nextIdx, changePercent);
            changePercent = percentSum() - 100;
          }
          if(nextIdx === idx) break;
        }
      }
      updatePaidDigs();
    });
  });
});