import React from 'react';

import { withRouter, RouteComponentProps } from 'react-router-dom';

import styles from './ChatNum.module.scss';

type Props = {
  style: Object;
  num: number;
};
type State = any;

class ChatNum extends React.Component<Props, State> {
  static defaultProps: Props;
  render() {
    const { num = 0, style } = this.props;
    return (
      <div className={`${styles.MsgNum} ${style}`}>
        <span className={styles.num}>{num}</span>
      </div>
    );
  }
}

export default ChatNum;
