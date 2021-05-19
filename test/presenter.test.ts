// Многие тесты для presenter будут проверяться в браузере

import Model from '../src/modules/Model/Model';
import View from '../src/modules/View/modules/View/View';
import Presenter from '../src/modules/Presenter/Presenter';
import IModel from '../src/modules/Model/interfacesAndTypes';
import IView from '../src/modules/View/modules/View/interfaces';
import IPresenter from '../src/modules/Presenter/interface';
import PresenterOptions from '../src/modules/Presenter/options';
import { ViewOptions } from '../src/modules/View/options';
import { ModelOptions } from '../src/modules/Model/options';

const defaultModelOptions: ModelOptions = {
  value: 0,
  isRange: false,
  stepSize: 1,
  min: 0,
  max: 10,
};
const defaultViewOptions: ViewOptions = {
  length: '200px',
  hasTooltip: false,
  hasScale: false,
  scaleValue: 3,
  hasValueInfo: false,
  isVertical: false,
  useKeyboard: true,
  isScaleClickable: true,
  isBarClickable: true,
};
const defaultPresenterOptions: PresenterOptions = {
};

describe('Presenter with different options in model and view', () => {
  let model: IModel;
  let view: IView;
  let presenter: IPresenter;

  it('model isRange true, stepSize', () => {
    model = new Model({
      value: [2, 8.25],
      isRange: true,
      stepSize: 3.5,
      min: 0,
      max: 12,
    });
    view = new View({
      length: '80%',
      isVertical: false,
      hasTooltip: true,
      hasScale: true,
      scaleValue: 3,
      hasValueInfo: true,
      isScaleClickable: true,
      isBarClickable: true,
      useKeyboard: true,
    }, document.body);
    presenter = new Presenter(model, view, defaultPresenterOptions);
  });

  it('onChange', () => {
    model = new Model(defaultModelOptions);
    view = new View(defaultViewOptions, document.body);
    // eslint-disable-next-line no-unused-vars
    presenter = new Presenter(model, view, {
      ...defaultPresenterOptions,
      onChange: () => {
        console.log(model.getValue());
      },
    });
    console.log('onChange: ', view.getElement('slider'));
  });
});