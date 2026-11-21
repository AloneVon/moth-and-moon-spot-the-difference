// Small, dependency-free drawing vocabulary shared by the three rooms.
// Every object in Moth & Moon is painted at run time, so the game loads no images.

export const TAU = Math.PI * 2;
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);

export function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export function fillRound(ctx, x, y, w, h, r, fill) {
  roundRectPath(ctx, x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function strokeRound(ctx, x, y, w, h, r, stroke, width = 1) {
  roundRectPath(ctx, x, y, w, h, r);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function ellipse(ctx, x, y, rx, ry, fill, rotation = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rotation, 0, TAU);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function ring(ctx, x, y, radius, stroke, width = 1) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function disc(ctx, x, y, radius, fill) {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.1, radius), 0, TAU);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function linear(ctx, x0, y0, x1, y1, stops) {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const [offset, color] of stops) gradient.addColorStop(offset, color);
  return gradient;
}

export function radial(ctx, x, y, r0, r1, stops) {
  const gradient = ctx.createRadialGradient(x, y, r0, x, y, r1);
  for (const [offset, color] of stops) gradient.addColorStop(offset, color);
  return gradient;
}

export function starPath(ctx, x, y, outer, inner, points = 5, rotation = -Math.PI / 2) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = rotation + (i * Math.PI) / points;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export function drawStar(ctx, x, y, outer, fill, points = 5, rotation = -Math.PI / 2) {
  starPath(ctx, x, y, outer, outer * 0.43, points, rotation);
  ctx.fillStyle = fill;
  ctx.fill();
}

export function drawSpark(ctx, x, y, size, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.quadraticCurveTo(x + size * 0.15, y - size * 0.14, x + size, y);
  ctx.quadraticCurveTo(x + size * 0.15, y + size * 0.14, x, y + size);
  ctx.quadraticCurveTo(x - size * 0.15, y + size * 0.14, x - size, y);
  ctx.quadraticCurveTo(x - size * 0.15, y - size * 0.14, x, y - size);
  ctx.fill();
  ctx.restore();
}

export function drawGlow(ctx, x, y, radius, color, alpha = 0.4) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
  glow.addColorStop(0, color.replace('ALPHA', String(alpha)));
  glow.addColorStop(0.4, color.replace('ALPHA', String(alpha * 0.46)));
  glow.addColorStop(1, color.replace('ALPHA', '0'));
  ctx.fillStyle = glow;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

export function drawMoon(ctx, x, y, radius, phase, tint = '#ffe6a7') {
  ctx.save();
  if (phase === 'full') {
    disc(ctx, x, y, radius, tint);
    ctx.globalAlpha = 0.24;
    disc(ctx, x - radius * 0.26, y - radius * 0.16, radius * 0.16, '#b18a55');
    disc(ctx, x + radius * 0.28, y + radius * 0.2, radius * 0.11, '#b18a55');
    disc(ctx, x + radius * 0.04, y + radius * 0.34, radius * 0.08, '#b18a55');
    ctx.globalAlpha = 1;
  } else if (phase === 'crescent') {
    // A true crescent path (even-odd fill), so the shape leaves no transparent bite in the sky.
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.moveTo(x + radius * 1.46, y - radius * 0.08);
    ctx.arc(x + radius * 0.46, y - radius * 0.08, radius, 0, TAU, true);
    ctx.fillStyle = tint;
    ctx.fill('evenodd');
    ctx.globalAlpha = 0.18;
    disc(ctx, x - radius * 0.34, y + radius * 0.18, radius * 0.1, '#745330');
    ctx.globalAlpha = 1;
  } else {
    disc(ctx, x, y, radius, tint);
    ctx.globalAlpha = 0.24;
    disc(ctx, x - radius * 0.22, y - radius * 0.25, radius * 0.12, '#79572f');
    disc(ctx, x + radius * 0.31, y + radius * 0.2, radius * 0.15, '#79572f');
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(35,30,28,.35)';
    ctx.fillRect(x + radius * 0.1, y - radius * 0.85, radius * 1.8, radius * 1.5);
  }
  ctx.restore();
}

export function drawCloud(ctx, x, y, scale, color, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x - scale * 0.58, y + scale * 0.1, scale * 0.5, scale * 0.29, 0, 0, TAU);
  ctx.ellipse(x - scale * 0.12, y - scale * 0.1, scale * 0.55, scale * 0.45, 0, 0, TAU);
  ctx.ellipse(x + scale * 0.42, y + scale * 0.06, scale * 0.53, scale * 0.32, 0, 0, TAU);
  ctx.ellipse(x + scale * 0.03, y + scale * 0.24, scale * 0.9, scale * 0.26, 0, 0, TAU);
  ctx.fill();
  ctx.restore();
}

export function drawLeaf(ctx, x, y, length, width, rotation, fill, vein = null) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(width, -length * 0.22, width * 0.82, -length * 0.8, 0, -length);
  ctx.bezierCurveTo(-width * 0.86, -length * 0.76, -width, -length * 0.18, 0, 0);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (vein) {
    ctx.beginPath();
    ctx.moveTo(0, -length * 0.04);
    ctx.quadraticCurveTo(width * 0.12, -length * 0.48, 0, -length * 0.9);
    ctx.strokeStyle = vein;
    ctx.lineWidth = Math.max(0.7, width * 0.09);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawFern(ctx, x, y, scale, color, leafCount = 7, missing = -1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  for (let i = 0; i < leafCount; i++) {
    if (i === missing) continue;
    const angle = -Math.PI * 0.93 + (i / Math.max(1, leafCount - 1)) * Math.PI * 0.86;
    const length = scale * (0.62 + 0.33 * Math.sin((i + 1) * 1.7));
    const tx = Math.cos(angle) * length;
    const ty = Math.sin(angle) * length;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.quadraticCurveTo(tx * 0.3 - 8, ty * 0.65, tx, ty);
    ctx.lineWidth = scale * 0.055;
    ctx.stroke();
    for (let l = 1; l <= 3; l++) {
      const t = l / 4;
      const lx = tx * t * 0.83;
      const ly = ty * t * 0.83;
      drawLeaf(ctx, lx, ly, scale * (0.24 - l * 0.025), scale * 0.065, angle + (l % 2 ? 0.86 : -0.86), color);
    }
  }
  ctx.restore();
}

export function drawFlower(ctx, x, y, scale, petalColor, centerColor, rotation = 0, petals = 7) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * TAU;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -scale * 0.48, scale * 0.2, scale * 0.5, 0, 0, TAU);
    ctx.fillStyle = petalColor;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.13)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();
  }
  disc(ctx, 0, 0, scale * 0.2, centerColor);
  ctx.restore();
}

export function drawBook(ctx, x, y, width, height, color, accent, lean = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(lean);
  fillRound(ctx, 0, 0, width, height, 2.5, color);
  ctx.fillStyle = 'rgba(255,255,255,.16)';
  ctx.fillRect(3, 3, Math.max(1, width * 0.14), Math.max(1, height - 6));
  ctx.fillStyle = accent;
  ctx.fillRect(width * 0.3, height * 0.16, Math.max(1, width * 0.5), Math.max(1, height * 0.08));
  ctx.fillRect(width * 0.3, height * 0.76, Math.max(1, width * 0.42), Math.max(1, height * 0.06));
  ctx.strokeStyle = 'rgba(35,23,14,.35)';
  ctx.lineWidth = 0.8;
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
  ctx.restore();
}

export function drawBookStack(ctx, x, y, scale, palette) {
  const widths = [86, 77, 91, 69];
  const heights = [15, 17, 14, 16];
  let currentY = 0;
  for (let i = 0; i < 4; i++) {
    const w = widths[i] * scale;
    const h = heights[i] * scale;
    const lean = i === 3 ? -0.08 : 0;
    drawBook(ctx, x - w * 0.5 + (i % 2 ? -3 : 4) * scale, y - currentY - h, w, h, palette[i % palette.length], 'rgba(246,217,158,.68)', lean);
    currentY += h + 1.4 * scale;
  }
}

export function drawMoth(ctx, x, y, scale, color, wingColor, countSpots = 2, folded = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  drawLeaf(ctx, -2, 5, 32, 18, 1.13, wingColor, 'rgba(255,238,194,.2)');
  if (!folded) drawLeaf(ctx, 2, 5, 32, 18, -1.13, wingColor, 'rgba(255,238,194,.2)');
  else drawLeaf(ctx, 2, 5, 25, 11, -0.46, wingColor, 'rgba(255,238,194,.2)');
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 3, 3.3, 15, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-1, -9);
  ctx.quadraticCurveTo(-8, -17, -12, -15);
  ctx.moveTo(1, -9);
  ctx.quadraticCurveTo(8, -17, 12, -15);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,233,176,.8)';
  for (let i = 0; i < countSpots; i++) disc(ctx, -10 + i * 7, -1 + (i % 2) * 5, 2.2, 'rgba(255,233,176,.8)');
  ctx.restore();
}

export function drawCat(ctx, x, y, scale, color, accent, tailMode = 'curl') {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  // Tail first, so the body sits over its root.
  ctx.beginPath();
  ctx.moveTo(38, -13);
  if (tailMode === 'curl') {
    ctx.bezierCurveTo(70, -22, 78, -61, 49, -64);
    ctx.bezierCurveTo(36, -65, 35, -45, 45, -43);
  } else {
    ctx.bezierCurveTo(66, -13, 69, -42, 89, -48);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();
  // Body, head and ears.
  ctx.beginPath();
  ctx.ellipse(5, -12, 48, 25, -0.06, 0, TAU);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-31, -23, 29, 26, -0.09, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-51, -39);
  ctx.lineTo(-48, -61);
  ctx.lineTo(-32, -47);
  ctx.moveTo(-22, -49);
  ctx.lineTo(-10, -62);
  ctx.lineTo(-4, -40);
  ctx.fillStyle = color;
  ctx.fill();
  // Closed eyes, nose and whiskers.
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(-39, -26, 6, 0.15, Math.PI - 0.15);
  ctx.arc(-18, -27, 5, 0.15, Math.PI - 0.15);
  ctx.stroke();
  ctx.fillStyle = '#c98d7c';
  ctx.beginPath();
  ctx.moveTo(-28, -17);
  ctx.lineTo(-24, -14);
  ctx.lineTo(-31, -14);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,231,188,.5)';
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.moveTo(-29, -13); ctx.lineTo(-47, -18);
  ctx.moveTo(-29, -13); ctx.lineTo(-47, -10);
  ctx.moveTo(-23, -13); ctx.lineTo(-5, -19);
  ctx.moveTo(-23, -13); ctx.lineTo(-4, -8);
  ctx.stroke();
  // Chest fur and tail tip.
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.68;
  ctx.beginPath();
  ctx.ellipse(-27, -9, 16, 15, 0, 0, TAU);
  ctx.fill();
  if (tailMode === 'curl') {
    ctx.beginPath();
    ctx.arc(47, -54, 8, 0, TAU);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(87, -48, 8, 0, TAU);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

export function drawBird(ctx, x, y, scale, bodyColor, wingColor, facing = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * facing, scale);
  ctx.beginPath();
  ctx.ellipse(0, 0, 19, 24, -0.25, 0, TAU);
  ctx.fillStyle = bodyColor;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(15, -19, 13, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(26, -19);
  ctx.lineTo(39, -14);
  ctx.lineTo(26, -10);
  ctx.closePath();
  ctx.fillStyle = '#ddb260';
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-2, 1, 11, 16, -0.4, 0, TAU);
  ctx.fillStyle = wingColor;
  ctx.fill();
  ctx.fillStyle = '#201b1b';
  disc(ctx, 20, -22, 1.8, '#201b1b');
  ctx.restore();
}

export function drawCandle(ctx, x, y, scale, lit = true, time = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  fillRound(ctx, -4, 0, 8, 28, 2, '#efe4c9');
  ctx.fillStyle = 'rgba(127,91,44,.28)';
  ctx.fillRect(-2, 3, 2, 20);
  // Brass holder.
  fillRound(ctx, -13, 25, 26, 6, 3, '#b28543');
  if (lit) {
    const flicker = 1 + Math.sin(time * 0.011 + x) * 0.12;
    drawGlow(ctx, 0, -9, 34, 'rgba(255,191,91,ALPHA)', 0.36);
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.bezierCurveTo(-7, -10, -3, -19 * flicker, 0, -24 * flicker);
    ctx.bezierCurveTo(4, -17, 7, -10, 0, -4);
    ctx.fillStyle = '#ffd577';
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, -9, 2.1, 4.5, 0, 0, TAU);
    ctx.fillStyle = '#fff6d3';
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.quadraticCurveTo(4, -10, 1, -15);
    ctx.strokeStyle = 'rgba(60,51,43,.65)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  ctx.restore();
}

export function drawChandelier(ctx, x, y, scale, candles = 3, time = 0, missing = -1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = '#b98c49';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -35);
  ctx.lineTo(0, 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-55, 24);
  ctx.quadraticCurveTo(0, -10, 55, 24);
  ctx.stroke();
  for (let i = 0; i < candles; i++) {
    if (i === missing) continue;
    const cx = -48 + (i * 96) / Math.max(1, candles - 1);
    const cy = 18 + Math.abs(cx) * 0.22;
    drawCandle(ctx, cx, cy, 0.72, true, time);
    ctx.beginPath();
    ctx.arc(cx, cy + 24, 6, 0, TAU);
    ctx.fillStyle = '#a67939';
    ctx.fill();
  }
  disc(ctx, 0, 15, 9, '#b98c49');
  disc(ctx, 0, 15, 4, '#6f4f27');
  ctx.restore();
}

export function drawClock(ctx, x, y, radius, hands = 0, face = '#eadab6', dark = '#4a3422') {
  ctx.save();
  ctx.translate(x, y);
  disc(ctx, 0, 3, radius + 5, 'rgba(0,0,0,.25)');
  disc(ctx, 0, 0, radius + 5, dark);
  disc(ctx, 0, 0, radius, face);
  ring(ctx, 0, 0, radius * 0.86, 'rgba(84,58,31,.36)', 1);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    const inner = i % 3 === 0 ? radius * 0.66 : radius * 0.74;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
    ctx.lineTo(Math.cos(a) * radius * 0.81, Math.sin(a) * radius * 0.81);
    ctx.strokeStyle = dark;
    ctx.lineWidth = i % 3 === 0 ? 2 : 1;
    ctx.stroke();
  }
  // hands: 0 is 10:10, 1 is 9:15
  const hour = hands === 0 ? -Math.PI * 0.36 : -Math.PI * 0.58;
  const minute = hands === 0 ? Math.PI * 0.16 : Math.PI * 0.48;
  ctx.strokeStyle = dark;
  ctx.lineCap = 'round';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(hour) * radius * 0.48, Math.sin(hour) * radius * 0.48);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(minute) * radius * 0.68, Math.sin(minute) * radius * 0.68);
  ctx.stroke();
  disc(ctx, 0, 0, 4, dark);
  ctx.restore();
}

export function drawJar(ctx, x, y, scale, glass, fireflies = 3, time = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  fillRound(ctx, -27, -55, 54, 61, 13, 'rgba(196,231,214,.13)');
  strokeRound(ctx, -27, -55, 54, 61, 13, 'rgba(226,247,224,.38)', 1);
  ctx.fillStyle = glass;
  ctx.globalAlpha = 0.32;
  ctx.fillRect(-23, -35, 7, 30);
  ctx.globalAlpha = 1;
  fillRound(ctx, -29, -61, 58, 9, 4, '#b28a50');
  ring(ctx, 0, -19, 3, 'rgba(230,247,220,.4)', 1);
  for (let i = 0; i < fireflies; i++) {
    const fx = -15 + i * 14;
    const fy = -25 + (i % 2) * 22 + Math.sin(time * 0.002 + i * 2) * 4;
    drawGlow(ctx, fx, fy, 13, 'rgba(255,223,129,ALPHA)', 0.45);
    disc(ctx, fx, fy, 1.8, '#ffe69b');
  }
  ctx.restore();
}

export function drawMushroom(ctx, x, y, scale, cap, stem, spots = 4) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  fillRound(ctx, -5, -40, 10, 41, 4, stem);
  ctx.beginPath();
  ctx.ellipse(0, -40, 28, 19, 0, Math.PI, TAU);
  ctx.fillStyle = cap;
  ctx.fill();
  ctx.fillStyle = 'rgba(255,248,215,.68)';
  for (let i = 0; i < spots; i++) {
    const angle = -Math.PI + (i + 1) * Math.PI / (spots + 1);
    disc(ctx, Math.cos(angle) * 16, -43 + Math.sin(angle) * 7, 2.2, 'rgba(255,248,215,.68)');
  }
  ctx.restore();
}

export function drawTeacup(ctx, x, y, scale, porcelain, tea, handle = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  if (handle) {
    ctx.beginPath();
    ctx.arc(24, 5, 11, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.strokeStyle = porcelain;
    ctx.lineWidth = 5;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(-25, -8);
  ctx.quadraticCurveTo(-19, 27, 0, 27);
  ctx.quadraticCurveTo(19, 27, 25, -8);
  ctx.closePath();
  ctx.fillStyle = porcelain;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -8, 25, 6, 0, 0, TAU);
  ctx.fillStyle = '#f4e7cb';
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, -7, 20, 4.4, 0, 0, TAU);
  ctx.fillStyle = tea;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-2, 17, 20, Math.PI * 0.12, Math.PI * 0.88);
  ctx.strokeStyle = 'rgba(97,65,35,.14)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();
}

export function drawTeapot(ctx, x, y, scale, body, highlight, spout = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.moveTo(25, 0);
  ctx.quadraticCurveTo(67, -8, 70, -31);
  ctx.quadraticCurveTo(71, -38, 76, -38);
  ctx.strokeStyle = body;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.stroke();
  if (spout === 2) {
    ctx.beginPath();
    ctx.moveTo(29, 5);
    ctx.quadraticCurveTo(54, 15, 57, -3);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(-30, -5, 18, Math.PI * 0.5, Math.PI * 1.5);
  ctx.strokeStyle = body;
  ctx.lineWidth = 7;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(0, 0, 37, 33, 0, 0, TAU);
  ctx.fillStyle = body;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(-8, -11, 19, 11, -0.3, 0, TAU);
  ctx.fillStyle = highlight;
  ctx.globalAlpha = 0.36;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.ellipse(0, -31, 20, 6, 0, 0, TAU);
  ctx.fillStyle = body;
  ctx.fill();
  fillRound(ctx, -7, -40, 14, 8, 2, highlight);
  disc(ctx, 0, -48, 4, body);
  ctx.restore();
}

export function drawFrame(ctx, x, y, w, h, frameColor, innerColor) {
  fillRound(ctx, x, y, w, h, 5, frameColor);
  fillRound(ctx, x + 9, y + 9, w - 18, h - 18, 2, innerColor);
  strokeRound(ctx, x + 5.5, y + 5.5, w - 11, h - 11, 3, 'rgba(255,224,160,.24)', 1);
  drawSpark(ctx, x + 5, y + 5, 4, 'rgba(255,229,161,.72)', 0.8);
  drawSpark(ctx, x + w - 5, y + 5, 4, 'rgba(255,229,161,.72)', 0.8);
}

export function drawWindowArch(ctx, x, y, w, h, sky, frame, grid = true) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + w * 0.5);
  ctx.arc(x + w * 0.5, y + w * 0.5, w * 0.5, Math.PI, TAU);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.fillStyle = sky;
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = frame;
  ctx.stroke();
  if (grid) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(24,29,29,.78)';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y);
    ctx.lineTo(x + w * 0.5, y + h);
    ctx.moveTo(x + 4, y + h * 0.47);
    ctx.lineTo(x + w - 4, y + h * 0.47);
    ctx.moveTo(x + 2, y + h * 0.73);
    ctx.lineTo(x + w - 2, y + h * 0.73);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(188,217,211,.13)';
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y + w * 0.5);
    ctx.arc(x + w * 0.5, y + w * 0.5, w * 0.35, 0, TAU);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawWoodFloor(ctx, x, y, w, h, planks, line, topGlow = 'rgba(255,225,170,.08)') {
  ctx.fillStyle = linear(ctx, 0, y, 0, y + h, [[0, planks[0]], [1, planks[1]]]);
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(255,255,255,.04)';
  ctx.lineWidth = 1;
  for (let row = 0; row < 7; row++) {
    const py = y + (row / 7) * h;
    ctx.beginPath();
    ctx.moveTo(x, py);
    ctx.lineTo(x + w, py + 2);
    ctx.strokeStyle = line;
    ctx.stroke();
    const offset = row % 2 === 0 ? 0.31 : 0.63;
    ctx.beginPath();
    ctx.moveTo(x + w * offset, py);
    ctx.lineTo(x + w * (offset - 0.016), py + h / 7);
    ctx.stroke();
  }
  const glow = ctx.createLinearGradient(0, y, 0, y + h * 0.35);
  glow.addColorStop(0, topGlow);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(x, y, w, h * 0.35);
}

export function drawCurtain(ctx, x, y, w, h, color, accent) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x + w * 0.9, y + h * 0.05, x + w * 0.16, y + h * 0.63, x + w * 0.5, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fillStyle = linear(ctx, x, y, x + w, y, [[0, accent], [0.55, color], [1, accent]]);
  ctx.fill();
  ctx.globalAlpha = 0.18;
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(x + w * i * 0.12, y + 5);
    ctx.quadraticCurveTo(x + w * i * 0.33, y + h * 0.45, x + w * (i * 0.18), y + h);
    ctx.strokeStyle = '#081014';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

export function drawVignette(ctx, w, h, strength = 0.65) {
  const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.24, w / 2, h / 2, Math.max(w, h) * 0.74);
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(0.72, `rgba(3,8,11,${strength * 0.18})`);
  vignette.addColorStop(1, `rgba(3,7,10,${strength})`);
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
}

export function drawDust(ctx, w, h, time, color = 'rgba(255,230,172,.5)', count = 42) {
  for (let i = 0; i < count; i++) {
    const seed = i * 97.73;
    const x = (seed * 7.17 + Math.sin(time * 0.00013 + i) * 14) % w;
    const y = (seed * 3.31 + Math.cos(time * 0.00011 + i * 1.9) * 12) % h;
    const alpha = 0.12 + (i % 5) * 0.055;
    const size = 0.7 + (i % 4) * 0.45;
    ctx.globalAlpha = alpha;
    disc(ctx, x, y, size, color);
  }
  ctx.globalAlpha = 1;
}

export function drawPatternRug(ctx, x, y, w, h, base, border, accent, odd = false) {
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x, y, w / 2, h / 2, 0, 0, TAU);
  ctx.fillStyle = base;
  ctx.fill();
  ctx.lineWidth = 10;
  ctx.strokeStyle = border;
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.strokeStyle = accent;
  ctx.beginPath();
  ctx.ellipse(x, y, w * 0.4, h * 0.33, 0, 0, TAU);
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    const px = x + Math.cos(a) * w * 0.29;
    const py = y + Math.sin(a) * h * 0.24;
    drawStar(ctx, px, py, 8, accent, 4, a + Math.PI / 4);
  }
  if (odd) drawStar(ctx, x, y, 26, accent, 4, 0);
  else drawStar(ctx, x, y, 26, accent, 5);
  ctx.restore();
}
