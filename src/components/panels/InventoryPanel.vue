<script setup lang="ts">
// ============================================================
// 背包面板 v2 - 优化卡片视觉
// ============================================================
import { computed, ref } from 'vue'
import { useInventoryStore } from '@/stores/inventoryStore'
import { usePlayerStore } from '@/stores/playerStore'
import { getItemById } from '@/utils/loot'
import { skills as skillDefs } from '@/data/skills'
import { RarityColor } from '@/types'
import type { ItemType } from '@/types'

const inventoryStore = useInventoryStore()
const playerStore = usePlayerStore()
const message = ref('')
const itemFilter = ref<ItemType | 'all'>('all')

const cats: { key: ItemType | 'all'; label: string; icon: string }[] = [
  { key: 'all', label: '全部', icon: '📦' },
  { key: 'weapon', label: '武器', icon: '🗡️' },
  { key: 'armor', label: '防具', icon: '🛡️' },
  { key: 'accessory', label: '饰品', icon: '💍' },
  { key: 'consumable', label: '丹药', icon: '💊' },
  { key: 'material', label: '材料', icon: '🪨' },
  { key: 'skill_book', label: '秘籍', icon: '📖' },
]

const filteredItems = computed(() => {
  const inv = inventoryStore.inventory
  if (itemFilter.value === 'all') return inv
  return inv.filter(e => {
    const item = getItemById(e.itemId)
    return item?.type === itemFilter.value
  })
})

const learnedSkills = computed(() => {
  const p = playerStore.player
  if (!p) return []
  return p.skills.map(ps => {
    const def = skillDefs.find(s => s.id === ps.skillId)
    return { ...ps, name: def?.name || '未知', desc: def?.description || '', rarity: def?.rarity || 'white' }
  })
})

const eq = computed(() => ({
  weapon: playerStore.player?.equipment.weapon,
  armor: playerStore.player?.equipment.armor,
  accessory: playerStore.player?.equipment.accessory,
}))

function toast(m: string) { message.value = m; setTimeout(() => message.value = '', 2500) }
function equip(uid: string) { if (inventoryStore.equipItem(uid)) toast('装备成功！') }
function unequip(s: 'weapon'|'armor'|'accessory') { if (inventoryStore.unequipItem(s)) toast('已卸下') }
function useItem(uid: string) { toast(inventoryStore.useConsumable(uid)) }
function learn(uid: string) { toast(inventoryStore.learnSkill(uid)) }
function discard(uid: string) { inventoryStore.removeItem(uid, 1); toast('已丢弃') }
</script>

<template>
  <div class="inv-panel">
    <div v-if="message" class="game-toast">{{ message }}</div>

    <!-- 装备栏 -->
    <div class="equip-bar">
      <div class="equip-slot" :class="{filled:eq.weapon}" @click="eq.weapon&&unequip('weapon')">
        <span class="es-icon">🗡️</span>
        <span class="es-label">武器</span>
        <span class="es-name" :style="{color:eq.weapon?.rarity?RarityColor[eq.weapon.rarity as keyof typeof RarityColor]:''}">{{ eq.weapon?.name || '空' }}</span>
      </div>
      <div class="equip-slot" :class="{filled:eq.armor}" @click="eq.armor&&unequip('armor')">
        <span class="es-icon">🛡️</span>
        <span class="es-label">防具</span>
        <span class="es-name" :style="{color:eq.armor?.rarity?RarityColor[eq.armor.rarity as keyof typeof RarityColor]:''}">{{ eq.armor?.name || '空' }}</span>
      </div>
      <div class="equip-slot" :class="{filled:eq.accessory}" @click="eq.accessory&&unequip('accessory')">
        <span class="es-icon">💍</span>
        <span class="es-label">饰品</span>
        <span class="es-name" :style="{color:eq.accessory?.rarity?RarityColor[eq.accessory.rarity as keyof typeof RarityColor]:''}">{{ eq.accessory?.name || '空' }}</span>
      </div>
    </div>

    <!-- 已学技能 -->
    <div class="skill-bar">
      <div v-for="s in learnedSkills" :key="s.skillId" class="skill-chip" :style="{color:RarityColor[s.rarity as keyof typeof RarityColor]}">
        {{ s.name }} Lv.{{ s.level }}
      </div>
      <span v-if="learnedSkills.length===0" class="no-data">未学习技能</span>
    </div>

    <!-- 分类 -->
    <div class="filter-row">
      <button v-for="c in cats" :key="c.key" :class="['f-btn',{active:itemFilter===c.key}]" @click="itemFilter=c.key">
        {{ c.icon }}
      </button>
    </div>

    <!-- 物品列表 -->
    <div class="items-grid">
      <div v-for="entry in filteredItems" :key="entry.uid" class="item-card"
        :style="{borderLeftColor:RarityColor[(getItemById(entry.itemId)?.rarity||'white')as keyof typeof RarityColor]}">
        <div class="ic-top">
          <span class="ic-name" :style="{color:RarityColor[(getItemById(entry.itemId)?.rarity||'white')as keyof typeof RarityColor]}">
            {{ getItemById(entry.itemId)?.name }}
            <span v-if="entry.quantity>1" class="ic-qty">×{{ entry.quantity }}</span>
          </span>
          <span class="ic-type">{{ getItemById(entry.itemId)?.type }}</span>
        </div>
        <div class="ic-desc">{{ getItemById(entry.itemId)?.description }}</div>
        <div class="ic-actions">
          <button v-if="['weapon','armor','accessory'].includes(getItemById(entry.itemId)?.type||'')" class="ia-btn equip" @click="equip(entry.uid)">穿戴</button>
          <button v-if="getItemById(entry.itemId)?.type==='consumable'" class="ia-btn use" @click="useItem(entry.uid)">使用</button>
          <button v-if="getItemById(entry.itemId)?.type==='skill_book'" class="ia-btn learn" @click="learn(entry.uid)">学习</button>
          <button class="ia-btn trash" @click="discard(entry.uid)">丢弃</button>
        </div>
      </div>
      <div v-if="filteredItems.length===0" class="no-data">空空如也</div>
    </div>
  </div>
</template>

<style scoped>
.inv-panel { padding: 8px; padding-bottom: 80px; }
.equip-bar { display: flex; gap: 6px; margin-bottom: 8px; }
.equip-slot {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 8px 4px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px; cursor: pointer; transition: all 0.2s;
}
.equip-slot.filled { border-color: rgba(122,94,176,0.3); background: rgba(122,94,176,0.08); }
.equip-slot:active { transform: scale(0.95); }
.es-icon { font-size: 1.2rem; }
.es-label { font-size: 0.62rem; color: #706860; }
.es-name { font-size: 0.68rem; text-align: center; max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.skill-bar { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
.skill-chip {
  padding: 2px 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px; font-size: 0.68rem;
}

.filter-row { display: flex; gap: 4px; margin-bottom: 8px; overflow-x: auto; padding-bottom: 4px; }
.f-btn {
  padding: 6px 10px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
}
.f-btn.active { background: rgba(122,94,176,0.2); border-color: #7b5eb0; }

.items-grid { display: flex; flex-direction: column; gap: 6px; }
.item-card {
  background: rgba(20,22,50,0.7); border-left: 3px solid; border-radius: 0 8px 8px 0;
  padding: 8px 10px; transition: all 0.2s;
}
.item-card:active { transform: scale(0.98); }
.ic-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
.ic-name { font-size: 0.85rem; font-weight: 500; }
.ic-qty { color: #807870; font-size: 0.72rem; }
.ic-type { font-size: 0.62rem; color: #605850; }
.ic-desc { font-size: 0.7rem; color: #807870; margin-bottom: 6px; }
.ic-actions { display: flex; gap: 4px; }
.ia-btn {
  padding: 3px 10px; border: none; border-radius: 4px; font-size: 0.68rem; cursor: pointer; transition: all 0.15s;
}
.ia-btn:active { transform: scale(0.92); }
.ia-btn.equip { background: #40a0e0; color: #fff; }
.ia-btn.use { background: #4ecb71; color: #fff; }
.ia-btn.learn { background: #ab47bc; color: #fff; }
.ia-btn.trash { background: rgba(255,255,255,0.05); color: #807870; }

.no-data { text-align: center; color: #505050; padding: 20px; font-size: 0.8rem; }
</style>
