/**
 * 卡片列表专用loading组件
 * @author zixiu
 * @since 1.0.1
 * @version 1.0
 */

import React, { SFC } from "react";
import { Skeleton } from "antd";
import styles from "./index.module.scss";

class Card extends React.Component<SFC, {}> {
  render() {
    return (
      <div className={styles.CardContainer}>
        {Array(6)
          .fill(1)
          .map((v, i) => (
            <div className={styles.cardLoading} key={i}>
              <Skeleton
                className={styles.hackSkeleton}
                loading
                active
                paragraph={{ rows: 10 }}
              />
            </div>
          ))}
      </div>
    );
  }
}

export default Card;
