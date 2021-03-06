(function() {
  var ListView, git, gitFetch;

  git = require('../git');

  ListView = require('../views/remote-list-view');

  gitFetch = function(repo) {
    return git.cmd({
      args: ['remote'],
      cwd: repo.getWorkingDirectory(),
      stdout: function(data) {
        return new ListView(repo, data.toString(), {
          mode: 'fetch'
        });
      }
    });
  };

  module.exports = gitFetch;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9naXQtZmV0Y2guY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVCQUFBOztBQUFBLEVBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSLENBQU4sQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsMkJBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLFNBQUMsSUFBRCxHQUFBO1dBQ1QsR0FBRyxDQUFDLEdBQUosQ0FDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLENBQUMsUUFBRCxDQUFOO0FBQUEsTUFDQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FETDtBQUFBLE1BRUEsTUFBQSxFQUFRLFNBQUMsSUFBRCxHQUFBO2VBQWMsSUFBQSxRQUFBLENBQVMsSUFBVCxFQUFlLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZixFQUFnQztBQUFBLFVBQUEsSUFBQSxFQUFNLE9BQU47U0FBaEMsRUFBZDtNQUFBLENBRlI7S0FERixFQURTO0VBQUEsQ0FIWCxDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFUakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/git-plus/lib/models/git-fetch.coffee
