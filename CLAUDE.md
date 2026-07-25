# 文字修仙游戏 - 项目开发指南

## 项目概述
一款纯前端文字修仙放置类网页游戏。玩家扮演修仙者，通过修炼、战斗、炼丹、探索等方式不断提升境界，最终飞升成仙。

## 技术栈
- **框架**: Vue 3 (Composition API) + TypeScript
- **构建工具**: Vite 5
- **状态管理**: Pinia
- **UI 框架**: Naive UI（对中文生态友好，组件丰富）
- **数据存储**: localStorage（单机版），预留后端接口
- **包管理**: pnpm（优先）或 npm

## 目录结构
```
文字修仙游戏/
├── public/                    # 静态资源
├── src/
│   ├── components/            # Vue 组件
│   │   ├── layout/           # 布局组件
│   │   ├── panels/           # 功能面板
│   │   ├── common/           # 通用组件
│   │   └── game/             # 游戏核心UI
│   ├── stores/               # Pinia 状态管理
│   │   ├── playerStore.ts    # 玩家状态
│   │   ├── gameStore.ts      # 游戏全局状态
│   │   ├── combatStore.ts    # 战斗状态
│   │   ├── inventoryStore.ts # 背包状态
│   │   └── eventStore.ts     # 事件/奇遇
│   ├── data/                 # 游戏数据配置
│   │   ├── realms.ts         # 境界数据
│   │   ├── skills.ts         # 功法技能
│   │   ├── items.ts          # 物品装备
│   │   ├── enemies.ts        # 敌人/Boss
│   │   ├── events.ts         # 随机事件
│   │   └── maps.ts           # 地图/副本
│   ├── systems/              # 游戏系统逻辑
│   │   ├── cultivation.ts    # 修炼系统
│   │   ├── combat.ts         # 战斗系统
│   │   ├── alchemy.ts        # 炼丹系统
│   │   ├── equipment.ts      # 装备系统
│   │   └── breakthrough.ts   # 突破系统
│   ├── utils/                # 工具函数
│   │   ├── random.ts         # 随机数/概率
│   │   ├── save.ts           # 存档管理
│   │   ├── format.ts         # 格式化工具
│   │   └── damage.ts         # 伤害计算
│   ├── types/                # TypeScript 类型定义
│   │   └── index.ts          # 所有类型
│   ├── composables/          # Vue Composables
│   │   ├── useTimer.ts       # 游戏计时器
│   │   ├── useGameLoop.ts    # 游戏主循环
│   │   └── useNotification.ts # 消息通知
│   ├── App.vue               # 根组件
│   ├── main.ts               # 入口文件
│   └── style.css             # 全局样式
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── CLAUDE.md
```

## 核心系统设计

### 1. 修炼系统 (Cultivation)
- **境界体系**（从低到高）:
  凡人 → 炼气期(1-9层) → 筑基期 → 金丹期 → 元婴期 → 化神期 → 炼虚期 → 合体期 → 大乘期 → 渡劫期 → 飞升
- **修炼进度**: 通过吸收灵气增长修为，速度受灵根、功法、丹药加成影响
- **突破机制**: 达到境界巅峰后可尝试突破，成功率受多种因素影响，失败可能降级或受伤
- **离线收益**: 关闭页面后持续计算修炼收益，再次打开时结算

### 2. 属性系统 (Attributes)
- **基础属性**: 生命(HP)、真气(MP)、攻击、防御、速度
- **修仙属性**: 根骨、悟性、神识、道心、气运
- **资源**: 灵石（货币）、修为、功德

### 3. 战斗系统 (Combat)
- **回合制战斗**: 类似传统RPG的回合制
- **战力计算**: 综合攻击、防御、生命、技能等计算战斗力
- **功法技能**: 可装备多种功法，战斗中可选择释放
- **法宝系统**: 特殊装备，战斗中提供被动或主动效果

### 4. 物品系统 (Inventory)
- **装备**: 武器、防具、饰品等
- **丹药**: 恢复类、增益类、突破类
- **材料**: 炼丹材料、炼器材料
- **功法书**: 学习新功法
- **品质等级**: 凡品→中品→上品→极品→仙品→神品

### 5. 历练系统 (Exploration)
- **副本战斗**: 不同等级副本，产出经验和材料
- **随机奇遇**: 概率触发特殊事件
- **秘境探索**: 限时高难度挑战

### 6. 成就与任务
- **主线任务**: 引导游戏进程
- **支线任务**: 额外奖励
- **成就系统**: 里程碑奖励

## 开发原则
- 数据驱动：游戏数据与逻辑分离，配置化所有数值
- 组件化：每个游戏系统对应独立组件
- 可扩展：预留多人/后端接口
- 用户体验：流畅的动画过渡，清晰的信息展示
- 存档安全：多槽位存档 + 自动保存 + 数据导出导入

## 参考资源
- [vue-XiuXianGame](https://github.com/setube/vue-XiuXianGame) - Vue.js 修仙游戏
- [Immortal_Cultivation](https://github.com/YangHeng66/Immortal_Cultivation) - Vue3+TS 修仙游戏
- [修仙世界MUD](https://github.com/xiuxianxiuxianxiuxian/diershij) - Go 微服务修仙世界
- [仙途](https://github.com/qianye60/XianTu) - AI 驱动修仙游戏
