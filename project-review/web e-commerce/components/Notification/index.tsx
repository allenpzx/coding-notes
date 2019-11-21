/**
 * @description: Pagination 分页组件, props 参数 https://github.com/react-component/pagination/
 * @param {Props}
 * @return {ReactNode}
 * @author zixiu
 */

import React, { SFC, memo } from 'react';
import { notification } from 'antd';

interface Props {
  message: string;
  description: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export const Notification: SFC<Props> = ({ message, description, type }): any => {
  notification[type]({
    message: message,
    description: description
  });
};
