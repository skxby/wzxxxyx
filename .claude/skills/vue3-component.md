---
name: vue3-component
description: Use when creating or modifying Vue 3 components. Ensures consistency with Composition API, TypeScript, Naive UI usage, and project coding standards.
---

# Vue 3 组件开发 Skill

## 组件模板

```vue
<script setup lang="ts">
// 1. 类型导入
import type { PropType } from 'vue'
import type { Player, Item } from '@/types'

// 2. Props & Emits
const props = defineProps({
  player: { type: Object as PropType<Player>, required: true },
  items: { type: Array as PropType<Item[]>, default: () => [] }
})
const emit = defineEmits<{
  'item-used': [item: Item]
  'panel-closed': []
}>()

// 3. 响应式状态
const isVisible = ref(false)
const selectedItem = ref<Item | null>(null)

// 4. 计算属性
const filteredItems = computed(() =>
  props.items.filter(i => i.type === 'weapon')
)

// 5. 方法
function handleUse(item: Item) {
  emit('item-used', item)
}

// 6. 生命周期
onMounted(() => { /* ... */ })
</script>

<template>
  <n-card :title="panelTitle" size="small">
    <n-scrollbar style="max-height: 400px">
      <n-space vertical>
        <!-- 内容 -->
      </n-space>
    </n-scrollbar>
  </n-card>
</template>

<style scoped>
.panel-container { /* ... */ }
</style>
```

## 命名规范
- 文件名: PascalCase (如 `CultivationPanel.vue`)
- 组件名: 同上
- Props: camelCase
- Events: kebab-case (如 `@item-used`)
- CSS class: kebab-case

## Naive UI 常用组件
- `n-card` - 面板容器
- `n-button` - 按钮，使用 type 区分：primary(主要操作)/info(信息)/success(成功)/warning(警告)/error(危险)
- `n-progress` - 进度条（修炼进度、血量等）
- `n-modal` - 弹窗（突破结果、战斗结算）
- `n-tag` - 标签（境界标识、物品品质）
- `n-tabs` - 标签页切换
- `n-scrollbar` - 自定义滚动条
- `n-space` - 间距布局
- `n-grid / n-gi` - 栅格布局
- `n-message` - 消息提示
- `n-spin` - 加载状态
- `n-popover` - 悬浮提示（物品详情）

## 品质配色方案
- 凡品: #9E9E9E (灰)
- 中品: #4CAF50 (绿)
- 上品: #2196F3 (蓝)
- 极品: #9C27B0 (紫)
- 仙品: #FF9800 (橙)
- 神品: #F44336 (红)

## 开发注意事项
- 使用 `<script setup>` 语法
- 所有变量显式类型标注
- 避免深层嵌套的响应式对象
- 大列表使用 `v-memo` 优化
- 游戏面板使用 `n-card` 包裹
- 保持修仙主题的古风氛围（可使用合适的字体/颜色）
