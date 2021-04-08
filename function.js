export function makeNewSlider(name, min, max, value) {
  var div = document.createElement('div');

  var label = document.createElement('label');
  label.textContent = `${name}: `;

  var slider = document.createElement('input');
  slider.type = 'range';
  slider.min = `${min}`;
  slider.max = `${max}`;
  slider.value = `${value}`;

  div.append(label);
  div.append(slider);

  return {div, slider}
}

export default makeNewSlider;