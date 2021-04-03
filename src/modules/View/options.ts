type ViewOptions = {
  // Длина слайдера(в любых единицах измерения)
  length: string
  // Наличие подсказки у ползунков
  hasTooltip: boolean
  // Наличие шкалы значений
  // False - отсутствует
  // True - показывает 5 чисел в шкале значений
  // Number - показывает number чисел в шкале значений
  // Array - показывает array.length значений(любых) по порядку в шкале значений
  stepsInfo: boolean | Array<number | string> | number
  // Элемент с текущим значением
  hasValueInfo: boolean
  // Вертикальный слайдер
  isVertical: boolean
  // Отзывчивость слайдера. Рекомендуется отключать(false), если length задана в
  // статических ед. измерения(например, px)
  isResponsive: boolean
  // Если true, то при нажатии стрелок и ad активный ползунок будет перемещаться
  useKeyboard: boolean
  // Если true, то шкала значений будет кликабельна и активный
  // ползунок(если isRange=true, по умолчанию = thumb[1]) будет
  // перемещаться на соответствующее значение
  stepsInfoInteractivity: boolean

  // Классы элементов слайдера
  sliderClass?: string | string[]
  sliderVerticalClass?: string | string[]
  barClass?: string | string[]
  progressBarClass?: string | string[]
  thumbClass?: string | string[]
  activeThumbClass?: string | string[]
  tooltipClass?: string | string[]
  tooltipValueClass?: string | string[]
  stepsInfoClass?: string | string[]
  valueInfoClass?: string | string[]
}

type ViewOptionsOptionalParams = {
  length?: string
  hasTooltip?: boolean
  stepsInfo?: boolean | Array<number | string> | number
  hasValueInfo?: boolean
  isVertical?: boolean
  isResponsive?: boolean
  useKeyboard?: boolean
  stepsInfoInteractivity?: boolean
  sliderClass?: string | string[]
  sliderVerticalClass?: string | string[]
  barClass?: string | string[]
  progressBarClass?: string | string[]
  thumbClass?: string | string[]
  activeThumbClass?: string | string[]
  tooltipClass?: string | string[]
  tooltipValueClass?: string | string[]
  stepsInfoClass?: string | string[]
  valueInfoClass?: string | string[]
}


export { ViewOptions, ViewOptionsOptionalParams };
