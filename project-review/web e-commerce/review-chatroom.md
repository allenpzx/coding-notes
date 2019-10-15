## chatroom review

1. 聊天室状态维护

```typescript
export interface RoomItem {
  id: string;
  status?: 'common' | 'min';
}

export interface AddActiveRoomId {
  type: ChatActionTypes.ADD_ACTIVE_ROOM_ID;
  item: RoomItem;
}

export interface ChatStore {
  unreadNum: {
    sell: number;
    buy: number;
  };
  activeRoomId: RoomItem[];
  chatList: {
    chatBuyList: chatBuyObject[];
    buyListCurrentPage: number;
    hasnextBuylistPage: boolean;
    chatSellList: chatSellObject[];
    sellListCurrentPage: number;
    hasnextSelllistPage: boolean;
  };
}

const initialState: ChatStore = {
  unreadNum: {
    sell: 0,
    buy: 0
  },
  chatList: {
    chatBuyList: [],
    chatSellList: [],
    buyListCurrentPage: 0,
    sellListCurrentPage: 0,
    hasnextBuylistPage: true,
    hasnextSelllistPage: true
  },
  activeRoomId: []
};

// dynamic chatroom quantity
const maxRooms = Math.floor((window.innerWidth - 320 - 40) / (451 + 16));

export default (state = initialState, action: ChatAction): ChatStore => {
  switch (action.type) {
    case ChatActionTypes.SET_UNREAD_NUM: {
      return {
        ...state,
        unreadNum: action.num
      };
    }
    case ChatActionTypes.ADD_ACTIVE_ROOM_ID: {
      const { activeRoomId } = state,
        {
          item: { id }
        } = action;
      if (!id) return state;
      const exitItem = activeRoomId.find((d: RoomItem) => d.id === id);
      console.log('exitItem: ', exitItem);
      if (!!exitItem && _get(exitItem, ['status']) === 'min') {
        return {
          ...state,
          activeRoomId: state.activeRoomId.map((v: RoomItem) => {
            if (v.id === id) {
              return { ...v, status: 'common' };
            }
            return v;
          })
        };
      }

      if (!!exitItem && _get(exitItem, ['status']) === 'common') {
        return state;
      }

      if (!exitItem && activeRoomId.length >= maxRooms) {
        const nextActiveRoomId = activeRoomId.slice(1).concat({ id, status: 'common' });
        return {
          ...state,
          activeRoomId: nextActiveRoomId
        };
      }

      return {
        ...state,
        activeRoomId: activeRoomId.concat({ id, status: 'common' })
      };
    }

    case ChatActionTypes.DELETE_ACTIVE_ROOM_ID: {
      const { activeRoomId } = state;
      return {
        ...state,
        activeRoomId: activeRoomId.filter((d: RoomItem) => d.id !== action.id)
      };
    }

    case ChatActionTypes.UPDATE_ACTIVE_ROOM_ID: {
      const { activeRoomId } = state;
      const {
        item: { id, status }
      } = action;
      const targetIndex = activeRoomId.findIndex((v: RoomItem) => v.id === id);
      if (targetIndex < 0) return state;
      activeRoomId[targetIndex].status = status;
      return {
        ...state,
        activeRoomId: activeRoomId
      };
    }

    ...
};
```



2. 滚动到底 scroll({ top: 9999, behavior: 'smooth' }) img render 之后 dynamic height 最后一张图片加载完成之后 img onload 触发 scroll

3. send message with a generator hash id . When web socket receive message check message_id, and find the id in room message list turn it on finished.

1. 滚动穿透
2. 10 分钟后 message time
3. 图片上传成功之后 记得清空 input 的值
4. 聊天消息的气泡三角形
5. z-index stacking context。 元素中 z-index 层级较低的元素内部 即使有非常高的 z-index 也是相对于元素内的堆叠，不会影响父元素的层级堆叠