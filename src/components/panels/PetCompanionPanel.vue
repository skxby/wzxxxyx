<script setup lang="ts">
// ============================================================
// 灵兽/道侣/宗门面板
// ============================================================
import { ref } from 'vue'
import { usePetStore } from '@/stores/petStore'
import { usePlayerStore } from '@/stores/playerStore'
import { spiritPets, companions, sects } from '@/data/petsCompanions'

const petStore = usePetStore()
const playerStore = usePlayerStore()
const activeTab = ref<'pet' | 'companion' | 'sect'>('pet')
const msg = ref('')

function showMsg(m: string) { msg.value = m; setTimeout(() => { msg.value = '' }, 2500) }

// ===== 灵兽 =====
function adoptPet(petId: string) {
  // 灵兽获得需要灵石
  const pet = spiritPets.find(p => p.id === petId)
  if (!pet) return
  const cost = pet.evolveCost
  const p = playerStore.player
  if (!p) return
  if (p.attributes.spiritStones < cost) {
    showMsg(`灵石不足！需要 ${cost} 灵石`)
    return
  }
  p.attributes.spiritStones -= cost
  showMsg(petStore.acquirePet(petId))
  playerStore.saveCurrentGame()
}

function evolve(petId: string) {
  showMsg(petStore.evolvePet(petId))
  playerStore.saveCurrentGame()
}
</script>

<template>
  <div class="pet-panel">
    <!-- 消息 -->
    <div v-if="msg" class="toast-msg fade-in">{{ msg }}</div>

    <!-- 子标签 -->
    <div class="sub-tabs">
      <button :class="['sub-tab', { active: activeTab === 'pet' }]" @click="activeTab = 'pet'">🐉 灵兽</button>
      <button :class="['sub-tab', { active: activeTab === 'companion' }]" @click="activeTab = 'companion'">💕 道侣</button>
      <button :class="['sub-tab', { active: activeTab === 'sect' }]" @click="activeTab = 'sect'">🏛️ 宗门</button>
    </div>

    <!-- ========== 灵兽 ========== -->
    <div v-if="activeTab === 'pet'" class="tab-content fade-in">
      <!-- 当前装备 -->
      <div class="current-pet" v-if="petStore.ownedPets.find(p => p.equipped)">
        <h4>当前灵兽</h4>
        <div class="active-pet-card">
          <template v-for="entry in petStore.ownedPets.filter(p => p.equipped)" :key="entry.petId">
            <span class="pet-name">{{ spiritPets.find(p => p.id === entry.petId)?.name }}</span>
            <span class="pet-level">Lv.{{ entry.level }}</span>
          </template>
          <button class="unequip-btn" @click="petStore.unequipPet()">卸下</button>
        </div>
      </div>

      <!-- 所有灵兽 -->
      <h4>灵兽图鉴</h4>
      <div v-for="pet in spiritPets" :key="pet.id" class="pet-card">
        <div class="pet-header">
          <span class="pet-name">{{ pet.name }}</span>
          <span class="pet-rarity">{{ pet.rarity }}</span>
        </div>
        <div class="pet-desc">{{ pet.description }}</div>
        <div class="pet-skill">技能：{{ pet.skillDescription }}</div>
        <div class="pet-bonus">
          加成：
          <span v-for="b in pet.statBonus" :key="b.type">{{ b.type }}+{{ b.value }}</span>
        </div>

        <div v-if="petStore.ownedPets.find(p => p.petId === pet.id)" class="pet-owned">
          <template v-for="entry in petStore.ownedPets.filter(p => p.petId === pet.id)" :key="entry.petId">
            <span>等级 {{ entry.level }}/{{ pet.maxLevel }}</span>
            <button class="evolve-btn" @click="evolve(pet.id)">进化 ({{ pet.evolveCost * entry.level }}💎)</button>
            <button v-if="!entry.equipped" class="equip-btn" @click="petStore.equipPet(pet.id)">装备</button>
          </template>
        </div>
        <div v-else class="pet-not-owned">
          <button class="adopt-btn" @click="adoptPet(pet.id)">收养 ({{ pet.evolveCost }}💎)</button>
        </div>
      </div>
    </div>

    <!-- ========== 道侣 ========== -->
    <div v-if="activeTab === 'companion'" class="tab-content fade-in">
      <div v-if="petStore.activeCompanion" class="active-companion">
        <h4>💕 当前道侣</h4>
        <div class="companion-card highlight">
          <span class="comp-name">{{ petStore.activeCompanion.name }}</span>
          <span class="comp-desc">{{ petStore.activeCompanion.description }}</span>
          <span class="comp-bonus">修炼加成：+{{ Math.floor(petStore.activeCompanion.cultivationBoost * 100) }}%</span>
        </div>
      </div>

      <h4>可结识的道侣</h4>
      <div v-for="comp in companions" :key="comp.id" class="companion-card">
        <div class="comp-header">
          <span class="comp-name">{{ comp.name }}</span>
          <span class="comp-rarity">{{ comp.rarity }}</span>
        </div>
        <div class="comp-desc">{{ comp.description }}</div>
        <div class="comp-condition">{{ comp.meetCondition }}</div>
        <div class="comp-skill">特殊能力：{{ comp.specialSkill }}</div>
        <button
          v-if="!petStore.metCompanions.includes(comp.id)"
          class="meet-btn"
          @click="showMsg(petStore.meetCompanion(comp.id))"
        >结识</button>
        <button
          v-else-if="petStore.activeCompanionId === comp.id"
          class="active-btn"
        >相伴中</button>
        <button
          v-else
          class="switch-btn"
          @click="petStore.activeCompanionId = comp.id"
        >选择相伴</button>
      </div>
    </div>

    <!-- ========== 宗门 ========== -->
    <div v-if="activeTab === 'sect'" class="tab-content fade-in">
      <div v-if="petStore.currentSect" class="current-sect">
        <h4>🏛️ 当前宗门</h4>
        <div class="sect-card highlight">
          <span class="sect-name">{{ petStore.currentSect.name }}</span>
          <span class="sect-desc">{{ petStore.currentSect.description }}</span>
          <div class="sect-bonuses">
            <span v-for="b in petStore.currentSect.bonuses" :key="b.name" class="sect-bonus">
              {{ b.name }}：{{ b.value }}
            </span>
          </div>
          <div class="sect-daily">每日奖励：{{ petStore.currentSect.dailyReward }}</div>
          <button class="leave-btn" @click="petStore.leaveSect()">离开宗门</button>
        </div>
      </div>

      <h4>宗门一览</h4>
      <div v-for="sect in sects" :key="sect.id" class="sect-card">
        <div class="sect-header">
          <span class="sect-name">{{ sect.name }}</span>
        </div>
        <div class="sect-desc">{{ sect.description }}</div>
        <div class="sect-require">加入条件：{{ sect.joinRequirement }}</div>
        <div class="sect-bonuses">
          <span v-for="b in sect.bonuses" :key="b.name" class="sect-bonus">
            {{ b.name }}：{{ b.value }}
          </span>
        </div>
        <div class="sect-daily">每日奖励：{{ sect.dailyReward }}</div>
        <button
          v-if="petStore.joinedSectId !== sect.id"
          class="join-btn"
          @click="showMsg(petStore.joinSect(sect.id))"
        >加入宗门</button>
        <span v-else class="joined-label">已加入</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pet-panel { display: flex; flex-direction: column; gap: 10px; }
.toast-msg {
  position: fixed; top: 60px; left: 50%; transform: translateX(-50%); z-index: 100;
  background: rgba(0,0,0,0.9); color: #ffd700; padding: 8px 20px; border-radius: 20px; font-size: 0.82rem;
}

.sub-tabs { display: flex; gap: 6px; }
.sub-tab {
  flex: 1; padding: 8px; background: rgba(255,255,255,0.05);
  border: 1px solid #2a2a4a; border-radius: 8px;
  color: #9090a0; font-size: 0.82rem; cursor: pointer; transition: all 0.2s;
}
.sub-tab.active { background: rgba(83,52,131,0.4); border-color: #7b5ea7; color: #ffd700; }

.tab-content { display: flex; flex-direction: column; gap: 8px; }
.tab-content h4 { color: #ffd700; font-size: 0.88rem; margin: 8px 0 4px; }

/* 灵兽 */
.pet-card, .companion-card, .sect-card {
  background: rgba(22,33,62,0.8); border: 1px solid #2a2a4a;
  border-radius: 8px; padding: 10px;
}
.pet-card.highlight, .companion-card.highlight, .sect-card.highlight {
  border-color: #ffd700; border-width: 2px;
}
.pet-header, .comp-header, .sect-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
.pet-name, .comp-name, .sect-name { color: #e0e0e0; font-weight: bold; }
.pet-rarity, .comp-rarity { color: #9090a0; font-size: 0.72rem; }
.pet-desc, .comp-desc, .sect-desc { font-size: 0.78rem; color: #9090a0; margin-bottom: 4px; }
.pet-skill { font-size: 0.78rem; color: #3498db; margin-bottom: 4px; }
.pet-bonus { font-size: 0.75rem; color: #2ecc71; }
.pet-bonus span { margin-right: 6px; padding: 1px 6px; background: rgba(46,204,113,0.1); border-radius: 3px; }
.pet-owned, .pet-not-owned { display: flex; align-items: center; gap: 6px; margin-top: 8px; }
.adopt-btn, .evolve-btn, .equip-btn, .unequip-btn, .join-btn, .meet-btn, .switch-btn, .leave-btn {
  padding: 3px 10px; border: none; border-radius: 4px; font-size: 0.72rem; cursor: pointer;
}
.adopt-btn, .join-btn, .meet-btn { background: #2ecc71; color: #fff; }
.evolve-btn { background: #e67e22; color: #fff; }
.equip-btn { background: #3498db; color: #fff; }
.unequip-btn, .leave-btn { background: #e74c3c; color: #fff; }
.switch-btn { background: #9b59b6; color: #fff; }
.active-btn { padding: 3px 10px; background: #ffd700; color: #1a1a2e; border: none; border-radius: 4px; font-size: 0.72rem; }
.joined-label { color: #2ecc71; font-size: 0.8rem; font-weight: bold; }

.comp-condition, .sect-require { font-size: 0.72rem; color: #f39c12; margin-bottom: 4px; }
.comp-skill { font-size: 0.75rem; color: #3498db; margin-bottom: 6px; }
.comp-bonus { font-size: 0.78rem; color: #2ecc71; }
.sect-bonuses { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 4px; }
.sect-bonus { font-size: 0.72rem; padding: 2px 6px; background: rgba(83,52,131,0.2); border-radius: 3px; color: #c0c0ff; }
.sect-daily { font-size: 0.75rem; color: #2ecc71; margin-bottom: 6px; }

.current-pet h4, .active-companion h4, .current-sect h4 { margin-top: 0; }
</style>
