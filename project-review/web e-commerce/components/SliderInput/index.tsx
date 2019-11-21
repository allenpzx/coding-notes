/**
 * @description range slider input
 * @param {ISliderInput}
 * @returns {ReactNode}
 * @author zixiu
 */

import React, { SFC, memo } from 'react';
import { Slider } from 'antd';
import formatNumber from '../../common/thousands';
import styles from './index.module.scss';

interface ISliderInput {
  min: number;
  max: number;
  left: number;
  right: number;
  onChange: any;
  onAfterChange?: any;
}

const SliderInput: SFC<ISliderInput> = ({ min, max, left, right, onChange, onAfterChange }) => (
  <div className={styles.container}>
    <div className={styles.range}>
      <span>{formatNumber(left)}</span>
      <span>{formatNumber(right)}</span>
    </div>
    <Slider
      range
      className={styles.hackSlider}
      value={[left, right]}
      min={min}
      max={max}
      defaultValue={[min, max]}
      disabled={false}
      tooltipVisible={false}
      onAfterChange={onAfterChange}
      onChange={onChange}
      tipFormatter={(value: number) => (
        <div className={styles.tooltipHack}>{formatNumber(value)}</div>
      )}
      getTooltipPopupContainer={(triggerNode: HTMLElement) => triggerNode}
    />
  </div>
);

export default memo(SliderInput);
