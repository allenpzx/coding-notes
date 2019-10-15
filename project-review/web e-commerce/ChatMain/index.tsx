import React from 'react';
import { connect } from 'react-redux';
import { AppStore } from '../../store/reducers';
import Main from './Main';
import { RoomItem, ChatRole, ChatStore, ChatMode } from '../../store/types';
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
        {/* <Main
            id={"212202b9-e7a1-4a7f-9b54-67b84b989191"}
            type="max"
            onMaxRoomClose={() => console.log(123)}
          /> */}
      </div>
    );
  }
}
export default connect((state: AppStore) => ({
  chat: state.chat,
  activeRole: state.route.params[ChatMode.WINDOW_MODE].activeRole,
  categoryId: state.route.params[ChatMode.WINDOW_MODE].categoryId
}))(ChatContainer);
