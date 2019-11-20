/**
 * 使用的时候直接放到最外层，内容当成children传进来即可
 * 配置了基础的body颜色和宽度，默认flex布局： 主轴方向水平，主轴方向水平居中，交叉轴的起点对齐
 * 引入BasicLayout 组件必须登陆!!!
 * @author zixiu
 * @since 1.0.1
 * @version 1.0
 */

import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import styles from './BasicLayout.module.scss';

interface Props {
  style?: object;
}
export default class BasicLayout extends React.Component<Props, {}> {
  render() {
    const { children, style } = this.props;
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.mainStyle} style={style} id="basic_layout_main">
          {children}
        </div>
        <Footer />
      </div>
    );
  }
}
