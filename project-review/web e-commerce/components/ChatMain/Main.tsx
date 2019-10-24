/**
 * @description: 聊天室组件 Main(container) => <MaxRoom /> | <CommonRoom /> | <MiniRoom />, low coupling
 * @param {Props}
 * @return {ReactNode}
 * @author zixiu
 */

import React from 'react';
import { MaxRoom, CommonRoom, MinRoom } from './Room';
import { sendImageMessage, getRoomHistory } from '../../api/chat';
import _get from '../../common/get';
import { AppStore } from '../../store/reducers';
import { UserInfoStore } from '../../store/types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { WebSocketManager } from '../../api/wss';
import { deleteActiveRoomId, updateActiveRoomId } from '../../store/actions/chat';
import { UnionChatRouteGoTo } from '../../store/actions/route';
import { ChatMode, ChatRole } from '../../store/types';
import { upDateRoomUnread } from '../../store/actions/chat';
import { TimeMessageType, MessageStatus } from './Message';

interface MessageType {
  msg_type: number | string;
  extra: object;
  messageStatus?: MessageStatus;
  sender?: {
    id: string;
    headshot: string;
    company_country: string;
  };
  id?: string;
  message_id?: string;
  [key: string]: any;
}

const MESSAGE_TIME_OUT = 10000;

const getMessageTime = (last: string) => {
  if (!last) return false;
  const originPrev = new Date(Number(last));
  const prev = originPrev.getTime();
  const now = Date.now();
  const dateDiff = now - prev;
  const minuteDiff = Math.floor(dateDiff / (60 * 1000));
  if (!Number.isInteger(minuteDiff) || minuteDiff < 11) {
    return false;
  }
  const dayDiff = Math.floor(dateDiff / (24 * 60 * 60 * 1000));
  const year = `${originPrev.getFullYear()}`;
  const month = `${originPrev.getMonth() + 1 < 10 ? '0' : ''}${originPrev.getMonth() + 1}`;
  const day = `${originPrev.getDate() < 10 ? '0' : ''}${originPrev.getDate()}`;
  const hour = `${originPrev.getHours() < 10 ? '0' : ''}${originPrev.getHours()}`;
  const minute = `${originPrev.getMinutes() < 10 ? '0' : ''}${originPrev.getMinutes()}`;
  if (dayDiff <= 1) {
    return `${hour}:${minute}`;
  }
  if (dayDiff <= 2) {
    return `yesterday ${hour}:${minute}`;
  }
  if (dayDiff <= 365) {
    return `${month}-${day} ${hour}:${minute}`;
  }
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

function uniqueID() {
  function chr4() {
    return Math.random()
      .toString(16)
      .slice(-4);
  }
  return (
    chr4() + chr4() + '-' + chr4() + '-' + chr4() + '-' + chr4() + '-' + chr4() + chr4() + chr4()
  );
}

export type RoomType = 'max' | 'min' | 'common';

interface ContainerProps {
  id: string;
  type?: RoomType;
  user: UserInfoStore;
  dispatch: any;
  onMaxRoomClose?: any;
  maxRoom: (id: string, categoryId: string, activeRole: ChatRole) => any;
  updateActiveRoomId: (id: string, status: 'common' | 'min') => any;
  deleteActiveRoomId: (id: string) => any;
  refreshUnread: (id: string, activeRole: ChatRole) => any;

  activeRole: ChatRole;
  categoryId: string;
}

interface ContainerState {
  count: number;
  next: string;
  previous: string;
  results: MessageType[];
  server_time: string;
  status: string;
  chatroom: any;

  page: number;
  pageSize: number;
  loading: boolean;
  targetId: string;
}

const initialState = {
  count: 0,
  next: '',
  previous: '',
  results: [],
  server_time: '',
  status: '',
  chatroom: {},

  // handle change
  page: 1,
  pageSize: 10,
  loading: false,
  targetId: ''
};

@(connect(
  (state: AppStore) => ({
    user: state.user
  }),
  dispatch =>
    bindActionCreators(
      {
        updateActiveRoomId: (id: string, status: 'common' | 'min') =>
          updateActiveRoomId(id, status),
        deleteActiveRoomId: (id: string) => deleteActiveRoomId(id),
        maxRoom: (id: string, categoryId: string, activeRole: ChatRole) =>
          UnionChatRouteGoTo(ChatMode.ALL_IN_ONE, {
            roomId: id,
            categoryId,
            activeRole
          }),
        refreshUnread: (id: string, activeRole: ChatRole) => upDateRoomUnread(activeRole, id)
      },
      dispatch
    )
) as any)
class ChatMain extends React.Component<ContainerProps, ContainerState> {
  static defaultProps: ContainerProps;
  private ROOM: any = null;

  private activeRole: ChatRole;
  private categoryId: string;

  constructor(props: ContainerProps) {
    super(props);
    this.state = initialState;
    this.activeRole = props.activeRole;
    this.categoryId = props.categoryId;
  }

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
      console.log('getRoomHistoryError: ', error);
    } finally {
      this.setState({ loading: false });
    }
  };

  onRoomMessage = (data: any) => {
    console.log('onMessageFromServer: ', data);
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
      this.setState(prev => ({ results: prev.results.concat(data) }));
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

    // before latest message exceed 10 minutes
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

  checkMessage = (message_id: string) => {
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
    }, MESSAGE_TIME_OUT);
  };

  sendImageMessage = async (data: FormData) => {
    try {
      if (!this.props.id) return;
      this.setState({ loading: true });
      await sendImageMessage(this.props.id, data);
    } catch (e) {
      console.log('upload image error: ', e.response);
    } finally {
      this.setState({ loading: false });
    }
  };

  getTextMessageTemplate = (text: string, id: string): MessageType => {
    const {
      userInfo: { userId, headshot, company_country }
    } = this.props.user;
    return {
      msg_type: 1,
      messageStatus: 'pending',
      extra: {
        content: text
      },
      sender: {
        id: userId,
        headshot: headshot,
        company_country: company_country
      },
      message_id: id
    };
  };

  sendTextMessage = async (text: string) => {
    try {
      if (!this.props.id) return;
      this.setState({ loading: true });
      if (!!text.trim()) {
        const message_id = uniqueID();
        this.ROOM.send({ message: text, message_id });
        this.setState(
          prev => ({
            results: prev.results.concat(this.getTextMessageTemplate(text, message_id))
          }),
          () => this.checkMessage(message_id)
        );
      }
    } catch (e) {
      console.log('send text error: ', e);
    } finally {
      this.setState({ loading: false });
    }
  };

  changRoomStatus = async () => {
    this.props.updateActiveRoomId(this.props.id, this.props.type === 'common' ? 'min' : 'common');
  };

  closeRoom = async () => {
    this.props.id && this.props.deleteActiveRoomId(this.props.id);
  };

  onMaxRoomClose = () => {
    this.props.onMaxRoomClose && this.props.onMaxRoomClose(this.props.id);
  };

  // maxRoom = () => this.props.maxRoom(this.props.id, this.categoryId, this.activeRole);

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

  resendMessage = (message: any) => (e: React.MouseEvent<HTMLDivElement>) => {
    let targetMessage: any;
    this.setState(
      prev => {
        const next = prev.results.slice();
        const index = next.findIndex(
          v => Reflect.has(v, 'message_id') && v.message_id === message.message_id
        );
        targetMessage = next.splice(index, 1)[0];
        return {
          results: next
        };
      },
      () => this.sendTextMessage(_get(targetMessage, ['extra', 'content']))
    );
  };

  render() {
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
      _get(target, ['local_timezone']) || _get(chatroom, ['opposite', 'local_timezone']);
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

    return (
      <React.Fragment>
        {type === 'common' && (
          <CommonRoom
            id={id}
            chatroom={chatroom}
            targetHeadshot={targetHeadshot}
            targetLocale={targetLocale}
            targetName={targetName}
            targetActive={targetActive}
            targetLocalTime={targetLocalTime}
            carName={carName}
            carMileage={carMileage}
            carMileageUnit={carMileageUnit}
            carStatus={carStatus}
            orderType={orderType}
            results={results}
            loading={loading}
            user={user}
            imageMessage={this.sendImageMessage}
            textMessage={this.sendTextMessage}
            changRoomStatus={this.changRoomStatus}
            closeRoom={this.closeRoom}
            // maxRoom={this.maxRoom}
            onPageChange={this.onPageChange}
            resendMessage={this.resendMessage}
          />
        )}

        {type === 'min' && (
          <MinRoom
            id={id}
            targetName={targetName}
            targetLocale={targetLocale}
            targetActive={targetActive}
            targetHeadshot={targetHeadshot}
            carName={carName}
            carMileage={carMileage}
            carMileageUnit={carMileageUnit}
            carStatus={carStatus}
            orderType={orderType}
            changRoomStatus={this.changRoomStatus}
            closeRoom={this.closeRoom}
          />
        )}

        {type === 'max' && (
          <MaxRoom
            id={id}
            chatroom={chatroom}
            targetName={targetName}
            targetJoined={targetJoined}
            targetTotalTrad={targetTotalTrad}
            targetActive={targetActive}
            targetLocalTime={targetLocalTime}
            carImage={carImage}
            carMakeLogo={carMakeLogo}
            carName={carName}
            carStatus={carStatus}
            carUnit={carUnit}
            carMileage={carMileage}
            carMileageUnit={carMileageUnit}
            results={results}
            orderType={orderType}
            loading={loading}
            user={user}
            imageMessage={this.sendImageMessage}
            textMessage={this.sendTextMessage}
            onClose={this.onMaxRoomClose}
            onPageChange={this.onPageChange}
            resendMessage={this.resendMessage}
          />
        )}
      </React.Fragment>
    );
  }
}
export default ChatMain;
