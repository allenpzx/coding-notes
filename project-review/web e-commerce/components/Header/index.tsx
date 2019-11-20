/**
 * Header组件，一般不需要单独引入，链接了router和store无需以额外的props
 * 如果要单独使用的话直接放到容器内第一个组件即可
 * 引入Header组件必须登陆！！！
 * @author zixiu
 * @since 1.0.1
 * @version 1.0
 */

import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Badge, Avatar } from 'antd';
import { UserInfoStore } from '../../store/types';
import { AppStore } from '../../store/reducers';
import { FormattedMessage } from 'react-intl';
import IconFont from '../ui/TradexIcon';
import { CustomPopover } from '../CusPopover';
import { logout } from '../../api/user';
import _get from '../../common/get';
import { removeCookie } from '../../common/cookie';
import { path as allPath } from '../../routes/routers';
import styles from './index.module.scss';

interface State {
  menuShow: boolean;
  mainMenu: string;
  notification: boolean;
}

export interface InnerProps extends RouteComponentProps<{}> {
  user: UserInfoStore;
  getNotification?: any;
  compoName: string;
}

export interface OutterProps extends InnerProps {}

@(withRouter as any)
@(connect(
  (state: AppStore) => ({
    user: state.user
  }),
  dispatch => ({
    getNotification: () => false
  })
) as any)
class Header extends React.Component<OutterProps, State> {
  static defaultProps: InnerProps;

  state = {
    menuShow: false,
    mainMenu: '',
    notification: false
  };

  async componentDidMount() {
    const notification = await this.getNotification();
    this.setState({ notification });
  }

  async componentDidUpdate(prevProps: any) {
    const {
      location: { pathname }
    } = prevProps;
    if (pathname !== this.props.location.pathname) {
      const notification = await this.getNotification();
      this.setState({ notification });
    }
  }

  async getNotification() {
    const { getNotification } = this.props;
    const res = await getNotification();
    return res;
  }

  goto = (path: string) => () => {
    const {
      history: { push }
    } = this.props;
    push(path);
  };

  onMainMouseOver = (mainMenu: string) => (e: React.MouseEvent) => {
    if (this.state.menuShow) return;
    this.setState({ mainMenu: mainMenu, menuShow: true });
  };

  onMainMouseLeave = (e: any) => {
    if (!this.state.menuShow) return;
    this.setState({ menuShow: false });
  };

  logout = async () => {
    try {
      const { status } = await logout();
      if (status === 200) {
        removeCookie('Authorization');
        window.location.href = 'https://tradexport.com';
      }
    } catch (e) {
      if (_get(e, ['response', 'status']) === 401) {
        this.props.history.push('/login');
      }
    } finally {
      removeCookie('Authorization');
    }
  };

  render() {
    const {
      user: {
        userInfo: { display_name, headshot }
      },
      location: { pathname }
    } = this.props;
    const { menuShow, mainMenu, notification } = this.state;
    const matchPath = (route: string): boolean => pathname.startsWith(route);
    const isBuyPage = matchPath(allPath.BuyMarket);
    const isSellPage = matchPath(allPath.SellMarket) || matchPath(allPath.SellGarage);
    const isOrderPage = matchPath(allPath.Order);
    const isExpanded = isBuyPage || isSellPage || isOrderPage;

    return (
      <header className={`${styles.container} ${isExpanded ? styles.expanded : ''}`}>
        <div className={styles.main}>
          <div className={styles.logoWrap}>
            <img src={require('../../assets/img/logo.png')} alt="logo" className={styles.logo} />
          </div>

          <ul className={styles.menu}>
            <li
              className={`${styles.menuItem} ${isBuyPage ? styles.active : ''} ${
                menuShow && mainMenu === 'buy' ? styles.menuItemActiveTriangle : ''
              }`}
              onMouseOver={this.onMainMouseOver('buy')}
              onMouseLeave={this.onMainMouseLeave}
            >
              <IconFont type="iconicon_buy_line" className={styles.itemPre} />
              <span>
                <FormattedMessage id="header_buy" defaultMessage="Buy" />
              </span>
              <IconFont type="iconicon_dropdown_line" className={styles.itemNex} />
            </li>
            <li
              className={`${styles.menuItem} ${isSellPage ? styles.active : ''} ${
                menuShow && mainMenu === 'sell' ? styles.menuItemActiveTriangle : ''
              }`}
              onMouseOver={this.onMainMouseOver('sell')}
              onMouseLeave={this.onMainMouseLeave}
            >
              <IconFont type="iconicon_sell_line" className={styles.itemPre} />
              <span>
                <FormattedMessage id="header_sell" defaultMessage="Sell" />
              </span>
              <IconFont type="iconicon_dropdown_line" className={styles.itemNex} />
            </li>
          </ul>

          <div className={styles.userInfo}>
            {/* <CustomPopover type="comingsoon"> */}
            <div className={styles.userInfoItem}>
              <Badge dot={notification} className={styles.hackDot}>
                <IconFont type="iconicon_warn_line" className={styles.prefix} />
              </Badge>
              <span className={styles.tag}>
                <FormattedMessage id="header_notification" defaultMessage="Notification" />
              </span>
            </div>
            {/* </CustomPopover> */}

            <div
              className={`${styles.userInfoItem} ${
                menuShow && mainMenu === 'order' ? styles.menuItemActiveTriangle : ''
              } ${styles.pl32} ${isOrderPage ? styles.active : ''}`}
              onMouseOver={this.onMainMouseOver('order')}
              onMouseLeave={this.onMainMouseLeave}
              onClick={this.goto(`${allPath.Order}/purchased`)}
            >
              <IconFont type="iconicon_pa_line" className={styles.prefix} />
              <span className={`${styles.tag} ${styles.pr8px}`}>
                <FormattedMessage id="header_ordercetner" defaultMessage="Order Center" />
              </span>
              <IconFont type="iconicon_dropdown_line" className={styles.itemNex} />
            </div>

            <CustomPopover type="logout" hoverContent={<span onClick={this.logout}>Log out</span>}>
              <div className={`${styles.userInfoItem} ${styles.pl32} ${styles.hackToggle}`}>
                <Avatar src={headshot} />
                <span className={styles.userName}>{display_name}</span>
                <IconFont type="iconicon_dropdown_line" className={styles.userInfoRightIcon} />
                <IconFont type="iconicon_fold_line" className={styles.userInfoRightIconHover} />
              </div>
            </CustomPopover>
          </div>
        </div>

        <div className={styles.sub}>
          <div
            className={`${styles.subMenu} ${
              menuShow && mainMenu === 'buy' ? styles.subMenu_buy : ''
            } ${isBuyPage ? styles.subMenu_expanded_buy : ''}`}
            onMouseOver={this.onMainMouseOver('buy')}
            onMouseLeave={this.onMainMouseLeave}
          >
            <span
              className={`${styles.subMenuItem} ${
                matchPath(allPath.BuyMarket) ? styles.active : ''
              }`}
              onClick={this.goto(allPath.BuyMarket)}
            >
              Market
            </span>
            <CustomPopover type="comingsoon">
              <span
                className={`${styles.subMenuItem} ${
                  matchPath('/sell/market') ? styles.active : ''
                }`}
              >
                Create Instant Request
              </span>
            </CustomPopover>
          </div>

          <div
            className={`${styles.subMenu} ${
              menuShow && mainMenu === 'sell' ? styles.subMenu_sell : ''
            } ${isSellPage ? styles.subMenu_expanded_sell : ''}`}
            onMouseOver={this.onMainMouseOver('sell')}
            onMouseLeave={this.onMainMouseLeave}
          >
            <span
              className={`${styles.subMenuItem} ${
                matchPath(allPath.SellMarket) ? styles.active : ''
              }`}
              onClick={this.goto(allPath.SellMarket)}
            >
              Market
            </span>

            <span
              className={`${styles.subMenuItem} ${
                matchPath(allPath.SellGarage) ? styles.active : ''
              }`}
              onClick={this.goto(allPath.SellGarage)}
            >
              Garage
            </span>

            <CustomPopover type="comingsoon">
              <span
                className={`${styles.subMenuItem} ${
                  matchPath('/sell/create') ? styles.active : ''
                }`}
              >
                Create
              </span>
            </CustomPopover>
          </div>

          <div
            className={`${styles.subMenu} ${
              menuShow && mainMenu === 'order' ? styles.subMenu_order : ''
            } ${isOrderPage ? styles.subMenu_expanded_order : ''}`}
            onMouseOver={this.onMainMouseOver('order')}
            onMouseLeave={this.onMainMouseLeave}
          >
            <span
              className={`${styles.subMenuItem} ${
                matchPath(`${allPath.Order}/purchased`) ? styles.active : ''
              }`}
              onClick={this.goto(`${allPath.Order}/purchased`)}
            >
              Purchased
            </span>

            <span
              className={`${styles.subMenuItem} ${
                matchPath(`${allPath.Order}/sold`) ? styles.active : ''
              }`}
              onClick={this.goto(`${allPath.Order}/sold`)}
            >
              Sold
            </span>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
