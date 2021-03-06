(function() {
  var pty;

  pty = require('pty.js');

  module.exports = function(ptyCwd, sh, args) {
    var callback, cols, path, ptyProcess, rows, shell;
    callback = this.async();
    if (sh) {
      shell = sh;
    } else {
      if (process.platform === 'win32') {
        path = require('path');
        shell = path.resolve(process.env.SystemRoot, 'WindowsPowerShell', 'v1.0', 'powershell.exe');
      } else {
        shell = process.env.SHELL;
      }
    }
    cols = 80;
    rows = 30;
    ptyProcess = pty.fork(shell, args, {
      name: 'xterm-256color',
      cols: cols,
      rows: rows,
      cwd: ptyCwd,
      env: process.env
    });
    ptyProcess.on('data', function(data) {
      return emit('term2:data', data);
    });
    ptyProcess.on('exit', function() {
      emit('term2:exit');
      return callback();
    });
    return process.on('message', function(_arg) {
      var cols, event, rows, text, _ref;
      _ref = _arg != null ? _arg : {}, event = _ref.event, cols = _ref.cols, rows = _ref.rows, text = _ref.text;
      switch (event) {
        case 'resize':
          return ptyProcess.resize(cols, rows);
        case 'input':
          return ptyProcess.write(text);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvdGVybTIvbGliL3B0eS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFFQTtBQUFBLE1BQUEsR0FBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixDQUFOLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLE1BQUQsRUFBUyxFQUFULEVBQWEsSUFBYixHQUFBO0FBQ2YsUUFBQSw2Q0FBQTtBQUFBLElBQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxLQUFELENBQUEsQ0FBWCxDQUFBO0FBQ0EsSUFBQSxJQUFHLEVBQUg7QUFDSSxNQUFBLEtBQUEsR0FBUSxFQUFSLENBREo7S0FBQSxNQUFBO0FBR0ksTUFBQSxJQUFHLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BQXZCO0FBQ0UsUUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBO0FBQUEsUUFDQSxLQUFBLEdBQVEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQXpCLEVBQXFDLG1CQUFyQyxFQUEwRCxNQUExRCxFQUFrRSxnQkFBbEUsQ0FEUixDQURGO09BQUEsTUFBQTtBQUlFLFFBQUEsS0FBQSxHQUFRLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBcEIsQ0FKRjtPQUhKO0tBREE7QUFBQSxJQVVBLElBQUEsR0FBTyxFQVZQLENBQUE7QUFBQSxJQVdBLElBQUEsR0FBTyxFQVhQLENBQUE7QUFBQSxJQWFBLFVBQUEsR0FBYSxHQUFHLENBQUMsSUFBSixDQUFTLEtBQVQsRUFBZ0IsSUFBaEIsRUFDWDtBQUFBLE1BQUEsSUFBQSxFQUFNLGdCQUFOO0FBQUEsTUFDQSxJQUFBLEVBQU0sSUFETjtBQUFBLE1BRUEsSUFBQSxFQUFNLElBRk47QUFBQSxNQUdBLEdBQUEsRUFBSyxNQUhMO0FBQUEsTUFJQSxHQUFBLEVBQUssT0FBTyxDQUFDLEdBSmI7S0FEVyxDQWJiLENBQUE7QUFBQSxJQW9CQSxVQUFVLENBQUMsRUFBWCxDQUFjLE1BQWQsRUFBc0IsU0FBQyxJQUFELEdBQUE7YUFBVSxJQUFBLENBQUssWUFBTCxFQUFtQixJQUFuQixFQUFWO0lBQUEsQ0FBdEIsQ0FwQkEsQ0FBQTtBQUFBLElBcUJBLFVBQVUsQ0FBQyxFQUFYLENBQWMsTUFBZCxFQUFzQixTQUFBLEdBQUE7QUFDcEIsTUFBQSxJQUFBLENBQUssWUFBTCxDQUFBLENBQUE7YUFDQSxRQUFBLENBQUEsRUFGb0I7SUFBQSxDQUF0QixDQXJCQSxDQUFBO1dBeUJBLE9BQU8sQ0FBQyxFQUFSLENBQVcsU0FBWCxFQUFzQixTQUFDLElBQUQsR0FBQTtBQUNwQixVQUFBLDZCQUFBO0FBQUEsNEJBRHFCLE9BQTBCLElBQXpCLGFBQUEsT0FBTyxZQUFBLE1BQU0sWUFBQSxNQUFNLFlBQUEsSUFDekMsQ0FBQTtBQUFBLGNBQU8sS0FBUDtBQUFBLGFBQ08sUUFEUDtpQkFDcUIsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsSUFBbEIsRUFBd0IsSUFBeEIsRUFEckI7QUFBQSxhQUVPLE9BRlA7aUJBRW9CLFVBQVUsQ0FBQyxLQUFYLENBQWlCLElBQWpCLEVBRnBCO0FBQUEsT0FEb0I7SUFBQSxDQUF0QixFQTFCZTtFQUFBLENBRmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/anas/.atom/packages/term2/lib/pty.coffee
