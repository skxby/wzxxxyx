<script setup lang="ts">
// ============================================================
// 根组件 - 游戏主入口
// ============================================================
import { onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from './stores/playerStore'
import CharacterCreate from './components/panels/CharacterCreate.vue'
import GameLayout from './components/layout/GameLayout.vue'

const playerStore = usePlayerStore()

onMounted(() => {
  // 尝试加载已有存档
  if (playerStore.hasExistingSave()) {
    playerStore.loadGameData()
  }
  // 如果已创建角色，开始修炼
  if (playerStore.isCreated) {
    playerStore.startCultivation()
  }
})

onUnmounted(() => {
  playerStore.stopCultivation()
})
</script>

<template>
  <div class="app-container">
    <!-- 创建角色 / 游戏主界面 -->
    <CharacterCreate v-if="!playerStore.isCreated" />
    <GameLayout v-else />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
</style>
