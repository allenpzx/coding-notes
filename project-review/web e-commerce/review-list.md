# list page review 
做了很多的电商列表页=>详情页，列表页的场景逻辑都差不多

比如订单列表，商品列表，运单列表，主要有筛选过滤，搜索，分页等功能

1. 初始化loadData({…getConditions(), …getNextPage()})
2. onChange

```javascript
this.setState({...conditions, page: nextPage})
loadData({…getConditions(), …getNextPage()})
```

3. ConditionsBar PaginationBar loading 状态禁止更改查询条件和分页
4. 分页第一页不能 prev, 最后一页不能 next, 跳页最大值不能大于总页数

5. loadData要设置loading状态, 空数据状态，error 空数据状态

6. 如果列表页是`3*3`卡片的话，样式flex或者grid布局，点击热区可能分两部分，卡片的上部分和下部分

```typescript
  onCardClick = (id: string) => (e: React.MouseEvent<HTMLDivElement>) =>
    push(`${path.BuyCarDetail}/${id}`);

  onCardBottomClick = (id: string) => (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
		...
  };
```
