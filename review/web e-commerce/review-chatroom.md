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

2. chatroom instance add/delet/update(点击右侧联系人，新增 chatroom， 点击 chatroom header toggle chatroom_status...)

- 点击右侧联系人列表的时候，本质是向对象数组里面 push 一个 MessageItem
- push MessageItem 的时候如果 id 存在且 status === 'common' return 即可，id 存在且 status === 'min'的时候把 status = 'common', id 不存在的 push 进去，id 超过限制数量替换第一个，则新实例化一个 chatroom
- 点击 chatroom 的 header 区域 toggle chatroom 的 status = 'common' | 'min', 则聊天室展开和收起

  ```javascript
  const changRoomStatus = async () => {
    this.props.updateActiveRoomId(
      this.props.id,
      this.props.type === "common" ? "min" : "common"
    );
  };

  const closeRoom = async () => {
    this.props.id && this.props.deleteActiveRoomId(this.props.id);
  };

  const onMaxRoomClose = () => {
    this.props.onMaxRoomClose && this.props.onMaxRoomClose(this.props.id);
  };
  ```

3. chatroom initial

- 从数据上来看仅仅是一个下拉触顶的分页列表

- 分页数据

  ```javascript
  this.setState(prev => ({ history: next_history.concat(prev.history) }));
  ```

- 初始化需要做的

  - reset unread number
  - get chatroom histroy
  - connect chatroom websocket for detect onmessage from server
  - detect room scroll to top for pagination
  - detect chatroom scrolling when a modal is open for prevent page scrolling
  - focus on input

  ```typescript
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

    componentDidMount() {
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
  ```

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

````

4. 聊天室收发消息

- 先生成模版消息, 模版消息符合 room history 子项的格式, 客户端生成`message_id = uuid();`

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

- 将`text/image`类型的消息通过 websocket 或者 http 发送给 server，假如 client A 向 client B 发送一条消息 MSG_A，那么将发生 👇

1. 将 message_a 立即推入到聊天内容的数组当中, 这条消息`message_status = pending`, `message_id = id_a`
2. 设置一个定时器检查这条消息在指定`TIME_OUT`时间后的`message_status`，如果`message_stauts = pending` 则 设置`message_status = error`, ``message_status = error`的消息在渲染的时候设置成发送失败的样式，hover 到这条错误消息上的时候显示 resend 的图标，点击即可重新发送。如果重新发送则重复以上此流程
3. client A 发送`MSG_A`到 server
4. server 把`MSG_A`存 database
5. server 存失败后通知 A 并附带`MSG_A`的 `message_id`, 存成功后把消息同时发送给 A 和 B 并附带`message_id`
5. client 收到消息之后, 如果消息没有`message_id`则直接推入聊天数组，如果有`message_id`则把这条消息比如 MSG_A 找到，并检查这条消息的`message_status === pending`则设置 `message_status = success`, 如果这条消息`message_status === error` 则不做重制

  ```typescript
    const onRoomMessage = (data: any) => {
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
      ...
    };

    const checkMessage = (message_id: string) => {
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
      }, SEND_MESSAGE_TIMEOUT);
    };


    const sendImageMessage = async (data: FormData, base64Image: string, uuid: string) => {
      try {
        if (!this.props.id) return;
        this.setState({ loading: true });
        if (base64Image) {
          const _message = this.getMessageTemplate({
            type: 'image',
            url: base64Image,
            id: uuid
          });
          this.setState(
            prev => ({ results: prev.results.concat(_message) }),
            () => this.checkMessage(uuid)
          );
        }
        await sendImageMessage(this.props.id, data);
      } catch (e) {
        Notification({
          type: 'error',
          message: 'upload image error',
          description: _get(e, ['response', 'data', 'message'] || e || '')
        });
      } finally {
        this.setState({ loading: false });
      }
    };

    const sendTextMessage = async (text: string) => {
      try {
        if (!this.props.id) return;
        this.setState({ loading: true });
        if (!!text.trim()) {
          const message_id = uniqueID();
          this.ROOM.send({ message: text, message_id });
          this.setState(
            prev => ({
              results: prev.results.concat(
                this.getMessageTemplate({ text, id: message_id, type: 'text' })
              )
            }),
            () => this.checkMessage(message_id)
          );
        }
      } catch (e) {
        Notification({
          type: 'error',
          message: 'Send text error',
          description: _get(e, ['response', 'data', 'message'] || e || '')
        });
      } finally {
        this.setState({ loading: false });
      }
    };
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

7. 聊天消息的气泡三角形

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

8. reset event value use e.persist()

  > React SyntheticEvent `Event Pooling`
  > The SyntheticEvent is pooled. This means that the SyntheticEvent object will be reused and all properties will be nullified after the event callback has been invoked. This is for performance reasons. As such, you cannot access the event in an asynchronous way.

  > Note:
  > If you want to access the event properties in an asynchronous way, you should call `event.persist()` on the event, which will remove the synthetic event from the pool and allow references to the event to be retained by user code.

  ```javascript
  function onClick(event) {
    console.log(event); // => nullified object.
    console.log(event.type); // => "click"
    const eventType = event.type; // => "click"

    setTimeout(function() {
      console.log(event.type); // => null
      console.log(eventType); // => "click"
    }, 0);

    // Won't work. this.state.clickEvent will only contain null values.
    this.setState({ clickEvent: event });

    // You can still export event properties.
    this.setState({ eventType: event.type });
  }
  ```

  ```typescript
  const onImageMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      e.persist();
      const files = _get(e, ["target", "files"]);
      const reader = new FileReader();
      reader.onload = async (event: any) => {
        const base64Image = event.target.result;
        const formData = new FormData();
        const uuid = uniqueID();
        formData.append("image", files[0]);
        formData.append("message_id", uuid);
        this.props.imageMessage(formData, base64Image, uuid);
        e.target.value = "";
      };
      reader.readAsDataURL(files[0]);
    } catch (e) {
      Notification({
        type: "error",
        message: "Upload image error",
        description: _get(e, ["response", "data", "message"]) || ""
      });
    }
  };
  ```

9. 聊天室聊天对象的活动信息开始取值 = onmessage(latest) || api(from component initial)

  ```javascript
      const { user, type, id } = this.props;
      const { targetId, results, chatroom, loading } = this.state;

      const matchTarget = results.find(
        (v: any) => v.receiver_id === targetId || v.sender_id === targetId
      );

      const target =
        _get(matchTarget, ['sender_id']) === targetId
          ? _get(matchTarget, ['sender'])
          : _get(matchTarget, ['receiver']);

      const targetName =
        _get(target, ['display_name']) || _get(chatroom, ['opposite', 'display_name']);
      const targetHeadshot = _get(target, ['headshot']) || _get(chatroom, ['opposite', 'headshot']);
      const targetJoined = _get(target, ['created_at']) || _get(chatroom, ['opposite', 'created_at']);
      const targetTotalTrad =
        _get(target, ['trade_history', 'cars_sold']) +
          _get(target, ['trade_history', 'cars_bought']) ||
        0 ||
        (_get(chatroom, ['opposite', 'trade_history', 'cars_sold']) +
          _get(chatroom, ['opposite', 'trade_history', 'cars_bought']) ||
          0);
      const targetActive =
        _get(target, ['last_time_online']) || _get(chatroom, ['opposite', 'last_time_online']);
      const targetLocalTime =
        _get(target, ['local_time']) || _get(chatroom, ['opposite', 'local_time']);
      const targetLocale =
        _get(target, ['company_country']) || _get(chatroom, ['opposite', 'company_country']);

      // car
      const carImage = _get(chatroom, ['car_info', 'thumbnail']) || '';
      const carMakeLogo = _get(chatroom, ['car_info', 'make_logo']) || '';
      const carName = _get(chatroom, ['car_info', 'name']) || '';
      const carMileage = _get(chatroom, ['car_info', 'distance_to_warehouse']);
      const carMileageUnit = _get(chatroom, ['car_info', 'distance_unit', 'display_value']) || '';
      const carStatus = _get(chatroom, ['car_info', 'car_status']) || -1;
      const carUnit = _get(chatroom, ['car_info', 'quantity']) || '';
      const orderType = _get(chatroom, ['order_type']) || -1;

      ...

  ```

10. 发送图片消息时候用到的，将图片消息直接推入聊天室其实推入的是base64Image, 重新发送给的时候需要把base64 convert to blob

  ```typescript
  const onImageMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist(); // 👈
    const files = _get(e, ['target', 'files']);
    const reader = new FileReader();
    reader.onload = async (event: any) => {
      ...
      e.target.value = ''; // 👈
    };
    reader.readAsDataURL(files[0]);
  };

  const base64ToBlob = (base64Image: string) =>
    fetch(base64Image)
      .then(res => res.blob())
      .then(blob => new File([blob], `image_from_chat.${blob.type.split("/")[1]}`));
  ```
````
