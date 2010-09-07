// Path
// =============================================================================

uv.Path = function(properties) {
  // super call
  uv.Actor.call(this, _.extend({
    points: [],
    lineWidth: 1,
    strokeStyle: '#000'
  }, properties));
  
  this.transformedPoints = this.points = [].concat(this.p('points'));
};

uv.Actor.registeredActors.path = uv.Path;

uv.Path.prototype = uv.extend(uv.Actor);

uv.Path.prototype.transform = function(ctx, tView) {
  if (this.p('transformMode') === 'coords') {
    var m = this.tShape().concat(tView).concat(this._tWorld);
    
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.transformedPoints = _.map(this.points, function(p) {
      var tp   = m.transformPoint(p),
          tcp1 = m.transformPoint(uv.Point(p.cp1x, p.cp1y)),
          tcp2 = m.transformPoint(uv.Point(p.cp2x, p.cp2y)),
          result;
      result = {x: tp.x, y: tp.y};
      if (p.cp1x && p.cp1y) {
        result.cp1x = tcp1.x;
        result.cp1y = tcp1.y;        
      }
      if (p.cp2x && p.cp2y) {
        result.cp2x = tcp2.x;
        result.cp2y = tcp2.y;        
      }
      return result;
    });
  } else {
    uv.Actor.prototype.transform.call(this, ctx, tView);
  }
};


uv.Path.prototype.draw = function(ctx, tView) {  
  var points = [].concat(this.transformedPoints),
      v;
  
  if (points.length >= 1) {
    ctx.beginPath();
    v = points.shift();
    ctx.moveTo(v.x, v.y);
    while (v = points.shift()) {
      if (v.cp1x && v.cp2x) {
        ctx.bezierCurveTo(v.cp1x, v.cp1y, v.cp2x,v.cp2y, v.x, v.y);
      } else if (v.cp1x) {
        ctx.quadraticCurveTo(v.cp1x, v.cp1y, v.x, v.y);
      } else {
        ctx.lineTo(v.x, v.y);
      }
    }
    ctx.stroke();
    ctx.closePath();
  }
};
