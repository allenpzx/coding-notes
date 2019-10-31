/**
 * @description: 聊天室组件 Main(container) => <MaxRoom /> | <CommonRoom /> | <MiniRoom />, low coupling
 * @param {Props}
 * @return {ReactNode}
 * @author zixiu
 */

import React from 'react';
import { MaxRoom, CommonRoom, MinRoom } from './Room';
import _get from '../../common/get';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { sendImageMessage, getRoomHistory } from '../../api/chat';
import { WebSocketManager } from '../../api/wss';
import { AppStore } from '../../store/reducers';
import { deleteActiveRoomId, updateActiveRoomId, upDateRoomUnread } from '../../store/actions/chat';
import { UnionChatRouteGoTo } from '../../store/actions/route';
import { ChatMode, ChatRole, UserInfoStore } from '../../store/types';
import {
  MessageProps,
  TimeMessageType,
  uniqueID,
  RoomStatus,
  SEND_MESSAGE_TIMEOUT,
  getMessageTime,
  RoomPageSize,
  base64ToBlob
} from './common';
import { Notification } from '../Notification';

interface ContainerProps {
  id: string;
  type: RoomStatus;
  user: UserInfoStore;
  maxRoom: (id: string, categoryId: string, activeRole: ChatRole) => any;
  updateActiveRoomId: (id: string, status: 'common' | 'min') => any;
  deleteActiveRoomId: (id: string) => any;
  refreshUnread: (id: string, activeRole: ChatRole) => any;
  onMaxRoomClose?: any;

  activeRole: ChatRole;
  categoryId: string;
}

interface ContainerState {
  count: number;
  next: string;
  previous: string;
  results: MessageProps[];
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
  pageSize: RoomPageSize,
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
    }, SEND_MESSAGE_TIMEOUT);
  };

  sendImageMessage = async (data: FormData, base64Image: string, uuid: string) => {
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

  getMessageTemplate = ({
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

  sendTextMessage = async (text: string) => {
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

  resendMessage = (message: MessageProps) => (e: React.MouseEvent<HTMLDivElement>) => {
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
      async () => {
        if (targetMessage.msg_type === 1) {
          this.sendTextMessage(_get(targetMessage, ['extra', 'content']));
        }
        if (targetMessage.msg_type === 2) {
          const base64Image = _get(targetMessage, ['extra', 'url']);
          const blobImage = await base64ToBlob(base64Image);
          const uuid = uniqueID();
          const data = new FormData();
          data.append('image', blobImage);
          data.append('message_id', uuid);
          this.sendImageMessage(data, base64Image, uuid);
        }
      }
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