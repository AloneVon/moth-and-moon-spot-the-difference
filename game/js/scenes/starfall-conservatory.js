// Case 03 — a glass conservatory under a sky that is always falling stars.
// The final room raises the count to fourteen and turns the clock a little faster.
import {
  TAU, disc, ring, ellipse, fillRound, strokeRound, linear, radial,
  drawStar, drawSpark, drawGlow, drawMoon, drawLeaf, drawFern, drawFlower,
  drawMoth, drawMushroom, drawJar, drawDust, drawVignette,
} from '../art/primitives.js';

const differences = [
  { id: 'moon-phase', name: 'The moon has turned its face', hint: 'The oldest lantern in the sky has changed.', x: 238, y: 185, r: 58 },
  { id: 'missing-star', name: 'A constellation lost a star', hint: 'One point in the upper constellation has gone dark.', x: 710, y: 140, r: 30 },
  { id: 'lens-glint', name: 'The telescope lens lost its spark', hint: 'The brass eye at the left edge sees something new.', x: 289, y: 475, r: 35 },
  { id: 'missing-jar', name: 'One hanging jar is missing', hint: 'The firefly lanterns are not keeping their usual count.', x: 861, y: 253, r: 36 },
  { id: 'flower-petal', name: 'The starflower changed colour', hint: 'A very large blossom is blushing a different shade.', x: 136, y: 583, r: 47 },
  { id: 'pond-star', name: 'The pond swallowed a reflection', hint: 'The water remembers one less star than the sky.', x: 530, y: 690, r: 31 },
  { id: 'moth-spots', name: 'The moth has fewer wing spots', hint: 'The great moth in the middle is wearing fewer jewels.', x: 500, y: 311, r: 42 },
  { id: 'firefly-count', name: 'The jar holds fewer fireflies', hint: 'Count the tiny lights in the left-hand glass jar.', x: 778, y: 196, r: 28 },
  { id: 'watering-spout', name: 'The watering can lost its spout', hint: 'Something copper by the mushroom bed has changed shape.', x: 792, y: 530, r: 34 },
  { id: 'stone-crack', name: 'A path stone has cracked', hint: 'Look down near the centre of the water garden.', x: 420, y: 729, r: 33 },
  { id: 'fern-frond', name: 'The fern is missing a frond', hint: 'The little fern by the mushrooms is one green less.', x: 682, y: 638, r: 32 },
  { id: 'glass-crack', name: 'The glass has cracked', hint: 'A hairline blemish has appeared in a pane above you.', x: 390, y: 290, r: 31 },
  { id: 'mushroom-spots', name: 'The mushroom has fewer spots', hint: 'The glowing toadstool has changed its freckles.', x: 795, y: 655, r: 34 },
  { id: 'vine-flower', name: 'The vine lost its little flower', hint: 'A tiny bloom on the far right has closed its eye.', x: 904, y: 338, r: 29 },
];

function drawNightSky(ctx, odd, time) {
  ctx.fillStyle = linear(ctx, 0, 0, 0, 620, [[0, '#0e1837'], [0.45, '#152b48'], [1, '#24484e']]);
  ctx.fillRect(0, 0, 1000, 620);
  // Nebula washes.
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = radial(ctx, 710, 230, 20, 370, [[0, 'rgba(116,93,154,.18)'], [1, 'rgba(116,93,154,0)']]);
  ctx.fillRect(0, 0, 1000, 620);
  ctx.fillStyle = radial(ctx, 400, 340, 20, 310, [[0, 'rgba(79,146,137,.12)'], [1, 'rgba(79,146,137,0)']]);
  ctx.fillRect(0, 0, 1000, 620);
  ctx.restore();
  // Countless pinprick stars.
  for (let i = 0; i < 95; i++) {
    const x = (i * 173.7) % 1000;
    const y = (i * 97.3) % 545;
    const twinkle = 0.28 + 0.35 * Math.abs(Math.sin(time * 0.0009 + i * 1.7));
    ctx.globalAlpha = twinkle;
    disc(ctx, x, y, 0.7 + (i % 5) * 0.24, '#d8e5d9');
  }
  ctx.globalAlpha = 1;
  // Moon.
  drawGlow(ctx, 238, 185, 180, 'rgba(235,217,160,ALPHA)', 0.22);
  drawMoon(ctx, 238, 185, 82, odd ? 'crescent' : 'full', '#e6ddb4');

  // A named-looking constellation. One star disappears from the odd copy.
  const constellation = [[650, 92], [710, 140], [762, 116], [806, 168], [744, 204]];
  ctx.strokeStyle = 'rgba(174,202,185,.22)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(constellation[0][0], constellation[0][1]);
  for (let i = 1; i < constellation.length; i++) ctx.lineTo(constellation[i][0], constellation[i][1]);
  ctx.stroke();
  for (let i = 0; i < constellation.length; i++) {
    if (odd && i === 1) continue;
    const [sx, sy] = constellation[i];
    drawGlow(ctx, sx, sy, 12, 'rgba(223,239,207,ALPHA)', 0.34);
    drawSpark(ctx, sx, sy, i === 1 ? 6 : 4.4, '#e7efd2', 0.86);
  }

  // The glasshouse frame is drawn over the stars.
  const cx = 500, cy = 592, radius = 552;
  ctx.strokeStyle = 'rgba(105,157,146,.7)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI, TAU);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(208,221,185,.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 14, Math.PI, TAU);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(103,151,142,.55)';
  ctx.lineWidth = 3;
  const ribXs = [97, 196, 304, 410, 500, 590, 696, 804, 903];
  for (const x of ribXs) {
    const top = cy - Math.sqrt(Math.max(0, radius * radius - (x - cx) * (x - cx)));
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x + (x - cx) * 0.06, 594);
    ctx.stroke();
  }
  // Curved cross-rails.
  for (const r of [176, 322, 452]) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI * 1.04, Math.PI * 1.96);
    ctx.stroke();
  }
  // Glass shine.
  ctx.strokeStyle = 'rgba(235,247,220,.09)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(270, 104);
  ctx.quadraticCurveTo(330, 280, 354, 558);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(730, 104);
  ctx.quadraticCurveTo(684, 280, 650, 558);
  ctx.stroke();
  // Hairline crack, present in the original and healed in the odd copy.
  if (!odd) {
    ctx.strokeStyle = 'rgba(226,238,209,.55)';
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.moveTo(380, 261);
    ctx.lineTo(390, 290);
    ctx.lineTo(377, 309);
    ctx.moveTo(390, 290);
    ctx.lineTo(405, 284);
    ctx.moveTo(390, 290);
    ctx.lineTo(392, 312);
    ctx.stroke();
    drawSpark(ctx, 390, 290, 3, 'rgba(238,246,218,.58)', 0.6);
  }
}

function drawConservatoryGround(ctx) {
  // Stone terrace.
  ctx.fillStyle = linear(ctx, 0, 594, 0, 800, [[0, '#30443f'], [0.3, '#253b3a'], [1, '#12272d']]);
  ctx.fillRect(0, 594, 1000, 206);
  ctx.fillStyle = 'rgba(202,214,180,.16)';
  ctx.fillRect(0, 590, 1000, 5);
  // Large flagstones.
  ctx.strokeStyle = 'rgba(187,198,169,.12)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 3; i++) {
    const y = 616 + i * 60;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(280, y - 12, 520, y + 4);
    ctx.quadraticCurveTo(760, y + 16, 1000, y - 2);
    ctx.stroke();
  }
  for (let i = 0; i < 8; i++) {
    const x = 30 + i * 138;
    ctx.beginPath();
    ctx.moveTo(x, 604);
    ctx.quadraticCurveTo(x + (i % 2 ? 21 : -17), 700, x + (i % 2 ? 8 : 20), 800);
    ctx.stroke();
  }
  // Moss along the edges.
  ctx.globalAlpha = 0.28;
  for (let i = 0; i < 40; i++) {
    const x = (i * 149) % 1000;
    const y = 620 + (i * 83) % 175;
    ellipse(ctx, x, y, 8 + (i % 4) * 4, 2.5, '#71815a');
  }
  ctx.globalAlpha = 1;
}

function drawPondAndPath(ctx, odd, time) {
  // A star mirror set into the stone.
  ctx.save();
  ellipse(ctx, 518, 714, 218, 76, '#071b28');
  ellipse(ctx, 518, 708, 204, 63, linear(ctx, 340, 660, 680, 760, [[0, '#173d48'], [0.55, '#10313f'], [1, '#0c2736']]));
  ellipse(ctx, 518, 704, 194, 53, linear(ctx, 340, 655, 680, 750, [[0, 'rgba(72,133,129,.24)'], [1, 'rgba(35,74,88,.16)']]));
  ctx.strokeStyle = 'rgba(164,197,177,.32)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(518, 709, 212, 68, 0, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(188,213,186,.11)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.ellipse(518 + (i - 2) * 35, 707, 47, 7 + i * 3, 0.04, 0, TAU);
    ctx.stroke();
  }
  // Reflected pinpricks. One reflection is reserved for the original.
  const reflections = [[449, 694, 1.6], [518, 720, 1.3], [581, 684, 1.9], [636, 714, 1.2], [393, 724, 1.1]];
  if (!odd) reflections.push([530, 690, 2.7]);
  for (const [x, y, r] of reflections) {
    ctx.globalAlpha = 0.35 + Math.sin(time * 0.002 + x) * 0.14;
    drawSpark(ctx, x, y, r * 3.2, '#e6d9a4', 0.7);
  }
  ctx.globalAlpha = 1;
  // Lily pads.
  for (const [x, y, s] of [[590, 710, 20], [638, 731, 13], [392, 699, 15]]) {
    ellipse(ctx, x, y, s, s * 0.42, '#3f6656');
    ctx.strokeStyle = 'rgba(202,222,178,.27)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(x, y, s * 0.75, s * 0.3, 0, 0.2, Math.PI * 1.3);
    ctx.stroke();
  }
  ctx.restore();

  // Three broad stepping stones lead to the pond. The middle one has a crack.
  const stones = [[360, 752, 50, 18], [452, 744, 45, 15], [656, 750, 46, 16]];
  for (const [x, y, rx, ry] of stones) {
    ellipse(ctx, x, y, rx, ry, 'rgba(87,101,88,.8)');
    ctx.strokeStyle = 'rgba(184,198,166,.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // Crack belonging to the hitbox at (420, 729).
  ctx.save();
  ctx.strokeStyle = 'rgba(203,214,184,.45)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(398, 720);
  ctx.lineTo(420, 729);
  ctx.lineTo(411, 744);
  ctx.moveTo(420, 729);
  ctx.lineTo(436, 726);
  ctx.stroke();
  ctx.restore();
}

function drawTelescope(ctx, odd) {
  // Tripod.
  ctx.strokeStyle = '#7d5e3e';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(172, 596);
  ctx.lineTo(113, 694);
  ctx.moveTo(172, 596);
  ctx.lineTo(224, 697);
  ctx.moveTo(172, 596);
  ctx.lineTo(186, 686);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(221,189,128,.22)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(135, 660);
  ctx.lineTo(208, 675);
  ctx.stroke();
  disc(ctx, 172, 594, 9, '#b2874c');
  // Rotating barrel assembly.
  ctx.save();
  ctx.translate(172, 574);
  ctx.rotate(-0.7);
  fillRound(ctx, -40, -24, 203, 48, 22, '#344f50');
  fillRound(ctx, 90, -18, 50, 36, 16, '#4e6c67');
  fillRound(ctx, -42, -27, 24, 54, 9, '#a8824b');
  fillRound(ctx, 118, -24, 12, 48, 4, '#b08b50');
  ctx.fillStyle = linear(ctx, -30, -22, 155, 18, [[0, 'rgba(200,228,206,.21)'], [0.5, 'rgba(72,112,108,.12)'], [1, 'rgba(20,41,46,.22)']]);
  ctx.fillRect(-33, -19, 188, 13);
  ctx.beginPath();
  ctx.arc(-40, 0, 20, 0, TAU);
  ctx.fillStyle = '#1c373c';
  ctx.fill();
  ring(ctx, -40, 0, 25, '#b68b4f', 4);
  ring(ctx, -40, 0, 17, 'rgba(213,189,143,.25)', 1);
  // Lens at the far end.
  disc(ctx, 153, 0, 18, '#16373b');
  ring(ctx, 153, 0, 18, '#a77d46', 3);
  ctx.globalAlpha = 0.82;
  disc(ctx, 153, 0, 12, odd ? '#1d4750' : '#e3c77d');
  if (!odd) {
    drawSpark(ctx, 153, 0, 8, '#fff2bd', 0.9);
    drawGlow(ctx, 153, 0, 35, 'rgba(255,220,130,ALPHA)', 0.3);
  }
  ctx.globalAlpha = 1;
  // Small engraved plate.
  ctx.fillStyle = 'rgba(247,220,160,.5)';
  ctx.font = 'italic 7px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('FOR THE FARTHEST THINGS', 50, 4);
  ctx.restore();
  // Hand wheel and a small star chart.
  ring(ctx, 204, 619, 16, '#9a7547', 3);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    ctx.beginPath();
    ctx.moveTo(204, 619);
    ctx.lineTo(204 + Math.cos(a) * 14, 619 + Math.sin(a) * 14);
    ctx.strokeStyle = '#9a7547';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawHangingJars(ctx, odd, time) {
  // Brass chains disappear into the dark above.
  for (const [x, y] of [[778, 220], [860, 256]]) {
    ctx.strokeStyle = 'rgba(191,164,103,.46)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, 54);
    ctx.lineTo(x, y - 62);
    ctx.stroke();
    for (let yy = 60; yy < y - 60; yy += 12) {
      ring(ctx, x, yy, 4, 'rgba(191,164,103,.32)', 1);
    }
  }
  drawJar(ctx, 778, 220, 0.82, 'rgba(202,232,203,.18)', odd ? 2 : 4, time);
  if (!odd) drawJar(ctx, 860, 256, 0.72, 'rgba(202,232,203,.16)', 3, time + 300);
  else {
    // A bare hook remains where the second jar hung.
    ring(ctx, 860, 232, 7, 'rgba(191,164,103,.58)', 1.5);
    ctx.strokeStyle = 'rgba(191,164,103,.46)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(860, 239);
    ctx.lineTo(860, 248);
    ctx.stroke();
  }
  // Fireflies that escaped the jars wander the room.
  for (let i = 0; i < 13; i++) {
    const x = 480 + (i * 47) % 450;
    const y = 140 + (i * 31) % 360 + Math.sin(time * 0.001 + i) * 7;
    drawGlow(ctx, x, y, 8, 'rgba(255,226,139,ALPHA)', 0.24);
    disc(ctx, x, y, 1.3, 'rgba(255,235,164,.85)');
  }
}

function drawGiantFlower(ctx, odd) {
  // Stem and giant leaves.
  ctx.strokeStyle = '#4e745a';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(140, 716);
  ctx.quadraticCurveTo(100, 667, 137, 620);
  ctx.stroke();
  drawLeaf(ctx, 130, 686, 81, 28, 0.7, '#3d6650', 'rgba(203,219,166,.18)');
  drawLeaf(ctx, 149, 678, 70, 24, -2.48, '#466f56', 'rgba(203,219,166,.18)');
  drawFlower(ctx, 137, 581, 70, odd ? '#e1a58e' : '#ad9bd0', '#e9cf7a', 0.2, 9);
  drawGlow(ctx, 137, 581, 95, 'rgba(222,195,235,ALPHA)', 0.18);
  // Smaller companions.
  ctx.strokeStyle = '#4d7259';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(48, 701);
  ctx.quadraticCurveTo(70, 661, 64, 636);
  ctx.stroke();
  drawFlower(ctx, 64, 624, 31, '#8ba7a0', '#e0c57a', -0.2, 6);
  ctx.beginPath();
  ctx.moveTo(239, 708);
  ctx.quadraticCurveTo(218, 675, 232, 650);
  ctx.stroke();
  drawFlower(ctx, 232, 643, 23, '#c39fbd', '#f0d48f', 0.3, 5);
}

function drawWateringCan(ctx, odd) {
  // Copper watering can by the mushroom bed.
  ctx.save();
  ctx.translate(850, 546);
  // Main body.
  ctx.beginPath();
  ctx.moveTo(-34, 7);
  ctx.quadraticCurveTo(-42, 43, 0, 50);
  ctx.quadraticCurveTo(42, 43, 34, 7);
  ctx.closePath();
  ctx.fillStyle = linear(ctx, -35, 8, 38, 50, [[0, '#d69b5a'], [0.55, '#a2643f'], [1, '#744835']]);
  ctx.fill();
  fillRound(ctx, -37, -2, 74, 13, 5, '#c78d54');
  ctx.strokeStyle = 'rgba(255,226,168,.26)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, 17, 22, Math.PI * 0.2, Math.PI * 0.8);
  ctx.stroke();
  // Handle.
  ctx.beginPath();
  ctx.arc(-6, -2, 26, Math.PI * 1.02, Math.PI * 1.83);
  ctx.strokeStyle = '#8c5b3e';
  ctx.lineWidth = 7;
  ctx.stroke();
  // Spout: the original has a full spout and sprinkler rose; the odd copy is broken off.
  ctx.beginPath();
  ctx.moveTo(-32, 17);
  if (!odd) {
    ctx.quadraticCurveTo(-64, 7, -76, -16);
    ctx.strokeStyle = '#a96d45';
    ctx.lineWidth = 10;
    ctx.stroke();
    ellipse(ctx, -79, -19, 12, 8, '#b67a4d', -0.4);
    ctx.fillStyle = 'rgba(68,42,28,.65)';
    for (let i = 0; i < 4; i++) disc(ctx, -83 + i * 3, -21 + i * 2, 1, 'rgba(68,42,28,.65)');
  } else {
    ctx.quadraticCurveTo(-52, 13, -55, 3);
    ctx.strokeStyle = '#a96d45';
    ctx.lineWidth = 10;
    ctx.stroke();
  }
  ctx.restore();
}

function drawMushroomBed(ctx, odd) {
  // Mossy mound.
  ctx.beginPath();
  ctx.ellipse(770, 704, 128, 47, -0.02, 0, TAU);
  ctx.fillStyle = '#38513f';
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(774, 698, 112, 37, 0.03, 0, TAU);
  ctx.fillStyle = '#4f6750';
  ctx.fill();
  drawMushroom(ctx, 736, 700, 1.5, '#b776a1', '#ddcba6', 4);
  drawMushroom(ctx, 795, 701, 1.08, odd ? '#b776a1' : '#b776a1', '#ddcba6', odd ? 2 : 5);
  drawMushroom(ctx, 847, 699, 0.72, '#d49a8d', '#e3d3b5', 3);
  // Sparse grass blades.
  for (let i = 0; i < 16; i++) {
    const x = 660 + i * 15;
    const h = 9 + (i % 4) * 6;
    ctx.strokeStyle = i % 3 === 0 ? '#759063' : '#5f7c59';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, 708);
    ctx.quadraticCurveTo(x + 3, 708 - h * 0.6, x - 2 + (i % 2) * 7, 708 - h);
    ctx.stroke();
  }
}

function drawFernAndVine(ctx, odd, time) {
  // Fern near the mushrooms. One frond is missing in the odd copy.
  ctx.save();
  ctx.globalAlpha = 0.24;
  ellipse(ctx, 684, 699, 54, 11, '#061216');
  ctx.restore();
  drawFern(ctx, 683, 677, 0.72, '#779b76', 7, odd ? 3 : -1);
  fillRound(ctx, 651, 669, 67, 10, 4, '#a17748');
  ctx.beginPath();
  ctx.moveTo(657, 678);
  ctx.lineTo(713, 678);
  ctx.lineTo(704, 707);
  ctx.quadraticCurveTo(684, 714, 665, 707);
  ctx.closePath();
  ctx.fillStyle = '#7f5e3c';
  ctx.fill();

  // A climbing vine on the right ironwork.
  ctx.strokeStyle = '#577b63';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(955, 590);
  ctx.bezierCurveTo(935, 510, 956, 417, 904, 338);
  ctx.stroke();
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    const x = 955 - 20 * Math.sin(t * Math.PI * 2.1) - t * 42;
    const y = 580 - t * 245;
    drawLeaf(ctx, x, y, 22 + (i % 3) * 4, 7, (i % 2 ? -1 : 1) * (0.55 + t * 0.3), i % 3 === 0 ? '#7c9876' : '#617f68');
    if (i % 4 === 1) drawGlow(ctx, x, y, 14, 'rgba(234,194,124,ALPHA)', 0.12);
  }
  // The vine's tiny moonflower, absent from the odd copy.
  const fx = 904, fy = 338;
  if (!odd) {
    drawGlow(ctx, fx, fy, 30, 'rgba(255,219,135,ALPHA)', 0.32);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * TAU;
      ellipse(ctx, fx + Math.cos(a) * 6, fy + Math.sin(a) * 6, 5, 2.5, '#efe3b4', a);
    }
    disc(ctx, fx, fy, 3, '#e6be63');
  }
  // A few curling tendrils.
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = 'rgba(124,161,128,.44)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(916 + i * 8, 410 + i * 31, 7, 0, Math.PI * 1.6);
    ctx.stroke();
  }
}

function drawGreatMoth(ctx, odd, time) {
  // A lamp-lit moth hangs in the middle of the conservatory.
  drawGlow(ctx, 500, 311, 125, 'rgba(248,216,145,ALPHA)', 0.17);
  drawMoth(ctx, 500, 311, 1.8, '#d9c58c', '#779a8d', odd ? 2 : 5, false);
  // A few luminous scales around it.
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU + time * 0.0002;
    drawSpark(ctx, 500 + Math.cos(a) * (66 + (i % 3) * 9), 311 + Math.sin(a) * (52 + (i % 4) * 7), 1.4 + (i % 2), 'rgba(238,221,166,.7)', 0.5);
  }
}

function drawConservatoryAtmosphere(ctx, odd, time) {
  // Reflected star specks drifting through the glasshouse.
  for (let i = 0; i < 26; i++) {
    const x = (i * 137.9 + Math.sin(time * 0.00022 + i) * 20) % 1000;
    const y = 80 + ((i * 79.7 + Math.cos(time * 0.00017 + i) * 15) % 530);
    ctx.globalAlpha = 0.1 + (i % 4) * 0.055;
    drawSpark(ctx, x, y, 1.5 + (i % 3) * 0.8, '#e9f0cb', 0.7);
  }
  ctx.globalAlpha = 1;
  drawDust(ctx, 1000, 800, time, 'rgba(255,234,170,.56)', 34);
  // Deep blue shadows and a warm moth glow.
  drawVignette(ctx, 1000, 800, 0.7);
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = radial(ctx, 500, 330, 30, 300, [[0, 'rgba(255,220,141,.08)'], [1, 'rgba(255,220,141,0)']]);
  ctx.fillRect(0, 0, 1000, 800);
  ctx.restore();
}

export const starfallConservatory = {
  id: 'starfall-conservatory',
  number: '03',
  title: 'The Starfall Conservatory',
  objective: 'Fourteen small impossibilities wait among the night flowers.',
  duration: 235,
  hints: 1,
  differences,
  draw(ctx, width, height, odd, time) {
    ctx.save();
    ctx.scale(width / 1000, height / 800);
    drawNightSky(ctx, odd, time);
    drawConservatoryGround(ctx);
    drawPondAndPath(ctx, odd, time);
    drawTelescope(ctx, odd);
    drawHangingJars(ctx, odd, time);
    drawGiantFlower(ctx, odd);
    drawWateringCan(ctx, odd);
    drawMushroomBed(ctx, odd);
    drawFernAndVine(ctx, odd, time);
    drawGreatMoth(ctx, odd, time);
    drawConservatoryAtmosphere(ctx, odd, time);
    ctx.restore();
  },
};
