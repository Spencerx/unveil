uv.behaviors = {};

uv.behaviors.adjust = function(display, m) {
  var b = display.bounds();
  
  // clamp to scene boundaries
  if (display.bounded) {
    m.a = m.d = Math.max(1, m.a);
    m.tx = Math.max(b.x, Math.min(0, m.tx));
    m.ty = Math.max(b.y, Math.min(0, m.ty));
  }
  return m;
};

uv.behaviors.Zoom = function(display) {
  display.$canvas.bind('mousewheel', function(event, delta) {
    var m = display.tView.scale(
          1+0.005 * delta,
          1+0.005 * delta,
          uv.Point(display.scene.mouseX, display.scene.mouseY)
        );

    display.tView = (delta < 0) ? uv.behaviors.adjust(display, m) : m;
    display.callbacks.viewChange.call(display);
  });
};

uv.behaviors.Pan = function(display) {
  var pos, // initial mouse position
      view, // cached view matrix
      panning = false;
  
  function mouseDown() {
    p = uv.Point(display.mouseX, display.mouseY);
    view = display.tView;
    panning = true;
  }
  
  function mouseMove() {
    if (!panning) return;
    var x = (display.mouseX - p.x),
        y = (display.mouseY - p.y),
        m = uv.Matrix.translation(x, y).concat(view);
    display.tView = uv.behaviors.adjust(display, m);
  }
  
  function release() {
    panning = false;
  }
  
  display.$canvas.bind('mousedown', mouseDown);
  display.$canvas.bind('mousemove', mouseMove);
  display.$canvas.bind('mouseup', release);
  display.$canvas.bind('mouseout', release);
};