# list page review

做了很多的电商列表页, 列表页的场景和逻辑都差不多，比如订单列表，商品列表，运单列表，主要有筛选过滤，搜索，分页等功能，主要思路如下

1. loadData

```javascript
loadData({ ...getConditions(), ...getNextPage() });
```

2. onChange

```javascript
this.setState({...conditions, page: nextPage})
loadData({…getConditions(), …getNextPage()})
```

3. ConditionsFilterBar and PaginationBar when status is loading forbit change state
4. first page forbit prev, last page forbit next, jump page <= pages, 1 page hide pagination
5. if list is card, hot click area can split it multiple

```typescript
  onCardClick = (id: string) => (e: React.MouseEvent<HTMLDivElement>) =>
    push(`${path.BuyCarDetail}/${id}`);

  onCardBottomClick = (id: string) => (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
		...
  };
```

6. image lazy loading, use new web api **IntersectionObserver()**

```typescript
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

  return (
    <img
      ref={imgRef}
      src={""}
      data-src={src}
      alt={alt}
      style={{ width, height, objectFit: "cover" }}
    />
  );
};

export default memo(LazyImage);
```

7. if list pagination way is scroll to bottom auto load next page, should use virtule list to render list without out screen list

   - initial startIndex, endIndex, fixed list item height
   - startIndex is the top to bottom first item in screen and the endIndex is bottom of list in screen
   - detect scroll to update startIndex and endIndex
   - when list index durining in range then render the list, out of screen list hide but preserve list height

8. **lazy load** and **virtule list** is prevent for **Reflow** and **Repaint**, because it's reduce performance.
