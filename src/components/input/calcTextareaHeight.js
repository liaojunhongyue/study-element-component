let hiddenTextarea;

const HIDDEN_STYLE = `
  height:0 !important;
  visibility:hidden !important;
  overflow:hidden !important;
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important
`;

const CONTEXT_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing'
];

// 获取目标元素的 box-sizing、padding、border、以及其他与元素大小有关的全部属性
function calculateNodeStyling(targetElement) {
  const style = window.getComputedStyle(targetElement);

  const boxSizing = style.getPropertyValue('box-sizing');

  const paddingSize = (
    parseFloat(style.getPropertyValue('padding-bottom')) +
    parseFloat(style.getPropertyValue('padding-top'))
  );

  const borderSize = (
    parseFloat(style.getPropertyValue('border-bottom-width')) +
    parseFloat(style.getPropertyValue('border-top-width'))
  );
  // 首先获取传入的 textarea 的与元素大小有关全部CSS属性
  const contextStyle = CONTEXT_STYLE
    .map(name => `${name}:${style.getPropertyValue(name)}`)
    .join(';');

  return { contextStyle, paddingSize, borderSize, boxSizing };
}

export default function calcTextareaHeight(
  targetElement,
  minRows = 1,
  maxRows = null
) {
  // 设置一个隐藏的 textarea 用于获取其 scrollHeight
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    document.body.appendChild(hiddenTextarea);
  }
  

  let {
    paddingSize,
    borderSize,
    boxSizing,
    contextStyle
  } = calculateNodeStyling(targetElement);

  hiddenTextarea.setAttribute('style', `${contextStyle};${HIDDEN_STYLE}`);
  hiddenTextarea.value = targetElement.value || targetElement.placeholder || '';

  // scrollHeight 返回该元素在不使用滚动条时的高度，包含元素内容content的高度，以及内边距padding的高度，但是
  let height = hiddenTextarea.scrollHeight;
  const result = {};

  if (boxSizing === 'border-box') {
    // 如果是『IE盒子模型』则高度需要加上边框的高度，因为IE盒子模型的高度是 content+padding+border
    height = height + borderSize;
  } else if (boxSizing === 'content-box') {
    // 如果是『标准盒子模型』则高度需要减去 padding 的高度，因为标准盒子模型的高度只有 content 的高度
    height = height - paddingSize;
  }

  // 将value设置为空，计算出1行的高度
  hiddenTextarea.value = '';
  let singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

  // 如果传入了最小行数 minRows
  if (minRows !== null) {
    // 根据传入的最小行数计算出最小高度
    let minHeight = singleRowHeight * minRows;
    // 如果是IE盒子模型，则最小高度需要加上 padding 和 border
    if (boxSizing === 'border-box') {
      minHeight = minHeight + paddingSize + borderSize;
    }
    // 取隐藏textarea和最小高度中较大的作为组件的最小高度 minHeight
    // 这样 textarea 在小于最小高度时取最小高度，在大于最小高度时取自适应高度
    height = Math.max(minHeight, height);
    result.minHeight = `${ minHeight }px`;
  }
  
  // 如果传入了最大行数 maxRows
  if (maxRows !== null) {
    // 则根据传入的最大行数计算出最大高度
    let maxHeight = singleRowHeight * maxRows;
    // 如果是IE盒子模型，则最大高度需要加上 padding 和 border
    if (boxSizing === 'border-box') {
      maxHeight = maxHeight + paddingSize + borderSize;
    }
    // 取隐藏textarea和最大高度中较小的作为组件的高度 height
    // 这样超过最大高度时出现滚动条，小于最大高度时自适应
    height = Math.min(maxHeight, height);
  }
  result.height = `${ height }px`;
  
  hiddenTextarea.parentNode && hiddenTextarea.parentNode.removeChild(hiddenTextarea);
  hiddenTextarea = null;
  return result;
};
