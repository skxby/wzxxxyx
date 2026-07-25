// ============================================================
// 灵石商店数据配置
// ============================================================

export interface ShopItem {
  itemId: string
  price: number
  stock: number       // -1表示无限
  discount: number    // 0-1, 0表示原价
  minRealmLevel: number
}

export interface ShopConfig {
  name: string
  refreshCost: number  // 刷新商店所需灵石
  items: ShopItem[]
}

export const shopConfig: ShopConfig = {
  name: '仙市',
  refreshCost: 50,
  items: [
    // ===== 消耗品 =====
    { itemId: 'pill_heal_small', price: 8, stock: -1, discount: 0, minRealmLevel: 0 },
    { itemId: 'pill_heal_medium', price: 30, stock: -1, discount: 0, minRealmLevel: 1 },
    { itemId: 'pill_heal_large', price: 120, stock: 10, discount: 0, minRealmLevel: 2 },
    { itemId: 'pill_heal_immortal', price: 500, stock: 3, discount: 0, minRealmLevel: 4 },
    { itemId: 'pill_cultivation', price: 45, stock: -1, discount: 0, minRealmLevel: 0 },
    { itemId: 'pill_breakthrough', price: 800, stock: 3, discount: 0, minRealmLevel: 3 },
    { itemId: 'pill_divine', price: 3500, stock: 1, discount: 0, minRealmLevel: 5 },

    // ===== 武器 =====
    { itemId: 'sword_iron', price: 15, stock: -1, discount: 0, minRealmLevel: 0 },
    { itemId: 'sword_steel', price: 80, stock: 5, discount: 0, minRealmLevel: 1 },
    { itemId: 'sword_ice', price: 300, stock: 3, discount: 0.1, minRealmLevel: 2 },
    { itemId: 'sword_thunder', price: 1200, stock: 2, discount: 0, minRealmLevel: 4 },

    // ===== 防具 =====
    { itemId: 'armor_cloth', price: 8, stock: -1, discount: 0, minRealmLevel: 0 },
    { itemId: 'armor_leather', price: 60, stock: 5, discount: 0, minRealmLevel: 1 },
    { itemId: 'armor_scale', price: 280, stock: 3, discount: 0, minRealmLevel: 2 },
    { itemId: 'armor_spirit', price: 1100, stock: 2, discount: 0, minRealmLevel: 4 },

    // ===== 饰品 =====
    { itemId: 'acc_ring_jade', price: 12, stock: -1, discount: 0, minRealmLevel: 0 },
    { itemId: 'acc_ring_blood', price: 70, stock: 5, discount: 0, minRealmLevel: 1 },
    { itemId: 'acc_amulet_soul', price: 320, stock: 3, discount: 0, minRealmLevel: 2 },
    { itemId: 'acc_crown_phoenix', price: 1300, stock: 2, discount: 0, minRealmLevel: 4 },

    // ===== 材料 =====
    { itemId: 'mat_herb', price: 3, stock: -1, discount: 0, minRealmLevel: 0 },
    { itemId: 'mat_ore_iron', price: 5, stock: -1, discount: 0, minRealmLevel: 0 },
    { itemId: 'mat_herb_rare', price: 40, stock: 10, discount: 0, minRealmLevel: 1 },
    { itemId: 'mat_ore_spirit', price: 50, stock: 10, discount: 0, minRealmLevel: 1 },
    { itemId: 'mat_jade_fire', price: 150, stock: 5, discount: 0, minRealmLevel: 2 },
    { itemId: 'mat_dragon_blood', price: 800, stock: 2, discount: 0, minRealmLevel: 4 },

    // ===== 技能书 =====
    { itemId: 'book_sword_advanced', price: 1500, stock: 1, discount: 0, minRealmLevel: 3 },
    { itemId: 'book_spirit_advanced', price: 1500, stock: 1, discount: 0, minRealmLevel: 3 },
    { itemId: 'book_demon_advanced', price: 1500, stock: 1, discount: 0, minRealmLevel: 3 },
    { itemId: 'book_passive_attack', price: 600, stock: 2, discount: 0, minRealmLevel: 2 },
    { itemId: 'book_passive_defense', price: 600, stock: 2, discount: 0, minRealmLevel: 2 },
    { itemId: 'book_cultivation_boost', price: 150, stock: 5, discount: 0, minRealmLevel: 0 },
  ],
}
