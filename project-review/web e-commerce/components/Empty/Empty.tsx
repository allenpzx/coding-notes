/**
 * empty data component
 * @author zixiu
 * @since 1.0.1
 * @version 1.0
 */

import React from 'react';
import { Empty } from 'antd';
import { injectIntl, IntlShape } from 'react-intl';
import Icon from '../Icon';
import styles from './Empty.module.scss';

interface Props {
  emptyType: 'empty_search' | 'empty_filter' | 'empty_market' | 'empty_garage' | 'empty_homepage';
  intl: IntlShape;
}

class CusEmpty extends React.PureComponent<Props, {}> {
  static defaultProps: Props;

  render() {
    const {
      emptyType,
      intl: { formatMessage }
    } = this.props;

    const description = formatMessage({ id: emptyType });
    const image = (
      <Icon
        kind={
          ['empty_search', 'empty_filter'].includes(emptyType)
            ? 'picture_nofound'
            : 'picture_zerocar'
        }
        width={400}
        height={300}
      />
    );
    return (
      <div className={styles.emptyContainer}>
        <Empty description={description} image={image} className={styles.emptyIcon} />
      </div>
    );
  }
}

export default injectIntl(CusEmpty);
