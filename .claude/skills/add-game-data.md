---
name: add-game-data
description: Use when adding or modifying game data (realms, skills, items, enemies, events, maps). Ensures consistent data schema, balance, and proper file organization.
---

# 游戏数据添加 Skill

当用户需要添加新物品、新功法、新敌人、新境界等游戏数据时使用。

## 通用规范

### 文件位置
| 数据类型 | 文件路径 |
|---------|---------|
| 境界 | `src/data/realms.ts` |
| 功法技能 | `src/data/skills.ts` |
| 物品装备 | `src/data/items.ts` |
| 丹药 | `src/data/items.ts`（统一物品系统） |
| 敌人/Boss | `src/data/enemies.ts` |
| 随机事件 | `src/data/events.ts` |
| 地图/副本 | `src/data/maps.ts` |
| 成就 | `src/data/achievements.ts` |

### 数据条目模板

#### 物品
```typescript
export interface Item {
  id: string           // 唯一标识，小写+下划线
  name: string         // 中文名称
  type: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material' | 'skill_book' | 'treasure'
  quality: 'mortal' | 'mid' | 'high' | 'supreme' | 'immortal' | 'divine'
  level: number        // 使用等级要求
  description: string  // 古风描述（1-2句）
  stats?: {            // 装备属性（非装备物品省略）
    attack?: number
    defense?: number
    hp?: number
    mp?: number
    speed?: number
  }
  effects?: Effect[]   // 特殊效果
  price: number        // 灵石价格
  stackable: boolean   // 是否可堆叠
  maxStack?: number    // 最大堆叠数
}
```

#### 功法
```typescript
export interface Skill {
  id: string
  name: string
  quality: 'mortal' | 'mid' | 'high' | 'supreme' | 'immortal' | 'divine'
  type: 'attack' | 'defense' | 'support' | 'cultivation' | 'passive'
  level: number
  description: string
  mpCost: number
  cooldown: number     // 冷却回合数
  power: number        // 威力系数
  effects: Effect[]
  learnRequirement: {  // 学习条件
    realmLevel: number
    intelligence: number
  }
}
```

#### 敌人
```typescript
export interface Enemy {
  id: string
  name: string
  realmLevel: number   // 对应境界等级
  stats: {
    hp: number
    attack: number
    defense: number
    speed: number
  }
  skills: string[]     // 技能ID列表
  drops: DropEntry[]   // 掉落列表
  expReward: number
  stoneReward: number  // 灵石奖励
  description: string
}
```

### 数值平衡原则
- 境界每升一级，属性提升约 1.5-2 倍
- 同境界敌人战力约为玩家的 0.8-1.2 倍
- Boss 战力约为玩家的 1.5-3 倍
- 丹药效果不应超过基础属性的 30%
- 极品以上物品掉落率不超过 5%

### 添加流程
1. 先在 `src/types/index.ts` 中确认/添加类型
2. 在对应的 `src/data/` 文件中按格式添加数据
3. 确保 `id` 唯一不重复
4. 添加中文描述，保持古风文风
5. 标注数据来源或参考（如果是参考其他作品）
