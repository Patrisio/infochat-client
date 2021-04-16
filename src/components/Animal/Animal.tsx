import React, { Component } from 'react';
import { animals, colors } from '../../utils/constants'
import styles from './animal.module.scss';

type IProps = {
  name?: string,
  color?: string,
  size?: string,
  rounded?: boolean,
  square?: boolean,
  circle?: boolean,
  dance?: boolean,
  classNames?: string,
}

interface IStyles {
  [key: string]: string
}

export default class Animal extends Component<IProps> {
  validateName(): { animal: string, translate: string } {
    const {name} = this.props;

    if (name) {
      const lower = name.toLowerCase();
      const foundName = animals.find(animal => animal.animal === lower);

      if (foundName) {
        return foundName;
      }

      return {
        animal: 'wolf',
        translate: 'Волк'
      }
    }

    return animals[Math.random() * animals.length << 0];
  }

  getAvatar(avatarName: string) {
    return require(`./animals/${avatarName}.png`).default
  }

  validateColor(): { color: string, translate: string } {
    const { color } = this.props;
    
    if (color) {
      const lower = color.toLowerCase();
      const foundColor = colors.find(color => (color.color).toLowerCase() === lower);

      if (foundColor) {
        return foundColor;
      }
      // else if (/^#[0-9A-F]{6}$/i.test(lower)) {
      //   return colors.find(color => color.color === lower);
      // }
      else {
        return {
          color: '#006CFE',
          translate: 'Синий'
        };
      }
    }

    const keys = Object.keys(colors);

    return colors[(keys.length * Math.random()) << 0];
  }

  validateSize() {
    const {size} = this.props;

    if (size) {
      if (
        size.match(
          /(^\d*)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax)/
        )
      ) {
        return size;
      } else {
        console.error(
          `InvalidSize: '${size}' is not a valid CSS width property. Using '70px' instead.`
        );
      }
    }
    return "70px";
  }

  borderRadius() {
    const {rounded, square} = this.props;

    if (rounded) {
      return "10%";
    } else if (square) {
      return "0px";
    }
    return "50%";
  }

  render() {
    const { dance, classNames } = this.props;

    let avatarName: { animal: string, translate: string } = this.validateName();
    let avatarImage = this.getAvatar(avatarName.animal);
    let avatarColor: { color: string, translate: string } = this.validateColor();
    let avatarSize = this.validateSize();

    let avatarStyle: IStyles = {
      '--a-bg-color': avatarColor.color,
      '--a-size': avatarSize,
      '--a-border-radius': this.borderRadius()
    };

    let conditionalClass = dance ? `${styles.animalImage} ${styles.animalDance}`: styles.animalImage;

    return (
      <div className={`${styles.animalAvatar} ${classNames}`} style={avatarStyle}>
        <img
          src={avatarImage}
          alt={avatarName.animal}
          className={conditionalClass}
        />
      </div>
    );
  }
}