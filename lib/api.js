
module.exports = function(comments){
  var buf = [];

  comments.forEach(function(comment){
    if (comment.private) return;
    if (comment.ignore) return;
    var ctx = comment.ctx;
    var desc = comment.description;
    if (!ctx) return;
    if (!ctx.string.indexOf('module.exports')) return;
    buf.push('## ' + ctx.string.replace('.prototype.', '#'));
    buf.push('');
    buf.push(desc.full.trim().replace(/^/gm, '  '));
    buf.push('');
  });

  return buf.join('\n');
};