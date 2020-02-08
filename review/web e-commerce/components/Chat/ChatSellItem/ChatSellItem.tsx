import React from 'react';
import TradexIcon from '../../ui/TradexIcon';

import { Badge, Avatar } from 'antd';
import styles from './ChatSellItem.module.scss';
import chatStyles from '../Chat.module.scss';
import IconFont from '../../ui/TradexIcon';
import { FormattedNumber, FormattedDate } from 'react-intl';
import ChatNum from '../ChatNum/ChatNum';
import { chatSellObject } from '../../../store/types';
import { showDate } from '../../../common/time';

import { msgIcon } from '../ChatListBox';
import ChatBuyItem from '../ChatBuyItem/ChatBuyItem';

/**
 * 作为卖家
 */

type Props = {
  chatSellObject: chatSellObject;
  setActiviteRoomIdAndCategoryId: any;
  activeRoomId: string;
  activeCategoryId: string;
  chatRoomScroll?: any;
  unfoldInitialStaus: boolean;
};

type State = any;

class ChatSellItem extends React.Component<Props, State> {
  private chatItem = React.createRef<any>();
  constructor(props: Props) {
    super(props);
    this.state = {
      //展开
      // unfold: this.props.chatSellObject.chatrooms.some(
      //   i => i.chatroom_id === this.props.activeRoomId
      // ),
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

  toggleFold = () => {
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
    const { chatrooms, car_info } = this.props.chatSellObject;
    const roomLength = chatrooms.length;

    let { unfold, totle_unread_count, showMore } = this.state;

    let showChatrooms = showMore ? chatrooms : chatrooms.slice(0, 3);

    chatrooms.forEach(item => {
      totle_unread_count += item.unread_count;
    });

    return (
      <div className={styles.ChatSellItemBox} ref={this.chatItem}>
        <div
          className={styles.ChatSellItemBox__header}
          onClick={(e: { stopPropagation: () => void }) => {
            e.stopPropagation();
            this.toggleFold();
          }}
        >
          <div className={styles.carImgBox}>
            {car_info && car_info.thumbnail ? (
              <img
                src={car_info.thumbnail}
                title={car_info.name ? car_info.name : ''}
                alt={car_info.name ? car_info.name : ''}
                className={styles.carImg}
              />
            ) : null}
            {totle_unread_count > 0 ? (
              <ChatNum style={styles.orderMsgNum} num={totle_unread_count} />
            ) : null}
          </div>
          <div className={styles.orderCarinfo}>
            <p className={styles.carName}>{car_info.name}</p>
            <div className={styles.milesAtag}>
              {/*<TradexIcon type="iconicon_mileage_area" className="icon_mileage_area" />*/}
              <IconFont type="iconicon_mileage_area" className={chatStyles.mileage_icon} />
              <span className={styles.mileage}>
                <FormattedNumber value={car_info.mileage}></FormattedNumber>
                KM
              </span>
              {car_info.car_status === 1 ? (
                <span className={styles.inStockTag}>IN STOCK</span>
              ) : (
                <span className={styles.inComingTag}>INCOMING</span>
              )}
            </div>
          </div>
          {/*<IconFont*/}
          {/*    type='iconicon_fold_line'*/}
          {/*    className={`${styles.fold} ${chatStyles.fold}`}*/}
          {/*/>*/}
          <IconFont
            type={unfold ? 'iconicon_fold_line' : 'iconicon_dropdown_line'}
            className={`${styles.fold} ${chatStyles.fold}`}
          />
        </div>
        {/*<div className={`${styles.ChatBuyItemBox__content} ${unfold ? styles.show : styles.hide}`}>*/}
        <div
          className={`${styles.ChatSellItemBox__content} ${
            unfold ? chatStyles.show : chatStyles.hide
          }`}
        >
          {showChatrooms.map((chatroom, index) => (
            <div
              className={`${styles.orderSellItem}  ${
                activeRoomId === chatroom.chatroom_id ? chatStyles.activeOrder : ''
              } `}
              key={index}
              onClick={() => {
                this.setActive(chatroom.chatroom_id);
              }}
            >
              <div className={styles.leftBox}>
                <div className={styles.headbox}>
                  <div className={styles.headshadBox}></div>
                  <Avatar src={chatroom.buyer.headshot} className={styles.userHead}></Avatar>
                </div>
                <img
                  src={require(`../../../assets/img/flag/${chatroom.buyer.company_country}.png`)}
                  alt=""
                  className={chatStyles.location}
                />
                {chatroom.unread_count > 0 ? (
                  <ChatNum style={styles.headMsgNum} num={chatroom.unread_count} />
                ) : null}
              </div>
              <div className={styles.orderInfo}>
                <p className={styles.userName}>{chatroom.buyer.display_name}</p>
                <p className={styles.offer}>
                  {chatroom.price_per_car
                    ? '$' +
                      chatroom.price_per_car +
                      ' ' +
                      chatroom.seller_currency +
                      ' * ' +
                      chatroom.total_cars
                    : ''}
                </p>
                <p className={styles.lastMsg}>
                  {/*<IconFont type="iconicon_pa_line" className={chatStyles.lastMsgIcon} />*/}
                  {msgIcon(chatroom.latest_msg_icon)}
                  <span
                    style={{ width: msgIcon(chatroom.latest_msg_icon) ? '218px' : '100%' }}
                    className={styles.lastMsgCon}
                  >
                    {chatroom.latest_msg}
                  </span>
                </p>
              </div>
              {chatroom.latest_msg_time ? (
                <span className={chatStyles.msgTime}>{showDate(chatroom.latest_msg_time)}</span>
              ) : null}
            </div>
          ))}
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

export default ChatSellItem;
