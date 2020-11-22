import { IModel } from '../interfaces/modelTypesAndInterfaces';
import { SliderOptions, ViewOptions } from '../interfaces/options';
import { IView } from '../interfaces/viewInterfaces';

export default class View implements IView {
  sliderClass: string | string[]
  sliderVerticalClass: string | string[]
  barClass: string | string[]
  progressBarClass: string | string[]
  thumbClass: string | string[]
  activeThumbClass: string | string[]
  tooltipClass: string | string[]
  stepsInfoClass: string | string[]
  valueInfoClass: string | string[]

  private _responsive: boolean
  private _lastLength: number
  private readonly _model: IModel
  private _parent: Element
  private _slider: HTMLElement
  private _bar: HTMLElement
  private _progressBar: HTMLElement
  private _thumb: HTMLElement | Array<HTMLElement> | undefined
  private _tooltip: HTMLElement | Array<HTMLElement> | undefined
  private _stepsInfo: HTMLElement | undefined
  private _valueInfo: HTMLElement | undefined
  private _length: string
  private _vertical: boolean
  private _stepsInfoSettings: boolean | Array<number | string> | number

  constructor(model: IModel, viewOptions: ViewOptions | SliderOptions, parent: Element) {
    this.sliderClass = viewOptions.sliderClass ? viewOptions.sliderClass : 'slider';
    this.sliderVerticalClass = viewOptions.sliderVerticalClass ? viewOptions.sliderVerticalClass : 'slider_vertical';
    this.barClass = viewOptions.barClass ? viewOptions.barClass : 'slider__bar';
    this.progressBarClass = viewOptions.progressBarClass ? viewOptions.progressBarClass : 'slider__progress-bar';
    this.thumbClass = viewOptions.thumbClass ? viewOptions.thumbClass : 'slider__thumb';
    this.activeThumbClass = viewOptions.activeThumbClass ? viewOptions.activeThumbClass : 'slider__thumb_active';
    this.tooltipClass = viewOptions.tooltipClass ? viewOptions.tooltipClass : 'slider__tooltip';
    this.stepsInfoClass = viewOptions.stepsInfoClass ? viewOptions.stepsInfoClass : 'slider__steps-info';
    this.valueInfoClass = viewOptions.valueInfoClass ? viewOptions.valueInfoClass : 'slider__value-info';

    this._model = model;

    this._length = viewOptions.length;

    this._responsive = viewOptions.responsive;

    this._vertical = viewOptions.vertical;
    this._stepsInfoSettings = viewOptions.stepsInfo;

    this._parent = parent;
    this._slider = this.createSlider();
    this._bar = this.createBar();
    this._progressBar = this.createProgressBar();
    this._thumb = this.createThumb();
    this._tooltip = viewOptions.tooltip ? this.createTooltip() : undefined;
    this._stepsInfo = viewOptions.stepsInfo ? this.createStepsInfo() : undefined;
    this._valueInfo = viewOptions.valueInfo ? this.createValueInfo() : undefined;

    this.onWindowResize = this.onWindowResize.bind(this);

    this._lastLength = this.getLength();
    if (this._responsive) {
      window.addEventListener('resize', this.onWindowResize);
    }
  }

  // Возвращает значение responsive
  getResponsive(): boolean {
    return this._responsive;
  }
  // Изменяет значение responsive, добавляет/убирает слушатели window resize
  // Возвращает новое значение responsive
  changeResponsive(newResponsive: boolean): boolean {
    if (this._responsive !== newResponsive) {
      if (newResponsive) {
        window.addEventListener('resize', this.onWindowResize);
      } else {
        window.removeEventListener('resize', this.onWindowResize);
      }
      this._responsive = newResponsive;
    }
    return this.getResponsive();
  }
  // Используется в слушателях window-resize
  private onWindowResize(): void {
    if (this.getLength() !== this._lastLength) {
      this.updateProgressBar();
      this.updateThumb();
      this.updateStepsInfo();

      this._lastLength = this.getLength();
    }
  }

  private getModel(): IModel {
    return this._model;
  }
  getSlider(): HTMLElement {
    return this._slider;
  }
  getParent(): Element {
    return this._parent;
  }
  getBar(): HTMLElement {
    return this._bar;
  }
  getProgressBar(): HTMLElement {
    return this._progressBar;
  }
  getThumb(): HTMLElement | Array<HTMLElement> | undefined {
    return this._thumb;
  }
  getTooltip(): HTMLElement | Array<HTMLElement> | undefined {
    return this._tooltip;
  }
  getStepsInfo(): HTMLElement | undefined {
    return this._stepsInfo;
  }
  getValueInfo(): HTMLElement | undefined {
    return this._valueInfo;
  }

  // Возвращает длину слайдер-бара в px
  getLength(): number {
    if (this.getVertical()) {
      return +this.getBar().offsetHeight;
    }
    return +this.getBar().offsetWidth;
  }
  getVertical(): boolean {
    return this._vertical;
  }
  // Возвращает заданные настройки stepsInfo
  getStepsInfoSettings(): boolean | Array<number | string> | number {
    return this._stepsInfoSettings;
  }
  // Возвращает нужное положение ползунка(ов), исходя из значений модели
  getThumbPosition(): number | number[] {
    const value = this.getModel().getValue();
    let thumbPosition;
    // value === 'number' при range = false
    if (typeof value === 'number') {
      thumbPosition = (this.getLength() / this.getModel().getMaxDiapason()) * value;
    } else {
      thumbPosition = [
        (this.getLength() / this.getModel().getMaxDiapason()) * value[0],
        (this.getLength() / this.getModel().getMaxDiapason()) * value[1],
      ];
    }

    return thumbPosition;
  }


  // Изменяет ширину/высоту слайдера, обновляет положение элементов
  // слайдера, возвращает новую длину
  changeLength(newLength: string): number {
    this._length = newLength;

    if (this.getVertical()) {
      this.getBar().style.height = this._length;
    } else {
      this.getBar().style.width = this._length;
    }

    this.updateThumb();

    this.updateProgressBar();

    this.updateStepsInfo();

    return this.getLength();
  }

  // Меняет положение всех элементов на новое значение vertical и возвращает его
  changeVertical(newVertical: boolean): boolean {
    this._vertical = newVertical;

    const stepsInfo = this.getStepsInfo();

    if (!this._vertical) {
      this.getBar().style.width = this._length;
      this.getBar().style.height = '';
      if (Array.isArray(this.sliderVerticalClass)) {
        this.getSlider().classList.remove(...this.sliderVerticalClass);
      } else {
        this.getSlider().classList.remove(this.sliderVerticalClass);
      }
      const thumb = this.getThumb();
      const thumbPosition = this.getThumbPosition();
      const progressBar = this.getProgressBar();

      if (thumb && !Array.isArray(thumb) && typeof thumbPosition === 'number') {
        thumb.style.top = '';
        thumb.style.left = `${thumbPosition - thumb.offsetHeight / 2}px`;

        progressBar.style.width = `${thumbPosition}px`;
        progressBar.style.height = '';
        progressBar.style.left = '0';
        progressBar.style.top = '';
      } else if (Array.isArray(thumb) && Array.isArray(thumbPosition)) {
        for (let i = 0; i <= 1; i += 1) {
          thumb[i].style.left = `${thumbPosition[i] - thumb[i].offsetHeight / 2}px`;
          thumb[i].style.top = '';

          progressBar.style.width = `${thumbPosition[1] - thumbPosition[0]}px`;
          progressBar.style.height = '';
          progressBar.style.left = `${thumbPosition[0]}px`;
          progressBar.style.top = '';
        }
      }
    } else {
      this.getBar().style.height = this._length;
      this.getBar().style.width = '';
      if (Array.isArray(this.sliderVerticalClass)) {
        this.getSlider().classList.add(...this.sliderVerticalClass);
      } else {
        this.getSlider().classList.add(this.sliderVerticalClass);
      }
      const thumb = this.getThumb();
      const thumbPosition = this.getThumbPosition();
      const progressBar = this.getProgressBar();

      if (thumb && !Array.isArray(thumb) && typeof thumbPosition === 'number') {
        thumb.style.left = '';
        thumb.style.top = `${thumbPosition - thumb.offsetHeight / 2}px`;

        progressBar.style.height = `${thumbPosition}px`;
        progressBar.style.width = '';
        progressBar.style.top = '0';
        progressBar.style.left = '';
      } else if (Array.isArray(thumb) && Array.isArray(thumbPosition)) {
        for (let i = 0; i <= 1; i += 1) {
          thumb[i].style.top = `${thumbPosition[i] - thumb[i].offsetHeight / 2}px`;
          thumb[i].style.left = '';

          progressBar.style.height = `${thumbPosition[1] - thumbPosition[0]}px`;
          progressBar.style.width = '';
          progressBar.style.top = `${thumbPosition[0]}px`;
          progressBar.style.left = '';
        }
      }
    }

    if (stepsInfo) {
      stepsInfo.remove();
      this.createStepsInfo();
    }

    return this._vertical;
  }

  // Создает и возвращает слайдер в this._parent
  createSlider(): HTMLElement {
    const slider = document.createElement('div');
    if (Array.isArray(this.sliderClass)) {
      slider.classList.add(...this.sliderClass);
    } else {
      slider.classList.add(this.sliderClass);
    }

    if (this.getVertical()) {
      if (Array.isArray(this.sliderVerticalClass)) {
        slider.classList.add(...this.sliderVerticalClass);
      } else {
        slider.classList.add(this.sliderVerticalClass);
      }
    }

    this._parent.appendChild(slider);

    return slider;
  }
  // Создает и возвращает бар в this._slider
  createBar(): HTMLElement {
    const bar = document.createElement('div');
    if (Array.isArray(this.barClass)) {
      bar.classList.add(...this.barClass);
    } else {
      bar.classList.add(this.barClass);
    }
    bar.style.position = 'relative';

    if (!this._vertical) {
      bar.style.width = this._length;
    } else {
      bar.style.height = this._length;
    }

    this.getSlider().appendChild(bar);
    return bar;
  }
  // Создает и возвращает прогресс-бар в баре
  createProgressBar(): HTMLElement {
    const progressBar = document.createElement('div');
    this.getBar().appendChild(progressBar);

    if (Array.isArray(this.progressBarClass)) {
      progressBar.classList.add(...this.progressBarClass);
    } else {
      progressBar.classList.add(this.progressBarClass);
    }
    progressBar.style.position = 'absolute';

    this._progressBar = progressBar;

    this.updateProgressBar();

    return progressBar;
  }
  // Обновляет положение прогресс-бара
  updateProgressBar(): void {
    const thumbPosition = this.getThumbPosition();

    if (typeof thumbPosition === 'number') {
      if (this.getVertical()) {
        this.getProgressBar().style.height = `${thumbPosition}px`;
        this.getProgressBar().style.top = '0';
      } else {
        this.getProgressBar().style.width = `${thumbPosition}px`;
        this.getProgressBar().style.left = '0';
      }
    } else {
      if (this.getVertical()) {
        this.getProgressBar().style.height = `${thumbPosition[1] - thumbPosition[0]}px`;
        this.getProgressBar().style.top = `${thumbPosition[0]}px`;
      } else {
        this.getProgressBar().style.width = `${thumbPosition[1] - thumbPosition[0]}px`;
        this.getProgressBar().style.left = `${thumbPosition[0]}px`;
      }
    }
  }
  // Создает и возвращает ползунок(ки) в баре
  createThumb(): HTMLElement | Array<HTMLElement> {
    const thumbPosition = this.getThumbPosition();

    // thumbPosition === 'number' при range = false
    if (typeof thumbPosition === 'number') {
      const thumb = document.createElement('div');

      if (Array.isArray(this.thumbClass)) {
        thumb.classList.add(...this.thumbClass);
      } else {
        thumb.classList.add(this.thumbClass);
      }
      thumb.style.position = 'absolute';

      this.getBar().appendChild(thumb);

      if (this.getVertical()) {
        thumb.style.top = `${thumbPosition - thumb.offsetHeight / 2}px`;
      } else {
        thumb.style.left = `${thumbPosition - thumb.offsetWidth / 2}px`;
      }

      this._thumb = thumb;
    } else {
      this._thumb = [];
      for (let i = 0; i <= 1; i += 1) {
        const thumb = document.createElement('div');
        if (Array.isArray(this.thumbClass)) {
          thumb.classList.add(...this.thumbClass);
        } else {
          thumb.classList.add(this.thumbClass);
        }
        thumb.style.position = 'absolute';
        thumb.dataset.number = String(i);

        this.getBar().appendChild(thumb);

        if (this.getVertical()) {
          thumb.style.top = `${thumbPosition[i] - thumb.offsetHeight / 2}px`;
        } else {
          thumb.style.left = `${thumbPosition[i] - thumb.offsetWidth / 2}px`;
        }

        this._thumb.push(thumb);
      }
    }
    return this._thumb;
  }
  // Обновляет положение ползунков
  updateThumb() {
    const thumbPosition = this.getThumbPosition();
    const thumb = this.getThumb();

    if (typeof thumbPosition === 'number' && !Array.isArray(thumb) && thumb) {
      if (this.getVertical()) {
        thumb.style.top = `${thumbPosition - thumb.offsetHeight / 2}px`;
      } else {
        thumb.style.left = `${thumbPosition - thumb.offsetWidth / 2}px`;
      }
    } else if (Array.isArray(thumbPosition) && Array.isArray(thumb)) {
      for (let i = 0; i <= 1; i += 1) {
        if (this.getVertical()) {
          thumb[i].style.top = `${thumbPosition[i] - thumb[i].offsetHeight / 2}px`;
        } else {
          thumb[i].style.left = `${thumbPosition[i] - thumb[i].offsetWidth / 2}px`;
        }
      }
    }
  }
  // Удаляет ползунок(ки)
  removeThumb() {
    const thumb = this.getThumb();

    if (thumb) {
      if (Array.isArray(thumb)) {
        thumb.forEach((thumbElem) => {
          thumbElem.remove();
        });
      } else {
        thumb.remove();
      }
    }

    this._thumb = undefined;
  }

  // Создает и возвращает подсказки в ползунках
  createTooltip(): HTMLElement | Array<HTMLElement> | undefined {
    const thumb = this.getThumb();
    const value = this.getModel().getValue();

    if (Array.isArray(thumb)) {
      this._tooltip = [];
      for (let i = 0; i <= 1; i += 1) {
        const tooltip = document.createElement('div');
        if (Array.isArray(this.tooltipClass)) {
          tooltip.classList.add(...this.tooltipClass);
        } else {
          tooltip.classList.add(this.tooltipClass);
        }

        if (Array.isArray(value)) {
          tooltip.innerHTML = `<div>${+(value[i]).toFixed(3)}</div>`;
        }

        thumb[i].appendChild(tooltip);
        this._tooltip.push(tooltip);
      }
    } else {
      const tooltip = document.createElement('div');
      if (Array.isArray(this.tooltipClass)) {
        tooltip.classList.add(...this.tooltipClass);
      } else {
        tooltip.classList.add(this.tooltipClass);
      }

      if (!Array.isArray(value)) {
        tooltip.innerHTML = `<div>${+(value).toFixed(3)}</div>`;
      }

      if (thumb) thumb.appendChild(tooltip);

      this._tooltip = tooltip;
    }
    return this._tooltip;
  }
  // Обновляет значение в подсказках
  updateTooltip() {
    const tooltip = this.getTooltip();
    const value = this.getModel().getValue();
    if (tooltip) {
      if (Array.isArray(tooltip)) {
        if (Array.isArray(value)) {
          for (let i = 0; i <= 1; i += 1) {
            tooltip[i].innerHTML = `<div>${+(value[i]).toFixed(3)}</div>`;
          }
        }
      } else {
        if (!Array.isArray(value)) {
          tooltip.innerHTML = `<div>${+(value).toFixed(3)}</div>`;
        }
      }
    }
  }
  // Удаляет подсказки
  removeTooltip(): void {
    const tooltip = this.getTooltip();

    if (Array.isArray(tooltip)) {
      for (let i = 0; i <= 1; i += 1) {
        tooltip[i].remove();
      }
    } else if (tooltip) {
      tooltip.remove();
    }

    this._tooltip = undefined;
  }

  // Создает шкалу значений в зависимости от текущих настроек stepsInfo.
  // Если stepsInfoSettings заданы как false, то переназначает на true
  createStepsInfo(): HTMLElement | undefined {
    const stepsInfo = document.createElement('div');
    let stepsInfoSettings = this.getStepsInfoSettings();

    this.getBar().appendChild(stepsInfo);

    if (!stepsInfoSettings) {
      this._stepsInfoSettings = true;
      stepsInfoSettings = this.getStepsInfoSettings();
    }
    if (Array.isArray(this.stepsInfoClass)) {
      stepsInfo.classList.add(...this.stepsInfoClass);
    } else {
      stepsInfo.classList.add(this.stepsInfoClass);
    }

    if (this.getVertical()) {
      stepsInfo.style.height = `${this.getLength()}px`;
    } else {
      stepsInfo.style.width = `${this.getLength()}px`;
    }

    let numOfSteps: number = 5;
    let steps: Array<number | string> = [];

    if (typeof stepsInfoSettings === 'number' || stepsInfoSettings === true) {
      if (typeof stepsInfoSettings === 'number') {
        numOfSteps = stepsInfoSettings;
      }

      for (let i = 0; i < numOfSteps; i += 1) {
        steps.push(
          this.getModel().getMin()
          + +((this.getModel().getMaxDiapason() / (numOfSteps - 1)) * i).toFixed(3),
        );
      }
    } else if (Array.isArray(stepsInfoSettings)) {
      numOfSteps = stepsInfoSettings.length;
      steps = stepsInfoSettings;
    }

    for (let i = 0; i < numOfSteps; i += 1) {
      const stepElem = document.createElement('div');
      const position = (this.getLength() / (numOfSteps - 1)) * i;
      stepElem.innerText = `${steps[i]}`;
      stepElem.style.position = 'absolute';
      stepsInfo.appendChild(stepElem);
      if (this.getVertical()) {
        stepElem.style.top = `${position - stepElem.offsetHeight / 2}px`;
      } else {
        stepElem.style.left = `${position - stepElem.offsetWidth / 2}px`;
      }
    }

    this._stepsInfo = stepsInfo;
    return stepsInfo;
  }
  // Обновляет положение элементов шкалы значений
  updateStepsInfo() {
    const stepsInfo = this.getStepsInfo();

    if (stepsInfo) {
      const stepElems = Array.from(stepsInfo.children) as HTMLElement[];

      for (let i = 0; i < stepElems.length; i += 1) {
        const position = (this.getLength() / (stepElems.length - 1)) * i;

        if (this.getVertical()) {
          stepElems[i].style.top = `${position - stepElems[i].offsetHeight / 2}px`;
        } else {
          stepElems[i].style.left = `${position - stepElems[i].offsetWidth / 2}px`;
        }
      }
    }
  }
  // Удаляет шкалу значений
  removeStepsInfo(): void {
    const stepsInfo = this.getStepsInfo();
    if (stepsInfo) {
      stepsInfo.remove();
      this._stepsInfo = undefined;
    }
  }
  // Меняет настройки шкалы значений и обновляет ее
  changeStepsInfoSettings(newStepsInfoSettings
                            : boolean | Array<number | string> | number): HTMLElement | undefined {
    this._stepsInfoSettings = newStepsInfoSettings;

    this.removeStepsInfo();
    return this.createStepsInfo();
  }

  // Создает элемент с текущим значением. По умолчанию, если range=false, то
  // указывается просто model.value, иначе записывается в виде value[0] - value[1]
  createValueInfo(): HTMLElement {
    const valueInfo = document.createElement('div');
    const value = this.getModel().getValue();

    if (Array.isArray(this.valueInfoClass)) {
      valueInfo.classList.add(...this.valueInfoClass);
    } else {
      valueInfo.classList.add(this.valueInfoClass);
    }

    this.getSlider().appendChild(valueInfo);

    if (typeof value === 'number') {
      valueInfo.innerText = `${+(value).toFixed()}`;
    } else {
      valueInfo.innerText = `${+(value[0]).toFixed()} - ${+(value[1]).toFixed()}`;
    }

    this._valueInfo = valueInfo;
    return valueInfo;
  }
  // Обновляет значение в valueInfo
  updateValueInfo() {
    const valueInfo = this.getValueInfo();
    const value = this.getModel().getValue();
    if (valueInfo) {
      if (typeof value === 'number') {
        valueInfo.innerText = `${+(value).toFixed()}`;
      } else {
        valueInfo.innerText = `${+(value[0]).toFixed()} - ${+(value[1]).toFixed()}`;
      }
    }
  }
  // Удаляет элемент со значением
  removeValueInfo(): void {
    if (this._valueInfo) {
      this._valueInfo.remove();
      this._valueInfo = undefined;
    }
  }
}
