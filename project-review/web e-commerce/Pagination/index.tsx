/**
 * Pagination 分页组件, props 参数 https://github.com/react-component/pagination/
 * @author zixiu
 * @since 1.0.1
 * @version 1.0
 */

import React from 'react';
import { Pagination } from 'antd';
import styles from './index.module.scss';

interface Props {
  currentPage: number;
  total: number;
  pageSize: number;
  onChange: any;
  loading: boolean;
}

export default class HackPagination extends React.Component<Props, {}> {
  render() {
    const { currentPage, total, pageSize, onChange, loading } = this.props;

    const lastPageIndex = Math.ceil(total / pageSize);
    function itemRender(
      current: number,
      type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
      originalElement: React.ReactElement
    ) {
      if (type === 'prev') {
        return (
          <span className={`${styles.btnl} ${currentPage === 1 ? styles.block : ''}`}>
            Previous
          </span>
        );
      }
      if (type === 'next') {
        return (
          <span className={`${styles.btnr} ${currentPage === lastPageIndex ? styles.block : ''}`}>
            Next
          </span>
        );
      }
      return originalElement;
    }

    return (
      <Pagination
        className={`${styles.pagination} ${loading ? styles.loading : ''}`}
        current={currentPage}
        pageSize={pageSize}
        total={total}
        itemRender={itemRender}
        onChange={onChange}
      />
    );
  }
}
