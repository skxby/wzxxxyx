<script setup lang="ts">
// ============================================================
// 制作系统面板 - 炼丹/炼器/阵法
// ============================================================
import { ref } from 'vue'
import { useCraftStore } from '@/stores/craftStore'
import { usePlayerStore } from '@/stores/playerStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { items as gameItems } from '@/data/items'

const craftStore = useCraftStore()
const playerStore = usePlayerStore()
const inventoryStore = useInventoryStore()

const craftTypes = [
  { key: 'alchemy' as const, label: '🔥 炼丹', icon: '💊' },
  { key: 'forging' as const, label: '⚒️ 炼器', icon: '🗡️' },
  { key: 'formation' as const, label: '⭕ 阵法', icon: '🔮' },
]

function doCraft(recipe: any) {
  craftStore.craftResult = craftStore.startCraft(recipe)
}

function getMaterialName(itemId: string): string {
  return gameItems.find(i => i.id === itemId)?.name || itemId
}
</script>

<template>
  <div class="craft-panel">
    <!-- 分类选择 -->
    <div class="craft-types">
      <button
        v-for="ct in craftTypes"
        :key="ct.key"
        :class="['type-btn', { active: craftStore.craftType === ct.key }]"
        @click="craftStore.craftType = ct.key"
      >
        {{ ct.label }}
      </button>
    </div>

    <!-- 制作状态 -->
    <div v-if="craftStore.craftResult" class="craft-status fade-in">
      {{ craftStore.craftResult }}
    </div>

    <!-- 配方列表 -->
    <div class="recipe-list">
      <div
        v-for="recipe in craftStore.availableRecipes"
        :key="recipe.id"
        class="recipe-card fade-in"
      >
        <div class="recipe-header">
          <span class="recipe-name">{{ recipe.name }}</span>
          <span class="recipe-rarity">{{ recipe.rarity }}</span>
        </div>
        <div class="recipe-desc">{{ recipe.description }}</div>

        <!-- 所需材料 -->
        <div class="recipe-materials">
          <span class="mat-label">材料：</span>
          <span
            v-for="[itemId, qty] in recipe.materials"
            :key="itemId"
            :class="['mat-item', {
              'mat-enough': (inventoryStore.inventory.filter(i => i.itemId === itemId).reduce((s, i) => s + i.quantity, 0)) >= qty
            }]"
          >
            {{ getMaterialName(itemId) }} x{{ qty }}
            <span class="mat-owned">
              ({{ inventoryStore.inventory.filter(i => i.itemId === itemId).reduce((s, i) => s + i.quantity, 0) }})
            </span>
          </span>
        </div>

        <div class="recipe-footer">
          <span class="recipe-cost">💎 {{ recipe.stoneCost }} 灵石</span>
          <span class="recipe-time">⏱️ {{ recipe.craftTime }}秒</span>
          <span class="recipe-rate">成功率: {{ Math.floor(recipe.baseSuccessRate * 100) }}%</span>
          <button
            class="craft-btn"
            :disabled="craftStore.isCrafting"
            @click="doCraft(recipe)"
          >
            {{ craftStore.isCrafting ? '制作中...' : '制作' }}
          </button>
        </div>
      </div>

      <div v-if="craftStore.availableRecipes.length === 0" class="empty-hint">
        当前境界无可制作配方
      </div>
    </div>
  </div>
</template>

<style scoped>
.craft-panel { display: flex; flex-direction: column; gap: 10px; }

.craft-types { display: flex; gap: 6px; }
.type-btn {
  flex: 1; padding: 8px; background: rgba(255,255,255,0.05);
  border: 1px solid #2a2a4a; border-radius: 8px;
  color: #9090a0; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
}
.type-btn.active { background: rgba(83,52,131,0.4); border-color: #7b5ea7; color: #ffd700; }

.craft-status {
  padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;
  text-align: center; color: #ffd700; font-size: 0.85rem;
}

.recipe-card {
  background: rgba(22,33,62,0.8); border: 1px solid #2a2a4a;
  border-radius: 8px; padding: 10px; margin-bottom: 6px;
}
.recipe-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
.recipe-name { color: #e0e0e0; font-weight: 500; }
.recipe-rarity { color: #9090a0; font-size: 0.72rem; }
.recipe-desc { font-size: 0.75rem; color: #808090; margin-bottom: 6px; }

.recipe-materials { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
.mat-label { font-size: 0.78rem; color: #9090a0; }
.mat-item { font-size: 0.75rem; padding: 2px 6px; border-radius: 4px; background: rgba(231,76,60,0.15); color: #e74c3c; }
.mat-item.mat-enough { background: rgba(46,204,113,0.15); color: #2ecc71; }
.mat-owned { font-size: 0.68rem; opacity: 0.7; }

.recipe-footer { display: flex; align-items: center; gap: 8px; font-size: 0.72rem; color: #9090a0; }
.recipe-cost { color: #ffd700; }
.craft-btn {
  margin-left: auto; padding: 4px 14px; background: #e67e22; border: none;
  border-radius: 4px; color: #fff; font-size: 0.78rem; cursor: pointer;
}
.craft-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.empty-hint { text-align: center; color: #606070; padding: 30px; }
</style>
