<script setup lang="ts">
// ============================================================
// 修炼面板 - 修炼进度 + 境界突破
// ============================================================
import { computed, ref } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'

const playerStore = usePlayerStore()
const breakthroughMsg = ref('')
const msgType = ref<'success' | 'error' | 'info'>('info')

const progress = computed(() => playerStore.cultivationProgress())
const realmName = computed(() => playerStore.currentRealmInfo()?.name || '凡人')
const realmDesc = computed(() => playerStore.currentRealmInfo()?.description || '')

function doBreakthrough() {
  try {
    const result = playerStore.breakthrough()
    breakthroughMsg.value = result.message
    msgType.value = result.success ? 'success' : result.tribulationTriggered ? 'error' : 'info'
  } catch (e: any) {
    breakthroughMsg.value = e.message || '突破失败'
    msgType.value = 'error'
  }

  // 自动清除消息
  setTimeout(() => { breakthroughMsg.value = '' }, 5000)
}
</script>

<template>
  <div class="cultivation-panel">
    <!-- 当前境界 -->
    <div class="realm-card fade-in">
      <div class="realm-name text-ancient">{{ realmName }}</div>
      <div class="realm-desc">{{ realmDesc }}</div>
    </div>

    <!-- 修炼进度条 -->
    <div class="progress-card fade-in">
      <div class="progress-header">
        <span>修炼进度</span>
        <span class="progress-text">{{ progress.current }} / {{ progress.required }}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress.percent + '%' }"></div>
      </div>
      <div class="progress-percent">{{ progress.percent }}%</div>
      <p class="progress-hint">修炼自动进行中，每秒获得修为...</p>
    </div>

    <!-- 突破按钮 -->
    <div class="breakthrough-card fade-in">
      <h3>⚡ 境界突破</h3>
      <p class="breakthrough-info">
        突破成功率受悟性、道心、气运影响。
        高境界突破可能触发天劫！
      </p>
      <button class="breakthrough-btn" @click="doBreakthrough">
        🔥 尝试突破
      </button>

      <!-- 突破结果 -->
      <div v-if="breakthroughMsg" :class="['result-msg', msgType]">
        {{ breakthroughMsg }}
      </div>
    </div>

    <!-- 境界列表 -->
    <div class="realm-list fade-in">
      <h3>📜 修仙境界一览</h3>
      <div class="realm-items">
        <div
          v-for="realm in [
            { name: '凡人', desc: '修仙起点' },
            { name: '炼气期', desc: '感应灵气' },
            { name: '筑基期', desc: '筑就道基' },
            { name: '金丹期', desc: '凝结金丹' },
            { name: '元婴期', desc: '金丹化婴' },
            { name: '化神期', desc: '化身千万' },
            { name: '炼虚期', desc: '炼化虚空' },
            { name: '合体期', desc: '天人合一' },
            { name: '大乘期', desc: '万法归一' },
            { name: '渡劫期', desc: '飞升在即' },
          ]"
          :key="realm.name"
          :class="['realm-item', { current: realmName === realm.name }]"
        >
          <span>{{ realm.name }}</span>
          <span class="realm-item-desc">{{ realm.desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cultivation-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.realm-card {
  text-align: center;
  padding: 20px;
  background: rgba(22, 33, 62, 0.8);
  border: 1px solid #2a2a4a;
  border-radius: 10px;
}

.realm-name {
  font-size: 1.8rem;
  color: #ffd700;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}

.realm-desc {
  color: #9090a0;
  margin-top: 6px;
  font-size: 0.85rem;
}

.progress-card {
  background: rgba(22, 33, 62, 0.8);
  border: 1px solid #2a2a4a;
  border-radius: 10px;
  padding: 14px;
  text-align: center;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.85rem;
  color: #c0c0d0;
}

.progress-text {
  color: #9090a0;
}

.progress-bar {
  height: 14px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 7px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #533483, #7b5ea7, #ffd700);
  border-radius: 7px;
  transition: width 0.5s ease;
}

.progress-percent {
  font-size: 1.2rem;
  color: #ffd700;
  font-weight: bold;
  margin-top: 6px;
}

.progress-hint {
  color: #707080;
  font-size: 0.75rem;
  margin-top: 4px;
}

.breakthrough-card {
  background: rgba(22, 33, 62, 0.8);
  border: 1px solid #2a2a4a;
  border-radius: 10px;
  padding: 14px;
  text-align: center;
}

.breakthrough-card h3 {
  color: #ffd700;
  margin-bottom: 8px;
}

.breakthrough-info {
  color: #9090a0;
  font-size: 0.8rem;
  margin-bottom: 12px;
}

.breakthrough-btn {
  padding: 10px 30px;
  background: linear-gradient(135deg, #e67e22, #f39c12);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.breakthrough-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(243, 156, 18, 0.4);
}

.result-msg {
  margin-top: 10px;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.9rem;
}

.result-msg.success {
  background: rgba(46, 204, 113, 0.2);
  border: 1px solid #2ecc71;
  color: #2ecc71;
}

.result-msg.error {
  background: rgba(231, 76, 60, 0.2);
  border: 1px solid #e74c3c;
  color: #e74c3c;
}

.result-msg.info {
  background: rgba(52, 152, 219, 0.2);
  border: 1px solid #3498db;
  color: #3498db;
}

.realm-list {
  background: rgba(22, 33, 62, 0.8);
  border: 1px solid #2a2a4a;
  border-radius: 10px;
  padding: 14px;
}

.realm-list h3 {
  color: #ffd700;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.realm-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.realm-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.82rem;
  color: #808090;
}

.realm-item.current {
  background: rgba(83, 52, 131, 0.3);
  color: #ffd700;
  font-weight: bold;
}

.realm-item-desc {
  color: #707080;
  font-size: 0.75rem;
}
</style>
