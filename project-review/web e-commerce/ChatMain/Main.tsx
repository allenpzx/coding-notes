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
import { CarMessageType, TimeMessageType } from './Message';

const getMessageTime = (last: string) => {
  if (!last) return false;
  const originPrev = new Date(Number(last));
  const prev = originPrev.getTime();
  const now = Date.now();
  const dateDiff = now - prev;
  const minuteDiff = Math.floor(dateDiff / (60 * 1000));
  // console.log('last: ', last);
  // console.log('originPrev: ', originPrev);
  // console.log('prev: ', prev);
  // console.log('now: ', now);
  // console.log('minuteDiff: ', minuteDiff);
  // console.log('dateDiff: ', dateDiff);
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
    console.log('within 1 day');
    return `${hour}:${minute}`;
  }
  if (dayDiff <= 2) {
    console.log('within 2 day');
    return `yesterday ${hour}:${minute}`;
  }
  if (dayDiff <= 365) {
    console.log('within 1 year');
    return `${month}-${day} ${hour}:${minute}`;
  }
  console.log('more than one year');
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

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
  results: any[];
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

        results.map((v: any) => (v.isFromHistory = true));

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
      console.log('getRoomHistoryError: ', error);
    } finally {
      this.setState({ loading: false });
    }
  };

  onRoomMessage = (data: any) => {
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

  sendTextMessage = async (text: string) => {
    try {
      if (!this.props.id) return;
      this.setState({ loading: true });
      !!text.trim() && this.ROOM.send({ message: text });
    } catch (e) {
      console.log('send text error: ', e.response);
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

    // target
    // const target =
    //   _get(results.slice(-1)[0], ["sender_id"]) === targetId
    //     ? _get(results.slice(-1)[0], ["sender"])
    //     : _get(results.slice(-1)[0], ["receiver"]);

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
          />
        )}
      </React.Fragment>
    );
  }
}
export default ChatMain;
