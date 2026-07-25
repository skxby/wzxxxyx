---
name: combat-visuals
description: 战斗视觉特效规范——球形碰撞战斗、技能施放光效、伤害反馈动画、屏幕震动、飘字系统
---

# 战斗视觉特效开发 Skill

参考《一念逍遥》的球形战斗可视化，为文字修仙游戏提供有冲击力的战斗视觉体验。

## 设计原则
- **境界碾压可视化**：高境界对低境界形成视觉压迫（大小对比）
- **技能有释放感**：每次技能施放有明显的光效和节奏感
- **伤害有反馈**：受击方有抖动、变色、飘字等多层反馈

## 一、球形战斗可视化

### 角色展现
- 玩家和敌人以**圆形气泡**呈现
- 气泡大小与战力/境界挂钩（境界越高球越大）
- 高境界对低境界形成直观的"大球压小球"

```css
.combat-orb {
  border-radius: 50%;
  transition: transform 0.3s;
  position: relative;
}
/* 境界差距带来的大小差异 */
.combat-orb.realm-0 { width: 60px; height: 60px; }
.combat-orb.realm-3 { width: 100px; height: 100px; }
.combat-orb.realm-6 { width: 140px; height: 140px; }
.combat-orb.realm-9 { width: 180px; height: 180px; }
```

### 碰撞效果
- 攻击时攻击方的球**快速冲向**防守方
- 碰撞瞬间产生粒子溅射
- 防守方球体抖动并后退
- 暴击时球体短暂变红 + 放大回弹

## 二、技能施放光效

### 技能分类特效

| 技能类型 | 视觉表现 |
|---------|---------|
| 普通攻击 | 小球快速碰撞 + 白色溅射粒子 |
| 剑气攻击 | 弧形刀光从球体飞出，轨迹渐隐 |
| 法术攻击 | 法阵在球体前方展开，光柱射出 |
| 邪功攻击 | 暗红色血雾从球体蔓延向敌方 |
| 防御技能 | 护盾光环包裹球体，碰撞时波纹扩散 |
| 治疗技能 | 绿色光点从球体上升，生命值绿色闪烁 |

### 技能施放时序（GSAP Timeline）
```
阶段1: 蓄力 0-400ms    → 球体微缩+发光增强
阶段2: 释放 400-600ms   → 光效飞出/法阵展开
阶段3: 命中 600-800ms   → 敌方抖动+粒子溅射+飘字
阶段4: 收招 800-1000ms  → 光效消散，回到待机状态
```

## 三、伤害反馈系统

### 多层反馈叠加
1. **飘字**：伤害数字从敌方球体上方飘出
   - 普通伤害：白色，字号1rem
   - 暴击伤害：金色，字号1.5rem，震屏
   - 闪避：灰色"闪避"文字
2. **球体抖动**：GSAP shake 动画
3. **血条闪白**：短暂白色覆盖后消退
4. **屏幕震感**（暴击时）：整个战斗区域轻微抖动

### 飘字动画
```typescript
// GSAP 飘字
function floatDamage(text: string, x: number, y: number, isCrit: boolean) {
  const el = document.createElement('div');
  el.className = 'damage-float' + (isCrit ? ' crit' : '');
  el.textContent = text;
  el.style.left = x + 'px'; el.style.top = y + 'px';
  document.body.appendChild(el);
  
  gsap.to(el, {
    y: y - 60, opacity: 0, scale: isCrit ? 1.5 : 1,
    duration: 1, ease: 'power2.out',
    onComplete: () => el.remove()
  });
}
```

## 四、屏幕震动

```typescript
// 战斗震动（轻/中/重三级）
function screenShake(intensity: 'light'|'medium'|'heavy') {
  const map = { light: 3, medium: 8, heavy: 15 };
  const power = map[intensity];
  gsap.to('.battle-stage', {
    x: `random(-${power}, ${power})`,
    y: `random(-${power}, ${power})`,
    duration: 0.1, repeat: 3, yoyo: true,
    onComplete: () => gsap.set('.battle-stage', { x: 0, y: 0 })
  });
}
```

## 五、战斗结果动画

### 胜利
1. 敌方球体裂开/破碎 → 化作光点消散
2. 金光降临，掉落物品从天而降
3. 玩家球体短暂发光庆祝

### 失败
1. 玩家球体变灰 → 缩小下沉
2. 屏幕暗角 → "败北" 文字浮现

## 六、技能冷却可视化

- 技能按钮上覆盖半透明遮罩
- 冷却转圈动画（SVG 圆环倒计时）
- 冷却完毕时按钮短暂发光提示

## 七、各道修方向战斗风格

| 道修 | 球体颜色 | 攻击光效 | 特色 |
|------|---------|---------|------|
| 剑修 | 银白 | 白色弧形刀光 | 快节奏连击感 |
| 灵修 | 青色 | 蓝色法阵光柱 | 华丽法术特效 |
| 邪修 | 暗红 | 暗红血雾蔓延 | 吞噬侵蚀感 |
