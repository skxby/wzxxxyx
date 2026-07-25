<script setup lang="ts">
// ============================================================
// 探索面板 v2
// ============================================================
import { ref } from 'vue'
import { useEventStore } from '@/stores/eventStore'
import { useCombatStore } from '@/stores/combatStore'
import { usePlayerStore } from '@/stores/playerStore'

const eventStore = useEventStore()
const combatStore = useCombatStore()
const playerStore = usePlayerStore()

const exploreResult = ref('')
const isExploring = ref(false)

const quickFights = [
  { id: 'novice_wolf', name: '妖狼', icon: '🐺', desc: '新手' },
  { id: 'novice_bandit', name: '山贼', icon: '🗡️', desc: '新手' },
  { id: 'normal_tiger', name: '剑齿虎', icon: '🐯', desc: '普通' },
  { id: 'normal_snake', name: '毒蟒', icon: '🐍', desc: '普通' },
  { id: 'elite_cultivator_dark', name: '魔修', icon: '👿', desc: '精英' },
  { id: 'elite_fire_beast', name: '赤焰兽', icon: '🔥', desc: '精英' },
]

function quickFight(id: string) { combatStore.initCombat(id) }

function startExplore() {
  isExploring.value = true
  exploreResult.value = '🔍 探索中...'
  setTimeout(() => {
    const triggered = eventStore.startExplore()
    if (triggered) {
      exploreResult.value = eventStore.processEventResult()
    } else {
      exploreResult.value = '🔍 本次探索未触发任何事件，平安无事。'
    }
    isExploring.value = false
  }, 800)
}
</script>

<template>
  <div class="panel-wrap">
    <!-- 随机探险 -->
    <div class="panel-card explore-hero">
      <h3>🗺️ 云游四方</h3>
      <p class="explore-hint">
        外出游历，可能遇到奇遇、秘境、机缘<br/>
        也可能遭遇陷阱、天劫、强敌！
      </p>
      <button class="explore-btn pulse" :disabled="isExploring" @click="startExplore">
        {{ isExploring ? '⏳ 云游中...' : '🔍 开始云游' }}
      </button>
      <div v-if="exploreResult" class="explore-result fade-in-up">
        <pre>{{ exploreResult }}</pre>
      </div>
    </div>

    <!-- 快速挑战 -->
    <div class="panel-card">
      <h3>⚔️ 快速挑战</h3>
      <div class="qf-grid">
        <div v-for="enemy in quickFights" :key="enemy.id" class="qf-card" @click="quickFight(enemy.id)">
          <span class="qf-icon">{{ enemy.icon }}</span>
          <span class="qf-name">{{ enemy.name }}</span>
          <span class="qf-tier">{{ enemy.desc }}</span>
        </div>
      </div>
    </div>

    <!-- 事件说明 -->
    <div class="panel-card">
      <h3>📋 事件类型</h3>
      <div class="event-types">
        <div class="et good">🌟 良机 — 奇遇/机缘/传承/宝藏，获得奖励</div>
        <div class="et bad">⚠️ 劫难 — 陷阱/天劫/惩戒，损失资源</div>
        <div class="et neutral">⚖️ 中立 — 切磋/秘境，可能触发战斗</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-wrap { padding: 8px; padding-bottom: 80px; }
.explore-hero { text-align: center; }
.explore-hint { color: #a09888; font-size: 0.8rem; line-height: 1.6; margin-bottom: 12px; }
.explore-btn {
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, #4a3080, #7b5eb0);
  border: none; border-radius: 14px; color: #fff;
  font-size: 1.1rem; font-family: var(--font-ancient);
  cursor: pointer; transition: all 0.3s;
}
.explore-btn:hover { box-shadow: 0 6px 30px rgba(122,94,176,0.4); transform: translateY(-2px); }
.explore-btn:disabled { opacity: 0.5; }
.explore-result {
  margin-top: 12px; padding: 12px; background: rgba(0,0,0,0.3);
  border-radius: 10px; text-align: left;
}
.explore-result pre {
  white-space: pre-wrap; font-family: 'Microsoft YaHei', sans-serif;
  font-size: 0.82rem; color: #d0d0d0; line-height: 1.7;
}

.qf-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.qf-card {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 12px 6px; background: rgba(20,22,50,0.5); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 10px; cursor: pointer; transition: all 0.2s;
}
.qf-card:active { transform: scale(0.93); }
.qf-icon { font-size: 1.6rem; }
.qf-name { font-size: 0.78rem; color: #e0e0e0; }
.qf-tier { font-size: 0.62rem; color: #807870; }

.event-types { display: flex; flex-direction: column; gap: 6px; }
.et {
  padding: 8px 10px; border-radius: 8px; font-size: 0.78rem;
  border-left: 3px solid;
}
.et.good { background: rgba(78,203,113,0.06); border-color: #4ecb71; }
.et.bad { background: rgba(232,85,69,0.06); border-color: #e85545; }
.et.neutral { background: rgba(240,160,32,0.06); border-color: #f0a020; }
</style>
