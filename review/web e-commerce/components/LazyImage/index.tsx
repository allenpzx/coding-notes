/**
 * @description: lazy load image component
 * @param {IProps}
 * @return {ReactNode}
 * @author zixiu
 */

import React, { SFC, useEffect, useRef, memo, useState } from "react";
import { Spin, Icon } from "antd";

interface IOptions {
  root: HTMLElement;
  rootMargin: string;
  threshold: number | number[];
}

interface IProps {
  src: string;
  alt: string;
  width: string | number;
  height: string | number;
  opt?: Partial<IOptions>;
}

const LazyImage: SFC<IProps> = ({ src, alt, width, height, opt }) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const observer = new IntersectionObserver(
    function(entries) {
      const _img = entries[0];
      if (_img.intersectionRatio <= 0) return;
      if (_img.isIntersecting) {
        (_img.target as any).src = (_img.target as any).dataset.src;
        observer.unobserve((imgRef as any).current);
      }
    },
    { rootMargin: "100px 0px", ...opt }
  );

  useEffect(() => {
    observer.observe((imgRef as any).current);
    return function cleanup() {
      observer.disconnect();
    };
  });

  const [show, setShow] = useState(false);

  const antIcon = (
    <Icon type="loading" style={{ fontSize: 30, zIndex: 1000 }} spin />
  );

  return (
    <div style={{ width, height }}>
      {!show && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width,
            height,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Spin indicator={antIcon} />
        </div>
      )}
      <img
        ref={imgRef}
        src={""}
        data-src={src}
        alt={alt}
        style={{ width, height, objectFit: "cover" }}
        onLoad={() => setShow(true)}
      />
    </div>
  );
};

export default memo(LazyImage);
