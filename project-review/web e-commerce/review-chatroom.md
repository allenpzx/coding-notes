## chatroom review

<img src="./chat-room.gif" alt="img" style="zoom:50%;" />

1. 聊天室基本状态联系人列表点击打开聊天室 store

```typescript
export interface RoomItem {
  id: string;
  status?: 'common' | 'min';
}

export interface AddActiveRoomId {
  type: ChatActionTypes.ADD_ACTIVE_ROOM_ID;
  item: RoomItem;
}

export interface ChatStore {
  unreadNum: {
    sell: number;
    buy: number;
  };
  activeRoomId: RoomItem[];
  chatList: {
    chatBuyList: chatBuyObject[];
    buyListCurrentPage: number;
    hasnextBuylistPage: boolean;
    chatSellList: chatSellObject[];
    sellListCurrentPage: number;
    hasnextSelllistPage: boolean;
  };
}

const initialState: ChatStore = {
  unreadNum: {
    sell: 0,
    buy: 0
  },
  chatList: {
    chatBuyList: [],
    chatSellList: [],
    buyListCurrentPage: 0,
    sellListCurrentPage: 0,
    hasnextBuylistPage: true,
    hasnextSelllistPage: true
  },
  activeRoomId: []
};

// dynamic chatroom quantity
const maxRooms = Math.floor((window.innerWidth - 320 - 40) / (451 + 16));

export default (state = initialState, action: ChatAction): ChatStore => {
  switch (action.type) {
    case ChatActionTypes.SET_UNREAD_NUM: {
      return {
        ...state,
        unreadNum: action.num
      };
    }
    case ChatActionTypes.ADD_ACTIVE_ROOM_ID: {
      const { activeRoomId } = state,
        {
          item: { id }
        } = action;
      if (!id) return state;
      const exitItem = activeRoomId.find((d: RoomItem) => d.id === id);
      console.log('exitItem: ', exitItem);
      if (!!exitItem && _get(exitItem, ['status']) === 'min') {
        return {
          ...state,
          activeRoomId: state.activeRoomId.map((v: RoomItem) => {
            if (v.id === id) {
              return { ...v, status: 'common' };
            }
            return v;
          })
        };
      }

      if (!!exitItem && _get(exitItem, ['status']) === 'common') {
        return state;
      }

      if (!exitItem && activeRoomId.length >= maxRooms) {
        const nextActiveRoomId = activeRoomId.slice(1).concat({ id, status: 'common' });
        return {
          ...state,
          activeRoomId: nextActiveRoomId
        };
      }

      return {
        ...state,
        activeRoomId: activeRoomId.concat({ id, status: 'common' })
      };
    }

    case ChatActionTypes.DELETE_ACTIVE_ROOM_ID: {
      const { activeRoomId } = state;
      return {
        ...state,
        activeRoomId: activeRoomId.filter((d: RoomItem) => d.id !== action.id)
      };
    }

    case ChatActionTypes.UPDATE_ACTIVE_ROOM_ID: {
      const { activeRoomId } = state;
      const {
        item: { id, status }
      } = action;
      const targetIndex = activeRoomId.findIndex((v: RoomItem) => v.id === id);
      if (targetIndex < 0) return state;
      activeRoomId[targetIndex].status = status;
      return {
        ...state,
        activeRoomId: activeRoomId
      };
    }

    ...
};
```

- 能够展开的聊天室数量根据窗口宽度来决定

- 聊天室的实例由一个对象数组维护, {id: string, status: 'common' | 'min'}[], id 存在且 status === 'common'不多开，id 存在且 status === 'min'的重新实例化，id 不存在的 push 进去，id 超过数量替换第一个

```javascript
changRoomStatus = async () => {
  this.props.updateActiveRoomId(
    this.props.id,
    this.props.type === "common" ? "min" : "common"
  );
};

closeRoom = async () => {
  this.props.id && this.props.deleteActiveRoomId(this.props.id);
};

onMaxRoomClose = () => {
  this.props.onMaxRoomClose && this.props.onMaxRoomClose(this.props.id);
};
```

2. 聊天室数据初始化及 websocket 链接

   ```javascript
     getRoomHistory = async () => {
       try {
         if (!this.props.id) return;
         this.setState({ loading: true });
         const { data, status } = await getRoomHistory(this.props.id, {
           page: this.state.page
         });
         if (status === 200 && data) {
           const results = _get(data, ['results']) || [];
           const meId = this.props.user.userInfo.userId;
           const sellerId = _get(data, ['chatroom', 'seller_id']);
           const targetId = meId === sellerId ? _get(data, ['chatroom', 'buyer_id']) : sellerId;

           // 标记history来源的message
           results.map((v: any) => (v.isFromHistory = true));

           // 业务上永远放在第一个位置的聊天卡片
           const nextResults = [{ msg_type: "carMessage" }].concat(
           	results.reverse().concat(this.state.results.slice(1))
           );

           this.setState({
             ...data,
             targetId,
             results: nextResults
           });
         }
       } catch (error) {
         ...
       } finally {
         this.setState({ loading: false });
       }
     };

     onRoomMessage = (data: any) => {
       console.log('onMessageFromServer: ', data);
       if (_get(data, ['msg_type']) === 1 && _get(data, ['extra', 'content'])) {
         this.setState(prev => ({ results: prev.results.concat(data) }));
       }
       if (_get(data, ['msg_type']) === 2 && _get(data, ['extra', 'url'])) {
         this.setState(prev => ({ results: prev.results.concat(data) }));
       }
       if (_get(data, ['msg_type']) === 6) {
         this.setState(prev => ({ results: prev.results.concat(data) }));
       }
       if (_get(data, ['msg_type']) === 8) {
         this.setState(prev => ({ results: prev.results.concat(data) }));
       }
       ...
     };

     connectToRoom = () => {
       const room = new WebSocketManager({
         chatroom_id: this.props.id,
         onMessage: this.onRoomMessage
       });
       this.ROOM = room;
     };

     refreshUnread = () => this.props.refreshUnread(this.props.id, this.activeRole);

     initialRoom = async () => {
       if (this.props.id) {
         this.refreshUnread(); // 刷新列表的未读
         await this.getRoomHistory(); // 先获取聊天室的聊天历史记录
         this.connectToRoom(); // 建立聊天室的websocket
       }
     };

     async componentDidMount() {
       this.initialRoom();
     }

     componentWillUnMount() {
       this.ROOM.hasOwnProperty('close') && this.ROOM.close();
     }

     componentDidUpdate(prevProps: ContainerProps, prevState: ContainerState) {
       if (prevProps.id !== this.props.id && this.props.id) {
         this.setState({ ...initialState }, () => this.initialRoom());
       }

       // before latest message exceed 10 minutes
       if (
         prevProps.id === this.props.id &&
         prevState.results.length < this.state.results.length
       ) {
         const _res = this.state.results;
         const latest = _res.slice(-1)[0];
         if (Reflect.has(latest, "isFromHistory")) return;
         const beforeLatest = _res.slice(-2, -1)[0];
         const beforeLatestTimeStamp = _get(beforeLatest, ["created_at"]);
         const isExceedTenMinutes = getMessageTime(beforeLatestTimeStamp);
         isExceedTenMinutes &&
           this.setState(prev => {
             const nextResults = prev.results;
             nextResults.splice(-1, 0, {
               msg_type: TimeMessageType,
               extra: { content: isExceedTenMinutes }
             });
             return { results: nextResults };
           });
       }
     }
     ...
   ```

- 聊天室的初始化的时候要 reset_unread => load history => connectRoom，组件卸载的时候要取消 websocket 的监听
- history 来源的数据可以标记来源，方便处理消息间隔和特殊业务消息置顶等问题
- componentDidUpdate 如果 room id 更新初始化状态并重新获取数据

3. 聊天室分页和收发消息

- 聊天消息是以对象数组的形式维护的，最新的消息在数组的最后面，监听容器内滚动到顶部之后请求下一页的数据, 然后塞到上一页数据的上面，也就是数组的前面
- 发送消息处理
1. 生成模版消息, 模版消息符合room history 子项的格式,  客户端生成uuid

    ```typescript
    interface Message {
      id?: string; // 服务端生成
      message_id: string; // 客户端生成
      message_type: string; // 和服务端约定不同的消息类型
      message_status: 'pending' | 'success' | 'error';
      // pending 等待状态 消息一侧出现loading的动画
      // success 消息发送成功状态 一条普通消息，没有任何状态动画
      // error 发送失败或者timeout 状态, 一个🈲️的状态，表示发送失败，hover之后🈲️的图标变成resend的图标，点击即可重新发送消息
      extra: {
        content: string;
        url?: stirng;
        ...
      };
      is_from_history: boolean; // 标记消息来源于hisroty 请求还是websocket
    	sender: {
        ...
      };
      receiver: {
        ...
      };
      ...
    }
    
    type RoomHistory = Message[];
       
    function generateMessage(message_id: string) {
      return {
    	  message_id: message_id,
    	  message_type: ...,
        message_status: 'pending', // default
        extra: {
          ...
        };
        is_from_history: false;
        sender: {
          ...
        };
        receiver: {
          ...
        };
      }
    }
    
    const nextMessage = generateMessage(..., message_id): Message
    ```

2. 先将message_type = 'pending' 的消息推入聊天室数组的末端, 并通过websocket发送消息, 然后把这条消息推入到一个定时的队列里，如果超过一定时间这条消息的状态 message_type = 'pending',  则把这条消息  message_type = 'error'， 此时这条消息会出现error状态，鼠标hover之后可以选择是否重发，如果重发则把这个消息移动到数组的尾端，重新发送

    ```typescript
    1. this.setState(prev => ({ prev.history.concat(nextMessage) }))
    2. ROOM.send(nextMessage)
    3. checkMessageTimeout = (message_id: string) => {
        setTimeout(() => {
          const next = this.state.results.slice();
          for (let i = next.length - 1; i > 0; i--) {
            if (Reflect.has(next[i], 'message_id') && next[i]['message_id'] === message_id) {
              this.state.results[i].messageStatus === 'pending' &&
                Reflect.set(next[i], 'messageStatus', 'error');
              break;
            }
          }
          this.setState({ results: next });
        }, TIME_OUT);
      };
    ```

3. 监听websocket的推送, 如果推送的消息A符合`Message`的类型, 则检查A是否有message_id, 如果有message_id 就从history从后向前查找message_id和A相同的那条消息N, 并把消息N的message_status = 'success'

    ```typescript
    function onRoomMessage(data: Message) {
        if (_get(data, ['msg_type']) === 1 && _get(data, ['extra', 'content'])) {
          const receive_message_id = _get(data, ['message_id']);
          this.setState(prev => {
            const nextResults = prev.results.slice();
            for (let i = nextResults.length - 1; i > 0; i--) {
              if (
                Reflect.has(nextResults[i], 'message_id') &&
                nextResults[i]['message_id'] === receive_message_id
              ) {
                this.state.results[i].messageStatus === 'pending' &&
                  Reflect.set(nextResults[i], 'messageStatus', 'success');
                break;
              }
            }
            return { results: nextResults };
          });
        }
        if (_get(data, ['msg_type']) === 2 && _get(data, ['extra', 'url'])) {
          ...
        }
        if (_get(data, ['msg_type']) === 6) {
          ...
        }
        if (_get(data, ['msg_type']) === 8) {
          ...
        }
    }
    
    ROOM.onmessage(onRoomMessage)
    ```

4. 滚动监听记得取消监听，聊天室层级比较高，一定要防止滚动穿透，根据业务需求还要优化或者聊天室滚动条

    ```javascript
      detectScroll = (e: any) => {
        const st = e && e.target && e.target.scrollTop;
        st <= 0 && !this.props.loading && this.props.onPageChange();
      };
    
      detectRoomScroll = () => {
        this.main.current.addEventListener('scroll', throttle(this.detectScroll, 500, {}));
      };
    
      undetectRoomScroll = () => {
        this.main.current.removeEventListener('scroll', throttle(this.detectScroll, 500, {}));
      };
    
      focusOnInput = () => this.inputArea.current && this.inputArea.current.focus();
    
      scrollToBottom = () => {
        setTimeout(() => {
          this.main.current &&
            this.main.current.scroll({
              top: 9999,
              behavior: 'smooth'
            });
        }, 500);
      };
    
      onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
        this.setState({ inputContent: e.target.value });
    
      onTextMessage = (e: React.KeyboardEvent) => {
        if (e.keyCode === 13) {
          e.preventDefault();
          this.props.textMessage(this.state.inputContent);
          this.setState({ inputContent: '' });
        }
      };
    
      componentDidMount() {
        this.detectRoomScroll();
        this.focusOnInput();
        util.lockScroll(styles.main_common);
      }
    
      componentWillUnmount() {
        this.undetectRoomScroll();
      }
    
      componentDidUpdate(prevProps: CommonRoomProps) {
        if (
          _get(prevProps.results.slice(-1)[0], ['id']) ===
            _get(this.props.results.slice(-2)[0], ['id']) ||
          (_get(prevProps.results, ['length']) === 0 && _get(this.props.results, ['length']) > 0)
        ) {
          this.scrollToBottom();
        }
      }
    
    // history分页
    onPageChange = () => {
        if (this.state.next) {
          this.setState(
            prev => ({
              page: prev.page + 1
            }),
            () => this.getRoomHistory()
          );
        }
      };
    ```

5. 发送图片消息和上传图片一样，先上传图片拿到 cdn 地址，然后发送消息采用 cdn 地址.上传图片的按钮记得 e.target.value 重新初始化

    ```javascript
    const onImageMessage = (e: React.ChangeEvent<HTMLInputElement>, cb: any) => {
      try {
        const files = _get(e, ['target', 'files']);
        const formData = new FormData();
        formData.append('image', files[0]);
        cb && cb(formData);
        e.target.value = '';
      } catch (e) {
    		...
      }
    };
    ```

6. 有新消息之后滚动到新消息最下面，图片消息需要特殊处理，大图片的 render 需要一定的时间，dynamic height, scrollbottom 之后图片渲染完成会有一段额外的高度，处理方式是最新的消息如果是图片则再触发一次 scrollbottom 即可解决

    ```html
    <img src="..." alt="..." onLoad="" onError="" />
    ```

7. stacking context. z-index 是相对的. 相邻兄弟 A 和 B 元素 z-index: 100;，其中 A 元素的子元素 a1 如果 z-index: 999; 宽高足够大 也不会遮挡 B， 所以在包或者写Modal或者notification组件的时候可以放到最外层用store控制， 或者用portal传送到组件的外层，防止干扰

    ```typescript
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
    ```

    

8. 聊天消息的气泡三角形

```scss
// 实心三角心
&_left {
    color: #ffffff;
    &:before {
      content: '';
      position: absolute;
      right: -6px;
      top: 12px;
      width: 0px;
      height: 0px;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-left: 6px solid $blue;
    }
  }
}


// 实线空心三角形
    &:before,
    &:after {
      content: '\0020';
      display: block;
      position: absolute;
      top: 12px;
      left: -6px;
      z-index: 2;
      width: 0;
      height: 0;
      overflow: hidden;
      border: solid 6px transparent;
      border-left: 0;
      border-right-color: #fff;
    }

    &:before {
      left: -7px;
      z-index: 1;
      border-right-color: #ebebeb;
      transform: scale(1.1);
    }
  }
```
