---
name: game-combat
description: Use when working on the combat system - designing combat mechanics, implementing battle logic, balancing damage formulas, or creating enemy AI.
---

# 战斗系统 Skill

当用户需要开发或修改战斗系统时使用。

## 战斗流程

```
1. 战斗初始化 → 2. 回合开始 → 3. 选择行动 → 4. 执行行动 → 5. 回合结束 → 回到2
                                                                          ↓
                                                                    战斗结束
```

## 核心公式

### 伤害计算
```typescript
// 基础伤害
function calcBaseDamage(attacker: CombatUnit): number {
  const baseAtk = attacker.stats.attack * (1 + attacker.buffs.attackBonus)
  const variance = 0.9 + Math.random() * 0.2  // 90%-110% 浮动
  return Math.floor(baseAtk * variance)
}

// 实际伤害（考虑防御）
function calcActualDamage(rawDamage: number, defender: CombatUnit): number {
  const defense = defender.stats.defense * (1 + defender.buffs.defenseBonus)
  const reduction = defense / (defense + 500)  // 防御减伤曲线
  const finalDamage = Math.max(1, Math.floor(rawDamage * (1 - reduction)))
  return finalDamage
}

// 暴击判定
function calcCrit(damage: number, attacker: CombatUnit): { damage: number, isCrit: boolean } {
  const critRate = Math.min(0.75, attacker.stats.critRate)
  const isCrit = Math.random() < critRate
  return {
    damage: isCrit ? Math.floor(damage * (1.5 + attacker.stats.critDamage)) : damage,
    isCrit
  }
}
```

### 战斗顺序
```typescript
function determineTurnOrder(units: CombatUnit[]): CombatUnit[] {
  return [...units].sort((a, b) => b.stats.speed - a.stats.speed)
}
```

### 命中/闪避
```typescript
function calcHitCheck(attacker: CombatUnit, defender: CombatUnit): boolean {
  const hitRate = Math.min(0.95, 0.85 + attacker.stats.accuracy * 0.01)
  const dodgeRate = Math.min(0.5, defender.stats.dodge * 0.008)
  return Math.random() < (hitRate - dodgeRate)
}
```

## 战斗状态机
```typescript
type CombatPhase = 
  | 'init'           // 初始化
  | 'player_turn'    // 玩家回合
  | 'player_action'  // 玩家行动中
  | 'enemy_turn'     // 敌人回合
  | 'enemy_action'   // 敌人行动中
  | 'round_end'      // 回合结束
  | 'victory'        // 胜利结算
  | 'defeat'         // 失败
  | 'fled'           // 逃跑
```

## UI 表现
- 战斗日志：用 `n-scrollbar` 包裹，显示每回合行动记录
- 血量条：`n-progress` 配合颜色变化（绿→黄→红）
- 技能按钮：`n-button` 显示技能名+冷却状态
- 伤害数字动画：CSS transition 实现飘字效果
- 战斗背景：根据场景切换古风背景

## 战斗日志格式
```
[修炼者] 使用 [功法名] 对 [敌人名] 造成了 X 点伤害！
[修炼者] 使用 [丹药名] 恢复了 X 点生命值。
[敌人名] 发动 [技能名]，[修炼者] 闪避了攻击！
[修炼者] 击败了 [敌人名]，获得 X 修为和 X 灵石！
```
