import { colors, animals } from './constants';

export const getClientName = (color: string, name: string) => {
  const colorTranslate = colors.find(animalColor => animalColor.color === color)?.translate;
  const animalNameTranslate = animals.find(animalName => animalName.animal === name)?.translate;

  return `${colorTranslate} ${animalNameTranslate}`;
};