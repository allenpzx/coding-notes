# basic-layout review

basic layout 基础布局的回顾

构成: `Header` + `Main(...)` + `Footer`, 需要引入 layout 页面内容放到 main 里面传入即可

```jsx
<BasicLayout>{children}</BasicLayout>
```

1. 三个基础组件的左右间距 `$margin: calc((100% - 1200px) * 0.5);`
2. main 需要设置 min-height 防止内容高度不足 footer 上移, min-height: 100vh - header.height - footer.height
3. 最外层容器不要设置 height: 100%; safari 不会自动撑起高度
4. 防止横向滚动条

```scss
:global {
  html,
  body {
    overflow-x: hidden;
  }
}
```

5. 修改滚动条样式css即可, 浏览器兼容性可以到 [Can I Use](https://caniuse.com) 查看, 想真正兼容所有场景可以用修改scrollbar的libary, 我们使用场景仅仅兼容chrome即可, 所以用css兼容即可
chrome 如下
```scss
:global {
  html,
  body {
    ::-webkit-scrollbar { // 滚动条容器
      width: 6px;
      height: 6px;
    }

    ::-webkit-scrollbar-track { //滚动条轨道
      border-radius: 3px;
      // background: rgba(0, 0, 0, 0.06);
      background: yellow;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
    }

    ::-webkit-scrollbar-thumb { // 滚动条小块
      border-radius: 3px;
      // background: rgba(0, 0, 0, 0.12);
      background: red;
      -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
    }

    ::-webkit-horizontal {
      display: none;
    }
  }
}
```
更多参数
```scss
//滚动条组成部分

::-webkit-scrollbar
//滚动条整体部分

::-webkit-scrollbar-thumb
// 滚动条里面的小方块，能向上向下移动（或向左向右移动）

::-webkit-scrollbar-track
// 滚动条的轨道（里面装有Thumb）

::-webkit-scrollbar-button
// 滚动条的轨道的两端按钮，由于通过点击微调小方块的位置。

::-webkit-scrollbar-track-piece
// 内层轨道，滚动条中间部分

::-webkit-scrollbar-corner
// 边角，即垂直滚动条和水平滚动条相交的地方

::-webkit-resizer
// 两个滚动条的交汇处上用于拖动调整元素大小的小控件

// 其他设置项：

:horizontal  
//horizontal伪类适用于任何水平方向上的滚动条  
  
:vertical  
//vertical伪类适用于任何垂直方向的滚动条  
  
:decrement  
//decrement伪类适用于按钮和轨道碎片。表示递减的按钮或轨道碎片，例如可以使区域向上或者向右移动的区域和按钮  
  
:increment  
//increment伪类适用于按钮和轨道碎片。表示递增的按钮或轨道碎片，例如可以使区域向下或者向左移动的区域和按钮  
  
:start  
//start伪类适用于按钮和轨道碎片。表示对象（按钮 轨道碎片）是否放在滑块的前面  
  
:end  
//end伪类适用于按钮和轨道碎片。表示对象（按钮 轨道碎片）是否放在滑块的后面  
  
:double-button  
//double-button伪类适用于按钮和轨道碎片。判断轨道结束的位置是否是一对按钮。也就是轨道碎片紧挨着一对在一起的按钮。  
  
:single-button  
//single-button伪类适用于按钮和轨道碎片。判断轨道结束的位置是否是一个按钮。也就是轨道碎片紧挨着一个单独的按钮。  
  
:no-button  
// no-button伪类表示轨道结束的位置没有按钮。  
  
:corner-present  
//corner-present伪类表示滚动条的角落是否存在。  
  
:window-inactive  
//适用于所有滚动条，表示包含滚动条的区域，焦点不在该窗口的时候。  
  
::-webkit-scrollbar-track-piece:start {  
/*滚动条上半边或左半边*/  
}  
  
::-webkit-scrollbar-thumb:window-inactive {  
/*当焦点不在当前区域滑块的状态*/  
}  
  
::-webkit-scrollbar-button:horizontal:decrement:hover {  
/*当鼠标在水平滚动条下面的按钮上的状态*/  
}  
```

IE 如下
```scss
.scrollBar{
    scrollbar-arrow-color: color; /三角箭头的颜色/
    scrollbar-face-color: color; /立体滚动条的颜色（包括箭头部分的背景色）/
    scrollbar-3dlight-color: color; /立体滚动条亮边的颜色/
    scrollbar-highlight-color: color; /滚动条的高亮颜色（左阴影？）/
    scrollbar-shadow-color: color; /立体滚动条阴影的颜色/
    scrollbar-darkshadow-color: color; /立体滚动条外阴影的颜色/
    scrollbar-track-color: color; /立体滚动条背景颜色/
    scrollbar-base-color:color; /滚动条的基色/
}
```

6. Header 里面主menu和子menu的highlight. 样式部分不必多说, 主要是路由的匹配上分业务路由和内在路由

   业务路由是产品或者运营希望展现给用户看的, 同样的页面同样的组件，可能会经常变化

   内在路由是不变的，一直用key来取到真正的路由，如果匹配到则高亮
```typescript
export enum path {
  Index = '/',
  Login = '/login',
  Home = '/home',
  BuyMarket = '/trade/buy/market/list',
  BuyCarDetail = '/trade/buy/market/cardetail',
  SellMarket = '/trade/sell/market/list',
  SellCarDetail = '/trade/sell/market/cardetail',
  NotFound = '/404'
}

export interface RouteTemplate {
  path: string;
  component: any;
  auth: boolean;
  title?: string;
}

const routes: RouteTemplate[] = [
  {
    path: path.Index, // 默认路由
    component: BuyMarket,
    auth: false,
    title: 'Market list'
  },
  {
    path: path.Login,
    component: Login,
    auth: false
  },
  {
    path: path.Home,
    component: Home,
    auth: true
  },
  {
    path: path.BuyMarket,
    component: BuyMarket,
    auth: true,
    title: 'Market list'
  },
  {
    path: `${path.BuyCarDetail}/:id`,
    component: CarDetail,
    auth: true,
    title: 'Car Detail'
  },
  {
    path: '/404',
    component: Error,
    auth: false
  }
];

export const defaultRoute: string = path.BuyMarket;

export default routes;
```