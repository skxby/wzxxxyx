// ============================================================
// 制作系统数据 - 炼丹/炼器/阵法配方
// ============================================================

export interface CraftRecipe {
  id: string
  name: string
  type: 'alchemy' | 'forging' | 'formation'
  rarity: 'green' | 'blue' | 'purple' | 'gold'
  description: string
  /** 所需材料：[itemId, 数量] */
  materials: [string, number][]
  /** 制作结果 itemId */
  resultItemId: string
  /** 基础成功率 0-1 */
  baseSuccessRate: number
  /** 所需最低境界等级 */
  minRealmLevel: number
  /** 消耗灵石 */
  stoneCost: number
  /** 制作时间（秒） */
  craftTime: number
}

export const recipes: CraftRecipe[] = [
  // ==================== 炼丹 (alchemy) ====================
  {
    id: 'recipe_pill_heal_small', name: '小还丹配方', type: 'alchemy', rarity: 'green',
    description: '将灵草炼制成恢复丹药', materials: [['mat_herb', 2]], resultItemId: 'pill_heal_small',
    baseSuccessRate: 0.85, minRealmLevel: 0, stoneCost: 3, craftTime: 5,
  },
  {
    id: 'recipe_pill_heal_medium', name: '大还丹配方', type: 'alchemy', rarity: 'green',
    description: '以灵草辅以灵芝炼制', materials: [['mat_herb', 3], ['mat_herb_rare', 1]], resultItemId: 'pill_heal_medium',
    baseSuccessRate: 0.75, minRealmLevel: 1, stoneCost: 10, craftTime: 10,
  },
  {
    id: 'recipe_pill_heal_large', name: '九转还魂丹配方', type: 'alchemy', rarity: 'blue',
    description: '以稀有材料炼制强力恢复丹', materials: [['mat_herb_rare', 3], ['mat_jade_fire', 1]], resultItemId: 'pill_heal_large',
    baseSuccessRate: 0.65, minRealmLevel: 2, stoneCost: 40, craftTime: 20,
  },
  {
    id: 'recipe_pill_cultivation', name: '聚灵丹配方', type: 'alchemy', rarity: 'green',
    description: '凝聚灵气为丹，服用增加修为', materials: [['mat_herb', 3]], resultItemId: 'pill_cultivation',
    baseSuccessRate: 0.80, minRealmLevel: 0, stoneCost: 15, craftTime: 8,
  },
  {
    id: 'recipe_pill_breakthrough', name: '破境丹配方', type: 'alchemy', rarity: 'purple',
    description: '提升突破成功率的珍稀丹药', materials: [['mat_herb_rare', 5], ['mat_dragon_blood', 1]], resultItemId: 'pill_breakthrough',
    baseSuccessRate: 0.45, minRealmLevel: 3, stoneCost: 250, craftTime: 60,
  },
  {
    id: 'recipe_pill_divine', name: '神元丹配方', type: 'alchemy', rarity: 'gold',
    description: '永久提升根骨的仙丹', materials: [['mat_dragon_blood', 3], ['mat_phoenix_feather', 2]], resultItemId: 'pill_divine',
    baseSuccessRate: 0.25, minRealmLevel: 5, stoneCost: 1500, craftTime: 120,
  },
  {
    id: 'recipe_pill_immortal', name: '仙灵续命丹配方', type: 'alchemy', rarity: 'purple',
    description: '炼制传说中的续命仙丹', materials: [['mat_herb_rare', 5], ['mat_dragon_blood', 2]], resultItemId: 'pill_heal_immortal',
    baseSuccessRate: 0.50, minRealmLevel: 4, stoneCost: 200, craftTime: 40,
  },

  // ==================== 炼器 (forging) ====================
  {
    id: 'recipe_sword_steel', name: '精钢剑锻造', type: 'forging', rarity: 'green',
    description: '以玄铁锻造精钢剑', materials: [['mat_ore_iron', 3]], resultItemId: 'sword_steel',
    baseSuccessRate: 0.80, minRealmLevel: 1, stoneCost: 25, craftTime: 15,
  },
  {
    id: 'recipe_sword_ice', name: '寒冰剑锻造', type: 'forging', rarity: 'blue',
    description: '加入火灵玉淬炼寒冰剑', materials: [['mat_ore_spirit', 3], ['mat_jade_fire', 1]], resultItemId: 'sword_ice',
    baseSuccessRate: 0.60, minRealmLevel: 2, stoneCost: 100, craftTime: 30,
  },
  {
    id: 'recipe_sword_thunder', name: '紫电神剑锻造', type: 'forging', rarity: 'purple',
    description: '以雷属性材料锻造成神剑', materials: [['mat_ore_spirit', 5], ['mat_phoenix_feather', 1]], resultItemId: 'sword_thunder',
    baseSuccessRate: 0.40, minRealmLevel: 4, stoneCost: 500, craftTime: 90,
  },
  {
    id: 'recipe_armor_spirit', name: '灵光法袍制作', type: 'forging', rarity: 'purple',
    description: '以灵丝织就法袍', materials: [['mat_ore_spirit', 4], ['mat_dragon_blood', 1]], resultItemId: 'armor_spirit',
    baseSuccessRate: 0.45, minRealmLevel: 3, stoneCost: 400, craftTime: 60,
  },
  {
    id: 'recipe_acc_crown', name: '凤凰冠锻造', type: 'forging', rarity: 'purple',
    description: '融合凤凰翎锻造华贵发冠', materials: [['mat_phoenix_feather', 2], ['mat_ore_spirit', 3]], resultItemId: 'acc_crown_phoenix',
    baseSuccessRate: 0.40, minRealmLevel: 4, stoneCost: 450, craftTime: 75,
  },
  {
    id: 'recipe_sword_immortal', name: '诛仙剑锻造', type: 'forging', rarity: 'gold',
    description: '以龙血草、凤凰翎和龙珠锻造仙剑', materials: [['mat_dragon_blood', 5], ['mat_phoenix_feather', 3], ['mat_jade_fire', 5]], resultItemId: 'sword_immortal',
    baseSuccessRate: 0.20, minRealmLevel: 6, stoneCost: 3000, craftTime: 300,
  },

  // ==================== 阵法 (formation) ====================
  {
    id: 'formation_attack', name: '杀阵·烈阳', type: 'formation', rarity: 'blue',
    description: '布置烈阳杀阵，战斗开始对敌人造成额外伤害', materials: [['mat_jade_fire', 3]], resultItemId: 'pill_cultivation',
    baseSuccessRate: 0.65, minRealmLevel: 2, stoneCost: 80, craftTime: 20,
  },
  {
    id: 'formation_defense', name: '护阵·玄武', type: 'formation', rarity: 'blue',
    description: '布置玄武护阵，进入战斗时获得防御加成', materials: [['mat_jade_fire', 2], ['mat_ore_spirit', 2]], resultItemId: 'pill_heal_medium',
    baseSuccessRate: 0.65, minRealmLevel: 2, stoneCost: 80, craftTime: 20,
  },
  {
    id: 'formation_cultivation', name: '聚灵阵', type: 'formation', rarity: 'green',
    description: '布置聚灵阵，修炼速度提升20%（持续1小时）', materials: [['mat_ore_spirit', 3], ['mat_jade_fire', 1]], resultItemId: 'pill_cultivation',
    baseSuccessRate: 0.75, minRealmLevel: 1, stoneCost: 50, craftTime: 30,
  },
  {
    id: 'formation_tribulation', name: '渡劫阵', type: 'formation', rarity: 'purple',
    description: '布置渡劫阵，突破时天劫存活率提升15%', materials: [['mat_dragon_blood', 3], ['mat_jade_fire', 5]], resultItemId: 'pill_breakthrough',
    baseSuccessRate: 0.35, minRealmLevel: 5, stoneCost: 800, craftTime: 180,
  },
]
