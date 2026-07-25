// ============================================================
// 战斗系统计算 - 命中/暴击/伤害公式（严格按需求固化）
// ============================================================
import type { CombatUnit, CombatLog, CombatBuff } from '@/types'
import { BASE_HIT_RATE, BASE_CRIT_RATE, CRIT_DAMAGE_MULTIPLIER, DAMAGE_VARIANCE } from '@/data/constants'
import { clamp } from './random'

// ==================== 命中判定 ====================

/**
 * 命中判定公式（固定不可修改）
 * 命中概率 = 50% + 自身命中率 - 敌方闪避值
 * 区间自动锁死 0%-100%
 */
export function calcHitChance(attacker: CombatUnit, defender: CombatUnit): number {
  const chance = BASE_HIT_RATE + attacker.attributes.accuracy - defender.attributes.dodge
  return clamp(chance, 0, 1)
}

export function rollHit(attacker: CombatUnit, defender: CombatUnit): boolean {
  return Math.random() < calcHitChance(attacker, defender)
}

// ==================== 暴击判定 ====================

/**
 * 暴击判定公式
 * 暴击概率 = 基础暴击率 + 自身暴击属性 - 敌方抗暴击属性
 * 区间锁死 0%-100%
 */
export function calcCritChance(attacker: CombatUnit, defender: CombatUnit): number {
  const chance = BASE_CRIT_RATE + attacker.attributes.critRate - defender.attributes.critResist
  return clamp(chance, 0, 1)
}

export function rollCrit(attacker: CombatUnit, defender: CombatUnit): boolean {
  return Math.random() < calcCritChance(attacker, defender)
}

// ==================== 伤害计算 ====================

/**
 * 计算基础伤害（考虑浮动 ±10%）
 */
export function calcBaseDamage(attacker: CombatUnit): number {
  const baseAtk = attacker.attributes.attack
  // 获取攻击增益buff
  const atkBuff = attacker.buffs
    .filter(b => b.type === 'attack')
    .reduce((sum, b) => sum + b.value, 0)
  const rawDamage = baseAtk * (1 + atkBuff)
  // 浮动 ±10%
  const variance = 1 - DAMAGE_VARIANCE + Math.random() * DAMAGE_VARIANCE * 2
  return Math.floor(rawDamage * variance)
}

/**
 * 计算最终伤害（考虑防御减伤）
 * 防御减伤公式：减伤率 = 防御 / (防御 + 500)
 */
export function calcFinalDamage(rawDamage: number, defender: CombatUnit): number {
  const defBuff = defender.buffs
    .filter(b => b.type === 'defense')
    .reduce((sum, b) => sum + b.value, 0)
  const effectiveDef = defender.attributes.defense * (1 + defBuff)
  const reduction = effectiveDef / (effectiveDef + 500)
  return Math.max(1, Math.floor(rawDamage * (1 - reduction)))
}

// ==================== 战斗行动执行 ====================

export interface ActionResult {
  log: CombatLog
  damageDealt: number
  isCrit: boolean
  isHit: boolean
  targetDefeated: boolean
}

/**
 * 执行一次攻击行动（战斗逻辑优先级：命中→暴击→伤害→扣血）
 */
export function executeAttack(
  attacker: CombatUnit,
  defender: CombatUnit,
  skillPower: number = 1.0,
  skillName: string = '普通攻击',
  round: number
): ActionResult {
  // 第一步：判定命中
  const isHit = rollHit(attacker, defender)

  if (!isHit) {
    return {
      log: {
        round,
        message: `【${attacker.name}】的攻击未能命中【${defender.name}】！`,
        type: 'miss',
      },
      damageDealt: 0,
      isCrit: false,
      isHit: false,
      targetDefeated: false,
    }
  }

  // 第二步：命中后判定暴击
  const isCrit = rollCrit(attacker, defender)

  // 第三步：计算最终伤害
  let baseDamage = calcBaseDamage(attacker) * skillPower
  if (isCrit) {
    baseDamage = Math.floor(baseDamage * CRIT_DAMAGE_MULTIPLIER)
  }
  const finalDamage = calcFinalDamage(baseDamage, defender)

  // 第四步：扣除生命值
  defender.attributes.currentHp = Math.max(0, defender.attributes.currentHp - finalDamage)

  const targetDefeated = defender.attributes.currentHp <= 0

  return {
    log: {
      round,
      message: isCrit
        ? `【${attacker.name}】使用${skillName}对【${defender.name}】造成暴击！-${finalDamage} 点伤害！`
        : `【${attacker.name}】使用${skillName}对【${defender.name}】造成 ${finalDamage} 点伤害`,
      type: isCrit ? 'crit' : 'normal',
    },
    damageDealt: finalDamage,
    isCrit,
    isHit: true,
    targetDefeated,
  }
}

// ==================== Buff管理 ====================

/**
 * 给单位添加Buff
 */
export function addBuff(unit: CombatUnit, buff: CombatBuff): void {
  const existing = unit.buffs.find(b => b.id === buff.id)
  if (existing) {
    existing.remainingTurns = buff.remainingTurns // 刷新持续时间
  } else {
    unit.buffs.push({ ...buff })
  }
}

/**
 * 回合结束时减少Buff持续回合，移除过期Buff
 */
export function tickBuffs(unit: CombatUnit): CombatBuff[] {
  const expired: CombatBuff[] = []
  unit.buffs = unit.buffs.filter(b => {
    b.remainingTurns--
    if (b.remainingTurns <= 0) {
      expired.push(b)
      return false
    }
    return true
  })
  return expired
}

/**
 * DOT伤害结算
 */
export function tickDots(unit: CombatUnit, round: number): CombatLog[] {
  const logs: CombatLog[] = []
  const dots = unit.buffs.filter(b => b.type === 'dot')
  for (const dot of dots) {
    unit.attributes.currentHp = Math.max(0, unit.attributes.currentHp - dot.value)
    logs.push({
      round,
      message: `【${unit.name}】受到持续伤害 -${dot.value} 点`,
      type: 'system',
    })
  }
  return logs
}

// ==================== 战力计算 ====================

/**
 * 计算综合战力（用于战力对比展示）
 */
export function calcCombatPower(unit: CombatUnit): number {
  const s = unit.attributes
  return Math.floor(
    s.attack * 10 +
    s.defense * 8 +
    s.maxHp * 2 +
    s.critRate * 1000 +
    s.dodge * 800 +
    s.accuracy * 800 +
    s.speed * 5
  )
}
