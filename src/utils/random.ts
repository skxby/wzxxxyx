// ============================================================
// 随机数/概率工具 - 游戏核心随机引擎
// ============================================================

/**
 * 简单随机数 (0到max-1的整数)
 */
export function randomInt(max: number): number {
  return Math.floor(Math.random() * max)
}

/**
 * 随机浮点数 [0, 1)
 */
export function randomFloat(): number {
  return Math.random()
}

/**
 * 范围随机整数 [min, max] 包含两端
 */
export function randomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 概率判定 - 传入0-1之间的概率值，返回是否触发
 */
export function rollProbability(chance: number): boolean {
  return Math.random() < Math.max(0, Math.min(1, chance))
}

/**
 * 加权随机选择 - 从数组中根据权重随机选取一个元素
 * @param items 元素数组
 * @param weightFn 获取每个元素权重的函数
 */
export function weightedRandom<T>(items: T[], weightFn: (item: T) => number): T | null {
  if (items.length === 0) return null
  const totalWeight = items.reduce((sum, item) => sum + weightFn(item), 0)
  if (totalWeight <= 0) return items[randomInt(items.length)]
  let random = Math.random() * totalWeight
  for (const item of items) {
    random -= weightFn(item)
    if (random <= 0) return item
  }
  return items[items.length - 1]
}

/**
 * 从数组中随机选取一个元素（等概率）
 */
export function randomPick<T>(items: T[]): T | null {
  if (items.length === 0) return null
  return items[randomInt(items.length)]
}

/**
 * 从数组中随机选取N个不重复元素
 */
export function randomPickN<T>(items: T[], n: number): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(n, items.length))
}

/**
 * 打乱数组
 */
export function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * 钳制数值在区间内
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
