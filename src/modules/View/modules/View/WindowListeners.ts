import { IWindowListeners, Views } from './interfaces';
import { IViewModel } from '../ViewModel/interfacesAndTypes';
import { IThumbView } from '../SubViews/ThumbView/interfaceAndTypes';
import IBarView from '../SubViews/BarView/interface';
import IStepsInfoView from '../SubViews/StepsInfoView/interface';

class WindowListeners implements IWindowListeners {
  private readonly viewModel: IViewModel
  private thumbView: IThumbView | undefined
  private barView: IBarView | undefined
  private stepsInfoView: IStepsInfoView | undefined

  constructor(viewModel: IViewModel, views: Views) {
    this.viewModel = viewModel;
    this.thumbView = views.thumb;
    this.barView = views.bar;
    this.stepsInfoView = views.stepsInfo;

    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
  }

  // Добавить обработчик onKeydown и useKeyboard = true
  addKeyboardListener(): void {
    document.addEventListener('keydown', this.handleDocumentKeyDown);
  }

  // Убирает слушатель клавиатуры и useKeyboard = false
  removeKeyboardListener() {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  // Изменяет значение responsive, добавляет/убирает слушатели window resize
  // Возвращает новое значение responsive
  setResponsive(newResponsive: boolean): void {
    if (newResponsive) {
      window.removeEventListener('resize', this.handleWindowResize);
      window.addEventListener('resize', this.handleWindowResize);
    } else {
      window.removeEventListener('resize', this.handleWindowResize);
    }
  }

  // При нажатии клавиш wasd и стрелок вызывается moveActiveThumb(1/-1)
  private handleDocumentKeyDown(evt: KeyboardEvent): void {
    const isThisNextKey = evt.key === 'ArrowRight' || evt.key === 'ArrowBottom'
      || evt.key === 'd' || evt.key === 's';
    const isThisPrevKey = evt.key === 'ArrowLeft' || evt.key === 'ArrowTop'
      || evt.key === 'a' || evt.key === 'w';

    if (this.thumbView) {
      if (isThisNextKey) {
        this.thumbView.moveActiveThumb(1);
      } else if (isThisPrevKey) {
        this.thumbView.moveActiveThumb(-1);
      }
    }
  }

  // Используется в слушателях window-resize
  private handleWindowResize(): void {
    if (this.barView) {
      const bar = this.barView.getBar();
      if (bar) {
        const currentLength = this.viewModel.getVertical() ? bar.offsetHeight : bar.offsetWidth;

        if (currentLength !== this.viewModel.getLengthInPx()) {
          this.barView.updateProgressBar();
          if (this.thumbView) this.thumbView.update();
          if (this.stepsInfoView) this.stepsInfoView.update();

          this.viewModel.setLengthInPx(currentLength);
        }
      }
    }
  }
}


export default WindowListeners;