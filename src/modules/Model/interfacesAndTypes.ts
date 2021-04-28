import { ISubject } from '../../ObserverAndSubject/interfacesAndTypes';
import { ModelOptionsPartial } from './options';

type Value = [number, number] | number

interface IModelData {
  value: Value
  isRange: boolean
  stepSize: number
  min: number
  max: number
}

type ModelProperties = Partial<IModelData>

interface IModel extends ISubject {
  changeOptions(newOptions: ModelOptionsPartial): void
  setValue(newValue: Value, shouldRound?: boolean): Value
  setMin(newMin: number): number
  setMax(newMax: number): number
  setIsRange(newRange: boolean): boolean
  setStepSize(newStepSize: number): number
  addStepsToValue(numberOfSteps: number, valueNumber?: 0 | 1, shouldRound?: boolean): Value
  roundValue(value: Value): Value
  checkAndFixValue(): Value
  checkAndFixStepSize(): number
  checkAndFixMinMax(): number[]
  getValue(): Value
  getIsRange(): boolean
  getStepSize(): number
  getMin(): number
  getMax(): number
  getMaxDiapason(): number
}

export default IModel;
export { ModelProperties, Value, IModelData };
