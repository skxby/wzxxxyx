<script setup lang="ts">
// ============================================================
// 角色创建与灵根觉醒面板
// ============================================================
import { ref, reactive } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import type { Gender, CultivationType } from '@/types'
import { CultivationTypeLabel, SpiritRootLabel } from '@/types'
import { randomPickN, rollProbability } from '@/utils/random'

const playerStore = usePlayerStore()

const name = ref('')
const gender = ref<Gender>('male')
const cultivationType = ref<CultivationType>('sword')
const showPreview = ref(false)
const previewRoots = ref<string[]>([])

// 预览灵根（实际创建时重新随机）
function previewSpiritRoots() {
  const roots = randomPickN(['gold', 'wood', 'water', 'fire', 'earth', 'wind', 'thunder'],
    rollProbability(0.7) ? 1 : 2)
  previewRoots.value = roots
  showPreview.value = true
}

function createCharacter() {
  if (!name.value.trim()) {
    alert('请输入道号！')
    return
  }
  playerStore.createPlayer(name.value.trim(), gender.value, cultivationType.value)
  playerStore.startCultivation()
}

// 道修方向描述
const cultivationDescs: Record<CultivationType, string> = {
  sword: '以剑证道，攻击见长，暴击率提升。剑修者一剑破万法，战力无双。',
  spirit: '感悟天道，防御均衡，修炼速度最快。灵修者与天地共鸣，境界突破更容易。',
  demon: '逆天而行，攻击力极强但生命值较低。邪修者不择手段，爆发力惊人。',
}
</script>

<template>
  <div class="create-container">
    <div class="create-card fade-in">
      <!-- 标题 -->
      <div class="title-section">
        <h1 class="text-ancient">修 仙 世 界</h1>
        <p class="subtitle">踏入修仙之路，问道长生</p>
      </div>

      <!-- 创建表单 -->
      <div class="form-section">
        <!-- 道号 -->
        <div class="form-group">
          <label>道 号</label>
          <input
            v-model="name"
            type="text"
            placeholder="请输入你的道号..."
            maxlength="8"
            class="name-input"
          />
        </div>

        <!-- 性别 -->
        <div class="form-group">
          <label>性 别</label>
          <div class="option-group">
            <button
              :class="['option-btn', { active: gender === 'male' }]"
              @click="gender = 'male'"
            >👨 男</button>
            <button
              :class="['option-btn', { active: gender === 'female' }]"
              @click="gender = 'female'"
            >👩 女</button>
          </div>
        </div>

        <!-- 修炼方向 -->
        <div class="form-group">
          <label>修炼方向</label>
          <div class="option-group vertical">
            <button
              v-for="ct in (['sword', 'spirit', 'demon'] as CultivationType[])"
              :key="ct"
              :class="['option-btn wide', { active: cultivationType === ct }]"
              @click="cultivationType = ct"
            >
              <span class="ct-name">{{ CultivationTypeLabel[ct] }}</span>
              <span class="ct-desc">{{ cultivationDescs[ct] }}</span>
            </button>
          </div>
        </div>

        <!-- 灵根预览 -->
        <div class="form-group">
          <label>灵根觉醒</label>
          <button class="preview-btn" @click="previewSpiritRoots">
            🔮 预览灵根觉醒
          </button>
          <div v-if="showPreview" class="root-preview fade-in">
            <p>觉醒灵根：</p>
            <span
              v-for="root in previewRoots"
              :key="root"
              class="root-tag"
            >{{ SpiritRootLabel[root as keyof typeof SpiritRootLabel] }}</span>
            <p class="root-note">（正式创建时灵根将随机觉醒，单灵根概率70%，双灵根30%）</p>
          </div>
        </div>

        <!-- 概率说明 -->
        <div class="rules-box">
          <h4>📋 灵根觉醒规则</h4>
          <ul>
            <li>7种灵根：金、木、水、火、土、风、雷</li>
            <li>最多觉醒1~2种灵根，无三灵根及以上</li>
            <li>7种单灵根概率均等，单灵根概率＞双灵根</li>
            <li>单灵根修炼速度更快，双灵根属性更全面</li>
            <li>创建后可随时重置灵根（重置后修为清零）</li>
          </ul>
        </div>

        <!-- 创建按钮 -->
        <button class="create-btn" @click="createCharacter">
          ⚔️ 踏入仙途
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.create-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.create-card {
  width: 100%;
  max-width: 520px;
  background: rgba(22, 33, 62, 0.95);
  border: 1px solid #2a2a4a;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.title-section {
  text-align: center;
  margin-bottom: 30px;
}

.title-section h1 {
  font-size: 2.4rem;
  color: #ffd700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.subtitle {
  color: #a0a0b0;
  margin-top: 8px;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #c0c0d0;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.name-input {
  width: 100%;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.name-input:focus {
  border-color: #533483;
}

.option-group {
  display: flex;
  gap: 10px;
}

.option-group.vertical {
  flex-direction: column;
}

.option-btn {
  flex: 1;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  color: #c0c0d0;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.option-btn.wide {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-btn:hover {
  background: rgba(83, 52, 131, 0.2);
  border-color: #533483;
}

.option-btn.active {
  background: rgba(83, 52, 131, 0.4);
  border-color: #7b5ea7;
  color: #fff;
}

.ct-name {
  font-size: 1rem;
  font-weight: bold;
  color: #ffd700;
}

.ct-desc {
  font-size: 0.78rem;
  color: #9090a0;
}

.preview-btn {
  width: 100%;
  padding: 10px;
  background: rgba(255, 215, 0, 0.1);
  border: 1px dashed #ffd700;
  border-radius: 8px;
  color: #ffd700;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.preview-btn:hover {
  background: rgba(255, 215, 0, 0.2);
}

.root-preview {
  margin-top: 10px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  text-align: center;
}

.root-tag {
  display: inline-block;
  padding: 4px 12px;
  margin: 4px;
  background: rgba(83, 52, 131, 0.5);
  border: 1px solid #7b5ea7;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #ffd700;
}

.root-note {
  margin-top: 8px;
  font-size: 0.75rem;
  color: #808090;
}

.rules-box {
  margin-bottom: 20px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid #2a2a4a;
  border-radius: 8px;
}

.rules-box h4 {
  color: #c0c0d0;
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.rules-box ul {
  list-style: none;
  padding: 0;
}

.rules-box li {
  color: #9090a0;
  font-size: 0.78rem;
  padding: 2px 0;
  padding-left: 16px;
  position: relative;
}

.rules-box li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #7b5ea7;
}

.create-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #533483, #7b5ea7);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  letter-spacing: 4px;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(83, 52, 131, 0.4);
}
</style>
