import type { JSX } from 'react';
import React from 'react';
import classBind from 'classnames/bind';
import styles from './index.module.less';

const cx = classBind.bind(styles);

const Loading = (): JSX.Element => {
  return (
    <div className={cx('loading')}>
      <span className={cx('loading-spin')}>
        <i className={cx('loading-spin_dot')}></i>
        <i className={cx('loading-spin_dot')}></i>
        <i className={cx('loading-spin_dot')}></i>
        <i className={cx('loading-spin_dot')}></i>
      </span>
      <div className={cx('loading-text')}>加载中...</div>
    </div>
  );
};

export default Loading;
