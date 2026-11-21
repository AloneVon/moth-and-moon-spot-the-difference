// Paints both copies of the room and the feedback that lives above the paintings.
import { TAU, disc, ring, drawGlow, drawSpark } from './art/primitives.js';

const SCENE_WIDTH = 1000;
const SCENE_HEIGHT = 800;

function fitCanvas(canvas) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(2, Math.round(rect.width * dpr));
  const height = Math.max(2, Math.round(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return { width, height, dpr };
}

function withSceneTransform(ctx, width, height, paint) {
  ctx.save();
  ctx.scale(width / SCENE_WIDTH, height / SCENE_HEIGHT);
  paint();
  ctx.restore();
}

function drawFoundMarker(ctx, difference, now, index) {
  const pulse = 0.5 + 0.5 * Math.sin(now * 0.0036 + index * 1.2);
  const radius = difference.r * (1.08 + pulse * 0.08);
  ctx.save();
  ctx.translate(difference.x, difference.y);
  // The warm stain makes a found detail easy to spot in a contact sheet.
  drawGlow(ctx, 0, 0, radius * 1.9, 'rgba(255,209,111,ALPHA)', 0.16 + pulse * 0.06);
  ctx.shadowColor = 'rgba(255,198,89,.85)';
  ctx.shadowBlur = 12;
  ring(ctx, 0, 0, radius, 'rgba(255,221,144,.95)', 3.2);
  ctx.shadowBlur = 0;
  ring(ctx, 0, 0, radius + 5.5, 'rgba(133,93,39,.55)', 1.1);
  // Eight small ticks turn the ring into a hand-drawn sight.
  ctx.strokeStyle = 'rgba(255,232,170,.86)';
  ctx.lineWidth = 1.7;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * TAU + Math.PI / 8;
    const inner = radius + 3;
    const outer = radius + (i % 2 ? 6 : 9);
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    ctx.stroke();
  }
  const sparkAngle = -Math.PI / 2 + now * 0.0004;
  drawSpark(ctx, Math.cos(sparkAngle) * (radius + 8), Math.sin(sparkAngle) * (radius + 8), 5 + pulse * 2, '#ffe8a8', 0.94);
  disc(ctx, 0, 0, 2.2, 'rgba(255,236,177,.9)');
  ctx.restore();
}

function drawHintAura(ctx, difference, now, startedAt) {
  const age = Math.max(0, now - startedAt);
  const open = Math.min(1, age / 280);
  const fade = 0.62 + 0.28 * Math.sin(now * 0.004);
  ctx.save();
  ctx.translate(difference.x, difference.y);
  drawGlow(ctx, 0, 0, difference.r * 3.1, 'rgba(255,202,89,ALPHA)', 0.22 * fade);
  ctx.globalAlpha = fade;
  ctx.setLineDash([7, 7]);
  ctx.lineDashOffset = -now * 0.018;
  ring(ctx, 0, 0, difference.r * (1.55 + (1 - open) * 0.9), 'rgba(255,223,142,.95)', 2.6);
  ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(255,218,128,.6)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * TAU + now * 0.0005;
    const x = Math.cos(angle) * difference.r * 2.2;
    const y = Math.sin(angle) * difference.r * 2.2;
    drawSpark(ctx, x, y, 3.4, '#ffe29d', 0.8);
  }
  ctx.restore();
}

function drawWrongMark(ctx, wrong, now) {
  if (!wrong) return;
  const age = (now - wrong.at) / 460;
  if (age >= 1) return;
  const alpha = 1 - age;
  ctx.save();
  ctx.translate(wrong.x, wrong.y);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = 'rgba(240,132,105,.88)';
  ctx.lineWidth = 3;
  const r = 17 + age * 30;
  ctx.beginPath();
  ctx.moveTo(-9, -9); ctx.lineTo(9, 9);
  ctx.moveTo(9, -9); ctx.lineTo(-9, 9);
  ctx.stroke();
  ring(ctx, 0, 0, r, 'rgba(235,119,91,.52)', 1.2);
  ctx.restore();
}

function drawParticles(ctx, effects, now) {
  for (const effect of effects) {
    const age = (now - effect.at) / 950;
    if (age < 0 || age > 1) continue;
    ctx.save();
    ctx.translate(effect.x, effect.y);
    for (let i = 0; i < 13; i++) {
      const angle = (i / 13) * TAU + effect.seed;
      const distance = 12 + age * (40 + (i % 4) * 17);
      const alpha = Math.sin(Math.PI * Math.min(1, age * 1.3)) * (0.42 + (i % 3) * 0.18);
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance + age * 18;
      ctx.globalAlpha = alpha;
      drawSpark(ctx, x, y, 1.8 + (i % 3) * 1.1, i % 2 ? '#ffe7ab' : '#e7b76c', alpha);
    }
    ctx.globalAlpha = Math.sin(Math.PI * age) * 0.65;
    ring(ctx, 0, 0, 12 + age * 52, 'rgba(255,224,145,.72)', 1.5);
    ctx.restore();
  }
}

function drawKeyboardReticle(ctx, cursor, now) {
  if (!cursor || !cursor.visible) return;
  const pulse = 0.8 + Math.sin(now * 0.006) * 0.15;
  ctx.save();
  ctx.translate(cursor.x, cursor.y);
  ctx.strokeStyle = `rgba(255,228,157,${pulse})`;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-18, 0); ctx.lineTo(-6, 0);
  ctx.moveTo(6, 0); ctx.lineTo(18, 0);
  ctx.moveTo(0, -18); ctx.lineTo(0, -6);
  ctx.moveTo(0, 6); ctx.lineTo(0, 18);
  ctx.stroke();
  ring(ctx, 0, 0, 10, 'rgba(255,232,165,.72)', 1.2);
  disc(ctx, 0, 0, 1.6, 'rgba(255,245,203,.9)');
  ctx.restore();
}

function drawPanel(canvas, scene, odd, game, now) {
  const { width, height } = fitCanvas(canvas);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  scene.draw(ctx, width, height, odd, now);
  withSceneTransform(ctx, width, height, () => {
    for (let i = 0; i < game.foundOrder.length; i++) {
      const diff = scene.differences.find((item) => item.id === game.foundOrder[i]);
      if (diff) drawFoundMarker(ctx, diff, now, i);
    }
    if (game.hint && game.hint.diff && now < game.hint.until) {
      drawHintAura(ctx, game.hint.diff, now, game.hint.startedAt);
    }
    if (!odd && game.wrong && game.wrong.panel === 0) drawWrongMark(ctx, game.wrong, now);
    if (odd && game.wrong && game.wrong.panel === 1) drawWrongMark(ctx, game.wrong, now);
    drawParticles(ctx, game.effects, now);
    if (odd) drawKeyboardReticle(ctx, game.keyboardCursor, now);
  });
}

export class GameRenderer {
  constructor(leftCanvas, rightCanvas) {
    this.leftCanvas = leftCanvas;
    this.rightCanvas = rightCanvas;
  }

  render(scene, game, now) {
    drawPanel(this.leftCanvas, scene, false, game, now);
    drawPanel(this.rightCanvas, scene, true, game, now);
  }
}
