---
name: game-design
description: Use when designing a new game system, mechanics, or feature for the cultivation game. Provides a structured design template covering system overview, data models, UI wireframe description, and integration points.
---

# 修仙游戏系统设计 Skill

当用户需要设计新的游戏系统（如修炼、战斗、炼丹、宗门等）时，遵循以下流程：

## 设计步骤

### 1. 需求分析
- 明确系统要解决的核心玩法
- 列出系统的输入（玩家操作）和输出（玩家获得）
- 确定与其他系统的交互点

### 2. 数值设计
- 确定关键数值和公式（如伤害公式、修炼速度公式）
- 设计成长曲线（线性/指数/对数）
- 平衡性考虑（避免数值膨胀）

### 3. 数据模型
在 `src/types/index.ts` 中定义类型接口，格式参考：

```typescript
// 示例：境界系统
export interface Realm {
  id: string
  name: string           // 中文名称
  level: number          // 等级排序
  subLevels: number      // 子层级数（如炼气1-9层）
  requiredExp: number    // 所需修为
  breakthroughRate: number // 突破基础成功率(0-1)
  bonuses: {             // 突破后加成
    hp: number
    mp: number
    attack: number
    defense: number
  }
  description: string    // 描述文字
}
```

### 4. 数据配置
在 `src/data/` 下创建配置文件，所有数值外置：

```typescript
// src/data/realms.ts
export const realms: Realm[] = [
  {
    id: 'qi_refining',
    name: '炼气期',
    level: 1,
    subLevels: 9,
    requiredExp: 100,
    breakthroughRate: 0.9,
    bonuses: { hp: 100, mp: 50, attack: 10, defense: 5 },
    description: '初入修仙之门，感应天地灵气'
  },
  // ...
]
```

### 5. 系统逻辑
在 `src/systems/` 下实现纯逻辑函数（不依赖UI）：

```typescript
// src/systems/cultivation.ts
export function gainExperience(player: Player, amount: number): Player {
  // 纯函数，返回新状态
}
export function attemptBreakthrough(player: Player): BreakthroughResult {
  // 计算突破结果
}
```

### 6. 状态管理
在 `src/stores/` 下创建 Pinia Store：

```typescript
// stores/playerStore.ts
export const usePlayerStore = defineStore('player', () => {
  const player = ref<Player>(createDefaultPlayer())
  // actions...
  return { player, cultivate, breakthrough, ... }
})
```

### 7. UI 组件
在 `src/components/` 下创建 Vue 组件，遵循单文件组件模式：
- `<script setup lang="ts">` - 逻辑
- `<template>` - 视图
- `<style scoped>` - 样式
- 使用 Naive UI 组件库
- 面板类型组件放在 `panels/` 下

## 设计检查清单
- [ ] 数值是否可配置
- [ ] 是否支持存档恢复
- [ ] 是否有离线收益计算
- [ ] UI 是否适配移动端
- [ ] 是否有足够的文字叙事氛围
- [ ] 是否与现有系统有合理的关联
