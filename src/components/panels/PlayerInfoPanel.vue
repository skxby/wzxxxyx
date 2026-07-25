<script setup lang="ts">
// ============================================================
// 玩家属性面板 - 完整属性展示
// ============================================================
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import { SpiritRootLabel } from '@/types'

const playerStore = usePlayerStore()
const p = computed(() => playerStore.player)

// 装备属性汇总
const equipStats = computed(() => {
  const eq = p.value?.equipment
  return {
    weapon: eq?.weapon?.name || '无',
    armor: eq?.armor?.name || '无',
    accessory: eq?.accessory?.name || '无',
  }
})

// 灵根信息
const spiritRootInfo = computed(() => {
  if (!p.value) return ''
  return p.value.spiritRoots
    .map(r => SpiritRootLabel[r] || r)
    .join('、')
})
</script>

<template>
  <div class="player-panel" v-if="p">
    <!-- 基本信息 -->
    <div class="info-section fade-in">
      <div class="section-title">📋 基本信息</div>
      <div class="info-grid">
        <div class="info-item"><span class="label">道号</span><span class="value text-ancient">{{ p.name }}</span></div>
        <div class="info-item"><span class="label">性别</span><span class="value">{{ p.gender === 'male' ? '男' : '女' }}</span></div>
        <div class="info-item"><span class="label">道修</span><span class="value">{{ p.cultivationType === 'sword' ? '剑修' : p.cultivationType === 'spirit' ? '灵修' : '邪修' }}</span></div>
        <div class="info-item"><span class="label">灵根</span><span class="value quality-gold">{{ spiritRootInfo }}</span></div>
      </div>
    </div>

    <!-- 境界修为 -->
    <div class="info-section fade-in">
      <div class="section-title">🏔️ 境界修为</div>
      <div class="info-grid">
        <div class="info-item"><span class="label">当前境界</span><span class="value quality-purple">{{ playerStore.currentRealmInfo()?.name || '凡人' }}</span></div>
        <div class="info-item"><span class="label">修为值</span><span class="value">{{ p.attributes.cultivation }}</span></div>
      </div>
    </div>

    <!-- 生存属性 -->
    <div class="info-section fade-in">
      <div class="section-title">❤️ 生存属性</div>
      <div class="info-grid">
        <div class="info-item"><span class="label">生命值</span><span class="value">{{ p.attributes.currentHp }} / {{ p.attributes.maxHp }}</span></div>
      </div>
    </div>

    <!-- 战斗属性 -->
    <div class="info-section fade-in">
      <div class="section-title">⚔️ 战斗属性</div>
      <div class="info-grid">
        <div class="info-item"><span class="label">攻击力</span><span class="value">{{ playerStore.totalAttack }}</span></div>
        <div class="info-item"><span class="label">防御力</span><span class="value">{{ p.attributes.defense }}</span></div>
        <div class="info-item"><span class="label">闪避值</span><span class="value">{{ (p.attributes.dodge * 100).toFixed(1) }}%</span></div>
        <div class="info-item"><span class="label">命中率</span><span class="value">{{ (p.attributes.accuracy * 100).toFixed(1) }}%</span></div>
        <div class="info-item"><span class="label">速度</span><span class="value">{{ p.attributes.speed }}</span></div>
        <div class="info-item"><span class="label">暴击率</span><span class="value">{{ (p.attributes.critRate * 100).toFixed(1) }}%</span></div>
        <div class="info-item"><span class="label">抗暴率</span><span class="value">{{ (p.attributes.critResist * 100).toFixed(1) }}%</span></div>
      </div>
    </div>

    <!-- 修仙属性 -->
    <div class="info-section fade-in">
      <div class="section-title">✨ 修仙属性</div>
      <div class="info-grid">
        <div class="info-item"><span class="label">根骨</span><span class="value">{{ p.attributes.rootBone }}</span></div>
        <div class="info-item"><span class="label">悟性</span><span class="value">{{ p.attributes.comprehension }}</span></div>
        <div class="info-item"><span class="label">神识</span><span class="value">{{ p.attributes.divineSense }}</span></div>
        <div class="info-item"><span class="label">道心</span><span class="value">{{ p.attributes.daoHeart }}</span></div>
        <div class="info-item"><span class="label">气运</span><span class="value">{{ p.attributes.fortune }}</span></div>
      </div>
    </div>

    <!-- 装备信息 -->
    <div class="info-section fade-in">
      <div class="section-title">🗡️ 装备信息</div>
      <div class="info-grid">
        <div class="info-item"><span class="label">武器</span><span class="value">{{ equipStats.weapon }}</span></div>
        <div class="info-item"><span class="label">防具</span><span class="value">{{ equipStats.armor }}</span></div>
        <div class="info-item"><span class="label">饰品</span><span class="value">{{ equipStats.accessory }}</span></div>
      </div>
    </div>

    <!-- 重置操作 -->
    <div class="info-section fade-in">
      <div class="section-title">⚙️ 重置操作</div>
      <div class="reset-actions">
        <button class="reset-btn" @click="playerStore.resetSpiritRoots()">
          🔄 重置灵根（修为清零）
        </button>
        <button class="reset-btn danger" @click="playerStore.globalReset()">
          💀 全局重置（删除存档）
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-section {
  background: rgba(22, 33, 62, 0.8);
  border: 1px solid #2a2a4a;
  border-radius: 10px;
  padding: 14px;
}

.section-title {
  font-size: 0.9rem;
  color: #ffd700;
  margin-bottom: 10px;
  font-weight: 500;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.label {
  color: #9090a0;
  font-size: 0.82rem;
}

.value {
  color: #e0e0e0;
  font-size: 0.82rem;
  font-weight: 500;
}

.reset-actions {
  display: flex;
  gap: 10px;
}

.reset-btn {
  flex: 1;
  padding: 8px;
  background: rgba(83, 52, 131, 0.3);
  border: 1px solid #533483;
  border-radius: 6px;
  color: #c0c0d0;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: rgba(83, 52, 131, 0.5);
}

.reset-btn.danger {
  background: rgba(231, 76, 60, 0.2);
  border-color: #e74c3c;
}

.reset-btn.danger:hover {
  background: rgba(231, 76, 60, 0.4);
}
</style>
