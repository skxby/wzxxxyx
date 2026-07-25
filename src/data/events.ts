// ============================================================
// 随机事件库 - 奇遇/秘境/天劫/机缘/陷阱/切磋/传承
// ============================================================
import type { RandomEvent } from '@/types'

export const randomEvents: RandomEvent[] = [
  // ==================== 奇遇 (fortune) ====================
  { id: 'fortune_herb', name: '灵草奇遇', type: 'fortune', nature: 'positive', description: '你在山中发现一株百年灵草！', probability: 0.08, minRealmLevel: 0, outcomes: [
    { description: '采集灵草，获得炼丹材料', probability: 0.7, effects: [{ type: 'gain_item', itemId: 'mat_herb_rare' }] },
    { description: '灵草旁潜伏妖兽！', probability: 0.3, effects: [{ type: 'trigger_combat', enemyId: 'normal_snake' }] },
  ]},
  { id: 'fortune_cave', name: '洞府机缘', type: 'fortune', nature: 'positive', description: '你发现了一座上古修士的洞府！', probability: 0.05, minRealmLevel: 1, outcomes: [
    { description: '在洞府中找到修炼资源和灵石', probability: 0.5, effects: [{ type: 'gain_cultivation', value: 200 }, { type: 'gain_stones', value: 100 }] },
    { description: '触发洞府禁制！', probability: 0.3, effects: [{ type: 'damage_hp', value: 50 }] },
    { description: '发现稀有功法残卷', probability: 0.2, effects: [{ type: 'gain_item', itemId: 'book_cultivation_boost' }] },
  ]},
  { id: 'fortune_immortal', name: '仙人指路', type: 'fortune', nature: 'positive', description: '一位路过的仙人看你资质不错，愿意指点一二', probability: 0.02, minRealmLevel: 3, outcomes: [
    { description: '仙人传授修炼心得，修为大增', probability: 0.6, effects: [{ type: 'gain_cultivation', value: 1000 }] },
    { description: '仙人赠送一枚丹药', probability: 0.4, effects: [{ type: 'gain_item', itemId: 'pill_divine' }] },
  ]},

  // ==================== 秘境 (secret_realm) ====================
  { id: 'secret_fog_valley', name: '迷雾山谷', type: 'secret_realm', nature: 'neutral', description: '前方出现一片迷雾笼罩的山谷', probability: 0.06, minRealmLevel: 2, outcomes: [
    { description: '深入探索，发现灵石矿脉', probability: 0.5, effects: [{ type: 'gain_stones', value: 300 }] },
    { description: '遭遇迷雾中的妖兽', probability: 0.3, effects: [{ type: 'trigger_combat', enemyId: 'elite_fire_beast' }] },
    { description: '在迷雾中迷失，损失部分修为', probability: 0.2, effects: [{ type: 'lose_cultivation', value: 100 }] },
  ]},
  { id: 'secret_ancient_ruins', name: '远古遗迹', type: 'secret_realm', nature: 'neutral', description: '地底震动，一座远古遗迹从地下升起', probability: 0.04, minRealmLevel: 4, outcomes: [
    { description: '在遗迹中寻得宝物', probability: 0.4, effects: [{ type: 'gain_item', itemId: 'acc_amulet_soul' }] },
    { description: '遗迹守卫苏醒！', probability: 0.35, effects: [{ type: 'trigger_combat', enemyId: 'lord_sword_master' }] },
    { description: '获得大量修为', probability: 0.25, effects: [{ type: 'gain_cultivation', value: 2000 }] },
  ]},

  // ==================== 天劫 (tribulation) ====================
  { id: 'tribulation_minor', name: '小天劫', type: 'tribulation', nature: 'negative', description: '天道降下小天劫，考验修仙者', probability: 0.04, minRealmLevel: 4, outcomes: [
    { description: '勉强扛过天劫，损失部分生命', probability: 0.5, effects: [{ type: 'damage_hp', value: 100 }] },
    { description: '被天劫击中，修为倒退', probability: 0.3, effects: [{ type: 'lose_cultivation', value: 500 }] },
    { description: '成功渡过天劫，获得天道感悟', probability: 0.2, effects: [{ type: 'gain_cultivation', value: 800 }] },
  ]},
  { id: 'tribulation_major', name: '大天劫', type: 'tribulation', nature: 'negative', description: '九天神雷降下，大天劫降临！', probability: 0.02, minRealmLevel: 6, outcomes: [
    { description: '以强大实力硬抗天劫成功', probability: 0.3, effects: [{ type: 'gain_cultivation', value: 5000 }] },
    { description: '天劫太强，身受重伤', probability: 0.5, effects: [{ type: 'damage_hp', value: 500 }] },
    { description: '天劫引发体内灵力紊乱', probability: 0.2, effects: [{ type: 'lose_cultivation', value: 2000 }] },
  ]},

  // ==================== 机缘 (opportunity) ====================
  { id: 'opportunity_disciple', name: '高人收徒', type: 'opportunity', nature: 'positive', description: '一位隐世高人路过，看中你的资质，愿收你为记名弟子', probability: 0.03, minRealmLevel: 0, outcomes: [
    { description: '获得高人传授功法', probability: 0.5, effects: [{ type: 'gain_item', itemId: 'book_passive_attack' }] },
    { description: '获得修炼资源', probability: 0.5, effects: [{ type: 'gain_stones', value: 500 }] },
  ]},
  { id: 'opportunity_trade', name: '神秘商人', type: 'opportunity', nature: 'positive', description: '路边出现一个神秘商人,愿意与你交易', probability: 0.06, minRealmLevel: 1, outcomes: [
    { description: '买到稀有丹药', probability: 0.4, effects: [{ type: 'gain_item', itemId: 'pill_breakthrough' }] },
    { description: '买到稀有材料', probability: 0.6, effects: [{ type: 'gain_item', itemId: 'mat_ore_spirit' }] },
  ]},

  // ==================== 陷阱 (trap) ====================
  { id: 'trap_formation', name: '阵法陷阱', type: 'trap', nature: 'negative', description: '你不慎踩入上古修士留下的阵法陷阱', probability: 0.05, minRealmLevel: 1, outcomes: [
    { description: '触发杀阵，受到伤害', probability: 0.5, effects: [{ type: 'damage_hp', value: 80 }] },
    { description: '被阵法困住，损失修为', probability: 0.3, effects: [{ type: 'lose_cultivation', value: 150 }] },
    { description: '阵法年久失修，自行崩溃', probability: 0.2, effects: [] },
  ]},
  { id: 'trap_poison', name: '毒雾沼泽', type: 'trap', nature: 'negative', description: '前方是一片毒雾弥漫的沼泽', probability: 0.04, minRealmLevel: 0, outcomes: [
    { description: '吸入毒雾，持续掉血', probability: 0.6, effects: [{ type: 'damage_hp', value: 60 }] },
    { description: '找到解毒草药', probability: 0.2, effects: [{ type: 'gain_item', itemId: 'mat_herb' }] },
    { description: '绕道而行，安全通过', probability: 0.2, effects: [] },
  ]},

  // ==================== 修士切磋 (duel) ====================
  { id: 'duel_friendly', name: '道友切磋', type: 'duel', nature: 'neutral', description: '一位同阶道友路过，想与你切磋一番', probability: 0.07, minRealmLevel: 1, outcomes: [
    { description: '接受切磋', probability: 0.7, effects: [{ type: 'trigger_combat', enemyId: 'normal_tiger' }] },
    { description: '婉拒切磋，继续赶路', probability: 0.3, effects: [] },
  ]},
  { id: 'duel_hostile', name: '遭遇敌修', type: 'duel', nature: 'negative', description: '前方出现不怀好意的修士！', probability: 0.05, minRealmLevel: 2, outcomes: [
    { description: '被迫应战', probability: 0.8, effects: [{ type: 'trigger_combat', enemyId: 'elite_cultivator_dark' }] },
    { description: '成功逃脱', probability: 0.2, effects: [] },
  ]},

  // ==================== 上古传承 (inheritance) ====================
  { id: 'inheritance_sword', name: '剑道传承', type: 'inheritance', nature: 'positive', description: '山壁上浮现出一篇古老的剑诀', probability: 0.03, minRealmLevel: 2, outcomes: [
    { description: '领悟剑诀，获得技能书', probability: 0.5, effects: [{ type: 'gain_item', itemId: 'book_sword_advanced' }] },
    { description: '心有所感，修为精进', probability: 0.5, effects: [{ type: 'gain_cultivation', value: 500 }] },
  ]},
  { id: 'inheritance_ancient', name: '远古大能传承', type: 'inheritance', nature: 'positive', description: '天地异象降下，远古大能的传承现世！', probability: 0.01, minRealmLevel: 5, outcomes: [
    { description: '获得大能传承，修为暴涨', probability: 0.4, effects: [{ type: 'gain_cultivation', value: 10000 }] },
    { description: '获得极品装备', probability: 0.3, effects: [{ type: 'gain_item', itemId: 'sword_immortal' }] },
    { description: '传承试炼失败', probability: 0.3, effects: [{ type: 'damage_hp', value: 300 }] },
  ]},

  // ==================== 惩戒事件 (punishment) ====================
  { id: 'punishment_bandit', name: '山贼劫道', type: 'punishment', nature: 'negative', description: '一群山贼拦住了你的去路！', probability: 0.06, minRealmLevel: 0, outcomes: [
    { description: '击败山贼', probability: 0.6, effects: [{ type: 'trigger_combat', enemyId: 'novice_bandit' }] },
    { description: '交出灵石保命', probability: 0.3, effects: [{ type: 'lose_stones', value: 20 }] },
    { description: '山贼见你是修士，自行退去', probability: 0.1, effects: [] },
  ]},
  { id: 'punishment_beast', name: '妖兽突袭', type: 'punishment', nature: 'negative', description: '一只妖兽突然从暗处扑向你！', probability: 0.05, minRealmLevel: 3, outcomes: [
    { description: '与妖兽战斗', probability: 0.7, effects: [{ type: 'trigger_combat', enemyId: 'elite_fire_beast' }] },
    { description: '被妖兽击伤', probability: 0.3, effects: [{ type: 'damage_hp', value: 150 }] },
  ]},

  // ==================== 宝藏 (treasure) ====================
  { id: 'treasure_chest', name: '藏宝箱', type: 'treasure', nature: 'positive', description: '你在路边草丛中发现了一个古老的宝箱', probability: 0.05, minRealmLevel: 0, outcomes: [
    { description: '打开宝箱，获得灵石', probability: 0.5, effects: [{ type: 'gain_stones', value: 200 }] },
    { description: '获得宝物', probability: 0.2, effects: [{ type: 'gain_item', itemId: 'pill_heal_immortal' }] },
    { description: '宝箱是空的', probability: 0.3, effects: [] },
  ]},
  { id: 'treasure_ruins', name: '仙府宝藏', type: 'treasure', nature: 'positive', description: '传说中的仙府大门为你敞开', probability: 0.02, minRealmLevel: 5, outcomes: [
    { description: '获得大量灵石', probability: 0.4, effects: [{ type: 'gain_stones', value: 5000 }] },
    { description: '获得仙品装备', probability: 0.3, effects: [{ type: 'gain_item', itemId: 'acc_orb_dragon' }] },
    { description: '触发仙府守卫', probability: 0.3, effects: [{ type: 'trigger_combat', enemyId: 'lord_dragon_young' }] },
  ]},

  // ==================== 扩展事件 ====================
  // --- 奇遇 ---
  { id: 'fortune_spring', name: '不老泉', type: 'fortune', nature: 'positive', description: '山涧中发现一口不老泉，泉水散发灵气', probability: 0.04, minRealmLevel: 2, outcomes: [
    { description: '饮用泉水，恢复全部生命', probability: 0.5, effects: [{ type: 'heal_hp', value: 9999 }] },
    { description: '泉水旁有一株珍稀灵草', probability: 0.3, effects: [{ type: 'gain_item', itemId: 'mat_herb_rare' }] },
    { description: '泉水被妖兽守护', probability: 0.2, effects: [{ type: 'trigger_combat', enemyId: 'normal_snake' }] },
  ]},
  { id: 'fortune_meteor', name: '天降陨石', type: 'fortune', nature: 'positive', description: '一颗陨石从天而降，其中蕴含天外玄铁', probability: 0.03, minRealmLevel: 3, outcomes: [
    { description: '采集到天外玄铁', probability: 0.6, effects: [{ type: 'gain_item', itemId: 'mat_ore_spirit' }, { type: 'gain_stones', value: 100 }] },
    { description: '陨石中有神秘晶石', probability: 0.4, effects: [{ type: 'gain_item', itemId: 'mat_jade_fire' }] },
  ]},
  // --- 秘境 ---
  { id: 'secret_sky_palace', name: '天宫残垣', type: 'secret_realm', nature: 'neutral', description: '云层之中浮现出一片残破的天宫遗迹', probability: 0.03, minRealmLevel: 5, outcomes: [
    { description: '在天宫中获得仙器碎片', probability: 0.3, effects: [{ type: 'gain_item', itemId: 'acc_orb_dragon' }] },
    { description: '遭遇天宫守卫残魂', probability: 0.4, effects: [{ type: 'trigger_combat', enemyId: 'ancient_phoenix' }] },
    { description: '领悟天宫残留的道韵', probability: 0.3, effects: [{ type: 'gain_cultivation', value: 3000 }] },
  ]},
  { id: 'secret_underground', name: '地底迷宫', type: 'secret_realm', nature: 'neutral', description: '地面裂开一道深渊，下方似乎有座迷宫', probability: 0.04, minRealmLevel: 3, outcomes: [
    { description: '在迷宫中发现宝箱', probability: 0.5, effects: [{ type: 'gain_stones', value: 500 }] },
    { description: '遭遇迷宫中的怪物', probability: 0.3, effects: [{ type: 'trigger_combat', enemyId: 'elite_thunder_bird' }] },
    { description: '获得稀有材料', probability: 0.2, effects: [{ type: 'gain_item', itemId: 'mat_dragon_blood' }] },
  ]},
  // --- 惩戒 ---
  { id: 'punishment_curse', name: '古修诅咒', type: 'punishment', nature: 'negative', description: '触碰到一座古修坟墓，被诅咒缠身', probability: 0.03, minRealmLevel: 3, outcomes: [
    { description: '诅咒发作，大量掉血', probability: 0.5, effects: [{ type: 'damage_hp', value: 200 }] },
    { description: '诅咒侵蚀修为', probability: 0.3, effects: [{ type: 'lose_cultivation', value: 500 }] },
    { description: '以道心抵御诅咒', probability: 0.2, effects: [{ type: 'damage_hp', value: 50 }] },
  ]},
  { id: 'punishment_demon', name: '心魔入侵', type: 'punishment', nature: 'negative', description: '修炼时心魔趁虚而入！', probability: 0.04, minRealmLevel: 2, outcomes: [
    { description: '被心魔所伤', probability: 0.5, effects: [{ type: 'damage_hp', value: 100 }, { type: 'lose_cultivation', value: 200 }] },
    { description: '以强大的道心镇压心魔', probability: 0.3, effects: [{ type: 'gain_cultivation', value: 300 }] },
    { description: '被心魔引诱损失灵石', probability: 0.2, effects: [{ type: 'lose_stones', value: 100 }] },
  ]},
  // --- 机缘 ---
  { id: 'opportunity_merchant_rare', name: '异域商人', type: 'opportunity', nature: 'positive', description: '一位来自异域的商人向你展示珍稀货物', probability: 0.03, minRealmLevel: 3, outcomes: [
    { description: '购买到稀有技能书', probability: 0.4, effects: [{ type: 'gain_item', itemId: 'book_passive_defense' }] },
    { description: '购得珍贵突破丹', probability: 0.3, effects: [{ type: 'gain_item', itemId: 'pill_breakthrough' }] },
    { description: '商品价格太贵，放弃购买', probability: 0.3, effects: [{ type: 'gain_stones', value: 50 }] },
  ]},
  // --- 切磋 ---
  { id: 'duel_tournament', name: '修士斗法大会', type: 'duel', nature: 'neutral', description: '附近城举办修士斗法大会，邀你参加', probability: 0.04, minRealmLevel: 2, outcomes: [
    { description: '参加并击败对手', probability: 0.5, effects: [{ type: 'trigger_combat', enemyId: 'elite_cultivator_dark' }, { type: 'gain_stones', value: 300 }] },
    { description: '参赛观摩学习', probability: 0.3, effects: [{ type: 'gain_cultivation', value: 200 }] },
    { description: '放弃参加', probability: 0.2, effects: [] },
  ]},
  // --- 宝藏 ---
  { id: 'treasure_dragon_nest', name: '龙巢遗宝', type: 'treasure', nature: 'positive', description: '发现一座废弃的龙巢，其中留下不少宝物', probability: 0.02, minRealmLevel: 4, outcomes: [
    { description: '收集龙巢宝物', probability: 0.4, effects: [{ type: 'gain_stones', value: 2000 }, { type: 'gain_item', itemId: 'mat_dragon_blood' }] },
    { description: '惊醒守护的龙魂', probability: 0.3, effects: [{ type: 'trigger_combat', enemyId: 'ancient_dragon' }] },
    { description: '获得龙族遗物', probability: 0.3, effects: [{ type: 'gain_item', itemId: 'acc_orb_dragon' }] },
  ]},
  // --- 传承 ---
  { id: 'inheritance_formation', name: '阵法大师传承', type: 'inheritance', nature: 'positive', description: '一位阵法大师留下的传承出现在眼前', probability: 0.03, minRealmLevel: 2, outcomes: [
    { description: '领悟阵法奥义，获得材料', probability: 0.5, effects: [{ type: 'gain_item', itemId: 'mat_jade_fire' }, { type: 'gain_cultivation', value: 400 }] },
    { description: '触发守护阵法', probability: 0.3, effects: [{ type: 'damage_hp', value: 100 }] },
    { description: '传承残缺，只悟得皮毛', probability: 0.2, effects: [{ type: 'gain_cultivation', value: 100 }] },
  ]},
]

/** 根据最低境界获取可用事件池 */
export function getEventsByRealm(realmLevel: number): RandomEvent[] {
  return randomEvents.filter(e => e.minRealmLevel <= realmLevel)
}
