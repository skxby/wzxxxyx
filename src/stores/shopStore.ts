// ============================================================
// 灵石商店状态管理
// ============================================================
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { shopConfig } from '@/data/shop'
import { items as gameItems } from '@/data/items'
import { usePlayerStore } from './playerStore'
import { useInventoryStore } from './inventoryStore'
import type { ShopItem } from '@/data/shop'

export const useShopStore = defineStore('shop', () => {
  const refreshCount = ref(0)
  const message = ref('')

  // 获取当前可用商品（根据境界过滤）
  const availableItems = computed(() => {
    const playerStore = usePlayerStore()
    const p = playerStore.player
    if (!p) return []
    const realmInfo = playerStore.currentRealmInfo()
    const realmLevel = realmInfo?.level || 0

    return shopConfig.items.filter(item => item.minRealmLevel <= realmLevel)
  })

  /** 购买物品 */
  function buyItem(shopItem: ShopItem): string {
    const playerStore = usePlayerStore()
    const inventoryStore = useInventoryStore()
    const p = playerStore.player
    if (!p) return '玩家数据不存在'

    // 检查灵石
    const actualPrice = Math.floor(shopItem.price * (1 - shopItem.discount))
    if (p.attributes.spiritStones < actualPrice) {
      return `灵石不足！需要 ${actualPrice} 灵石，当前拥有 ${p.attributes.spiritStones}`
    }

    // 检查库存
    if (shopItem.stock === 0) {
      return '该物品已售罄！'
    }

    // 查找物品
    const item = gameItems.find(i => i.id === shopItem.itemId)
    if (!item) return '物品不存在'

    // 扣除灵石
    p.attributes.spiritStones -= actualPrice
    // 添加到背包
    inventoryStore.addItem(item)

    // 减少库存
    if (shopItem.stock > 0) {
      shopItem.stock--
    }

    playerStore.saveCurrentGame()
    return `成功购买【${item.name}】，花费 ${actualPrice} 灵石！`
  }

  /** 刷新商店 */
  function refreshShop(): string {
    const playerStore = usePlayerStore()
    const p = playerStore.player
    if (!p) return ''

    if (p.attributes.spiritStones < shopConfig.refreshCost) {
      return `灵石不足！刷新需要 ${shopConfig.refreshCost} 灵石`
    }

    p.attributes.spiritStones -= shopConfig.refreshCost
    refreshCount.value++
    playerStore.saveCurrentGame()
    return `商店已刷新！（已刷新 ${refreshCount.value} 次）`
  }

  return {
    refreshCount,
    message,
    availableItems,
    buyItem,
    refreshShop,
    shopConfig,
  }
})
