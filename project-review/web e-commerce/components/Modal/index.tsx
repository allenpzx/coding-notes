/**
 * @description: 受控组件ui modal组件, 参数详见props
 * @param {Props}
 * @return {ReactNode}
 * @author zixiu
 */

import React, { Component, SFC } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button } from 'antd';
import IconFont from '../ui/TradexIcon';
import styles from './index.module.scss';

class CusPortal extends Component {
  private el = document.createElement('div');
  private appRoot = document.getElementById('root') as Element;
  componentDidMount() {
    this.appRoot.appendChild(this.el);
  }
  componentWillUnmount() {
    this.appRoot.removeChild(this.el);
  }
  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

interface Props {
  onOk: any;
  onCancel: any;
  visible: boolean;
  message: string;
  cancelText: string;
  okText: string;
  title?: string;
}

const CusModal: SFC<Props> = ({ visible, message, title, onOk, onCancel, cancelText, okText }) => (
  <CusPortal>
    <Modal
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      title={title}
      closeIcon={<IconFont type="iconicon_cancel" />}
      centered
      className={styles.modal}
      footer={[
        <Button key="cancel" onClick={onCancel} className={styles.btnCancel}>
          {cancelText}
        </Button>,
        <Button key="submit" onClick={onOk} className={styles.btnOk}>
          {okText}
        </Button>
      ]}
    >
      <p>{message}</p>
    </Modal>
  </CusPortal>
);

export default CusModal;
