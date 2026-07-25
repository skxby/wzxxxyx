// ============================================================
// 掉落系统 - 稀有度/概率/唯一物品管理
// ============================================================
import type { DropEntry, Rarity, GameItem, Enemy, InventoryItem } from '@/types'
import { RARITY_DROP_RATES } from '@/data/constants'
import { items } from '@/data/items'
import { rollProbability, randomPick, weightedRandom } from './random'

/**
 * 根据稀有度获取掉落概率
 */
export function getRarityDropRate(rarity: Rarity): number {
  return RARITY_DROP_RATES[rarity] || 0.1
}

/**
 * 判定稀有度是否掉落
 */
export function rollRarityDrop(rarity: Rarity): boolean {
  return rollProbability(getRarityDropRate(rarity))
}

/**
 * 判定单个掉落条目
 */
export function rollDrop(drop: DropEntry): boolean {
  return rollProbability(drop.probability)
}

/**
 * 处理敌人的全部掉落
 * @param enemy 敌人数据
 * @param defeatedUniqueItems 已获得的唯一物品ID列表
 * @returns 掉落的物品列表
 */
export function processEnemyDrops(
  enemy: Enemy,
  defeatedUniqueItems: string[]
): GameItem[] {
  const drops: GameItem[] = []

  for (const drop of enemy.drops) {
    // 唯一物品检查：如果已获得，跳过
    if (drop.rarity === 'unique' && defeatedUniqueItems.includes(drop.itemId)) {
      continue
    }

    if (rollDrop(drop)) {
      const item = items.find(i => i.id === drop.itemId)
      if (item) {
        drops.push(item)
      }
    }
  }

  return drops
}

/**
 * 生成随机掉落（用于随机事件）
 * @param minRarity 最低稀有度
 * @param maxRarity 最高稀有度
 * @param defeatedUniqueItems 已获得的唯一物品ID列表
 */
export function generateRandomDrop(
  minRarity: Rarity = 'white',
  maxRarity: Rarity = 'gold',
  defeatedUniqueItems: string[] = []
): GameItem | null {
  const rarityOrder = ['white', 'green', 'blue', 'purple', 'gold', 'unique'] as Rarity[]
  const minIdx = rarityOrder.indexOf(minRarity)
  const maxIdx = rarityOrder.indexOf(maxRarity)
  const availableRarities = rarityOrder.slice(minIdx, maxIdx + 1)

  // 根据稀有度权重随机选择稀有度
  const selectedRarity = weightedRandom(availableRarities, r => RARITY_DROP_RATES[r] || 0)
  if (!selectedRarity) return null

  // 根据稀有度筛选物品池
  const pool = items.filter(i => {
    if (i.rarity !== selectedRarity) return false
    // 唯一物品检查
    if (i.rarity === 'unique' && defeatedUniqueItems.includes(i.id)) return false
    return true
  })

  if (pool.length === 0) return null

  return randomPick(pool)
}

/**
 * 创建背包物品条目
 */
export function createInventoryItem(item: GameItem): InventoryItem {
  return {
    uid: `${item.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    itemId: item.id,
    quantity: 1,
    isEquipped: false,
  }
}

/**
 * 根据物品ID获取物品
 */
export function getItemById(id: string): GameItem | undefined {
  return items.find(i => i.id === id)
}
