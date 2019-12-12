function component() {
  var element = document.createElement('div');

  element.innerHTML = ['Hello webpack!', '<i class="iconfont icon-waimai1"></i>'].join('\n\n');

  return element;
}

document.body.appendChild(component());
