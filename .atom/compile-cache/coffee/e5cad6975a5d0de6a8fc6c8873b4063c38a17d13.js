(function() {
  var GitCommit, Path, commentchar_config, commitFilePath, commitPane, commitTemplate, currentPane, fs, git, pathToRepoFile, repo, setupMocks, status, templateFile, textEditor, workspace, _ref;

  fs = require('fs-plus');

  Path = require('flavored-path');

  _ref = require('../fixtures'), repo = _ref.repo, workspace = _ref.workspace, pathToRepoFile = _ref.pathToRepoFile, currentPane = _ref.currentPane, textEditor = _ref.textEditor, commitPane = _ref.commitPane;

  git = require('../../lib/git');

  GitCommit = require('../../lib/models/git-commit');

  commitFilePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');

  status = {
    replace: function() {
      return status;
    },
    trim: function() {
      return status;
    }
  };

  commentchar_config = '';

  templateFile = '';

  commitTemplate = 'foobar';

  setupMocks = function() {
    atom.config.set('git-plus.openInPane', false);
    spyOn(currentPane, 'activate');
    spyOn(commitPane, 'destroy').andCallThrough();
    spyOn(commitPane, 'splitRight');
    spyOn(atom.workspace, 'getActivePane').andReturn(currentPane);
    spyOn(atom.workspace, 'open').andReturn(Promise.resolve(textEditor));
    spyOn(atom.workspace, 'getPanes').andReturn([currentPane, commitPane]);
    spyOn(atom.workspace, 'paneForURI').andReturn(commitPane);
    spyOn(status, 'replace').andCallFake(function() {
      return status;
    });
    spyOn(status, 'trim').andCallThrough();
    spyOn(fs, 'readFileSync').andCallFake(function() {
      if (fs.readFileSync.mostRecentCall.args[0] === 'template') {
        return commitTemplate;
      } else {
        return '';
      }
    });
    spyOn(fs, 'writeFileSync');
    spyOn(fs, 'writeFile');
    spyOn(fs, 'unlinkSync');
    spyOn(git, 'refresh');
    spyOn(git, 'getConfig').andCallFake(function() {
      var arg;
      arg = git.getConfig.mostRecentCall.args[0];
      if (arg === 'commit.template') {
        return Promise.resolve(templateFile);
      } else if (arg === 'core.commentchar') {
        return Promise.resolve(commentchar_config);
      }
    });
    spyOn(git, 'cmd').andCallFake(function() {
      var args;
      args = git.cmd.mostRecentCall.args[0];
      if (args[0] === 'status') {
        return Promise.resolve(status);
      } else if (args[0] === 'commit') {
        return Promise.resolve('commit success');
      }
    });
    spyOn(git, 'stagedFiles').andCallFake(function() {
      var args;
      args = git.stagedFiles.mostRecentCall.args;
      if (args[0].getWorkingDirectory() === repo.getWorkingDirectory()) {
        return Promise.resolve([pathToRepoFile]);
      }
    });
    return spyOn(git, 'add').andCallFake(function() {
      var args;
      args = git.add.mostRecentCall.args;
      if (args[0].getWorkingDirectory() === repo.getWorkingDirectory() && args[1].update) {
        return Promise.resolve(true);
      }
    });
  };

  describe("GitCommit", function() {
    describe("a regular commit", function() {
      beforeEach(function() {
        atom.config.set("git-plus.openInPane", false);
        setupMocks();
        return waitsForPromise(function() {
          return GitCommit(repo);
        });
      });
      it("gets the current pane", function() {
        return expect(atom.workspace.getActivePane).toHaveBeenCalled();
      });
      it("gets the commentchar from configs", function() {
        return expect(git.getConfig).toHaveBeenCalledWith('core.commentchar', Path.dirname(commitFilePath));
      });
      it("gets staged files", function() {
        return expect(git.cmd).toHaveBeenCalledWith(['status'], {
          cwd: repo.getWorkingDirectory()
        });
      });
      it("removes lines with '(...)' from status", function() {
        return expect(status.replace).toHaveBeenCalled();
      });
      it("gets the commit template from git configs", function() {
        return expect(git.getConfig).toHaveBeenCalledWith('commit.template', Path.dirname(commitFilePath));
      });
      it("writes to a file", function() {
        var argsTo_fsWriteFile;
        argsTo_fsWriteFile = fs.writeFileSync.mostRecentCall.args;
        return expect(argsTo_fsWriteFile[0]).toEqual(commitFilePath);
      });
      it("shows the file", function() {
        return expect(atom.workspace.open).toHaveBeenCalled();
      });
      it("calls git.cmd with ['commit'...] on textEditor save", function() {
        textEditor.save();
        return expect(git.cmd).toHaveBeenCalledWith(['commit', '--cleanup=strip', "--file=" + commitFilePath], {
          cwd: repo.getWorkingDirectory()
        });
      });
      it("closes the commit pane when commit is successful", function() {
        textEditor.save();
        waitsFor(function() {
          return commitPane.destroy.callCount > 0;
        });
        return runs(function() {
          return expect(commitPane.destroy).toHaveBeenCalled();
        });
      });
      return it("cancels the commit on textEditor destroy", function() {
        textEditor.destroy();
        expect(currentPane.activate).toHaveBeenCalled();
        return expect(fs.unlinkSync).toHaveBeenCalledWith(commitFilePath);
      });
    });
    describe("when core.commentchar config is not set", function() {
      return it("uses '#' in commit file", function() {
        setupMocks();
        return GitCommit(repo).then(function() {
          var argsTo_fsWriteFile;
          argsTo_fsWriteFile = fs.writeFileSync.mostRecentCall.args;
          return expect(argsTo_fsWriteFile[1].trim().charAt(0)).toBe('#');
        });
      });
    });
    describe("when core.commentchar config is set to '$'", function() {
      return it("uses '$' as the commentchar", function() {
        commentchar_config = '$';
        setupMocks();
        return GitCommit(repo).then(function() {
          var argsTo_fsWriteFile;
          argsTo_fsWriteFile = fs.writeFileSync.mostRecentCall.args;
          return expect(argsTo_fsWriteFile[1].trim().charAt(0)).toBe(commentchar_config);
        });
      });
    });
    describe("when commit.template config is not set", function() {
      return it("commit file starts with a blank line", function() {
        setupMocks();
        return waitsForPromise(function() {
          return GitCommit(repo).then(function() {
            var argsTo_fsWriteFile;
            argsTo_fsWriteFile = fs.writeFileSync.mostRecentCall.args;
            return expect(argsTo_fsWriteFile[1].charAt(0)).toEqual("\n");
          });
        });
      });
    });
    describe("when commit.template config is set", function() {
      return it("commit file starts with content of that file", function() {
        templateFile = 'template';
        setupMocks();
        GitCommit(repo);
        waitsFor(function() {
          return fs.writeFileSync.callCount > 0;
        });
        return runs(function() {
          var argsTo_fsWriteFile;
          argsTo_fsWriteFile = fs.writeFileSync.mostRecentCall.args;
          return expect(argsTo_fsWriteFile[1].indexOf(commitTemplate)).toBe(0);
        });
      });
    });
    return describe("when 'stageChanges' option is true", function() {
      return it("calls git.add with update option set to true", function() {
        setupMocks();
        return GitCommit(repo, {
          stageChanges: true
        }).then(function() {
          return expect(git.add).toHaveBeenCalledWith(repo, {
            update: true
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9tb2RlbHMvZ2l0LWNvbW1pdC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwTEFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVIsQ0FEUCxDQUFBOztBQUFBLEVBR0EsT0FPSSxPQUFBLENBQVEsYUFBUixDQVBKLEVBQ0UsWUFBQSxJQURGLEVBRUUsaUJBQUEsU0FGRixFQUdFLHNCQUFBLGNBSEYsRUFJRSxtQkFBQSxXQUpGLEVBS0Usa0JBQUEsVUFMRixFQU1FLGtCQUFBLFVBVEYsQ0FBQTs7QUFBQSxFQVdBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQVhOLENBQUE7O0FBQUEsRUFZQSxTQUFBLEdBQVksT0FBQSxDQUFRLDZCQUFSLENBWlosQ0FBQTs7QUFBQSxFQWNBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTCxDQUFBLENBQVYsRUFBMEIsZ0JBQTFCLENBZGpCLENBQUE7O0FBQUEsRUFlQSxNQUFBLEdBQ0U7QUFBQSxJQUFBLE9BQUEsRUFBUyxTQUFBLEdBQUE7YUFBRyxPQUFIO0lBQUEsQ0FBVDtBQUFBLElBQ0EsSUFBQSxFQUFNLFNBQUEsR0FBQTthQUFHLE9BQUg7SUFBQSxDQUROO0dBaEJGLENBQUE7O0FBQUEsRUFrQkEsa0JBQUEsR0FBcUIsRUFsQnJCLENBQUE7O0FBQUEsRUFtQkEsWUFBQSxHQUFlLEVBbkJmLENBQUE7O0FBQUEsRUFvQkEsY0FBQSxHQUFpQixRQXBCakIsQ0FBQTs7QUFBQSxFQXNCQSxVQUFBLEdBQWEsU0FBQSxHQUFBO0FBQ1gsSUFBQSxJQUFJLENBQUMs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

//# sourceURL=/Users/anas/.atom/packages/git-plus/spec/models/git-commit-spec.coffee
