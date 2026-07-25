<script setup lang="ts">
import { ref } from 'vue'
import { useShopStore } from '@/stores/shopStore'
import { usePlayerStore } from '@/stores/playerStore'
import { items as gameItems } from '@/data/items'
import { RarityColor } from '@/types'

const shopStore = useShopStore()
const playerStore = usePlayerStore()
const msg = ref('')

function buy(item: any) { msg.value = shopStore.buyItem(item); setTimeout(() => msg.value = '', 2500) }
function refresh() { msg.value = shopStore.refreshShop(); setTimeout(() => msg.value = '', 2500) }
</script>

<template>
  <div class="panel-wrap">
    <div v-if="msg" class="game-toast">{{ msg }}</div>

    <div class="panel-card shop-top">
      <div class="shop-title-row">
        <span class="shop-title">🏪 仙市</span>
        <span class="shop-stones">💎 {{ playerStore.player?.attributes.spiritStones || 0 }}</span>
      </div>
      <button class="refresh-btn" @click="refresh">🔄 刷新商铺 ({{ shopStore.shopConfig.refreshCost }}💎)</button>
    </div>

    <div class="shop-grid">
      <div v-for="si in shopStore.availableItems" :key="si.itemId" class="shop-card"
        :style="{borderTopColor:RarityColor[(gameItems.find(i=>i.id===si.itemId)?.rarity||'white')as keyof typeof RarityColor]}">
        <div class="sc-top">
          <span class="sc-name" :style="{color:RarityColor[(gameItems.find(i=>i.id===si.itemId)?.rarity||'white')as keyof typeof RarityColor]}">
            {{ gameItems.find(i=>i.id===si.itemId)?.name }}
          </span>
        </div>
        <div class="sc-desc">{{ gameItems.find(i=>i.id===si.itemId)?.description }}</div>
        <div class="sc-foot">
          <span class="sc-price">💎{{ Math.floor(si.price*(1-si.discount)) }}</span>
          <span v-if="si.stock>0" class="sc-stock">余{{ si.stock }}</span>
          <span v-else-if="si.stock===-1" class="sc-stock inf">∞</span>
          <span v-else class="sc-stock sold">售罄</span>
          <button class="buy-btn" :disabled="si.stock===0" @click="buy(si)">购买</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-wrap { padding: 8px; padding-bottom: 80px; }
.shop-top { display: flex; justify-content: space-between; align-items: center; }
.shop-title-row { display: flex; align-items: center; gap: 12px; }
.shop-title { font-size: 1.1rem; color: #ffd700; font-family: var(--font-ancient); }
.shop-stones { font-size: 0.8rem; color: #c0c0c0; }
.refresh-btn {
  padding: 6px 14px; background: rgba(122,94,176,0.2); border: 1px solid rgba(122,94,176,0.4);
  border-radius: 16px; color: #c0b0e0; font-size: 0.72rem; cursor: pointer;
}
.shop-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }
.shop-card {
  background: rgba(20,22,50,0.7); border-top: 2px solid; border-radius: 8px; padding: 8px;
  transition: all 0.2s;
}
.shop-card:active { transform: scale(0.96); }
.sc-name { font-size: 0.82rem; font-weight: 500; }
.sc-desc { font-size: 0.65rem; color: #807870; margin: 3px 0; }
.sc-foot { display: flex; align-items: center; gap: 4px; margin-top: 4px; }
.sc-price { font-size: 0.8rem; color: #ffd700; font-weight: bold; flex: 1; }
.sc-stock { font-size: 0.62rem; color: #807870; }
.sc-stock.inf { color: #40a0e0; }
.sc-stock.sold { color: #e85545; }
.buy-btn {
  padding: 3px 10px; background: #4ecb71; border: none; border-radius: 4px;
  color: #fff; font-size: 0.7rem; cursor: pointer;
}
.buy-btn:disabled { opacity: 0.35; }
.buy-btn:active { transform: scale(0.9); }
</style>
