import ISliderContainerView from './interface';
import IView from '../../View/interfacesAndTypes';
import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';
import { addClass, removeClass } from '../../../../../utilities/changeClassList';

class SliderContainerView implements ISliderContainerView {
  private readonly target: HTMLElement;

  private readonly viewModel: IViewModelGetMethods;

  private slider: HTMLElement;

  constructor(target: HTMLElement, mainView: IView) {
    this.target = target;
    this.viewModel = mainView.getViewModel();
    this.slider = this.create();
  }

  get(): HTMLElement {
    return this.slider;
  }

  // Обновляет классы контейнера
  update() {
    const { sliderVerticalClass } = this.viewModel.getClasses();
    if (this.viewModel.getIsVertical()) {
      addClass(this.slider, sliderVerticalClass);
    } else {
      removeClass(this.slider, sliderVerticalClass);
    }
  }

  mount() {
    this.target.appendChild(this.slider);
  }

  private create(): HTMLElement {
    const slider = document.createElement('div');
    const { sliderClass } = this.viewModel.getClasses();
    addClass(slider, sliderClass);
    this.slider = slider;
    this.update();
    return this.slider;
  }
}

export default SliderContainerView;
