/**
 * @description: hack checkbox
 * @param {IHackCheckBox}
 * @return {ReactNode}
 * @author zixiu
 */

import React, { SFC } from 'react';
import styles from './index.module.scss';

export interface IHackCheckBox {
  text: string;
  checked: boolean;
  onChange: any;
}

const HackCheckBox: SFC<IHackCheckBox> = ({ text, checked, onChange }) => {
  return (
    <label className={styles.hackCheckBoxContainer}>
      <span className={styles.textmark}>{text}</span>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default HackCheckBox;
