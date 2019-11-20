import React, { SFC } from 'react';
import { Radio } from 'antd';
import styles from './index.module.scss';

interface IBtn {
  key: string;
  value: string;
}

interface IRadioBtn {
  value: string;
  onChange: any;
  all: IBtn[];
}

const RadioBtn: SFC<IRadioBtn> = ({ value, onChange, all }) => (
  <Radio.Group value={value} onChange={onChange} className={styles.container}>
    {all.map((v: IBtn) => (
      <Radio value={v.value} key={v.key}>
        {v.key}
      </Radio>
    ))}
  </Radio.Group>
);

export default RadioBtn;
