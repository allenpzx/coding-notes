import React, { useState, useEffect, useRef } from "react";
import styles from "./AutoImg.module.scss";

export default function AutoImg({
  url,
  smallUrl,
  alt,
  width = 400,
  height = 200
}) {
  const [smallSrc, setSmallSrc] = useState(null);
  const [src, setSrc] = useState(null);
  const placeholderRef = useRef(null);
  const observer = new IntersectionObserver(async function(res) {
    if (res[0].intersectionRatio > 0) {
      observer.unobserve(placeholderRef.current);

      const img = new Image();
      img.onload = function() {
        setSmallSrc(smallUrl);
      };
      img.src = smallUrl;
      
      const _img = new Image();
      _img.onload = function() {
        setSrc(url);
      };
      _img.src = url;
    }
  });

  useEffect(() => {
    observer.observe(placeholderRef.current);
  });

  return (
    <div
      ref={placeholderRef}
      className={styles.placeholder}
      style={{ width, height }}
    >
      <img
        className={`${styles.imgSmall} ${smallSrc ? styles.loaded : ""}`}
        src={smallSrc}
        alt={alt}
      />
      <img className={`${src ? styles.loaded : ''}`} src={src} alt={alt} />
    </div>
  );
}
