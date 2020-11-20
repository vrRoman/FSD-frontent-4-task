// Многие тесты для controller будут проверяться в браузере

import View, { IView, ViewOptions } from '../src/ui/View';
import Model, { IModel, ModelOptions } from '../src/model/Model';
import Controller, { IController, ControllerOptions } from '../src/ui/Controller';


const defaultModelOptions: ModelOptions = {
  value: 0,
  range: true,
  stepSize: 1,
  min: 0,
  max: 10,
};
const defaultViewOptions: ViewOptions = {
  length: '200px',
  tooltip: false,
  stepsInfo: false,
  valueInfo: false,
  vertical: false,
  responsive: false,
};
const defaultControllerOptions: ControllerOptions = {
  useKeyboard: true,
  interactiveStepsInfo: true,
};


describe('Controller methods', () => {
  let model: IModel;
  let view: IView;
  let controller: IController;
  beforeEach(() => {
    model = new Model(defaultModelOptions);
    view = new View(model, defaultViewOptions, document.body);
    controller = new Controller(model, view, defaultControllerOptions);
  });

  it('getUseKeyboard', () => {
    expect(controller.getUseKeyboard()).toBe(true);
  });
  it('getInteractiveStepsInfo', () => {
    expect(controller.getInteractiveStepsInfo()).toBe(true);
  });
  it('getStepLength', () => {
    expect(controller.getStepLength()).toBe(20);
  });


  it('addStepsInfoInteractivity', () => {
    view = new View(model, {
      ...defaultViewOptions,
      stepsInfo: true,
    }, document.body);
    controller = new Controller(model, view, {
      ...defaultControllerOptions,
      interactiveStepsInfo: false,
    });
    controller.addStepsInfoInteractivity();
    // console.log для проверки в браузере
    console.log('Added stepsInfo interactivity: ', view.getSlider());
    expect(controller.getInteractiveStepsInfo()).toBe(true);
  });

  it('removeStepsInfoInteractivity', () => {
    view.createStepsInfo();
    controller.removeStepsInfoInteractivity();
    console.log('Removed stepsInfo interactivity: ', view.getSlider());
    expect(controller.getInteractiveStepsInfo()).toBe(false);
  });

  it('addKeyboardListener', () => {
    view = new View(model, defaultViewOptions, document.body);
    controller = new Controller(model, view, {
      ...defaultControllerOptions,
      useKeyboard: false,
    });
    controller.addKeyboardListener();
    console.log('Added keyboard listener: ', view.getSlider());
    expect(controller.getUseKeyboard()).toBe(true);
  });
  it('removeKeyboardListener', () => {
    controller.removeKeyboardListener();
    console.log('Removed keyboard listener: ', view.getSlider());
    expect(controller.getUseKeyboard()).toBe(false);
  });


  it('setActiveThumb', () => {
    controller.setActiveThumb();
    console.log('SetActiveThumb range false: ', view.getSlider());
    expect(controller.getActiveThumb()).toBeDefined();

    view = new View(model, defaultViewOptions, document.body);
    controller = new Controller(model, view, defaultControllerOptions);
    controller.setActiveThumb(0);
    console.log('SetActiveThumb with range true', view.getSlider());
    expect(controller.getActiveThumb()).toBeDefined();
  });

  it('removeActiveThumb', () => {
    controller.setActiveThumb();
    controller.removeActiveThumb();
    console.log('RemoveActiveThumb range false: ', view.getSlider());
    expect(controller.getActiveThumb()).toBe(undefined);


    view = new View(model, defaultViewOptions, document.body);
    controller = new Controller(model, view, defaultControllerOptions);
    controller.setActiveThumb(0);
    controller.removeActiveThumb();
    console.log('RemoveActiveThumb with range true', view.getSlider());
    expect(controller.getActiveThumb()).toBe(undefined);
  });
});

describe('Controller with different options in model and view', () => {
  let model: IModel;
  let view: IView;
  let controller: IController;

  it('View all true, vertical=false and responsive with %', () => {
    model = new Model(defaultModelOptions);
    view = new View(model, {
      length: '80%',
      vertical: false,
      tooltip: true,
      stepsInfo: true,
      valueInfo: true,
      responsive: true,
    }, document.body);
    controller = new Controller(model, view, defaultControllerOptions);
  });
  it('View all true, vertical=false and responsive with vh', () => {
    model = new Model(defaultModelOptions);
    view = new View(model, {
      length: '30vh',
      vertical: true,
      tooltip: true,
      stepsInfo: true,
      valueInfo: true,
      responsive: true,
    }, document.body);
    controller = new Controller(model, view, defaultControllerOptions);
  });
  it('model range true, stepSize', () => {
    model = new Model({
      value: [2, 8.25],
      range: true,
      stepSize: 3.5,
      min: 0,
      max: 12,
    });
    view = new View(model, {
      length: '80%',
      vertical: false,
      tooltip: true,
      stepsInfo: true,
      valueInfo: true,
      responsive: true,
    }, document.body);
    controller = new Controller(model, view, defaultControllerOptions);
  });
});
