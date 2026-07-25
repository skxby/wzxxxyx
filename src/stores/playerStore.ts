// ============================================================
// 玩家核心状态管理
// ============================================================
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Player, Gender, CultivationType, SpiritRoot, PlayerAttributes, RealmLevel } from '@/types'
import { INITIAL_ATTRIBUTES, SPIRIT_ROOT_POOL, SINGLE_ROOT_CHANCE } from '@/data/constants'
import { getRealmById } from '@/data/realms'
import { getInitialSkill, skills } from '@/data/skills'
import { randomPick, randomPickN, rollProbability } from '@/utils/random'
import { calcCultivationSpeed, addCultivation, attemptBreakthrough, getCultivationProgress } from '@/utils/cultivation'
import { saveGame, createNewSave, loadGame, deleteSave, hasSave } from '@/utils/save'

export const usePlayerStore = defineStore('player', () => {
  // ==================== 状态 ====================
  const player = ref<Player | null>(null)
  const cultivationInterval = ref<ReturnType<typeof setInterval> | null>(null)
  const isCreated = computed(() => player.value !== null)

  // ==================== 角色创建 ====================

  /** 随机觉醒灵根 */
  function awakenSpiritRoots(): SpiritRoot[] {
    const isSingle = rollProbability(SINGLE_ROOT_CHANCE)
    if (isSingle) {
      // 单灵根：7种均等概率
      return [randomPick([...SPIRIT_ROOT_POOL])!]
    } else {
      // 双灵根：随机2种，不重复
      return randomPickN([...SPIRIT_ROOT_POOL], 2)
    }
  }

  /** 创建角色 */
  function createPlayer(
    name: string,
    gender: Gender,
    cultivationType: CultivationType
  ): Player {
    const spiritRoots = awakenSpiritRoots()

    const attributes: PlayerAttributes = { ...INITIAL_ATTRIBUTES }

    // 修炼方向专属初始属性
    switch (cultivationType) {
      case 'sword':
        attributes.attack += 5
        attributes.defense += 2
        attributes.critRate += 0.03
        break
      case 'spirit':
        attributes.attack += 2
        attributes.defense += 3
        attributes.dodge += 0.02
        attributes.accuracy += 0.03
        break
      case 'demon':
        attributes.attack += 8
        attributes.defense += 1
        attributes.critRate += 0.05
        attributes.maxHp -= 10
        attributes.currentHp -= 10
        break
    }

    // 灵根属性加成
    for (const root of spiritRoots) {
      switch (root) {
        case 'gold': attributes.attack += 3; break
        case 'wood': attributes.maxHp += 20; attributes.currentHp += 20; break
        case 'water': attributes.defense += 3; break
        case 'fire': attributes.critRate += 0.02; break
        case 'earth': attributes.defense += 2; attributes.maxHp += 10; attributes.currentHp += 10; break
        case 'wind': attributes.speed += 3; attributes.dodge += 0.03; break
        case 'thunder': attributes.attack += 2; attributes.critRate += 0.03; break
      }
    }

    const newPlayer: Player = {
      name,
      gender,
      cultivationType,
      spiritRoots,
      attributes,
      equipment: { weapon: null, armor: null, accessory: null },
      skills: [],
      inventory: [],
      unlockedSkills: [],
      defeatedUniqueItems: [],
    }

    // 赋予初始技能
    const initialSkill = getInitialSkill(cultivationType)
    newPlayer.skills.push({ skillId: initialSkill.id, level: 1, isActive: true })
    newPlayer.unlockedSkills.push(initialSkill.id)

    player.value = newPlayer
    saveCurrentGame()
    return newPlayer
  }

  /** 重置灵根 */
  function resetSpiritRoots(): void {
    if (!player.value) return

    // 重新选择修炼方向时保留（也可以让玩家重选）
    const newRoots = awakenSpiritRoots()
    player.value.spiritRoots = newRoots

    // 修为境界清零
    player.value.attributes.cultivation = 0
    player.value.attributes.currentRealm = 'mortal'
    // 重置属性到初始值
    Object.assign(player.value.attributes, INITIAL_ATTRIBUTES)
    // 重新计算灵根加成
    for (const root of newRoots) {
      switch (root) {
        case 'gold': player.value.attributes.attack += 3; break
        case 'wood': player.value.attributes.maxHp += 20; player.value.attributes.currentHp = player.value.attributes.maxHp; break
        case 'water': player.value.attributes.defense += 3; break
        case 'fire': player.value.attributes.critRate += 0.02; break
        case 'earth': player.value.attributes.defense += 2; player.value.attributes.maxHp += 10; player.value.attributes.currentHp = player.value.attributes.maxHp; break
        case 'wind': player.value.attributes.speed += 3; player.value.attributes.dodge += 0.03; break
        case 'thunder': player.value.attributes.attack += 2; player.value.attributes.critRate += 0.03; break
      }
    }

    saveCurrentGame()
  }

  /** 全局重置 */
  function globalReset(): void {
    stopCultivation()
    player.value = null
    deleteSave()
  }

  // ==================== 修炼 ====================

  /** 开始自动修炼（每秒增加修为） */
  function startCultivation(): void {
    if (cultivationInterval.value) return
    cultivationInterval.value = setInterval(() => {
      if (!player.value) return
      const speed = calcCultivationSpeed(player.value)
      player.value.attributes.cultivation += speed
      // 自动保存
      saveCurrentGame()
    }, 1000)
  }

  /** 停止自动修炼 */
  function stopCultivation(): void {
    if (cultivationInterval.value) {
      clearInterval(cultivationInterval.value)
      cultivationInterval.value = null
    }
  }

  /** 尝试突破境界 */
  function breakthrough(): ReturnType<typeof attemptBreakthrough> {
    if (!player.value) throw new Error('玩家数据不存在')
    const result = attemptBreakthrough(player.value)
    saveCurrentGame()
    return result
  }

  /** 获取修为进度 */
  function cultivationProgress() {
    if (!player.value) return { current: 0, required: 0, percent: 0 }
    return getCultivationProgress(player.value)
  }

  // ==================== 属性相关 ====================

  /** 获取当前境界信息 */
  function currentRealmInfo() {
    if (!player.value) return null
    return getRealmById(player.value.attributes.currentRealm)
  }

  /** 计算总攻击力（基础+装备+技能被动加成） */
  const totalAttack = computed(() => {
    if (!player.value) return 0
    let atk = player.value.attributes.attack

    // 装备加成
    if (player.value.equipment.weapon?.stats.attack) atk += player.value.equipment.weapon.stats.attack
    if (player.value.equipment.accessory?.stats.attack) atk += player.value.equipment.accessory.stats.attack

    // 被动技能加成
    for (const ps of player.value.skills) {
      const skill = skills.find((s) => s.id === ps.skillId)
      if (skill?.type === 'passive') {
        const atkEffect = skill.effects.find((e) => e.type === 'passive_stat')
        if (atkEffect) atk += atkEffect.value
      }
    }

    return Math.floor(atk)
  })

  // ==================== 存档 ====================

  function saveCurrentGame(): boolean {
    if (!player.value) return false
    return saveGame(createNewSave(player.value))
  }

  function loadGameData(): boolean {
    const data = loadGame()
    if (!data) return false
    player.value = data.player
    return true
  }

  function hasExistingSave(): boolean {
    return hasSave()
  }

  return {
    player,
    isCreated,
    totalAttack,
    createPlayer,
    resetSpiritRoots,
    globalReset,
    startCultivation,
    stopCultivation,
    breakthrough,
    cultivationProgress,
    currentRealmInfo,
    saveCurrentGame,
    loadGameData,
    hasExistingSave,
  }
})
