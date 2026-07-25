<script setup lang="ts">
// ============================================================
// 战斗面板 v2 - 动画特效增强
// ============================================================
import { computed, ref, watch, nextTick, onUnmounted } from 'vue'
import { useCombatStore } from '@/stores/combatStore'
import { usePlayerStore } from '@/stores/playerStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { getEnemyById, getEnemiesByTier } from '@/data/enemies'

const combatStore = useCombatStore()
const playerStore = usePlayerStore()
const inventoryStore = useInventoryStore()

const selectedTier = ref('novice')
const showEnemyList = ref(!combatStore.inCombat)
const logContainer = ref<HTMLElement | null>(null)
const playerHpPercent = ref(100)
const enemyHpPercent = ref(100)
const lastLogType = ref('')
const floatDamage = ref<{ id: number; text: string; side: 'player' | 'enemy'; crit: boolean }[]>([])
let floatId = 0

// 自动滚动日志
watch(() => combatStore.logs.length, async () => {
  await nextTick()
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
  if (combatStore.logs.length > 0) {
    lastLogType.value = combatStore.logs[combatStore.logs.length - 1].type
  }
  updateHpBars()
})

// 自动更新血条
function updateHpBars() {
  const pu = combatStore.playerUnit
  const eu = combatStore.enemyUnit
  if (pu) playerHpPercent.value = (pu.attributes.currentHp / pu.attributes.maxHp) * 100
  if (eu) enemyHpPercent.value = (eu.attributes.currentHp / eu.attributes.maxHp) * 100
}

// 飘字
function showFloat(text: string, side: 'player' | 'enemy', crit: boolean) {
  const id = floatId++
  floatDamage.value.push({ id, text, side, crit })
  setTimeout(() => { floatDamage.value = floatDamage.value.filter(f => f.id !== id) }, 1100)
}

const enemyOptions = computed(() => getEnemiesByTier(selectedTier.value))

function selectEnemy(enemyId: string) {
  combatStore.initCombat(enemyId)
  showEnemyList.value = false
}

function doAttack() {
  combatStore.playerAction(0)
  updateHpBars()
  // 飘字
  const lastLog = combatStore.logs[combatStore.logs.length - 1]
  if (lastLog?.type === 'crit') showFloat('暴击!', 'enemy', true)
  else if (lastLog?.type === 'miss') showFloat('未命中', 'enemy', false)
  else if (lastLog?.type === 'normal') showFloat('攻击', 'enemy', false)

  if (combatStore.phase === 'enemy_turn') {
    setTimeout(() => {
      combatStore.enemyAction()
      updateHpBars()
      showFloat('反击', 'player', false)
    }, 700)
  }
}

const isAutoBattle = ref(false)
let autoTimer: any = null

function toggleAuto() {
  isAutoBattle.value = !isAutoBattle.value
  if (isAutoBattle.value) {
    autoTimer = setInterval(() => {
      if (combatStore.phase === 'player_turn') doAttack()
      else if (!combatStore.inCombat) stopAuto()
    }, 1100)
  } else stopAuto()
}

function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null } isAutoBattle.value = false }
onUnmounted(() => stopAuto())

function back() { combatStore.leaveCombat(); stopAuto(); showEnemyList.value = true }
function acceptDrop(i: number) { combatStore.handleDropChoice(true, i) }
function rejectDrop(i: number) { combatStore.handleDropChoice(false, i) }

// 敌人图标
const enemyIcon = computed(() => {
  const e = combatStore.enemyData
  if (!e) return '👹'
  const tierIcons: Record<string, string> = {
    novice: '🐺', normal: '🐍', elite: '👹', lord: '🐉',
    ancient_beast: '🦅', unique_boss: '👿',
  }
  return tierIcons[e.tier] || '👹'
})
</script>

<template>
  <div class="combat-v2">
    <!-- ===== 选敌界面 ===== -->
    <div v-if="showEnemyList" class="select-screen fade-in-up">
      <h2 class="select-title">⚔️ 选择挑战目标</h2>
      <div class="tier-tabs">
        <button v-for="t in [
          { k:'novice',l:'新手' },{ k:'normal',l:'普通' },{ k:'elite',l:'精英' },
          { k:'lord',l:'领主' },{ k:'ancient_beast',l:'神兽' },{ k:'unique_boss',l:'唯一' }
        ]" :key="t.k" :class="['tier-tab',{active:selectedTier===t.k}]" @click="selectedTier=t.k">{{ t.l }}</button>
      </div>
      <div class="enemy-grid">
        <div v-for="e in enemyOptions" :key="e.id" class="enemy-card" @click="selectEnemy(e.id)">
          <div class="ec-icon">{{ e.id.includes('dragon')||e.id.includes('serpent')?'🐉':e.id.includes('phoenix')||e.id.includes('bird')?'🦅':e.id.includes('thunder')?'⚡':e.id.includes('fire')?'🔥':e.id.includes('ice')?'❄️':e.id.includes('demon')||e.id.includes('shadow')?'👿':e.id.includes('tiger')?'🐯':e.id.includes('snake')?'🐍':'👹' }}</div>
          <div class="ec-name">{{ e.name }}</div>
          <div class="ec-stats">❤️{{ e.stats.maxHp }} ⚔️{{ e.stats.attack }}</div>
          <div class="ec-rewards">🏆{{ e.expReward }}修 💎{{ e.stoneReward }}石</div>
        </div>
        <div v-if="enemyOptions.length===0" class="empty">该梯度暂无敌人</div>
      </div>
    </div>

    <!-- ===== 战斗场景 ===== -->
    <div v-else class="battle-screen fade-in">
      <!-- 对战舞台 -->
      <div class="battle-stage">
        <!-- 玩家侧 -->
        <div class="fighter player-side">
          <div class="fighter-avatar">
            <span class="fighter-icon">{{ playerStore.player?.cultivationType==='sword'?'⚔️':playerStore.player?.cultivationType==='spirit'?'🔮':'👿' }}</span>
            <div class="hp-bar-wrap">
              <div class="hp-bar p-hp" :style="{width:playerHpPercent+'%'}"/>
            </div>
            <span class="hp-num">{{combatStore.playerUnit?.attributes.currentHp}}/{{combatStore.playerUnit?.attributes.maxHp}}</span>
          </div>
          <div class="fighter-name">{{ playerStore.player?.name }}</div>
          <!-- 飘字 -->
          <div v-for="fd in floatDamage.filter(f=>f.side==='player')" :key="fd.id" :class="['damage-pop',fd.crit?'crit':'']">
            {{ fd.text }}
          </div>
        </div>

        <!-- VS -->
        <div class="vs-divider">
          <span class="vs-text">VS</span>
        </div>

        <!-- 敌人侧 -->
        <div class="fighter enemy-side">
          <div class="fighter-avatar">
            <span class="fighter-icon big">{{ enemyIcon }}</span>
            <div class="hp-bar-wrap">
              <div class="hp-bar e-hp" :style="{width:enemyHpPercent+'%'}"/>
            </div>
            <span class="hp-num">{{combatStore.enemyUnit?.attributes.currentHp}}/{{combatStore.enemyUnit?.attributes.maxHp}}</span>
          </div>
          <div class="fighter-name">{{ combatStore.enemyUnit?.name }}</div>
          <!-- 飘字 -->
          <div v-for="fd in floatDamage.filter(f=>f.side==='enemy')" :key="fd.id" :class="['damage-pop',fd.crit?'crit':'']">
            {{ fd.text }}
          </div>
        </div>
      </div>

      <!-- 战斗日志 -->
      <div class="battle-log" ref="logContainer">
        <div v-for="(log,i) in combatStore.logs" :key="i" :class="['log-line',log.type]">
          <span class="log-round" v-if="log.round>0">[{{log.round}}]</span> {{ log.message }}
        </div>
      </div>

      <!-- 操作 -->
      <div class="battle-bar" v-if="combatStore.inCombat">
        <button class="bbtn attack" :disabled="combatStore.phase!=='player_turn'" @click="doAttack">⚔️ 攻击</button>
        <button class="bbtn flee" :disabled="combatStore.phase!=='player_turn'" @click="combatStore.flee()">🏃 逃跑</button>
        <button :class="['bbtn auto',{active:isAutoBattle}]" @click="toggleAuto">{{ isAutoBattle?'⏸️ 手动':'🤖 自动' }}</button>
      </div>

      <!-- 掉落 -->
      <div v-if="combatStore.showDropChoice" class="drop-pop fade-in-up">
        <h4>🎁 获得战利品</h4>
        <div v-for="(item,i) in combatStore.pendingDrops" :key="i" class="drop-row">
          <span>{{ item.name }}</span>
          <span :class="'q-'+item.rarity">[{{ item.rarity }}]</span>
          <button class="dbtn accept" @click="acceptDrop(i)">领取</button>
          <button class="dbtn reject" @click="rejectDrop(i)">放弃</button>
        </div>
      </div>

      <!-- 结果 -->
      <div v-if="!combatStore.inCombat && combatStore.phase!=='idle'" class="battle-result">
        <div class="result-msg">{{ combatStore.phase==='victory'?'🎉 胜利！':combatStore.phase==='defeat'?'💀 败北...':'🏃 已逃跑' }}</div>
        <button class="bbtn back" @click="back">↩ 返回</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.combat-v2 { height: 100%; }

/* ===== 选敌 ===== */
.select-screen { padding: 10px; }
.select-title { text-align: center; color: #ffd700; font-family: var(--font-ancient); margin-bottom: 10px; font-size: 1.1rem; }
.tier-tabs { display: flex; gap: 4px; margin-bottom: 10px; flex-wrap: wrap; justify-content: center; }
.tier-tab {
  padding: 5px 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px; color: #807870; font-size: 0.72rem; cursor: pointer; transition: all 0.2s;
}
.tier-tab.active { background: rgba(122,94,176,0.3); border-color: #7b5eb0; color: #ffd700; }
.enemy-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.enemy-card {
  background: var(--bg-card); border: 1px solid var(--border-panel); border-radius: 10px;
  padding: 12px; text-align: center; cursor: pointer; transition: all 0.2s;
}
.enemy-card:hover { border-color: #7b5eb0; transform: translateY(-2px); }
.enemy-card:active { transform: scale(0.96); }
.ec-icon { font-size: 2rem; margin-bottom: 4px; }
.ec-name { color: #e0e0e0; font-weight: bold; font-size: 0.85rem; }
.ec-stats { font-size: 0.7rem; color: #a09888; margin: 3px 0; }
.ec-rewards { font-size: 0.68rem; color: #4ecb71; }

/* ===== 战斗场景 ===== */
.battle-stage { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 16px 8px; }
.fighter { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
.fighter-avatar { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.fighter-icon { font-size: 3rem; display: block; }
.fighter-icon.big { font-size: 3.5rem; }
.fighter-name { font-size: 0.82rem; color: #e0e0e0; margin-top: 4px; font-weight: bold; }

.hp-bar-wrap { width: 80px; height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; }
.hp-bar { height: 100%; border-radius: 4px; transition: width 0.4s; }
.p-hp { background: linear-gradient(90deg, #4ecb71, #2ecc71); }
.e-hp { background: linear-gradient(90deg, #e85545, #f06050); }
.hp-num { font-size: 0.62rem; color: #a09888; }

.vs-divider { flex: 0; }
.vs-text { font-size: 1.5rem; font-weight: bold; color: #ffd700; text-shadow: 0 0 10px rgba(255,215,0,0.4); }

/* 飘字 */
.damage-pop {
  position: absolute; right: -20px; top: 10px;
  font-size: 1rem; font-weight: bold; pointer-events: none;
  animation: floatDmg 1s ease-out forwards; z-index: 20;
  color: #fff;
}
.damage-pop.crit { font-size: 1.3rem; color: #ffa726; text-shadow: 0 0 10px rgba(255,167,38,0.6); }
@keyframes floatDmg {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-40px) scale(1.3); }
}

/* 日志 */
.battle-log {
  height: 140px; overflow-y: auto; margin: 0 10px;
  background: rgba(0,0,0,0.3); border-radius: 8px; padding: 8px;
  border: 1px solid rgba(255,255,255,0.05);
}
.log-line { padding: 2px 0; font-size: 0.75rem; color: #b0b0b0; border-bottom: 1px solid rgba(255,255,255,0.02); }
.log-line.crit { color: #ffa726; }
.log-line.miss { color: #807870; }
.log-line.system { color: #40a0e0; }
.log-round { color: #606060; font-size: 0.65rem; }

/* 操作栏 */
.battle-bar { display: flex; gap: 8px; padding: 10px; }
.bbtn {
  flex: 1; padding: 10px; border: none; border-radius: 10px;
  color: #fff; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
}
.bbtn:disabled { opacity: 0.35; }
.bbtn:active { transform: scale(0.95); }
.bbtn.attack { background: #e85545; }
.bbtn.flee { background: #607080; }
.bbtn.auto { background: #4ecb71; }
.bbtn.auto.active { background: #f0a020; }
.bbtn.back { width: 100%; background: #7b5eb0; margin-top: 6px; }

/* 掉落 */
.drop-pop {
  margin: 10px; padding: 14px;
  background: linear-gradient(135deg, #1e2048, #2a2060);
  border: 2px solid #ffd700; border-radius: 16px;
}
.drop-pop h4 { color: #ffd700; margin-bottom: 8px; }
.drop-row { display: flex; align-items: center; gap: 6px; padding: 6px 0; font-size: 0.85rem; }
.dbtn { padding: 4px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem; }
.dbtn.accept { background: #4ecb71; color: #fff; }
.dbtn.reject { background: #e85545; color: #fff; }

/* 结果 */
.battle-result { text-align: center; padding: 20px; }
.result-msg { font-size: 1.4rem; color: #ffd700; font-family: var(--font-ancient); margin-bottom: 12px; }

.empty { grid-column: 1/-1; text-align: center; color: #606060; padding: 30px; }
</style>
