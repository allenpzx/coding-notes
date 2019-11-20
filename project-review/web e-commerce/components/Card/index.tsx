/**
 * @description: 卡片组件, props多为必传, 仔细查看CardTypes文件
 * @param {Props}
 * @return {ReactNode}
 * @author zixiu
 */

import React, { SFC, ReactNode, PureComponent } from 'react';
import { Tag, Badge } from 'antd';
import IconFont from '../ui/TradexIcon';
import { FormattedMessage, injectIntl } from 'react-intl';
import { CardType } from './CardTypes';
import _get from '../../common/get';
import utils from '../../common/util';
import { CusPopover } from '../CusPopover';
import styles from './index.module.scss';

const thousands = utils.numberWithCommas;

interface State {
  logoError: boolean;
}

@(injectIntl as any)
class Card extends PureComponent<CardType & SFC, State> {
  static defaultProps: CardType & SFC;

  state = {
    logoError: false
  };

  onLogoError = (e: React.MouseEvent<HTMLImageElement>) => {
    this.setState({ logoError: true });
  };

  render() {
    let {
      type,
      id,
      is_new_car,
      image,
      make_logo,
      make_name,
      view_count,
      display_name,
      distance_to_warehouse,
      distance_unit,
      exterior_color,
      exterior_color_name,
      interior_color,
      interior_color_name,
      warehouse,
      car_status,
      user,
      quantity,
      available,
      price,
      currency,
      msrp,
      user_company_country,
      money_symbol,
      onCardClick,
      onCardBottomClick
    } = this.props;

    const { logoError } = this.state;
    const isSolded = available <= 0;
    const display_location = `${_get(warehouse, ['country', 'display_value'])}, ${_get(warehouse, [
      'city_location',
      'name',
      'display_value'
    ])}`;

    const location_key = _get(warehouse, ['country', 'key']);

    function isSafeMoney(money: string | number): boolean {
      const safePoint = 0;
      if (typeof money === 'number' && money > safePoint) return true;
      return isNaN(Number(money)) ? false : Number(money) > safePoint;
    }

    const display_price_row = () => {
      const getFontSize = (textLength: number) => {
        const baseSize = 13; // $ + 1,000,000 + CAD  basic unit => 32px
        if (textLength <= baseSize) {
          return `32px`;
        }
        const pw = ((282 - 8) / textLength) * (32 / ((282 - 8) / 13)) * 1.15;
        return `${pw}px`;
      };

      // 调试价格长度用
      // price = `12345123451234512345`;
      // console.log(t_price);

      // 此处一定要选择字符串正则运算, 不可以用react-intl
      const formatPrice = (price: string | number): ReactNode =>
        !!thousands(price).match(/\./) ? thousands(price).split('.')[0] : thousands(price);

      const fontStyle = {
        style: {
          fontSize: getFontSize(
            money_symbol.length + `${formatPrice(price)}`.length + currency.length
          )
        }
      };

      // CN 用户nego
      // if (user_company_country === 'CN' && !is_new_car && distance_to_warehouse <= 350) {
      //   return (
      //     <div className={styles.price_row}>
      //       <div className={styles.left}>
      //         <FormattedMessage id="buy_market_card_negotiable" defaultMessage="NEGOTIABLE" />
      //       </div>
      //     </div>
      //   );
      // }

      if (user_company_country === 'CN' && isSafeMoney(price)) {
        return (
          <div className={styles.price_row}>
            <div className={styles.left} {...fontStyle}>
              <span className={styles.priceDisplay}>
                <span className={styles.prefix}>{money_symbol}</span>
                <span>{`${formatPrice(price)}`}</span>
              </span>
              <span className={styles.priceCurrency}>{currency}</span>
            </div>
            <div className={styles.buy_tag}>BUY NOW</div>
          </div>
        );
      }

      // CN 用户 msrp
      if (user_company_country === 'CN' && !isSafeMoney(price)) {
        return (
          <div className={styles.price_row}>
            <div className={styles.left} {...fontStyle}>
              <span className={styles.priceDisplay}>
                <span className={styles.prefix}>{money_symbol}</span>
                <span>{formatPrice(msrp) + ''}</span>
              </span>
              <span className={styles.priceCurrency}>{currency}</span>
            </div>
            <div className={styles.msrp_tag}>MSRP</div>
          </div>
        );
      }

      if (user_company_country === 'CN') {
        return (
          <div className={styles.price_row}>
            <div className={styles.left}>
              <FormattedMessage id="buy_market_card_negotiable" defaultMessage="NEGOTIABLE" />
            </div>
          </div>
        );
      }

      // buy now
      if (isSafeMoney(price)) {
        return (
          <div className={styles.price_row}>
            <div className={styles.left} {...fontStyle}>
              <span className={styles.priceDisplay}>
                <span className={styles.prefix}>{money_symbol}</span>
                <span>{`${formatPrice(price)}`}</span>
              </span>
              <span className={styles.priceCurrency}>{currency}</span>
            </div>
            <div className={styles.buy_tag}>BUY NOW</div>
          </div>
        );
      }

      // negotiable
      if (!isSafeMoney(price)) {
        return (
          <div className={styles.price_row}>
            <div className={styles.left}>
              <FormattedMessage id="buy_market_card_negotiable" defaultMessage="NEGOTIABLE" />
            </div>
          </div>
        );
      }
    };

    const UpArea = (
      <div className={styles.up}>
        <div className={styles.coverTop}>
          {logoError && <span className={styles.brandLogo} />}
          {!logoError && (
            <img className={styles.brandLogo} src={make_logo} onError={this.onLogoError} />
          )}
          <span title="123" className={styles.brandName}>
            {_get(make_name, ['display_value'])}
          </span>
          {!isSolded && (
            <Tag className={styles.hackTag} color="#3acdfe">
              {`${quantity} ${quantity <= 1 ? 'UNIT' : 'UNITS'}`}
            </Tag>
          )}
        </div>

        <img src={image} alt="card_cover" className={styles.cover} />

        <div className={styles.coverBottom}>
          <div className={styles.left}>
            {view_count >= 50 ? (
              <IconFont type="iconicon_fire_area" className={styles.iconHot} />
            ) : (
              <IconFont type="iconicon_view_area" className={styles.icon} />
            )}
            <span className={styles.viewsNumber}>{view_count}</span>
            <span>{view_count <= 1 ? 'view' : 'views'}</span>
          </div>

          <div className={styles.right}>
            <div className={styles.color}>
              <span
                className={styles.colorCircle}
                style={{ backgroundColor: `#${exterior_color}` }}
              ></span>
              <span className={styles.colorDesc}>{exterior_color_name}</span>
            </div>

            <div className={`${styles.color} ${styles.color2}`}>
              <span
                className={styles.colorCircle}
                style={{ backgroundColor: `#${interior_color}` }}
              ></span>
              <span className={styles.colorDesc}>{interior_color_name}</span>
            </div>
          </div>
        </div>

        {isSolded && (
          <div
            className={styles.soldCover}
            // onClick={e => e.stopPropagation()} 如果要求sold不能点击就释放这行
          >
            <IconFont type="iconicon_sold_area" className={styles.soldIcon} />
          </div>
        )}
      </div>
    );

    const DownArea = (
      <div className={styles.down}>
        {display_price_row()}
        <div className={styles.desc_row}>{display_name}</div>
        <div className={styles.status_row}>
          {car_status === 1 && <span className={styles.instock_tag}>IN STOCK</span>}
          {car_status === 2 && <span className={styles.incoming_tag}>INCOMING</span>}
        </div>
        <div className={styles.mileage_row}>
          <IconFont type="iconicon_mileage_area" className={styles.mileage_icon} />
          <span className={styles.mileage_info}>
            {distance_to_warehouse}
            {_get(distance_unit, ['display_value'])}
          </span>
        </div>
        {type === 'buy_market' && (
          <div className={styles.buy_row} onClick={onCardBottomClick({ id, type: 'none' })}>
            <div className={styles.left}>
              <Badge dot={false} className={styles.hackDot}>
                <img
                  className={styles.userAvatar}
                  src={_get(user, ['headshot'])}
                  alt="user-avatar"
                />
              </Badge>
              <span className={styles.userName}>{_get(user, ['display_name'])}</span>
            </div>
            <div className={styles.right}>
              <img
                className={styles.iconFlag}
                src={require(`../../assets/img/flag/${location_key}.png`)}
                alt="icon-flag"
              />
              <span className={styles.countryInfo} title={display_location}>
                {display_location}
              </span>
            </div>
          </div>
        )}

        {type === 'sell_market' && (
          <div className={styles.sell_row}>
            <CusPopover>
              <span
                className={styles.sell_row_item}
                onClick={onCardBottomClick({ id, type: 'edit_sell_market' })}
              >
                Edit
              </span>
            </CusPopover>
            <span
              className={styles.sell_row_item}
              onClick={onCardBottomClick({ id, type: 'move_to_garage' })}
            >
              Move To Garage
            </span>
            <span
              className={styles.sell_row_item}
              onClick={onCardBottomClick({ id, type: 'remove_sell_market' })}
            >
              Remove
            </span>
          </div>
        )}

        {type === 'sell_garage' && (
          <div className={styles.sell_garage_row}>
            <span
              className={styles.sell_garage_row_item}
              onClick={onCardBottomClick({ id, type: 'publish' })}
            >
              Publish
            </span>
            <CusPopover>
              <span
                className={styles.sell_garage_row_item}
                onClick={onCardBottomClick({ id, type: 'edit_sell_garage' })}
              >
                Edit
              </span>
            </CusPopover>
            <span
              className={styles.sell_garage_row_item}
              onClick={onCardBottomClick({ id, type: 'remove_sell_garage' })}
            >
              Remove
            </span>
          </div>
        )}
      </div>
    );

    return (
      <div className={styles.card} onClick={onCardClick(id)}>
        {UpArea}
        {DownArea}
      </div>
    );
  }
}

export default Card;
