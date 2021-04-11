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

export function makeNewCheckbox(name, checked = Boolean) {
  var div = document.createElement('div');

  var label = document.createElement('label');
  label.textContent = `${name}: `;

  var checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  if(checked) {
    checkbox.checked = 'checked';
  } else {
    checkbox.checked = '';
  }

  div.append(label);
  div.append(checkbox);

  return {div, checkbox}
}

export default () => {
  return 'what is up pimp?';
};