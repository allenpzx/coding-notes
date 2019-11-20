/**
 * 自定义popover, 仅仅为样式的修改, 默认是comming soon!
 * @author zixiu
 * @since 1.0.1
 * @version 1.0
 */

import React, { SFC, ReactNode } from 'react';
import { Popover } from 'antd';
import styles from './index.module.scss';

interface OtherProps {
  title?: string | ReactNode;
  style?: object;
}

interface CusProps {
  hoverContent?: ReactNode;
  childrenStyle?: object;
  type: 'comingsoon' | 'logout';
}

export const CustomPopover: SFC<CusProps> = ({ children, hoverContent, type }) => (
  <div className={styles.CustomPopover}>
    <div className={`${styles.hoverContent} ${type === 'comingsoon' ? styles.comingSoon : ''}`}>
      {hoverContent || 'Coming Soon'}
    </div>
    <div className={`${styles.wrapChild}`}>{children}</div>
  </div>
);

export const CusPopover: SFC<OtherProps> = ({ children, title, style }) => (
  <Popover
    content={
      <div style={style || {}} className={styles.popcontent}>
        <span>{title || 'Coming Soon'}</span>
      </div>
    }
    placement="bottom"
    trigger="hover"
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'nowrap'
      }}
      className={styles.wrappedChild}
    >
      {children}
    </div>
  </Popover>
);

export default CusPopover;
