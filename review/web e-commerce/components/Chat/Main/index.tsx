import React from 'react';
import { connect } from 'react-redux';
import styles from './index.module.scss';
import '../../../assets/style/common.scss';
import { FormattedNumber } from 'react-intl';
import { Tag } from 'antd';
import { AppStore } from '../../../store/reducers';
import TradexIcon from '../../ui/TradexIcon';
import { ChatRole, ChatMode, RouteItemParams } from '../../../store/types';
import { AvatarWithFlag } from '../../../components/ui/Avatar';
import ChatListBox from '../ChatListBox';
import Window from '../../ChatMain/Main';
import { UnionChatRouteGoTo, UnionChatRouteGoAway } from '../../../store/actions/route';
import { setUnreadNum } from '../../../store/actions/chat';

const mapStateToProps = (state: AppStore) => ({
  user: state.user.userInfo,
  unreadNum: state.chat.unreadNum,
  chatList: { ...state.chat.chatList },
  roomId: state.route.params[ChatMode.ALL_IN_ONE].roomId,
  categoryId: state.route.params[ChatMode.ALL_IN_ONE].categoryId,
  activeRole: state.route.params[ChatMode.ALL_IN_ONE].activeRole
});

const mapDispatchToProps = {
  setUnreadNum,
  UnionChatRouteGoTo,
  UnionChatRouteGoAway
};

interface Props {
  user: AppStore['user']['userInfo'];
  unreadNum: AppStore['chat']['unreadNum'];
  chatList: AppStore['chat']['chatList'];
  roomId: string;
  categoryId?: string;
  activeRole?: ChatRole;
  setUnreadNum: any;
  UnionChatRouteGoTo: any;
  UnionChatRouteGoAway: typeof UnionChatRouteGoAway;
}

const NumTag = (props: { num: number }) => {
  if (!props.num) return null;
  return (
    <FormattedNumber value={props.num}>
      {(val: string) => (
        <div className={styles.numTagWrapper}>
          <Tag color="#f2565f" className={styles.numTag} style={{ transform: 'scale(0.83333)' }}>
            {val}
          </Tag>
        </div>
      )}
    </FormattedNumber>
  );
};
class ChatMain extends React.Component<Props, {}> {
  componentDidMount() {
    this.props.setUnreadNum();
  }

  closeMain = () => {
    this.props.UnionChatRouteGoAway(ChatMode.ALL_IN_ONE);
  };

  updateRouteParams = (params: any) => {
    const { activeRole, roomId, categoryId } = this.props;
    this.props.UnionChatRouteGoTo(
      ChatMode.ALL_IN_ONE,
      Object.assign(
        {},
        {
          activeRole,
          roomId,
          categoryId
        },
        params
      )
    );
  };

  render() {
    const { user, unreadNum, roomId, categoryId, activeRole, chatList } = this.props;
    const { headshot, display_name, company_country } = user;
    if (!user.userId) return null;

    return (
      <div className={styles.chatMain}>
        <div className={styles.container}>
          <aside className={styles.left}>
            <TradexIcon
              type="iconicon_exitfullscreen"
              className={styles.exitfullscreen}
              onClick={this.closeMain}
            />
            <AvatarWithFlag
              avatarUrl={headshot}
              countryUrl={company_country}
              avatarSize={58}
              countrySize={19}
              style={{ marginTop: 34 }}
            />
            <div className={styles.name}>{display_name}</div>
            <div
              className={`${styles.role} ${activeRole === ChatRole.Buyer ? styles.active : ''}`}
              onClick={this.updateRouteParams.bind(null, { activeRole: ChatRole.Buyer })}
            >
              <TradexIcon type="iconicon_buy_line" className={styles.roleIcon} />
              <span>Buy</span>
              <NumTag num={unreadNum.buy} />
            </div>
            <div
              className={`${styles.role} ${activeRole === ChatRole.Seller ? styles.active : ''}`}
              onClick={this.updateRouteParams.bind(null, { activeRole: ChatRole.Seller })}
            >
              <TradexIcon type="iconicon_sell_line" className={styles.roleIcon} />
              <span>Sell</span>
              <NumTag num={unreadNum.sell} />
            </div>
          </aside>
          <div className={styles.mid}>
            <ChatListBox
              activeRole={activeRole}
              setActiviteRoomIdAndCategoryId={(id: string) => {
                this.updateRouteParams({ roomId: id });
              }}
              activeRoomId={roomId}
              activeCategoryId={categoryId}
            />
          </div>
          <div className={styles.right}>
            <Window type="max" onMaxRoomClose={this.closeMain} id={roomId} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatMain);
