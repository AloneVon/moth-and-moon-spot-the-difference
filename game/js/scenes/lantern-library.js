// Case 01 — a candlelit library where a fox reads past midnight.
// All differences are deliberate, hand-placed changes painted into the "odd copy".
import {
  TAU, disc, ring, ellipse, fillRound, strokeRound, linear, radial,
  drawStar, drawSpark, drawGlow, drawMoon, drawLeaf, drawFern, drawBook,
  drawBookStack, drawMoth, drawCat, drawCandle, drawChandelier, drawClock,
  drawTeacup, drawTeapot, drawFrame, drawWindowArch, drawWoodFloor,
  drawCurtain, drawDust, drawVignette, drawPatternRug, drawCloud,
} from '../art/primitives.js';

const differences = [
  { id: 'moon-phase', name: 'The moon has changed its phase', hint: 'The night outside is wearing a different face.', x: 500, y: 218, r: 48 },
  { id: 'extra-star', name: 'A new star has appeared', hint: 'One point of light is not where you left it.', x: 618, y: 303, r: 30 },
  { id: 'middle-candle', name: 'The chandelier is one flame short', hint: 'Count the warm little crowns above the room.', x: 500, y: 105, r: 36 },
  { id: 'portrait-wing', name: 'The portrait moth has folded a wing', hint: 'The painted moth is keeping something to itself.', x: 738, y: 226, r: 39 },
  { id: 'clock-hands', name: 'The clock has lost fifteen minutes', hint: 'Time keeps its own counsel on the right wall.', x: 858, y: 230, r: 43 },
  { id: 'red-book', name: 'A red book turned green', hint: 'A shelf on the left has changed its mind about colour.', x: 160, y: 240, r: 31 },
  { id: 'teacup-handle', name: 'The teacup lost its handle', hint: 'Tea is a serious business at the little table.', x: 225, y: 623, r: 25 },
  { id: 'fox-tail', name: 'The fox curled its tail another way', hint: 'The reader by the fire is almost too comfortable.', x: 846, y: 579, r: 49 },
  { id: 'fern-leaf', name: 'The fern is missing a frond', hint: 'Something green has shed a little bravery.', x: 648, y: 542, r: 38 },
  { id: 'rug-star', name: 'The rug has a new central star', hint: 'Look down. Even the carpet tells a different story.', x: 505, y: 722, r: 38 },
];

const books = [
  { x: 59, y: 199, w: 19, h: 76, color: '#9c5b47', accent: '#deb985', lean: -0.05 },
  { x: 80, y: 218, w: 17, h: 57, color: '#477065', accent: '#c9d6aa', lean: 0 },
  { x: 99, y: 204, w: 22, h: 71, color: '#b0864e', accent: '#f0d99b', lean: 0.04 },
  { x: 123, y: 223, w: 16, h: 52, color: '#586278', accent: '#c5d4dd', lean: 0 },
  { x: 150, y: 211, w: 24, h: 64, color: '#83525e', accent: '#e9c59f', lean: -0.08 },
  { x: 58, y: 337, w: 22, h: 47, color: '#667b56', accent: '#d7d6a5', lean: 0 },
  { x: 82, y: 320, w: 16, h: 64, color: '#7e5370', accent: '#e9c1b8', lean: 0.05 },
  { x: 101, y: 347, w: 25, h: 37, color: '#b0684e', accent: '#e8cf9f', lean: 0 },
  { x: 128, y: 330, w: 18, h: 54, color: '#4b6d7a', accent: '#b8d6c7', lean: -0.04 },
  { x: 148, y: 315, w: 23, h: 69, color: '#a88a51', accent: '#f1e3b3', lean: 0 },
  { x: 56, y: 444, w: 22, h: 61, color: '#967449', accent: '#e4d09c', lean: 0.04 },
  { x: 80, y: 468, w: 19, h: 37, color: '#52706f', accent: '#bed2bf', lean: 0 },
  { x: 102, y: 428, w: 23, h: 77, color: '#a05a4a', accent: '#e7c195', lean: -0.03 },
  { x: 128, y: 459, w: 16, h: 46, color: '#5c5b7b', accent: '#d2c6d7', lean: 0.02 },
  { x: 148, y: 438, w: 21, h: 67, color: '#92754c', accent: '#ead7a3', lean: 0 },
];

function drawLibraryWall(ctx) {
  ctx.fillStyle = linear(ctx, 0, 0, 0, 800, [[0, '#183a42'], [0.44, '#15343d'], [1, '#0e232c']]);
  ctx.fillRect(0, 0, 1000, 800);

  // Faint hand-painted damask pattern.
  ctx.save();
  ctx.globalAlpha = 0.13;
  ctx.strokeStyle = '#9bb3a7';
  ctx.lineWidth = 1;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 8; col++) {
      const x = 80 + col * 127 + (row % 2) * 62;
      const y = 84 + row * 108;
      ctx.beginPath();
      ctx.moveTo(x, y - 19);
      ctx.quadraticCurveTo(x + 23, y - 5, x, y + 18);
      ctx.quadraticCurveTo(x - 23, y - 5, x, y - 19);
      ctx.moveTo(x, y - 5);
      ctx.lineTo(x + 9, y + 4);
      ctx.lineTo(x, y + 13);
      ctx.lineTo(x - 9, y + 4);
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.restore();

  // Crown moulding and warm ceiling shadow.
  ctx.fillStyle = linear(ctx, 0, 0, 0, 50, [[0, '#0a1820'], [1, 'rgba(10,24,32,0)']]);
  ctx.fillRect(0, 0, 1000, 58);
  ctx.fillStyle = '#54452f';
  ctx.fillRect(0, 51, 1000, 4);
  ctx.fillStyle = '#9e7940';
  ctx.globalAlpha = 0.44;
  ctx.fillRect(0, 54, 1000, 2);
  ctx.globalAlpha = 1;
}

function drawLibraryWindow(ctx, odd, time) {
  // Curtains frame the arched window.
  drawCurtain(ctx, 270, 73, 92, 430, '#593c3a', '#2b2024');
  drawCurtain(ctx, 730, 73, 92, 430, '#593c3a', '#2b2024');
  ctx.save();
  ctx.translate(1000, 0);
  ctx.scale(-1, 1);
  drawCurtain(ctx, 270, 73, 92, 430, '#593c3a', '#2b2024');
  ctx.restore();

  // The night inside the glass.
  const x = 330, y = 80, w = 340, h = 422;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + w * 0.5);
  ctx.arc(x + w * 0.5, y + w * 0.5, w * 0.5, Math.PI, TAU);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = linear(ctx, 0, y, 0, y + h, [[0, '#0e2941'], [0.6, '#1f5260'], [1, '#426a68']]);
  ctx.fillRect(x, y, w, h);

  // A soft haze and distant hills.
  ctx.fillStyle = radial(ctx, 520, 275, 10, 265, [[0, 'rgba(141,178,158,.12)'], [1, 'rgba(15,37,47,0)']]);
  ctx.fillRect(x, y, w, h);
  ctx.beginPath();
  ctx.moveTo(x, y + 320);
  ctx.bezierCurveTo(x + 72, 280, x + 105, 311, x + 157, 290);
  ctx.bezierCurveTo(x + 211, 266, x + 258, 311, x + 318, 281);
  ctx.lineTo(x + w, 324);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fillStyle = 'rgba(8,25,30,.62)';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x, y + 354);
  ctx.bezierCurveTo(x + 74, 331, x + 125, 360, x + 184, 338);
  ctx.bezierCurveTo(x + 256, 309, x + 304, 346, x + 340, 331);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fillStyle = 'rgba(4,15,20,.81)';
  ctx.fill();

  // Moon: the original hangs as a thin crescent, the odd copy is full.
  drawGlow(ctx, 500, 218, 121, 'rgba(246,211,134,ALPHA)', 0.2);
  drawMoon(ctx, 500, 218, 54, odd ? 'full' : 'crescent', '#f3d79a');

  // Tiny stars; one extra is added in the odd copy.
  const stars = [[377, 163, 2.6], [606, 142, 2.0], [411, 317, 1.4], [578, 373, 1.7]];
  if (odd) stars.push([618, 303, 3.1]);
  for (const [sx, sy, sr] of stars) {
    ctx.globalAlpha = 0.7 + Math.sin(time * 0.0015 + sx) * 0.2;
    drawSpark(ctx, sx, sy, sr * 2.4, '#f8e5b0', 0.8);
    ctx.globalAlpha = 1;
  }
  ctx.restore();

  drawWindowArch(ctx, x, y, w, h, 'rgba(0,0,0,0)', '#4c3826', true);

  // Warm inner rim and curtains' little brass tie-backs.
  ctx.strokeStyle = 'rgba(248,210,137,.26)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + 20, y + w * 0.5);
  ctx.arc(x + w * 0.5, y + w * 0.5, w * 0.5 - 20, Math.PI, TAU);
  ctx.stroke();
  for (const bx of [279, 721]) {
    fillRound(ctx, bx - 6, 405, 12, 9, 3, '#bc8f4c');
    disc(ctx, bx, 412, 3, '#f2ce7c');
  }
}

function drawBookshelf(ctx, odd) {
  const x = 38, y = 147, w = 238, h = 424;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.38)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 12;
  fillRound(ctx, x, y, w, h, 4, '#402d21');
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = linear(ctx, x, y, x + w, y, [[0, '#6d4a2c'], [0.1, '#2f241d'], [0.9, '#4a3322'], [1, '#241a14']]);
  ctx.fillRect(x + 10, y + 9, w - 20, h - 18);
  for (let shelf = 1; shelf <= 3; shelf++) {
    const sy = y + 32 + shelf * 104;
    ctx.fillStyle = '#231a14';
    ctx.fillRect(x + 6, sy, w - 12, 10);
    ctx.fillStyle = '#8b693d';
    ctx.fillRect(x + 7, sy + 1, w - 14, 2);
    ctx.fillStyle = 'rgba(10,8,7,.35)';
    ctx.fillRect(x + 8, sy + 10, w - 16, 4);
  }
  ctx.fillStyle = '#6a4b2d';
  ctx.fillRect(x + 5, y + 6, 7, h - 12);
  ctx.fillRect(x + w - 12, y + 6, 7, h - 12);
  ctx.restore();

  // Books are individually painted so the special red volume has a home.
  for (let i = 0; i < books.length; i++) {
    const b = books[i];
    let color = b.color;
    if (i === 4) color = odd ? '#5f8a6b' : '#c46952';
    drawBook(ctx, b.x, b.y, b.w, b.h, color, b.accent, b.lean);
  }
  // Small brass ornaments and a candle stub.
  drawCandle(ctx, 220, 183, 0.55, false);
  drawSpark(ctx, 227, 164, 5, 'rgba(239,201,123,.65)', 0.8);
  fillRound(ctx, 186, 370, 29, 9, 3, '#9c7844');
  disc(ctx, 197, 369, 5, '#cfaa63');
  fillRound(ctx, 166, 588, 45, 8, 3, '#9c7844');
  disc(ctx, 188, 581, 8, '#b58b4c');
}

function drawPortrait(ctx, odd) {
  const x = 684, y = 160, w = 105, h = 133;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.35)';
  ctx.shadowBlur = 13;
  ctx.shadowOffsetY = 8;
  drawFrame(ctx, x, y, w, h, '#b18345', '#1b3034');
  ctx.shadowColor = 'transparent';
  ctx.save();
  ctx.beginPath();
  ctx.rect(x + 10, y + 10, w - 20, h - 20);
  ctx.clip();
  // Painted backdrop: a tiny moon over a midnight meadow.
  ctx.fillStyle = linear(ctx, 0, y, 0, y + h, [[0, '#203e46'], [1, '#15282d']]);
  ctx.fillRect(x + 10, y + 10, w - 20, h - 20);
  drawMoon(ctx, x + 71, y + 36, 11, 'crescent', '#b8cfb2');
  ctx.strokeStyle = 'rgba(176,203,175,.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 16, y + 98);
  ctx.quadraticCurveTo(x + 45, y + 78, x + 63, y + 101);
  ctx.quadraticCurveTo(x + 77, y + 81, x + 93, y + 100);
  ctx.stroke();
  drawMoth(ctx, x + 54, y + 77, 1.22, '#d5c08d', '#7f9f83', odd ? 1 : 3, odd);
  ctx.restore();
  ctx.strokeStyle = 'rgba(242,205,136,.26)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 10.5, y + 10.5, w - 21, h - 21);
  // Engraved little title plate.
  fillRound(ctx, x + 24, y + 110, w - 48, 12, 2, '#866435');
  ctx.fillStyle = 'rgba(255,236,188,.65)';
  ctx.font = 'italic 6px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('L. MOTH', x + w / 2, y + 119);
  ctx.restore();
}

function drawArmchairAndFox(ctx, odd) {
  // Rug first, giving the chair a soft stage.
  drawPatternRug(ctx, 505, 722, 470, 151, '#633d3a', '#a17a45', '#d5b36c', odd);
  // Chair shadow.
  ctx.save();
  ctx.globalAlpha = 0.3;
  ellipse(ctx, 823, 695, 158, 30, '#050b0e');
  ctx.restore();
  // Chair back.
  ctx.beginPath();
  ctx.moveTo(731, 615);
  ctx.quadraticCurveTo(716, 466, 796, 454);
  ctx.quadraticCurveTo(887, 443, 927, 508);
  ctx.lineTo(929, 651);
  ctx.lineTo(731, 651);
  ctx.closePath();
  ctx.fillStyle = linear(ctx, 720, 455, 940, 660, [[0, '#8d4f3d'], [0.5, '#6c3b31'], [1, '#3f2927']]);
  ctx.fill();
  // Tufting.
  ctx.strokeStyle = 'rgba(250,201,134,.14)';
  ctx.lineWidth = 1;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const px = 778 + col * 48 + (row % 2) * 23;
      const py = 490 + row * 40;
      disc(ctx, px, py, 1.7, 'rgba(250,201,134,.24)');
    }
  }
  // Seat and arms.
  fillRound(ctx, 722, 614, 222, 67, 27, '#754337');
  fillRound(ctx, 703, 546, 38, 130, 17, '#9a6546');
  fillRound(ctx, 915, 546, 38, 130, 17, '#9a6546');
  ctx.fillStyle = '#342321';
  ctx.fillRect(751, 675, 15, 31);
  ctx.fillRect(891, 675, 15, 31);
  // The fox is curled up in the seat.
  drawCat(ctx, 852, 598, 1.08, '#c4774b', '#f2dfbb', odd ? 'straight' : 'curl');
  // A little blanket and book on the arm.
  ctx.beginPath();
  ctx.moveTo(744, 635);
  ctx.quadraticCurveTo(827, 620, 918, 641);
  ctx.lineTo(905, 671);
  ctx.quadraticCurveTo(810, 658, 752, 668);
  ctx.closePath();
  ctx.fillStyle = 'rgba(160,108,74,.75)';
  ctx.fill();
  drawBook(ctx, 894, 608, 32, 13, '#5c7181', '#e4cda3', -0.2);
}

function drawTeaTable(ctx, odd) {
  ctx.save();
  ctx.globalAlpha = 0.34;
  ellipse(ctx, 189, 735, 157, 20, '#04090c');
  ctx.restore();
  // Turned table legs.
  fillRound(ctx, 96, 641, 13, 109, 5, '#4a3426');
  fillRound(ctx, 279, 641, 13, 109, 5, '#4a3426');
  fillRound(ctx, 92, 698, 21, 8, 4, '#35251b');
  fillRound(ctx, 275, 698, 21, 8, 4, '#35251b');
  // Round table top.
  ctx.beginPath();
  ctx.ellipse(193, 636, 143, 36, 0, 0, TAU);
  ctx.fillStyle = linear(ctx, 50, 600, 340, 670, [[0, '#87603b'], [0.5, '#b98a53'], [1, '#6c4b30']]);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(193, 627, 143, 28, 0, 0, TAU);
  ctx.fillStyle = linear(ctx, 70, 600, 300, 650, [[0, '#b58854'], [0.6, '#795232'], [1, '#9d7245']]);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,217,149,.22)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(193, 627, 125, 20, 0, 0, TAU);
  ctx.stroke();
  // Tea things, an open book, and a lemon wedge.
  drawTeapot(ctx, 124, 610, 0.84, '#9b7951', '#f2d49c');
  drawTeacup(ctx, 204, 618, 0.86, '#ead9b5', '#6c4630', !odd);
  ctx.save();
  ctx.translate(253, 616);
  ctx.rotate(-0.25);
  fillRound(ctx, -18, -11, 37, 23, 4, '#e8d9b8');
  ctx.strokeStyle = '#9f7b4c';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -11);
  ctx.lineTo(0, 12);
  ctx.stroke();
  ctx.restore();
  fillRound(ctx, 245, 609, 16, 3, 2, '#c7a85f');
  for (let i = 0; i < 4; i++) drawSpark(ctx, 235 + (i % 2) * 8, 593 + Math.floor(i / 2) * 7, 2.5, 'rgba(255,227,156,.7)', 0.6);
}

function drawFernAndSconce(ctx, odd) {
  // Sconce on the right wall.
  fillRound(ctx, 953, 352, 14, 76, 5, '#8c6736');
  ctx.beginPath();
  ctx.moveTo(960, 378);
  ctx.quadraticCurveTo(925, 357, 917, 386);
  ctx.strokeStyle = '#8c6736';
  ctx.lineWidth = 3;
  ctx.stroke();
  drawCandle(ctx, 917, 353, 0.52, true, 3);
  // Big fern in a brass pot.
  ctx.save();
  ctx.globalAlpha = 0.28;
  ellipse(ctx, 650, 650, 66, 13, '#040a0d');
  ctx.restore();
  drawFern(ctx, 648, 590, 0.94, '#7a9c68', 8, odd ? 4 : -1);
  // Pot.
  ctx.beginPath();
  ctx.moveTo(607, 568);
  ctx.lineTo(691, 568);
  ctx.lineTo(675, 646);
  ctx.quadraticCurveTo(650, 657, 623, 646);
  ctx.closePath();
  ctx.fillStyle = linear(ctx, 607, 568, 691, 646, [[0, '#b0834b'], [0.5, '#76532f'], [1, '#bc9357']]);
  ctx.fill();
  fillRound(ctx, 602, 561, 94, 14, 6, '#bb8e50');
  ctx.fillStyle = 'rgba(42,29,17,.3)';
  for (let i = 0; i < 4; i++) ctx.fillRect(620 + i * 16, 580, 2, 56);
}

function drawClockAndDetails(ctx, odd) {
  drawClock(ctx, 858, 230, 64, odd ? 1 : 0);
  // A tiny hanging key and framed botanical card give the wall life.
  ctx.strokeStyle = '#9b7746';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(950, 94);
  ctx.quadraticCurveTo(957, 119, 947, 129);
  ctx.stroke();
  ring(ctx, 947, 135, 8, '#b68a4b', 2);
  ctx.beginPath();
  ctx.moveTo(944, 142);
  ctx.lineTo(950, 153);
  ctx.stroke();
  drawFrame(ctx, 588, 145, 64, 82, '#9b7444', '#24393a');
  ctx.strokeStyle = 'rgba(206,217,169,.55)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(620, 204);
  ctx.quadraticCurveTo(612, 178, 620, 160);
  ctx.quadraticCurveTo(629, 181, 620, 204);
  ctx.moveTo(620, 188);
  ctx.quadraticCurveTo(609, 182, 606, 174);
  ctx.moveTo(620, 193);
  ctx.quadraticCurveTo(631, 185, 635, 177);
  ctx.stroke();
  drawSpark(ctx, 620, 156, 4, 'rgba(238,210,145,.65)', 0.7);
}

function drawForeground(ctx, odd, time) {
  drawDust(ctx, 1000, 800, time, 'rgba(255,228,172,.52)', 36);
  // Soft candlelight wash from the chandelier.
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const wash = radial(ctx, 500, 138, 20, 390, [[0, 'rgba(255,201,112,.17)'], [0.55, 'rgba(235,166,83,.045)'], [1, 'rgba(235,166,83,0)']]);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, 1000, 670);
  ctx.restore();
  // A few foreground frame shadows.
  drawVignette(ctx, 1000, 800, 0.62);
}

export const lanternLibrary = {
  id: 'lantern-library',
  number: '01',
  title: 'The Lantern Library',
  objective: 'Find ten differences before the candles burn out.',
  duration: 225,
  hints: 3,
  differences,
  draw(ctx, width, height, odd, time) {
    ctx.save();
    ctx.scale(width / 1000, height / 800);
    drawLibraryWall(ctx);
    drawLibraryWindow(ctx, odd, time);
    drawBookshelf(ctx, odd);
    drawPortrait(ctx, odd);
    drawClockAndDetails(ctx, odd);
    drawChandelier(ctx, 500, 83, 0.95, 3, time, odd ? 1 : -1);
    drawWoodFloor(ctx, 0, 600, 1000, 200, ['#3a3228', '#1b1a19'], 'rgba(211,171,100,.075)');
    // Baseboard and a puddle of candlelight on the boards.
    ctx.fillStyle = '#5f4830';
    ctx.fillRect(0, 592, 1000, 12);
    ctx.fillStyle = 'rgba(220,178,102,.14)';
    ctx.fillRect(0, 603, 1000, 2);
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = radial(ctx, 500, 650, 90, 360, [[0, 'rgba(255,207,120,.11)'], [1, 'rgba(255,207,120,0)']]);
    ctx.fillRect(0, 560, 1000, 240);
    ctx.restore();
    drawArmchairAndFox(ctx, odd);
    drawTeaTable(ctx, odd);
    drawFernAndSconce(ctx, odd);
    drawBookStack(ctx, 387, 693, 0.83, ['#8e5d44', '#506f66', '#a28750', '#70505e']);
    drawForeground(ctx, odd, time);
    ctx.restore();
  },
};
