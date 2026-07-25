<script setup lang="ts">
// ============================================================
// 修炼中枢 - 中央角色+灵气环绕+快捷操作
// ============================================================
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import { useCombatStore } from '@/stores/combatStore'
import { useEventStore } from '@/stores/eventStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { getEnemyById } from '@/data/enemies'

const playerStore = usePlayerStore()
const combatStore = useCombatStore()
const eventStore = useEventStore()
const inventoryStore = useInventoryStore()

const p = computed(() => playerStore.player)
const realmInfo = computed(() => playerStore.currentRealmInfo())
const progress = computed(() => playerStore.cultivationProgress())
const showBreakthroughResult = ref(false)
const breakthroughResult = ref<any>(null)
const floatingTexts = ref<{ id: number; text: string; color: string }[]>([])
let floatId = 0

// 灵气粒子生成
const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  style: {
    left: `${20 + Math.random() * 60}%`,
    top: `${15 + Math.random() * 70}%`,
    width: `${3 + Math.random() * 5}px`,
    height: `${3 + Math.random() * 5}px`,
    animationDelay: `${Math.random() * 4}s`,
    animationDuration: `${4 + Math.random() * 5}s`,
  },
}))

// 修炼相关数值
const cultivationSpeed = computed(() => {
  if (!p.value) return 0
  return Math.floor(playerStore.totalAttack * 0.5 + 1)
})

// 快捷战斗敌人
const quickEnemies = [
  { id: 'novice_wolf', name: '妖狼' },
  { id: 'normal_tiger', name: '剑齿虎' },
  { id: 'elite_fire_beast', name: '赤焰兽' },
]

function quickFight(enemyId: string) {
  combatStore.initCombat(enemyId)
}

function doBreakthrough() {
  const result = playerStore.breakthrough()
  breakthroughResult.value = result
  showBreakthroughResult.value = true
  floatText(result.success ? '突破成功！' : '突破失败', result.success ? '#ffd700' : '#e85545')
  setTimeout(() => { showBreakthroughResult.value = false }, 4000)
}

function doExplore() {
  const triggered = eventStore.startExplore()
  if (triggered) {
    const result = eventStore.processEventResult()
    floatText('探索发现！', '#ffd700')
  } else {
    floatText('平安无事', '#a09888')
  }
}

// 飘字
function floatText(text: string, color: string = '#ffd700') {
  const id = floatId++
  floatingTexts.value.push({ id, text, color })
  setTimeout(() => {
    floatingTexts.value = floatingTexts.value.filter(f => f.id !== id)
  }, 1200)
}

// 角色名称根据道修方向
const charEmoji = computed(() => {
  switch (p.value?.cultivationType) {
    case 'sword': return '⚔️'
    case 'spirit': return '🔮'
    case 'demon': return '👿'
    default: return '🧘'
  }
})

// 灵根颜色映射
const rootColors: Record<string, string> = {
  gold: '#FFD700', wood: '#4CAF50', water: '#42A5F5',
  fire: '#EF5350', earth: '#D2B48C', wind: '#90CAF9', thunder: '#CE93D8',
}

// 修炼速度计算
const speed = computed(() => {
  if (!p.value) return 1
  return Math.max(0.5, (playerStore.totalAttack * 0.05 + p.value.attributes.comprehension * 0.3))
})

// 定时刷新
const tick = ref(0)
let timer: any = null
onMounted(() => { timer = setInterval(() => tick.value++, 1000) })
onUnmounted(() => { clearInterval(timer) })
</script>

<template>
  <div class="hub-container" v-if="p">
    <!-- 飘字 -->
    <div v-for="ft in floatingTexts" :key="ft.id" class="float-text" :style="{ color: ft.color, left: '50%', top: '30%' }">
      {{ ft.text }}
    </div>

    <!-- 灵气粒子 -->
    <div v-for="pt in particles" :key="pt.id" class="spirit-particle" :style="pt.style" />

    <!-- ===== 上半部：角色+境界 ===== -->
    <div class="hub-hero">
      <!-- 境界光环 -->
      <div class="realm-ring" :class="{ 'breakthrough-glow': showBreakthroughResult && breakthroughResult?.success }">
        <!-- 灵根光环 -->
        <div
          v-for="(root, i) in p.spiritRoots"
          :key="root"
          class="root-orb"
          :style="{
            borderColor: rootColors[root] || '#fff',
            animationDelay: `${i * 2}s`,
          }"
        />
        <!-- 修炼进度环 -->
        <svg class="progress-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,215,0,0.1)" stroke-width="3" />
          <circle
            cx="60" cy="60" r="52" fill="none"
            :stroke="progress.percent >= 90 ? '#ffd700' : '#7b5eb0'"
            stroke-width="3"
            stroke-linecap="round"
            :stroke-dasharray="2 * Math.PI * 52"
            :stroke-dashoffset="2 * Math.PI * 52 * (1 - progress.percent / 100)"
            style="transform: rotate(-90deg); transform-origin: center; transition: stroke-dashoffset 0.8s ease;"
          />
        </svg>
        <!-- 角色 -->
        <div class="character">
          <span class="char-icon breathe">{{ charEmoji }}</span>
        </div>
      </div>

      <!-- 角色名+境界 -->
      <div class="hero-info">
        <div class="char-name">{{ p.name }}</div>
        <div class="realm-badge-large">{{ realmInfo?.name || '凡人' }}</div>
        <div class="realm-cultivation">{{ progress.current }} / {{ progress.required }}</div>
      </div>
    </div>

    <!-- ===== 中部：核心数值条 ===== -->
    <div class="hub-stats">
      <div class="stat-row">
        <div class="stat-cell">
          <span class="stat-icon">❤️</span>
          <div class="stat-bar-wrap">
            <div class="stat-bar hp" :style="{ width: (p.attributes.currentHp / p.attributes.maxHp * 100) + '%' }" />
          </div>
          <span class="stat-val">{{ p.attributes.currentHp }}/{{ p.attributes.maxHp }}</span>
        </div>
        <div class="stat-cell">
          <span class="stat-icon">💎</span>
          <span class="stat-val">{{ p.attributes.spiritStones }}</span>
        </div>
      </div>
      <div class="stat-row mini">
        <span>⚔️{{ playerStore.totalAttack }}</span>
        <span>🛡️{{ p.attributes.defense }}</span>
        <span>💨{{ p.attributes.speed }}</span>
        <span>💥{{ (p.attributes.critRate * 100).toFixed(0) }}%</span>
      </div>
    </div>

    <!-- ===== 中部：灵根展示 ===== -->
    <div class="hub-roots">
      <span
        v-for="root in p.spiritRoots"
        :key="root"
        class="root-chip"
        :style="{ borderColor: rootColors[root], color: rootColors[root] }"
      >
        {{ root === 'gold' ? '金' : root === 'wood' ? '木' : root === 'water' ? '水' : root === 'fire' ? '火' : root === 'earth' ? '土' : root === 'wind' ? '风' : '雷' }}灵根
      </span>
      <span class="cult-type-chip">{{ p.cultivationType === 'sword' ? '剑修' : p.cultivationType === 'spirit' ? '灵修' : '邪修' }}</span>
    </div>

    <!-- ===== 下半部：操作按钮 ===== -->
    <div class="hub-actions">
      <button class="hub-btn primary" @click="doBreakthrough">
        <span class="hub-btn-icon">⚡</span>
        <span class="hub-btn-label">突破</span>
      </button>
      <button class="hub-btn danger" @click="quickFight(quickEnemies[Math.floor(Math.random() * 3)].id)">
        <span class="hub-btn-icon">⚔️</span>
        <span class="hub-btn-label">战斗</span>
      </button>
      <button class="hub-btn explore" @click="doExplore">
        <span class="hub-btn-icon">🗺️</span>
        <span class="hub-btn-label">探索</span>
      </button>
    </div>

    <!-- 突破结果弹窗 -->
    <div v-if="showBreakthroughResult" class="breakthrough-modal" @click="showBreakthroughResult = false">
      <div class="breakthrough-card" :class="{ success: breakthroughResult?.success }">
        <div class="bt-icon">{{ breakthroughResult?.success ? '🌟' : '💔' }}</div>
        <div class="bt-title">{{ breakthroughResult?.success ? '突破成功！' : '突破失败' }}</div>
        <div class="bt-msg">{{ breakthroughResult?.message }}</div>
        <div v-if="breakthroughResult?.tribulationTriggered" class="bt-tribulation">⚡ 天劫降临！</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hub-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 130px);
  padding: 10px;
  overflow: hidden;
}

/* ========== 角色英雄区 ========== */
.hub-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  position: relative;
  z-index: 1;
}

.realm-ring {
  position: relative;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(74,48,128,0.3) 0%, rgba(10,10,26,0.8) 70%);
  box-shadow: 0 0 40px rgba(122,94,176,0.25);
  transition: all 0.5s;
}

.realm-ring.breakthrough-glow {
  box-shadow: 0 0 60px rgba(255,215,0,0.5), 0 0 100px rgba(255,215,0,0.3);
  background: radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(74,48,128,0.4) 50%, rgba(10,10,26,0.8) 70%);
}

.root-orb {
  position: absolute;
  width: 148px; height: 148px;
  border-radius: 50%;
  border: 2px dashed;
  opacity: 0.5;
  animation: rotate 8s linear infinite;
}

.progress-ring {
  position: absolute;
  width: 140px; height: 140px;
}

.character {
  position: relative;
  z-index: 2;
}

.char-icon {
  font-size: 3.5rem;
  display: block;
  filter: drop-shadow(0 0 10px rgba(255,215,0,0.4));
}

.hero-info {
  text-align: center;
  margin-top: 8px;
}

.char-name {
  font-family: var(--font-ancient);
  font-size: 1.3rem;
  color: #ffd700;
  text-shadow: 0 0 15px rgba(255,215,0,0.3);
}

.realm-badge-large {
  display: inline-block;
  margin-top: 4px;
  padding: 3px 16px;
  background: linear-gradient(135deg, rgba(74,48,128,0.5), rgba(122,94,176,0.3));
  border: 1px solid rgba(122,94,176,0.5);
  border-radius: 20px;
  font-family: var(--font-ancient);
  font-size: 0.9rem;
  color: #c0b0e0;
  letter-spacing: 2px;
}

.realm-cultivation {
  margin-top: 4px;
  font-size: 0.72rem;
  color: #a09888;
}

/* ========== 数值区 ========== */
.hub-stats {
  width: 100%;
  max-width: 340px;
  margin-top: 14px;
  z-index: 1;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.stat-row.mini {
  justify-content: center;
  gap: 14px;
  font-size: 0.75rem;
  color: #a09888;
}

.stat-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.stat-icon { font-size: 0.85rem; }
.stat-val { font-size: 0.78rem; color: #c0c0c0; white-space: nowrap; }

.stat-bar-wrap {
  flex: 1;
  height: 8px;
  background: rgba(255,255,255,0.08);
  border-radius: 4px;
  overflow: hidden;
}

.stat-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s;
}

.stat-bar.hp {
  background: linear-gradient(90deg, #e85545, #f06050);
}

/* ========== 灵根区 ========== */
.hub-roots {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
  justify-content: center;
  z-index: 1;
}

.root-chip {
  padding: 2px 10px;
  border: 1px solid;
  border-radius: 14px;
  font-size: 0.72rem;
  background: rgba(0,0,0,0.3);
}

.cult-type-chip {
  padding: 2px 10px;
  border: 1px solid #ffd700;
  border-radius: 14px;
  font-size: 0.72rem;
  color: #ffd700;
  background: rgba(255,215,0,0.08);
}

/* ========== 操作按钮 ========== */
.hub-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  z-index: 1;
}

.hub-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 80px;
  padding: 14px 8px;
  border: 2px solid;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(10,10,26,0.7);
  backdrop-filter: blur(10px);
}

.hub-btn.primary { border-color: #7b5eb0; }
.hub-btn.danger { border-color: #e85545; }
.hub-btn.explore { border-color: #f0a020; }

.hub-btn:hover { transform: translateY(-3px); }
.hub-btn.primary:hover { box-shadow: 0 6px 25px rgba(122,94,176,0.4); }
.hub-btn.danger:hover { box-shadow: 0 6px 25px rgba(232,85,69,0.4); }
.hub-btn.explore:hover { box-shadow: 0 6px 25px rgba(240,160,32,0.4); }

.hub-btn-icon { font-size: 1.6rem; }
.hub-btn-label { font-size: 0.78rem; color: #c0c0c0; font-family: var(--font-ancient); }

/* ========== 突破弹窗 ========== */
.breakthrough-modal {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7); display: flex; align-items: center;
  justify-content: center; z-index: 100; backdrop-filter: blur(4px);
}

.breakthrough-card {
  background: linear-gradient(135deg, #1e2048, #2a2060);
  border: 2px solid #e85545;
  border-radius: 20px; padding: 30px; text-align: center;
  max-width: 300px; width: 90%;
  animation: fadeInUp 0.4s ease-out;
}

.breakthrough-card.success {
  border-color: #ffd700;
  box-shadow: 0 0 40px rgba(255,215,0,0.3);
}

.bt-icon { font-size: 3rem; margin-bottom: 10px; }
.bt-title { font-size: 1.3rem; color: #ffd700; font-family: var(--font-ancient); margin-bottom: 8px; }
.bt-msg { font-size: 0.85rem; color: #c0c0c0; line-height: 1.6; }
.bt-tribulation { margin-top: 10px; font-size: 1rem; color: #f0a020; font-weight: bold; }
</style>
