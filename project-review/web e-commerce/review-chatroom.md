## chatroom review

[preview]('./chat-room.mp4')

1. chatroom data structure

- 能够展开的聊天室数量根据窗口宽度来决定
- 聊天室的实例由一个对象数组维护, {id: string, status: 'common' | 'min'}[]

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

2. chatroom实例的增删改(点击右侧联系人，关闭一个 chatroom)

- 点击右侧联系人列表的时候，本质是向对象数组里面 push 一个 MessageItem
- push MessageItem 的时候如果 id 存在且 status === 'common' return 即可，id 存在且 status === 'min'的时候把 status = 'common', id 不存在的 push 进去，id 超过限制数量替换第一个，则新实例化一个 chatroom
- 点击 chatroom 的 header 区域 toggle chatroom 的 status = 'common' | 'min', 则聊天室展开和收起

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

2. chatroom initial

- 从数据上来看仅仅是一个下拉触顶的分页列表

- 分页数据 

  ```javascript
  this.setState(prev => ({ history: next_history.concat(prev.history) }))
  ```

- 初始化需要做的

  - reset unread number
  - get chatroom histroy
  - connect chatroom websocket for detect onmessage from server
  - detect room scroll to top for pagination
  - detect chatroom scrolling when a modal is open for prevent page scrolling
  - focus on input

```javascript
// 👇 container initial
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

        results.map((v: any) => {
          v.isFromHistory = true;
          v.messageStatus = 'success';
        });

        const nextResults = [{ msg_type: 'carMessage' }].concat(
          results.reverse().concat(this.state.results.slice(1))
        );

        this.setState({
          ...data,
          targetId,
          results: nextResults
        });
      }
    } catch (error) {
      Notification({
        type: 'error',
        message: 'upload image error',
        description: _get(error, ['response', 'data', 'message'] || '')
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  onRoomMessage = (data: any) => {
    console.log('on_message_from_server: ', data);
    if (
      (_get(data, ['msg_type']) === 1 && _get(data, ['extra', 'content'])) ||
      (_get(data, ['msg_type']) === 2 && _get(data, ['extra', 'url']))
    ) {
      const receive_message_id = _get(data, ['message_id']);
      if (!receive_message_id) {
        return this.setState(prev => ({ results: prev.results.concat(data) }));
      }
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

    if (_get(data, ['msg_type']) === 6) {
      this.setState(prev => ({ results: prev.results.concat(data) }));
    }
    if (_get(data, ['msg_type']) === 8) {
      this.setState(prev => ({ results: prev.results.concat(data) }));
    }
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
      this.refreshUnread();
      await this.getRoomHistory();
      this.connectToRoom();
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

    // before latest message exceed 10 minutes shot time stamp
    if (prevProps.id === this.props.id && prevState.results.length < this.state.results.length) {
      const _res = this.state.results;
      const latest = _res.slice(-1)[0];
      if (Reflect.has(latest, 'isFromHistory')) return;
      const beforeLatest = _res.slice(-2, -1)[0];
      const beforeLatestTimeStamp = _get(beforeLatest, ['created_at']);
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


// 👇 UI component initial
  componentDidMount() {
    this.detectRoomScroll();
    this.main.current &&
      this.main.current.classList.length > 0 &&
      util.lockScroll(this.main.current.classList[0]);
    this.inputArea.current && this.inputArea.current.focus();
  }

  componentWillUnmount() {
    this.undetectRoomScroll();
  }

  componentDidUpdate(prevProps: BasicProps) {
    const beforeLatest = prevProps.results.slice(-1)[0];
    const latest = this.props.results.slice(-1)[0];
    if (
      prevProps.results.length < this.props.results.length &&
      (_get(beforeLatest, ['id']) !== _get(latest, ['id']) ||
        _get(beforeLatest, ['message_id']) !== _get(latest, ['message_id']))
    ) {
      this.scrollToBottom();
    }
  }
```

3. 聊天室收发消息

- 生成模版消息, 模版消息符合 room history 子项的格式, 客户端生成`message_id = uuid();`

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

  const getMessageTemplate = ({
    text,
    url,
    id,
    type
  }: {
    text?: string;
    url?: string;
    id: string;
    type: 'text' | 'image';
  }): MessageProps => {
    const {
      userInfo: { userId, headshot, company_country }
    } = this.props.user;
    const types = {
      text: 1,
      image: 2
    };
    return {
      msg_type: types[type],
      messageStatus: 'pending',
      extra: {
        content: type === 'text' ? text : '',
        url: type === 'image' ? url : ''
      },
      sender: {
        id: userId,
        headshot: headshot,
        company_country: company_country
      },
      message_id: id,
      isFromHistory: false
    };
  };

const nextMessage = generateMessage(...): Message
```

- 将`text/image`类型的消息通过websocket或者http发送给server，假如client A 向 client B 发送一条消息MSG_A，那么将发生👇

  1. 将message_a立即推入到聊天内容的数组当中, 这条消息`message_status = pending`, `message_id = id_a`
  2. 设置一个定时器检查这条消息在指定`TIME_OUT`时间后的`message_status`，如果`message_stauts = pending` 则 设置`message_status = error`, ``message_status = error`的消息在渲染的时候设置成发送失败的样式，hover到这条错误消息上的时候显示resend的图标，点击即可重新发送。如果重新发送则重复以上此流程
  3. client A 发送`MSG_A`到 server
  4. server把`MSG_A`存database
  5. server存失败后通知A并附带`MSG_A`的 `message_id`, 存成功后把消息同时发送给A和B并附带`message_id`

  5. client收到消息之后, 如果消息没有`message_id`则直接推入聊天数组，如果有`message_id`则把这条消息比如MSG_A找到，并检查这条消息的`message_status === pending`则设置 `message_status = success`, 如果这条消息`message_status === error` 则不做重制

1. 先将 message_type = 'pending' 的消息推入聊天室数组的末端, 并通过 websocket 发送消息, 然后把这条消息推入到一个定时的队列里，如果超过一定时间这条消息的状态 message_type = 'pending', 则把这条消息 message_type = 'error'， 此时这条消息会出现 error 状态，鼠标 hover 之后可以选择是否重发，如果重发则把这个消息移动到数组的尾端，重新发送

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

2. 监听 websocket 的推送, 如果推送的消息 A 符合`Message`的类型, 则检查 A 是否有 message_id, 如果有 message_id 就从 history 从后向前查找 message_id 和 A 相同的那条消息 N, 并把消息 N 的 message_status = 'success'

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

3. 滚动监听记得取消监听，聊天室层级比较高，一定要防止滚动穿透，根据业务需求还要优化或者聊天室滚动条

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

4. 发送图片消息和上传图片一样，先上传图片拿到 cdn 地址，然后发送消息采用 cdn 地址.上传图片的按钮记得 e.target.value 重新初始化

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

5. 有新消息之后滚动到新消息最下面，图片消息需要特殊处理，大图片的 render 需要一定的时间，dynamic height, scrollbottom 之后图片渲染完成会有一段额外的高度，处理方式是最新的消息如果是图片则再触发一次 scrollbottom 即可解决

   ```html
   <img src="..." alt="..." onLoad="" onError="" />
   ```

6. stacking context. z-index 是相对的. 相邻兄弟 A 和 B 元素 z-index: 100;，其中 A 元素的子元素 a1 如果 z-index: 999; 宽高足够大 也不会遮挡 B， 所以在包或者写 Modal 或者 notification 组件的时候可以放到最外层用 store 控制， 或者用 portal 传送到组件的外层，防止干扰

   ```typescript
   /**
    * @description: 受控组件ui modal组件, 参数详见props
    * @param {Props}
    * @return {ReactNode}
    * @author zixiu
    */
   
   import React, { Component, SFC } from "react";
   import ReactDOM from "react-dom";
   import { Modal, Button } from "antd";
   import IconFont from "../ui/TradexIcon";
   import styles from "./index.module.scss";
   
   class CusPortal extends Component {
     private el = document.createElement("div");
     private appRoot = document.getElementById("root") as Element;
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
   
   const CusModal: SFC<Props> = ({
     visible,
     message,
     title,
     onOk,
     onCancel,
     cancelText,
     okText
   }) => (
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

8) 聊天消息的气泡三角形

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
