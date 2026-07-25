// ============================================================
// 制作系统状态管理（炼丹/炼器/阵法）
// ============================================================
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { recipes, type CraftRecipe } from '@/data/recipes'
import { items as gameItems } from '@/data/items'
import { usePlayerStore } from './playerStore'
import { useInventoryStore } from './inventoryStore'
import { rollProbability } from '@/utils/random'

export const useCraftStore = defineStore('craft', () => {
  const craftType = ref<'alchemy' | 'forging' | 'formation'>('alchemy')
  const isCrafting = ref(false)
  const craftResult = ref('')
  const craftTimer = ref<ReturnType<typeof setTimeout> | null>(null)

  // 获取当前可制作配方
  const availableRecipes = computed(() => {
    const playerStore = usePlayerStore()
    const p = playerStore.player
    if (!p) return []
    const realmInfo = playerStore.currentRealmInfo()
    const realmLevel = realmInfo?.level || 0

    return recipes.filter(r =>
      r.type === craftType.value &&
      r.minRealmLevel <= realmLevel
    )
  })

  /** 检查材料是否足够 */
  function hasMaterials(recipe: CraftRecipe): boolean {
    const inventoryStore = useInventoryStore()
    for (const [itemId, qty] of recipe.materials) {
      const owned = inventoryStore.inventory
        .filter(i => i.itemId === itemId)
        .reduce((sum, i) => sum + i.quantity, 0)
      if (owned < qty) return false
    }
    return true
  }

  /** 消耗材料 */
  function consumeMaterials(recipe: CraftRecipe): boolean {
    const inventoryStore = useInventoryStore()
    for (const [itemId, qty] of recipe.materials) {
      let remaining = qty
      const entries = inventoryStore.inventory.filter(i => i.itemId === itemId)
      for (const entry of entries) {
        if (remaining <= 0) break
        const consume = Math.min(remaining, entry.quantity)
        inventoryStore.removeItem(entry.uid, consume)
        remaining -= consume
      }
      if (remaining > 0) return false
    }
    return true
  }

  /** 开始制作 */
  function startCraft(recipe: CraftRecipe): string {
    if (isCrafting.value) return '正在制作中，请等待...'

    const playerStore = usePlayerStore()
    const inventoryStore = useInventoryStore()
    const p = playerStore.player
    if (!p) return '玩家数据不存在'

    // 检查灵石
    if (p.attributes.spiritStones < recipe.stoneCost) {
      return `灵石不足！需要 ${recipe.stoneCost} 灵石`
    }

    // 检查材料
    if (!hasMaterials(recipe)) {
      const matList = recipe.materials.map(([id, q]) => {
        const item = gameItems.find(i => i.id === id)
        return `${item?.name || id} x${q}`
      }).join('、')
      return `材料不足！需要：${matList}`
    }

    // 消耗灵石和材料
    p.attributes.spiritStones -= recipe.stoneCost
    consumeMaterials(recipe)

    isCrafting.value = true
    craftResult.value = `⏳ 正在制作【${recipe.name}】...（${recipe.craftTime}秒）`

    // 制作计时
    craftTimer.value = setTimeout(() => {
      // 判定成功
      const success = rollProbability(recipe.baseSuccessRate)
      const resultItem = gameItems.find(i => i.id === recipe.resultItemId)

      if (success && resultItem) {
        inventoryStore.addItem(resultItem)
        craftResult.value = `✅ 制作成功！获得了【${resultItem.name}】！`
      } else {
        craftResult.value = `❌ 制作失败！材料已消耗，请再接再厉。`
      }
      isCrafting.value = false
      playerStore.saveCurrentGame()
    }, recipe.craftTime * 1000)

    playerStore.saveCurrentGame()
    return craftResult.value
  }

  /** 取消制作（不返还材料） */
  function cancelCraft(): void {
    if (craftTimer.value) {
      clearTimeout(craftTimer.value)
      craftTimer.value = null
    }
    isCrafting.value = false
    craftResult.value = '已取消制作'
  }

  return {
    craftType,
    isCrafting,
    craftResult,
    availableRecipes,
    startCraft,
    cancelCraft,
    hasMaterials,
  }
})
