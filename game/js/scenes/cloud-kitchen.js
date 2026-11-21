// Case 02 — a sunlit kitchen floating above the clouds, where breakfast is never quite the same twice.
import {
  TAU, disc, ring, ellipse, fillRound, strokeRound, linear, radial,
  drawStar, drawSpark, drawGlow, drawCloud, drawBird, drawCat, drawClock,
  drawTeacup, drawTeapot, drawFern, drawLeaf, drawWindowArch, drawDust,
  drawVignette, drawWoodFloor, drawFrame,
} from '../art/primitives.js';

const differences = [
  { id: 'cuckoo-hands', name: 'The cuckoo clock has new hands', hint: 'The little clock has been busy while you blinked.', x: 548, y: 246, r: 38 },
  { id: 'missing-pot', name: 'A copper pot is missing', hint: 'The pot rack is not as polished as it was.', x: 431, y: 164, r: 37 },
  { id: 'balloon-flag', name: 'The balloon lost its flag', hint: 'Look out of the window, above the clouds.', x: 770, y: 147, r: 27 },
  { id: 'jar-lid', name: 'A pantry jar changed its lid', hint: 'The tall cupboard keeps its colours in a row.', x: 130, y: 325, r: 27 },
  { id: 'kettle-steam', name: 'The kettle breathes differently', hint: 'Something is curling above the copper kettle.', x: 475, y: 386, r: 35 },
  { id: 'cherry', name: 'The cupcake lost its cherry', hint: 'A small, sweet crown has vanished.', x: 722, y: 473, r: 26 },
  { id: 'cat-ribbon', name: 'The cat wears a different ribbon', hint: 'The window cat is dressed for another occasion.', x: 792, y: 399, r: 24 },
  { id: 'cup-handle', name: 'The cup lost its handle', hint: 'Even a quiet cup of tea has a tell.', x: 640, y: 503, r: 23 },
  { id: 'plant-leaf', name: 'The plant is missing a leaf', hint: 'The pot by the floor is one leaf lighter.', x: 94, y: 599, r: 32 },
  { id: 'stove-knob', name: 'A stove knob has disappeared', hint: 'Count the little brass soldiers on the oven.', x: 299, y: 574, r: 20 },
  { id: 'spoon', name: 'The spoon rail is short one spoon', hint: 'The hanging kitchen tools are not keeping ranks.', x: 514, y: 262, r: 23 },
  { id: 'sky-bird', name: 'An extra bird crosses the sky', hint: 'One more tiny visitor is flying past the balloon.', x: 666, y: 106, r: 23 },
];

function drawKitchenWall(ctx) {
  ctx.fillStyle = linear(ctx, 0, 0, 0, 800, [[0, '#e5c397'], [0.34, '#d7b487'], [0.63, '#c5a276'], [1, '#a98968']]);
  ctx.fillRect(0, 0, 1000, 800);
  // A broad morning shaft falling through the room.
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = radial(ctx, 760, 260, 30, 620, [[0, 'rgba(255,247,205,.24)'], [1, 'rgba(255,247,205,0)']]);
  ctx.fillRect(0, 0, 1000, 800);
  ctx.restore();
  // Gentle wallpaper stripes.
  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.strokeStyle = '#936b4c';
  ctx.lineWidth = 1;
  for (let i = 0; i < 30; i++) {
    const x = i * 35;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 12, 590);
    ctx.stroke();
  }
  ctx.restore();
  // Small painted flourishes near the ceiling.
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = '#7f5c43';
  ctx.lineWidth = 1.3;
  for (let i = 0; i < 7; i++) {
    const x = 75 + i * 145;
    ctx.beginPath();
    ctx.moveTo(x, 68);
    ctx.quadraticCurveTo(x + 22, 45, x + 49, 68);
    ctx.quadraticCurveTo(x + 24, 62, x, 78);
    ctx.stroke();
  }
  ctx.restore();
  // Wainscot and tiled skirting.
  ctx.fillStyle = '#b7c1aa';
  ctx.fillRect(0, 500, 1000, 90);
  ctx.fillStyle = 'rgba(255,247,215,.22)';
  for (let x = 0; x < 1000; x += 36) ctx.fillRect(x, 500, 1, 90);
  for (let y = 526; y < 590; y += 30) ctx.fillRect(0, y, 1000, 1);
  ctx.fillStyle = '#75553b';
  ctx.fillRect(0, 586, 1000, 9);
  ctx.fillStyle = '#e8d1a4';
  ctx.globalAlpha = 0.34;
  ctx.fillRect(0, 588, 1000, 2);
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(40,33,23,.13)';
  ctx.fillRect(0, 593, 1000, 6);
}

function drawKitchenFloor(ctx) {
  ctx.fillStyle = '#a4876a';
  ctx.fillRect(0, 599, 1000, 201);
  const tile = 58;
  for (let row = 0; row < 4; row++) {
    for (let col = -1; col < 19; col++) {
      const x = col * tile + (row % 2) * tile * 0.5;
      const y = 599 + row * 42;
      ctx.fillStyle = (row + col) % 2 === 0 ? '#d5c5a7' : '#7e9585';
      ctx.globalAlpha = 0.72;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + tile - 2, y);
      ctx.lineTo(x + tile + 8, y + 39);
      ctx.lineTo(x + 8, y + 39);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(44,28,18,.17)';
  ctx.fillRect(0, 599, 1000, 7);
  const light = ctx.createLinearGradient(0, 599, 0, 800);
  light.addColorStop(0, 'rgba(255,238,183,.13)');
  light.addColorStop(1, 'rgba(20,16,11,.16)');
  ctx.fillStyle = light;
  ctx.fillRect(0, 599, 1000, 201);
}

function drawKitchenWindow(ctx, odd, time) {
  const x = 596, y = 68, w = 326, h = 336;
  // Curtains.
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(563, 55);
  ctx.bezierCurveTo(615, 73, 627, 195, 586, 324);
  ctx.lineTo(554, 343);
  ctx.lineTo(554, 55);
  ctx.closePath();
  ctx.fillStyle = linear(ctx, 554, 55, 625, 320, [[0, '#d68169'], [0.55, '#b45e54'], [1, '#7b4944']]);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(956, 55);
  ctx.bezierCurveTo(907, 82, 908, 205, 948, 323);
  ctx.lineTo(982, 344);
  ctx.lineTo(982, 55);
  ctx.closePath();
  ctx.fillStyle = linear(ctx, 956, 55, 900, 320, [[0, '#d68169'], [0.55, '#b45e54'], [1, '#7b4944']]);
  ctx.fill();
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = '#4f2d2e';
  ctx.lineWidth = 4;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(570 + i * 15, 58);
    ctx.quadraticCurveTo(604 + i * 11, 190, 570 + i * 10, 331);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(947 - i * 16, 60);
    ctx.quadraticCurveTo(915 - i * 8, 187, 949 - i * 10, 331);
    ctx.stroke();
  }
  ctx.restore();

  // Sky clip inside the arch.
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + w * 0.5);
  ctx.arc(x + w * 0.5, y + w * 0.5, w * 0.5, Math.PI, TAU);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = linear(ctx, 0, y, 0, y + h, [[0, '#77b7c4'], [0.55, '#aad4d0'], [1, '#f2d9ac']]);
  ctx.fillRect(x, y, w, h);
  drawGlow(ctx, 820, 130, 160, 'rgba(255,244,194,ALPHA)', 0.28);
  // Far clouds.
  drawCloud(ctx, 668, 328, 52, '#f3e8d2', 0.74);
  drawCloud(ctx, 890, 302, 63, '#f2e4ce', 0.8);
  drawCloud(ctx, 628, 200, 36, '#e5eee8', 0.52);
  drawCloud(ctx, 902, 210, 30, '#e9f0e8', 0.48);
  // The balloon and its changed pennant.
  const bx = 770, by = 195;
  ctx.strokeStyle = '#684a3d';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(bx - 17, by + 28);
  ctx.lineTo(bx - 9, by + 62);
  ctx.moveTo(bx + 17, by + 28);
  ctx.lineTo(bx + 9, by + 62);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bx, by - 43);
  ctx.bezierCurveTo(bx - 50, by - 19, bx - 46, by + 31, bx, by + 36);
  ctx.bezierCurveTo(bx + 46, by + 31, bx + 50, by - 19, bx, by - 43);
  ctx.fillStyle = linear(ctx, bx - 40, by - 40, bx + 38, by + 30, [[0, '#d88967'], [0.45, '#f1c47e'], [0.72, '#b96a5a'], [1, '#d8a45f']]);
  ctx.fill();
  ctx.strokeStyle = 'rgba(91,53,44,.45)';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(bx - 28, by - 8);
  ctx.quadraticCurveTo(bx, by + 2, bx + 28, by - 8);
  ctx.moveTo(bx - 22, by + 12);
  ctx.quadraticCurveTo(bx, by + 20, bx + 22, by + 12);
  ctx.stroke();
  fillRound(ctx, bx - 12, by + 35, 24, 18, 5, '#8d5c3d');
  ctx.strokeStyle = '#5b3b2d';
  ctx.strokeRect(bx - 11, by + 36, 22, 15);
  if (!odd) {
    ctx.beginPath();
    ctx.moveTo(bx, by - 43);
    ctx.lineTo(bx + 20, by - 52);
    ctx.lineTo(bx, by - 54);
    ctx.closePath();
    ctx.fillStyle = '#b44f45';
    ctx.fill();
  }
  // Birds: two in the original, three in the odd copy.
  drawBird(ctx, 638, 129, 0.36, '#415f63', '#8da7a0', 1);
  drawBird(ctx, 862, 164, 0.29, '#415f63', '#8da7a0', -1);
  if (odd) drawBird(ctx, 666, 106, 0.25, '#415f63', '#8da7a0', 1);
  ctx.restore();
  drawWindowArch(ctx, x, y, w, h, 'rgba(0,0,0,0)', '#765139', true);
  // Window sill, brass latch, and a sun warm stain.
  fillRound(ctx, 573, 397, 371, 18, 7, '#b58d5f');
  fillRound(ctx, 577, 394, 363, 10, 5, '#e3c08b');
  ctx.fillStyle = 'rgba(255,232,170,.18)';
  ctx.fillRect(585, 399, 347, 3);
  disc(ctx, 759, 360, 4, '#c89b53');
  ctx.strokeStyle = '#6f5038';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(759, 360);
  ctx.lineTo(768, 370);
  ctx.stroke();

  // The window cat, with a ribbon whose colour tells a small lie.
  drawCat(ctx, 811, 405, 0.7, '#534f52', '#e9d5b5', 'curl');
  ctx.save();
  ctx.translate(811, 405);
  ctx.scale(0.7, 0.7);
  ctx.beginPath();
  ctx.arc(-27, -7, 15, Math.PI * 1.07, Math.PI * 1.85);
  ctx.strokeStyle = odd ? '#6c9c84' : '#b35757';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = odd ? '#6c9c84' : '#b35757';
  ctx.beginPath();
  ctx.moveTo(-31, 4);
  ctx.lineTo(-35, 17);
  ctx.lineTo(-22, 8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPantry(ctx, odd) {
  const x = 28, y = 133, w = 264, h = 429;
  ctx.save();
  ctx.globalAlpha = 0.24;
  ellipse(ctx, 160, 570, 152, 18, '#3a271b');
  ctx.restore();
  fillRound(ctx, x, y, w, h, 7, '#6d4d34');
  fillRound(ctx, x + 8, y + 8, w - 16, h - 16, 4, '#b28758');
  ctx.fillStyle = linear(ctx, x + 15, y + 20, x + w - 15, y + h - 10, [[0, '#c59b67'], [0.5, '#9e744a'], [1, '#c59b67']]);
  ctx.fillRect(x + 17, y + 20, w - 34, h - 37);
  // Top crown.
  fillRound(ctx, x - 8, y - 8, w + 16, 17, 5, '#d2ab76');
  fillRound(ctx, x - 1, y + 10, w + 2, 6, 2, '#795737');
  // Inner recess.
  ctx.fillStyle = '#5c4330';
  ctx.fillRect(x + 25, y + 37, w - 50, h - 73);
  // Shelves and their contents.
  const shelfY = [190, 294, 399, 503];
  for (const sy of shelfY) {
    ctx.fillStyle = '#785837';
    ctx.fillRect(x + 21, sy, w - 42, 9);
    ctx.fillStyle = '#d3ad76';
    ctx.fillRect(x + 23, sy + 1, w - 46, 2);
  }
  // Plates on the top shelf.
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(72 + i * 47, 176, 22, Math.PI, TAU);
    ctx.fillStyle = i % 2 ? '#e4d4b2' : '#a9c2b1';
    ctx.fill();
    ring(ctx, 72 + i * 47, 176, 15, 'rgba(95,77,51,.24)', 1);
  }
  // Jars, each with a distinguishable brass lid.
  const jars = [
    [58, 232, '#bfa074', '#a7584a'], [104, 234, '#b5c4a1', '#a9874e'],
    [151, 228, '#d0b0a0', '#6e8477'], [207, 226, '#c4b390', '#aa654d'],
    [80, 338, '#a6b9a2', '#a97d45'], [130, 331, '#c7a67b', '#8a6953'],
    [187, 340, '#b7c2b4', '#9f5b4a'], [74, 444, '#c0a580', '#7c907f'],
    [128, 434, '#d0b897', '#b56850'], [181, 447, '#b4b99d', '#97754a'],
  ];
  for (let i = 0; i < jars.length; i++) {
    const [jx, jy, body, lid] = jars[i];
    const h = i === 1 ? 50 : 42 + (i % 3) * 4;
    fillRound(ctx, jx - 15, jy, 30, h, 8, body);
    ctx.fillStyle = 'rgba(255,245,211,.22)';
    ctx.fillRect(jx - 11, jy + 6, 5, h - 14);
    fillRound(ctx, jx - 17, jy - 7, 34, 9, 3, lid);
    disc(ctx, jx, jy - 3, 3, 'rgba(246,218,156,.43)');
  }
  // A specific jar lid changes from coral to moss green in the odd copy.
  // Draw it after the row so the difference stays crisp.
  fillRound(ctx, 112, 323, 36, 9, 3, odd ? '#6f9a78' : '#b65f50');
  // Tea tin and a sleepy ceramic hen.
  fillRound(ctx, 198, 490, 45, 48, 5, '#6f8c7f');
  ctx.fillStyle = '#dfcb9b';
  ctx.font = 'italic 8px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('TEA', 220, 518);
  ellipse(ctx, 86, 510, 27, 22, '#d6c4a1');
  disc(ctx, 107, 494, 15, '#d6c4a1');
  ctx.fillStyle = '#b0574d';
  ctx.beginPath();
  ctx.moveTo(105, 481);
  ctx.lineTo(110, 470);
  ctx.lineTo(116, 483);
  ctx.fill();
  ctx.fillStyle = '#4b3d32';
  disc(ctx, 113, 494, 1.6, '#4b3d32');
  // Cabinet door border.
  strokeRound(ctx, x + 20, y + 19, w - 40, h - 36, 5, 'rgba(78,51,31,.45)', 2);
  // Door knobs and cabinet feet.
  disc(ctx, 154, 547, 5, '#d5ae69');
  fillRound(ctx, 54, 559, 20, 19, 3, '#5c412d');
  fillRound(ctx, 244, 559, 20, 19, 3, '#5c412d');
}

function drawPotRackAndUtensils(ctx, odd, time) {
  // Ceiling beam and hooks.
  fillRound(ctx, 302, 101, 291, 14, 4, '#6c4d32');
  fillRound(ctx, 309, 103, 277, 4, 2, '#b38a55');
  const pots = [
    { x: 356, y: 170, r: 34, color: '#b56c43' },
    { x: 431, y: 165, r: 38, color: '#986143' },
    { x: 507, y: 174, r: 31, color: '#c07a4a' },
  ];
  for (let i = 0; i < pots.length; i++) {
    if (odd && i === 1) continue;
    const p = pots[i];
    ctx.strokeStyle = '#7e603e';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(p.x, 115);
    ctx.lineTo(p.x, p.y - p.r + 5);
    ctx.stroke();
    ring(ctx, p.x, p.y - p.r + 5, 7, '#b28b52', 2);
    // Copper pot with side handles.
    ctx.beginPath();
    ctx.moveTo(p.x - p.r, p.y - p.r * 0.35);
    ctx.quadraticCurveTo(p.x - p.r, p.y + p.r * 0.75, p.x, p.y + p.r * 0.85);
    ctx.quadraticCurveTo(p.x + p.r, p.y + p.r * 0.75, p.x + p.r, p.y - p.r * 0.35);
    ctx.closePath();
    ctx.fillStyle = linear(ctx, p.x - p.r, p.y - p.r, p.x + p.r, p.y + p.r, [[0, '#e0a36d'], [0.4, p.color], [1, '#704535']]);
    ctx.fill();
    ellipse(ctx, p.x, p.y - p.r * 0.37, p.r * 0.92, 7, '#4b332a');
    ellipse(ctx, p.x, p.y - p.r * 0.44, p.r * 0.82, 4, '#d9a06c');
    ctx.strokeStyle = '#78553b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(p.x - p.r, p.y - 4, 9, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(p.x + p.r, p.y - 4, 9, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.stroke();
    drawGlow(ctx, p.x, p.y, p.r + 12, 'rgba(244,198,119,ALPHA)', 0.12);
  }
  // Utensil rail.
  fillRound(ctx, 320, 214, 209, 7, 3, '#8d6b3f');
  for (let i = 0; i < 5; i++) disc(ctx, 343 + i * 43, 221, 2.5, '#dfbd7c');
  // A spoon, a skimmer, and a ladle; the odd copy is missing one spoon.
  const utensils = [
    { x: 343, type: 'ladle' }, { x: 389, type: 'spoon' }, { x: 434, type: 'spoon' },
    { x: 477, type: 'skimmer' }, { x: 514, type: 'spoon' },
  ];
  for (let i = 0; i < utensils.length; i++) {
    if (odd && i === 4) continue;
    const u = utensils[i];
    ctx.strokeStyle = '#7f6647';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(u.x, 222);
    ctx.lineTo(u.x, 257);
    ctx.stroke();
    if (u.type === 'ladle') {
      ctx.beginPath();
      ctx.arc(u.x, 269, 12, 0, Math.PI);
      ctx.fillStyle = '#b08b56';
      ctx.fill();
    } else if (u.type === 'skimmer') {
      disc(ctx, u.x, 266, 11, '#9a8159');
      ctx.fillStyle = 'rgba(41,34,24,.44)';
      for (let j = 0; j < 3; j++) disc(ctx, u.x - 5 + j * 5, 265, 1.2, 'rgba(41,34,24,.44)');
    } else {
      ctx.beginPath();
      ctx.ellipse(u.x, 264, 6, 11, 0, 0, TAU);
      ctx.fillStyle = '#b9935b';
      ctx.fill();
    }
  }
  // Hanging rosemary bundle.
  ctx.strokeStyle = '#587461';
  ctx.lineWidth = 2;
  for (let i = 0; i < 11; i++) {
    const a = -0.8 + i * 0.16;
    ctx.beginPath();
    ctx.moveTo(278, 116);
    ctx.quadraticCurveTo(273 + Math.cos(a) * 19, 150, 271 + Math.cos(a) * 27, 173 + Math.sin(i) * 5);
    ctx.stroke();
  }
  fillRound(ctx, 271, 116, 15, 11, 3, '#a45e4b');
  ctx.strokeStyle = '#d7b274';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(278, 118);
  ctx.lineTo(278, 204 + Math.sin(time * 0.001) * 2);
  ctx.stroke();
}

function drawCuckooClock(ctx, odd) {
  const x = 548, y = 258;
  // Hanging chains and leafy crest.
  ctx.strokeStyle = '#6d5139';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 17, 94);
  ctx.quadraticCurveTo(x - 29, 149, x - 18, 196);
  ctx.moveTo(x + 17, 94);
  ctx.quadraticCurveTo(x + 29, 149, x + 18, 196);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, 109);
  ctx.lineTo(x - 9, 188);
  ctx.lineTo(x + 9, 188);
  ctx.closePath();
  ctx.fillStyle = '#7e5c3a';
  ctx.fill();
  // Roof and little chalet.
  ctx.beginPath();
  ctx.moveTo(x - 54, 226);
  ctx.lineTo(x, 192);
  ctx.lineTo(x + 54, 226);
  ctx.lineTo(x + 40, 236);
  ctx.lineTo(x - 40, 236);
  ctx.closePath();
  ctx.fillStyle = '#5a3f2c';
  ctx.fill();
  fillRound(ctx, x - 47, 235, 94, 82, 8, '#a9794a');
  fillRound(ctx, x - 38, 245, 76, 60, 5, '#7a5438');
  drawClock(ctx, x, y - 14, 34, odd ? 1 : 0, '#ead9b2', '#60432e');
  // A tiny carved bird door.
  fillRound(ctx, x - 12, 203, 24, 18, 3, '#4e3828');
  ctx.fillStyle = '#d8b77d';
  ctx.beginPath();
  ctx.moveTo(x - 3, 219);
  ctx.quadraticCurveTo(x + 3, 205, x + 11, 218);
  ctx.closePath();
  ctx.fill();
  // Pendulum.
  ctx.strokeStyle = '#9b7548';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, 317);
  ctx.lineTo(x + 8, 365);
  ctx.stroke();
  disc(ctx, x + 8, 369, 15, '#b18b54');
  ring(ctx, x + 8, 369, 11, 'rgba(255,229,166,.28)', 1);
  // Leaf decorations.
  for (let i = 0; i < 4; i++) {
    drawLeaf(ctx, x - 46 + i * 12, 246 + (i % 2) * 7, 21, 7, -0.55 + i * 0.1, '#7d996d');
    drawLeaf(ctx, x + 47 - i * 12, 249 + (i % 2) * 7, 21, 7, 0.55 - i * 0.1, '#7d996d');
  }
}

function drawKitchenIsland(ctx, odd, time) {
  // Counter body with sturdier silhouette.
  ctx.save();
  ctx.globalAlpha = 0.27;
  ellipse(ctx, 518, 704, 347, 24, '#332417');
  ctx.restore();
  fillRound(ctx, 171, 526, 606, 166, 10, '#8e6948');
  fillRound(ctx, 184, 539, 580, 140, 7, '#c9a474');
  // Door panels.
  const panels = [228, 390, 552, 714];
  for (let i = 0; i < 4; i++) {
    fillRound(ctx, panels[i] - 49, 557, 98, 98, 5, '#b68d61');
    strokeRound(ctx, panels[i] - 43, 563, 86, 86, 3, 'rgba(91,60,35,.37)', 1.4);
    fillRound(ctx, panels[i] - 32, 573, 64, 66, 3, 'rgba(217,181,128,.45)');
    disc(ctx, panels[i], 604, 4.5, '#d9b36d');
  }
  // Stove front and knobs.
  fillRound(ctx, 245, 538, 113, 140, 5, '#748276');
  ctx.fillStyle = '#3f4b48';
  ctx.fillRect(258, 634, 87, 30);
  ctx.strokeStyle = 'rgba(230,226,197,.22)';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(265, 640 + i * 5);
    ctx.lineTo(338, 640 + i * 5);
    ctx.stroke();
  }
  const knobs = [274, 299, 324];
  for (let i = 0; i < knobs.length; i++) {
    if (odd && i === 1) continue;
    disc(ctx, knobs[i], 574, 7, '#d4ae6c');
    disc(ctx, knobs[i], 574, 3, '#725634');
  }
  // Countertop.
  fillRound(ctx, 151, 507, 646, 28, 10, '#d9b985');
  fillRound(ctx, 158, 502, 632, 18, 8, '#f0d6a4');
  ctx.fillStyle = 'rgba(255,245,213,.35)';
  ctx.fillRect(164, 505, 619, 3);
  // Stovetop plate.
  ellipse(ctx, 308, 511, 75, 11, '#5a5951');
  ellipse(ctx, 308, 509, 66, 8, '#85887a');
  // Kettle.
  drawTeapot(ctx, 413, 475, 1.24, '#b87448', '#f4cf94', odd ? 1 : 2);
  ctx.save();
  ctx.translate(413, 470);
  ctx.strokeStyle = 'rgba(82,47,29,.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(48, -26, 24, Math.PI * 1.05, Math.PI * 1.58);
  ctx.stroke();
  ctx.restore();
  // Steam: a single curl normally, a second curl in the odd copy.
  ctx.save();
  ctx.strokeStyle = 'rgba(250,244,222,.55)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  for (let s = 0; s < (odd ? 1 : 2); s++) {
    ctx.beginPath();
    ctx.moveTo(463 + s * 13, 420);
    ctx.bezierCurveTo(494 + s * 16, 397, 461 + s * 10, 380, 488 + s * 13, 347);
    ctx.stroke();
  }
  ctx.restore();
  // Cutting board with bread and a jar.
  ctx.save();
  ctx.translate(520, 503);
  ctx.rotate(-0.04);
  fillRound(ctx, -65, -10, 132, 22, 8, '#c29456');
  strokeRound(ctx, -58, -6, 118, 14, 6, 'rgba(93,61,32,.35)', 1);
  fillRound(ctx, -45, -29, 50, 25, 13, '#d9b373');
  fillRound(ctx, -39, -32, 38, 24, 11, '#ebc987');
  ctx.strokeStyle = 'rgba(125,79,38,.4)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-28, -26); ctx.lineTo(-28, -10);
  ctx.moveTo(-14, -27); ctx.lineTo(-14, -10); ctx.stroke();
  ctx.restore();
  fillRound(ctx, 574, 449, 35, 55, 7, '#ad9272');
  fillRound(ctx, 570, 443, 43, 10, 4, '#8e5d43');
  ctx.fillStyle = '#e6d1a0';
  ctx.font = 'italic 7px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('SALT', 591, 480);
  // Teacup.
  drawTeacup(ctx, 622, 497, 0.86, '#e9d8b3', '#7d5033', !odd);
  // Cupcake tray.
  ctx.save();
  ctx.translate(722, 506);
  ellipse(ctx, 0, 3, 48, 9, '#cca96d');
  strokeRound(ctx, -47, -3, 94, 14, 7, '#9a7950', 1);
  // Cupcake wrapper and frosting.
  ctx.beginPath();
  ctx.moveTo(-20, 1);
  ctx.lineTo(20, 1);
  ctx.lineTo(15, 23);
  ctx.lineTo(-15, 23);
  ctx.closePath();
  ctx.fillStyle = '#d58e72';
  ctx.fill();
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(-18 + i * 11, 2);
    ctx.lineTo(-11 + i * 11, 22);
    ctx.strokeStyle = 'rgba(255,244,217,.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.ellipse(-7, -6, 16, 13, -0.22, 0, TAU);
  ctx.ellipse(7, -7, 15, 14, 0.25, 0, TAU);
  ctx.ellipse(0, -16, 15, 12, 0, 0, TAU);
  ctx.fillStyle = '#f3dcae';
  ctx.fill();
  if (!odd) {
    disc(ctx, 1, -31, 7, '#a94339');
    ctx.strokeStyle = '#5e6c47';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(1, -37);
    ctx.quadraticCurveTo(9, -44, 12, -39);
    ctx.stroke();
  }
  ctx.restore();
  // Hovering flour dust and bees of light.
  for (let i = 0; i < 5; i++) drawSpark(ctx, 590 + i * 36, 445 + (i % 2) * 12, 2.2, 'rgba(255,241,192,.68)', 0.65);
}

function drawPlantAndFloorDetails(ctx, odd) {
  // A cluster of potted kitchen herbs at lower left.
  ctx.save();
  ctx.globalAlpha = 0.28;
  ellipse(ctx, 92, 711, 82, 17, '#302319');
  ctx.restore();
  drawFern(ctx, 91, 634, 0.83, '#68885e', 8, odd ? 2 : -1);
  ctx.beginPath();
  ctx.moveTo(53, 628);
  ctx.lineTo(129, 628);
  ctx.lineTo(117, 698);
  ctx.quadraticCurveTo(91, 708, 65, 698);
  ctx.closePath();
  ctx.fillStyle = linear(ctx, 53, 628, 129, 698, [[0, '#b27652'], [0.56, '#8b593e'], [1, '#c28a5e']]);
  ctx.fill();
  fillRound(ctx, 49, 621, 84, 14, 5, '#c08a60');
  // Herb labels.
  fillRound(ctx, 141, 682, 36, 15, 2, '#9a7950');
  ctx.fillStyle = 'rgba(247,228,184,.72)';
  ctx.font = 'italic 7px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('THYME', 159, 692);
  // Woven runner rug by the counter.
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(560, 735, 242, 39, 0, 0, TAU);
  ctx.fillStyle = '#8c7e63';
  ctx.fill();
  ctx.strokeStyle = '#d3b879';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(247,225,177,.28)';
  ctx.lineWidth = 1;
  for (let i = -4; i <= 4; i++) {
    ctx.beginPath();
    ctx.moveTo(560 + i * 44, 704);
    ctx.lineTo(560 + i * 39, 765);
    ctx.stroke();
  }
  ctx.restore();
  // Little jug on the floor.
  fillRound(ctx, 806, 621, 33, 48, 9, '#acc1b0');
  fillRound(ctx, 809, 616, 27, 8, 3, '#d6c699');
  ctx.beginPath();
  ctx.arc(839, 642, 12, -Math.PI * 0.5, Math.PI * 0.5);
  ctx.strokeStyle = '#acc1b0';
  ctx.lineWidth = 5;
  ctx.stroke();
  // Scattered flour marks.
  ctx.fillStyle = 'rgba(243,230,198,.26)';
  for (let i = 0; i < 7; i++) disc(ctx, 370 + (i * 61) % 280, 711 + (i * 37) % 43, 2.2 + (i % 3), 'rgba(243,230,198,.26)');
}

function drawMorningAtmosphere(ctx, odd, time) {
  // Golden window motes.
  drawDust(ctx, 1000, 800, time, 'rgba(255,246,201,.72)', 42);
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = linear(ctx, 585, 70, 250, 760, [[0, 'rgba(255,244,197,.16)'], [0.55, 'rgba(255,231,163,.06)'], [1, 'rgba(255,231,163,0)']]);
  ctx.beginPath();
  ctx.moveTo(615, 76);
  ctx.lineTo(915, 76);
  ctx.lineTo(680, 800);
  ctx.lineTo(180, 800);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  drawVignette(ctx, 1000, 800, 0.48);
}

export const cloudKitchen = {
  id: 'cloud-kitchen',
  number: '02',
  title: 'The Cloud Kitchen',
  objective: 'A dozen differences are hiding among the breakfast things.',
  duration: 230,
  hints: 2,
  differences,
  draw(ctx, width, height, odd, time) {
    ctx.save();
    ctx.scale(width / 1000, height / 800);
    drawKitchenWall(ctx);
    drawKitchenFloor(ctx);
    drawKitchenWindow(ctx, odd, time);
    drawPantry(ctx, odd);
    drawPotRackAndUtensils(ctx, odd, time);
    drawCuckooClock(ctx, odd);
    drawKitchenIsland(ctx, odd, time);
    drawPlantAndFloorDetails(ctx, odd);
    drawMorningAtmosphere(ctx, odd, time);
    ctx.restore();
  },
};
