// Mouse, touch and keyboard input for the two-picture table.
export function scenePointFromEvent(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / Math.max(1, rect.width)) * 1000,
    y: ((event.clientY - rect.top) / Math.max(1, rect.height)) * 800,
  };
}

export function bindCanvasInput(canvas, { onInspect, onPointerMoved }) {
  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    event.preventDefault();
    onPointerMoved();
    onInspect(scenePointFromEvent(event, canvas));
  });
  canvas.addEventListener('pointermove', (event) => {
    onPointerMoved();
    const point = scenePointFromEvent(event, canvas);
    canvas.style.cursor = 'crosshair';
    canvas.dataset.pointerX = String(point.x);
    canvas.dataset.pointerY = String(point.y);
  });
}

export function bindKeyboard({ onArrow, onInspect, onHint, onPause, onMute, onRestart }) {
  window.addEventListener('keydown', (event) => {
    const target = event.target;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
    const key = event.key.toLowerCase();
    const arrows = {
      arrowup: [0, -28], w: [0, -28],
      arrowdown: [0, 28], s: [0, 28],
      arrowleft: [-28, 0], a: [-28, 0],
      arrowright: [28, 0], d: [28, 0],
    };
    if (arrows[key]) {
      event.preventDefault();
      onArrow(arrows[key][0], arrows[key][1]);
      return;
    }
    if (key === 'enter' || key === ' ') {
      event.preventDefault();
      onInspect();
    } else if (key === 'h') {
      event.preventDefault();
      onHint();
    } else if (key === 'p' || key === 'escape') {
      event.preventDefault();
      onPause();
    } else if (key === 'm') {
      event.preventDefault();
      onMute();
    } else if (key === 'r') {
      onRestart();
    }
  });
}
