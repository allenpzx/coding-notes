import React from 'react';

import { Badge, Avatar } from 'antd';
import TradexIcon from '../../ui/TradexIcon';
import styles from './ChatBuyItem.module.scss';
import chatStyles from '../Chat.module.scss';
import IconFont from '../../ui/TradexIcon';
import { FormattedNumber, FormattedDate } from 'react-intl';
import ChatNum from '../ChatNum/ChatNum';
import { Tag } from 'antd';

import { ChatRole, UserInfo, chatBuyObject } from '../../../store/types';
import { AppStore } from '../../../store/reducers';

import { showDate } from '../../../common/time';

import { msgIcon } from '../ChatListBox';

const mapStateToProps = (state: AppStore) => ({
  userInfo: state.user.userInfo
});

type Props = {
  chatBuyObject: chatBuyObject;
  setActiviteRoomIdAndCategoryId: any;
  activeRoomId: string;
  activeCategoryId: string;
  chatRoomScroll?: any;
  unfoldInitialStaus: boolean;
};
type State = any;

// class msgIcon extends React.Component<object> {
//   render(){
//    return(
//        <div></div>
//    )
//   }
// }

class ChatBuyItem extends React.Component<Props, State> {
  private chatItem = React.createRef<any>();
  constructor(props: Props) {
    super(props);

    this.state = {
      unfold: props.unfoldInitialStaus,
      totle_unread_count: 0,
      showMore: false
    };
  }

  componentDidUpdate(preProps: Props) {
    if (this.props.unfoldInitialStaus !== preProps.unfoldInitialStaus) {
      this.setState({
        unfold: this.props.unfoldInitialStaus
      });
    }
  }

  pluralize = (n: number, unit: string, cap = false) => {
    let u = n > 1 ? `${unit}s` : unit;
    u = cap ? u.toUpperCase() : u;
    return `${n} ${u}`;
  };

  toggleFold = (e: any) => {
    console.log('toggleFold');
    const unfold = !this.state.unfold;
    this.setState({ unfold }, (() => {
      if (unfold) {
        // console.log(e.target)
        this.props.chatRoomScroll(this.chatItem);
      }
    }) as any);
  };

  showMore = () => {
    this.setState({ showMore: true }, (() => {
      // console.log(e.target)
      this.props.chatRoomScroll(this.chatItem);
    }) as any);
  };

  setActive = (chatroom_id: string) => {
    this.props.setActiviteRoomIdAndCategoryId(chatroom_id, this.props.activeCategoryId);
  };

  render() {
    const { activeRoomId } = this.props;
    const { user, chatrooms } = this.props.chatBuyObject;
    const roomLength = chatrooms.length;

    let { unfold, totle_unread_count, showMore } = this.state;

    let latestMsgObj: {
      latest_msg_time: string;
      latest_msg_icon: string;
      latest_msg: string;
    }[] = [];

    chatrooms.forEach(item => {
      totle_unread_count += item.unread_count;
      latestMsgObj.push({
        latest_msg_time: item.latest_msg_time,
        latest_msg_icon: item.latest_msg_icon,
        latest_msg: item.latest_msg
      });
    });

    let showChatrooms = showMore ? chatrooms : chatrooms.slice(0, 3);

    latestMsgObj = latestMsgObj.sort(
      (item1, item2) => Number(item2.latest_msg_time) - Number(item1.latest_msg_time)
    );
    return (
      <div className={styles.ChatBuyItemBox} ref={this.chatItem}>
        <div
          className={styles.ChatBuyItemBox__header}
          onClick={(e: { stopPropagation: () => void }) => {
            e.stopPropagation();
            this.toggleFold(e);
          }}
        >
          <div className={styles.leftBox}>
            <div className={styles.headbox}>
              <div className={styles.headshadBox}></div>
              <Avatar src={user.headshot} className={styles.userHead}></Avatar>
            </div>
            <img
              src={require(`../../../assets/img/flag/${user.company_country}.png`)}
              alt=""
              className={styles.location}
            />
            {totle_unread_count > 0 ? (
              <ChatNum style={styles.headMsgNum} num={totle_unread_count} />
            ) : null}
          </div>
          <div className={styles.cont}>
            <span className={styles.userName}>{user.display_name}</span>
            {!unfold ? (
              <div className={styles.headLastMsg}>
                {msgIcon(latestMsgObj[0].latest_msg_icon)}
                <span
                  className={styles.lastMsgCon}
                  style={{ width: msgIcon(latestMsgObj[0].latest_msg_icon) ? '218px' : '100%' }}
                >
                  {latestMsgObj[0].latest_msg}
                </span>
              </div>
            ) : null}
          </div>

          <IconFont
            type={unfold ? 'iconicon_fold_line' : 'iconicon_dropdown_line'}
            className={chatStyles.fold}
          />
        </div>
        <div
          className={`${styles.ChatBuyItemBox__content} ${
            unfold ? chatStyles.show : chatStyles.hide
          }`}
        >
          {showChatrooms.map((chatroom, index) => (
            <div
              className={`${styles.orderCarItem}  ${
                activeRoomId === chatroom.chatroom_id ? chatStyles.activeOrder : ''
              } `}
              key={index}
              onClick={() => {
                this.setActive(chatroom.chatroom_id);
              }}
            >
              <div className={styles.carImgBox}>
                {chatroom.car_info && chatroom.car_info.thumbnail ? (
                  <img
                    src={chatroom.car_info.thumbnail}
                    title="11"
                    alt="1"
                    className={styles.carImg}
                  />
                ) : null}
              </div>
              <div className={styles.orderCarinfo}>
                <p className={styles.carName}>{chatroom.car_info.name}</p>
                <div className={styles.milesAtag}>
                  <IconFont type="iconicon_mileage_area" className={chatStyles.mileage_icon} />
                  <span className={styles.mileage}>
                    <FormattedNumber value={chatroom.car_info.mileage}></FormattedNumber>
                    KM
                  </span>
                  {/*<Tag className="round-blue"*/}
                  {/*     text={this.pluralize(chatroom.car_info.quantity, 'UNIT', true)}/>*/}
                  {/*<Tag color='#3acdfe'>*/}
                  {/*    {this.pluralize(chatroom.car_info.quantity, 'UNIT', true)}*/}
                  {/*</Tag>*/}
                  <span className={styles.orderTag}>
                    {this.pluralize(chatroom.car_info.available, 'UNIT', true)}
                  </span>
                </div>
                <p className={styles.carPrice}>
                  $<FormattedNumber value={Number(chatroom.car_info.price)}></FormattedNumber>
                  {' ' + chatroom.car_info.currency} * {chatroom.total_cars}
                </p>
                {/*订单状态*/}
                {/*不同状态显示不同图标和消息*/}
                <p
                  className={styles.conLastMsg}
                  // style={{ maxWidth: 'none', marginRight: '-50px' }}
                >
                  {/*{ chatroom.latest_msg_icon }*/}
                  {/*<IconFont type="iconicon_pa_line" className={chatStyles.lastMsgIcon} />*/}
                  {msgIcon(chatroom.latest_msg_icon)}
                  <span
                    className={styles.lastMsgCon}
                    style={{ width: msgIcon(chatroom.latest_msg_icon) ? '188px' : '100%' }}
                  >
                    {chatroom.latest_msg}
                  </span>
                </p>
              </div>
              {chatroom.latest_msg_time ? (
                <span className={chatStyles.msgTime}>{showDate(chatroom.latest_msg_time)}</span>
              ) : null}
              {chatroom.unread_count > 0 ? (
                <ChatNum style={styles.orderMsgNum} num={chatroom.unread_count} />
              ) : null}
            </div>
          ))}
          {/*<div className={styles.showMoreOrder}>*/}
          {/*    <span>Show More</span>*/}
          {/*</div>*/}
          {unfold && roomLength > 3 && roomLength != showChatrooms.length ? (
            <div className={chatStyles.showMoreOrder}>
              <span onClick={() => this.showMore()}>Show More</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default ChatBuyItem;
