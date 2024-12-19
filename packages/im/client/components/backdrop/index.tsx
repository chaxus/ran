import type { JSX } from 'react';
import React from 'react';
import classBind from 'classnames/bind';
import styles from './index.module.less';
import { randomGeneratePolygon } from '@/client/lib/index';

const cx = classBind.bind(styles);

interface BackDropProps {
  children?: JSX.Element | Array<JSX.Element>;
  number?: number;
  maxSides?: number;
}

/**
 * @description: 背景
 * @param {*} props
 */
const BackDrop = (props: BackDropProps): JSX.Element => {
  const { children, number = 3, maxSides = 10 } = props;
  const polygonPathList = randomGeneratePolygon(number, maxSides);
  return (
    <div className={cx('backdrop')}>
      {polygonPathList.map((item, index) => {
        const { color, path } = item;
        return <div className={cx('backdrop-item')} key={index} style={{ clipPath: path, background: color }} />;
      })}
      <div className={cx('backdrop-content')}>{children}</div>
    </div>
  );
};

export default BackDrop;
