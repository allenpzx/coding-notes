/**
 * @description: 聊天室组件 special for <CommonRoom />s view
 * @param {Props}
 * @return {ReactNode}
 * @author zixiu
 */

import React from 'react';
import { connect } from 'react-redux';
import { AppStore } from '../../store/reducers';
import { RoomItem, ChatStore, ChatMode } from '../../store/types';
import Main from './Main';
import styles from './index.module.scss';

interface ContainerProps {
  chat: ChatStore;
  dispatch: any;
  roomId: string;
  categoryId?: AppStore['route']['params']['WINDOW_MODE']['categoryId'];
  activeRole?: AppStore['route']['params']['WINDOW_MODE']['activeRole'];
}

class ChatContainer extends React.Component<ContainerProps, {}> {
  static defaultProps: ContainerProps;
  render() {
    const {
      chat: { activeRoomId },
      categoryId,
      activeRole
    } = this.props;
    return (
      <div className={styles.roomsContainer}>
        {activeRoomId.map((item: RoomItem) => (
          <Main
            key={item.id}
            id={item.id}
            type={item.status}
            categoryId={categoryId}
            activeRole={activeRole}
          />
        ))}
      </div>
    );
  }
}
export default connect((state: AppStore) => ({
  chat: state.chat,
  activeRole: state.route.params[ChatMode.WINDOW_MODE].activeRole,
  categoryId: state.route.params[ChatMode.WINDOW_MODE].categoryId
}))(ChatContainer);
