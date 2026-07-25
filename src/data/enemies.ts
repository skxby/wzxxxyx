// ============================================================
// 敌人/BOSS数据配置 - 覆盖全梯度
// ============================================================
import type { Enemy } from '@/types'

export const enemies: Enemy[] = [
  // ==================== 新手BOSS (novice) ====================
  { id: 'novice_wolf', name: '妖狼', tier: 'novice', realmLevel: 0, stats: { maxHp: 50, attack: 8, defense: 3, dodge: 0.02, accuracy: 0.05, speed: 5, critRate: 0.02, critResist: 0.01 }, skills: [], drops: [{ itemId: 'pill_heal_small', probability: 0.5, rarity: 'white' }, { itemId: 'mat_herb', probability: 0.6, rarity: 'white' }], expReward: 20, stoneReward: 5, description: '山间常见的妖狼' },
  { id: 'novice_bandit', name: '山贼喽啰', tier: 'novice', realmLevel: 0, stats: { maxHp: 60, attack: 10, defense: 4, dodge: 0.03, accuracy: 0.05, speed: 4, critRate: 0.03, critResist: 0.01 }, skills: [], drops: [{ itemId: 'pill_heal_small', probability: 0.3, rarity: 'white' }, { itemId: 'sword_iron', probability: 0.08, rarity: 'white' }], expReward: 25, stoneReward: 8, description: '盘踞山道的普通山贼' },

  // ==================== 普通BOSS (normal) ====================
  { id: 'normal_tiger', name: '剑齿虎', tier: 'normal', realmLevel: 1, stats: { maxHp: 120, attack: 18, defense: 10, dodge: 0.05, accuracy: 0.08, speed: 8, critRate: 0.04, critResist: 0.02 }, skills: [], drops: [{ itemId: 'pill_heal_medium', probability: 0.4, rarity: 'green' }, { itemId: 'mat_ore_iron', probability: 0.5, rarity: 'white' }, { itemId: 'armor_leather', probability: 0.06, rarity: 'green' }], expReward: 50, stoneReward: 20, description: '修炼成精的剑齿虎' },
  { id: 'normal_snake', name: '毒蟒', tier: 'normal', realmLevel: 1, stats: { maxHp: 140, attack: 15, defense: 8, dodge: 0.08, accuracy: 0.07, speed: 6, critRate: 0.05, critResist: 0.03 }, skills: [], drops: [{ itemId: 'pill_cultivation', probability: 0.35, rarity: 'green' }, { itemId: 'mat_herb_rare', probability: 0.3, rarity: 'green' }], expReward: 55, stoneReward: 22, description: '百年毒蟒，身长数丈' },
  { id: 'normal_ghost', name: '厉鬼', tier: 'normal', realmLevel: 2, stats: { maxHp: 100, attack: 25, defense: 5, dodge: 0.12, accuracy: 0.10, speed: 12, critRate: 0.06, critResist: 0.01 }, skills: [], drops: [{ itemId: 'pill_heal_medium', probability: 0.45, rarity: 'green' }, { itemId: 'acc_ring_blood', probability: 0.05, rarity: 'green' }], expReward: 60, stoneReward: 25, description: '含冤而死的怨灵' },

  // ==================== 精英BOSS (elite) ====================
  { id: 'elite_cultivator_dark', name: '魔修头领', tier: 'elite', realmLevel: 3, stats: { maxHp: 300, attack: 40, defense: 25, dodge: 0.08, accuracy: 0.12, speed: 10, critRate: 0.08, critResist: 0.05 }, skills: ['demon_basic'], drops: [{ itemId: 'pill_heal_large', probability: 0.4, rarity: 'blue' }, { itemId: 'book_demon_lifesteal', probability: 0.1, rarity: 'green' }, { itemId: 'mat_ore_spirit', probability: 0.35, rarity: 'green' }], expReward: 150, stoneReward: 80, description: '堕入魔道的修士' },
  { id: 'elite_fire_beast', name: '赤焰兽', tier: 'elite', realmLevel: 3, stats: { maxHp: 350, attack: 35, defense: 30, dodge: 0.06, accuracy: 0.10, speed: 9, critRate: 0.07, critResist: 0.06 }, skills: [], drops: [{ itemId: 'sword_ice', probability: 0.05, rarity: 'blue' }, { itemId: 'mat_jade_fire', probability: 0.3, rarity: 'blue' }, { itemId: 'pill_cultivation', probability: 0.5, rarity: 'green' }], expReward: 180, stoneReward: 100, description: '沐浴岩浆而生的火焰妖兽' },
  { id: 'elite_thunder_bird', name: '雷鹏', tier: 'elite', realmLevel: 4, stats: { maxHp: 500, attack: 50, defense: 35, dodge: 0.10, accuracy: 0.14, speed: 15, critRate: 0.09, critResist: 0.06 }, skills: [], drops: [{ itemId: 'sword_thunder', probability: 0.04, rarity: 'purple' }, { itemId: 'acc_amulet_soul', probability: 0.06, rarity: 'blue' }], expReward: 300, stoneReward: 200, description: '御雷而行的远古鹏鸟' },

  // ==================== 领主BOSS (lord) ====================
  { id: 'lord_dragon_young', name: '幼年蛟龙', tier: 'lord', realmLevel: 5, stats: { maxHp: 1200, attack: 90, defense: 70, dodge: 0.10, accuracy: 0.16, speed: 12, critRate: 0.10, critResist: 0.08 }, skills: ['demon_advanced'], drops: [{ itemId: 'armor_spirit', probability: 0.08, rarity: 'purple' }, { itemId: 'pill_breakthrough', probability: 0.15, rarity: 'purple' }, { itemId: 'mat_dragon_blood', probability: 0.25, rarity: 'purple' }], expReward: 800, stoneReward: 500, description: '即将化龙的蛟，实力恐怖' },
  { id: 'lord_sword_master', name: '剑魔', tier: 'lord', realmLevel: 6, stats: { maxHp: 1800, attack: 120, defense: 80, dodge: 0.12, accuracy: 0.18, speed: 14, critRate: 0.12, critResist: 0.08 }, skills: ['sword_advanced'], drops: [{ itemId: 'sword_thunder', probability: 0.1, rarity: 'purple' }, { itemId: 'book_sword_advanced', probability: 0.08, rarity: 'purple' }], expReward: 1200, stoneReward: 800, description: '以剑入魔的绝代剑客' },
  { id: 'lord_fox_demon', name: '九尾妖狐', tier: 'lord', realmLevel: 6, stats: { maxHp: 1500, attack: 100, defense: 90, dodge: 0.15, accuracy: 0.16, speed: 18, critRate: 0.11, critResist: 0.09 }, skills: ['spirit_advanced'], drops: [{ itemId: 'acc_crown_phoenix', probability: 0.07, rarity: 'purple' }, { itemId: 'pill_heal_immortal', probability: 0.2, rarity: 'purple' }], expReward: 1100, stoneReward: 750, description: '修炼千年的九尾狐' },

  // ==================== 上古神兽 (ancient_beast) ====================
  { id: 'ancient_phoenix', name: '不死凤凰', tier: 'ancient_beast', realmLevel: 7, stats: { maxHp: 5000, attack: 200, defense: 150, dodge: 0.15, accuracy: 0.20, speed: 20, critRate: 0.15, critResist: 0.12 }, skills: ['spirit_advanced', 'spirit_heal'], drops: [{ itemId: 'sword_immortal', probability: 0.05, rarity: 'gold' }, { itemId: 'pill_divine', probability: 0.1, rarity: 'gold' }, { itemId: 'mat_phoenix_feather', probability: 0.3, rarity: 'gold' }], expReward: 3000, stoneReward: 2500, description: '浴火重生的不死神鸟' },
  { id: 'ancient_dragon', name: '远古真龙', tier: 'ancient_beast', realmLevel: 8, stats: { maxHp: 8000, attack: 280, defense: 220, dodge: 0.12, accuracy: 0.22, speed: 15, critRate: 0.18, critResist: 0.15 }, skills: ['spirit_advanced', 'passive_defense'], drops: [{ itemId: 'armor_heaven', probability: 0.05, rarity: 'gold' }, { itemId: 'acc_orb_dragon', probability: 0.04, rarity: 'gold' }], expReward: 5000, stoneReward: 4000, description: '存活数万年的远古巨龙' },

  // ==================== 唯一秘境BOSS (unique_boss) ====================
  { id: 'unique_taixu', name: '太虚古魔', tier: 'unique_boss', realmLevel: 9, stats: { maxHp: 20000, attack: 450, defense: 350, dodge: 0.18, accuracy: 0.25, speed: 25, critRate: 0.20, critResist: 0.18 }, skills: ['demon_ultimate', 'demon_advanced'], drops: [{ itemId: 'sword_chaos', probability: 0.15, rarity: 'unique' }, { itemId: 'armor_universe', probability: 0.15, rarity: 'unique' }, { itemId: 'acc_star', probability: 0.15, rarity: 'unique' }], expReward: 20000, stoneReward: 15000, description: '开天辟地时被封印的古魔，为全游戏最强BOSS' },

  // ==================== 扩展BOSS ====================
  // 新手
  { id: 'novice_slime', name: '灵液怪', tier: 'novice', realmLevel: 0, stats: { maxHp: 40, attack: 6, defense: 2, dodge: 0.01, accuracy: 0.04, speed: 3, critRate: 0.01, critResist: 0.01 }, skills: [], drops: [{ itemId: 'pill_heal_small', probability: 0.4, rarity: 'white' }, { itemId: 'mat_herb', probability: 0.5, rarity: 'white' }], expReward: 15, stoneReward: 3, description: '灵气凝聚而成的液状怪物' },
  { id: 'novice_bat', name: '吸血蝠', tier: 'novice', realmLevel: 0, stats: { maxHp: 45, attack: 9, defense: 3, dodge: 0.04, accuracy: 0.06, speed: 7, critRate: 0.02, critResist: 0.01 }, skills: [], drops: [{ itemId: 'mat_herb', probability: 0.45, rarity: 'white' }, { itemId: 'pill_heal_small', probability: 0.35, rarity: 'white' }], expReward: 18, stoneReward: 4, description: '栖息在洞穴中的吸血蝙蝠' },
  // 普通
  { id: 'normal_golem', name: '石魔像', tier: 'normal', realmLevel: 1, stats: { maxHp: 180, attack: 14, defense: 20, dodge: 0.02, accuracy: 0.06, speed: 4, critRate: 0.03, critResist: 0.05 }, skills: [], drops: [{ itemId: 'mat_ore_iron', probability: 0.6, rarity: 'white' }, { itemId: 'armor_leather', probability: 0.04, rarity: 'green' }], expReward: 45, stoneReward: 18, description: '被法术赋予生命的石像' },
  { id: 'normal_spider', name: '毒寡妇', tier: 'normal', realmLevel: 2, stats: { maxHp: 130, attack: 22, defense: 10, dodge: 0.07, accuracy: 0.09, speed: 9, critRate: 0.04, critResist: 0.02 }, skills: [], drops: [{ itemId: 'pill_heal_medium', probability: 0.4, rarity: 'green' }, { itemId: 'mat_herb_rare', probability: 0.25, rarity: 'green' }], expReward: 52, stoneReward: 22, description: '剧毒蜘蛛，体型如牛' },
  // 精英
  { id: 'elite_ice_golem', name: '冰霜巨人', tier: 'elite', realmLevel: 4, stats: { maxHp: 450, attack: 45, defense: 40, dodge: 0.05, accuracy: 0.13, speed: 7, critRate: 0.07, critResist: 0.08 }, skills: [], drops: [{ itemId: 'armor_scale', probability: 0.08, rarity: 'blue' }, { itemId: 'mat_ore_spirit', probability: 0.4, rarity: 'green' }], expReward: 250, stoneReward: 150, description: '由万载寒冰凝聚而成的巨人' },
  { id: 'elite_shadow', name: '暗影刺客', tier: 'elite', realmLevel: 3, stats: { maxHp: 280, attack: 55, defense: 15, dodge: 0.15, accuracy: 0.15, speed: 18, critRate: 0.12, critResist: 0.03 }, skills: [], drops: [{ itemId: 'acc_ring_blood', probability: 0.08, rarity: 'green' }, { itemId: 'book_passive_attack', probability: 0.06, rarity: 'blue' }], expReward: 200, stoneReward: 120, description: '来无影去无踪的暗影刺客' },
  // 领主
  { id: 'lord_sea_serpent', name: '深海玄蛇', tier: 'lord', realmLevel: 5, stats: { maxHp: 2000, attack: 95, defense: 85, dodge: 0.08, accuracy: 0.15, speed: 10, critRate: 0.10, critResist: 0.09 }, skills: ['demon_basic'], drops: [{ itemId: 'armor_spirit', probability: 0.06, rarity: 'purple' }, { itemId: 'mat_dragon_blood', probability: 0.2, rarity: 'purple' }], expReward: 900, stoneReward: 600, description: '潜伏深海千年的巨蛇' },
  // 神兽
  { id: 'ancient_kirin', name: '上古麒麟', tier: 'ancient_beast', realmLevel: 7, stats: { maxHp: 6000, attack: 220, defense: 180, dodge: 0.13, accuracy: 0.21, speed: 18, critRate: 0.14, critResist: 0.13 }, skills: ['spirit_advanced'], drops: [{ itemId: 'acc_crown_phoenix', probability: 0.08, rarity: 'purple' }, { itemId: 'pill_divine', probability: 0.1, rarity: 'gold' }], expReward: 4000, stoneReward: 3000, description: '祥瑞之兽，力量深不可测' },
  // 唯一
  { id: 'unique_sky_emperor', name: '天罚之眼', tier: 'unique_boss', realmLevel: 9, stats: { maxHp: 25000, attack: 500, defense: 400, dodge: 0.15, accuracy: 0.28, speed: 22, critRate: 0.22, critResist: 0.20 }, skills: ['spirit_ultimate', 'spirit_heal'], drops: [{ itemId: 'sword_chaos', probability: 0.12, rarity: 'unique' }, { itemId: 'armor_universe', probability: 0.12, rarity: 'unique' }], expReward: 25000, stoneReward: 20000, description: '天道意志的化身，双眼睁开之时即是世界毁灭之日' },
]

/** 根据梯度获取BOSS池 */
export function getEnemiesByTier(tier: string): Enemy[] {
  return enemies.filter(e => e.tier === tier)
}

/** 根据ID获取敌人 */
export function getEnemyById(id: string): Enemy | undefined {
  return enemies.find(e => e.id === id)
}
