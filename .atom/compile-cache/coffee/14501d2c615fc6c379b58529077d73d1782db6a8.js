(function() {
  var Path, commitPane, currentPane, fs, git, mockRepo, mockRepoWithSubmodule, mockSubmodule, pathToRepoFile, pathToSubmoduleFile, repo, textEditor, _ref;

  fs = require('fs-plus');

  Path = require('flavored-path');

  git = require('../lib/git');

  _ref = require('./fixtures'), repo = _ref.repo, pathToRepoFile = _ref.pathToRepoFile, textEditor = _ref.textEditor, commitPane = _ref.commitPane, currentPane = _ref.currentPane;

  pathToSubmoduleFile = Path.get("~/some/submodule/file");

  mockRepo = {
    getWorkingDirectory: function() {
      return Path.get("~/some/repository");
    },
    refreshStatus: function() {
      return void 0;
    },
    relativize: function(path) {
      if (path === pathToRepoFile) {
        return "directory/file";
      }
    },
    repo: {
      submoduleForPath: function(path) {
        return void 0;
      }
    }
  };

  mockSubmodule = {
    getWorkingDirectory: function() {
      return Path.get("~/some/submodule");
    },
    relativize: function(path) {
      if (path === pathToSubmoduleFile) {
        return "file";
      }
    }
  };

  mockRepoWithSubmodule = Object.create(mockRepo);

  mockRepoWithSubmodule.repo = {
    submoduleForPath: function(path) {
      if (path === pathToSubmoduleFile) {
        return mockSubmodule;
      }
    }
  };

  describe("Git-Plus git module", function() {
    describe("git.getConfig", function() {
      var args;
      args = ['config', '--get', 'user.name'];
      beforeEach(function() {
        return spyOn(git, 'cmd').andReturn(Promise.resolve('akonwi'));
      });
      describe("when a repo file path isn't specified", function() {
        return it("spawns a command querying git for the given global setting", function() {
          waitsForPromise(function() {
            return git.getConfig('user.name');
          });
          return runs(function() {
            return expect(git.cmd).toHaveBeenCalledWith(args, {
              cwd: Path.get('~')
            });
          });
        });
      });
      return describe("when a repo file path is specified", function() {
        return it("checks for settings in that repo", function() {
          waitsForPromise(function() {
            return git.getConfig('user.name', repo.getWorkingDirectory());
          });
          return runs(function() {
            return expect(git.cmd).toHaveBeenCalledWith(args, {
              cwd: repo.getWorkingDirectory()
            });
          });
        });
      });
    });
    describe("git.getRepo", function() {
      return it("returns a promise resolving to repository", function() {
        spyOn(atom.project, 'getRepositories').andReturn([repo]);
        return waitsForPromise(function() {
          return git.getRepo().then(function(actual) {
            return expect(actual.getWorkingDirectory()).toEqual(repo.getWorkingDirectory());
          });
        });
      });
    });
    describe("git.dir", function() {
      return it("returns a promise resolving to absolute path of repo", function() {
        spyOn(atom.workspace, 'getActiveTextEditor').andReturn(textEditor);
        spyOn(atom.project, 'getRepositories').andReturn([repo]);
        return git.dir().then(function(dir) {
          return expect(dir).toEqual(repo.getWorkingDirectory());
        });
      });
    });
    describe("git.getSubmodule", function() {
      it("returns undefined when there is no submodule", function() {
        return expect(git.getSubmodule(pathToRepoFile)).toBe(void 0);
      });
      return it("returns a submodule when given file is in a submodule of a project repo", function() {
        spyOn(atom.project, 'getRepositories').andCallFake(function() {
          return [mockRepoWithSubmodule];
        });
        return expect(git.getSubmodule(pathToSubmoduleFile).getWorkingDirectory()).toEqual(Path.get("~/some/submodule"));
      });
    });
    describe("git.relativize", function() {
      return it("returns relativized filepath for files in repo", function() {
        spyOn(atom.project, 'getRepositories').andCallFake(function() {
          return [mockRepo, mockRepoWithSubmodule];
        });
        expect(git.relativize(pathToRepoFile)).toBe('directory/file');
        return expect(git.relativize(pathToSubmoduleFile)).toBe("file");
      });
    });
    describe("git.cmd", function() {
      return it("returns a promise", function() {
        var promise;
        promise = git.cmd();
        expect(promise["catch"]).toBeDefined();
        return expect(promise.then).toBeDefined();
      });
    });
    describe("git.add", function() {
      it("calls git.cmd with ['add', '--all', {fileName}]", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.add(mockRepo, {
            file: pathToSubmoduleFile
          }).then(function(success) {
            return expect(git.cmd).toHaveBeenCalledWith(['add', '--all', pathToSubmoduleFile], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
      it("calls git.cmd with ['add', '--all', '.'] when no file is specified", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.add(mockRepo).then(function(success) {
            return expect(git.cmd).toHaveBeenCalledWith(['add', '--all', '.'], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
      return it("calls git.cmd with ['add', '--update'...] when update option is true", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.add(mockRepo, {
            update: true
          }).then(function(success) {
            return expect(git.cmd).toHaveBeenCalledWith(['add', '--update', '.'], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
    });
    describe("git.reset", function() {
      return it("resets and unstages all files", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve(true);
        });
        return waitsForPromise(function() {
          return git.reset(mockRepo).then(function() {
            return expect(git.cmd).toHaveBeenCalledWith(['reset', 'HEAD'], {
              cwd: mockRepo.getWorkingDirectory()
            });
          });
        });
      });
    });
    describe("git.stagedFiles", function() {
      return it("returns an empty array when there are no staged files", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve('');
        });
        return waitsForPromise(function() {
          return git.stagedFiles(mockRepo).then(function(files) {
            return expect(files.length).toEqual(0);
          });
        });
      });
    });
    describe("git.unstagedFiles", function() {
      return it("returns an empty array when there are no unstaged files", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve('');
        });
        return waitsForPromise(function() {
          return git.unstagedFiles(mockRepo).then(function(files) {
            return expect(files.length).toEqual(0);
          });
        });
      });
    });
    describe("git.status", function() {
      return it("calls git.cmd with 'status' as the first argument", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          var args;
          args = git.cmd.mostRecentCall.args;
          if (args[0][0] === 'status') {
            return Promise.resolve(true);
          }
        });
        return git.status(mockRepo).then(function() {
          return expect(true).toBeTruthy();
        });
      });
    });
    describe("git.refresh", function() {
      it("calls git.cmd with 'add' and '--refresh' arguments for each repo in project", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          var args;
          args = git.cmd.mostRecentCall.args[0];
          expect(args[0]).toBe('add');
          return expect(args[1]).toBe('--refresh');
        });
        spyOn(mockRepo, 'getWorkingDirectory').andCallFake(function() {
          return expect(mockRepo.getWorkingDirectory.callCount).toBe(1);
        });
        return git.refresh();
      });
      return it("calls repo.refreshStatus for each repo in project", function() {
        spyOn(atom.project, 'getRepositories').andCallFake(function() {
          return [mockRepo];
        });
        spyOn(mockRepo, 'refreshStatus');
        spyOn(git, 'cmd').andCallFake(function() {
          return void 0;
        });
        git.refresh();
        return expect(mockRepo.refreshStatus.callCount).toBe(1);
      });
    });
    return describe("git.diff", function() {
      return it("calls git.cmd with ['diff', '-p', '-U1'] and the file path", function() {
        spyOn(git, 'cmd').andCallFake(function() {
          return Promise.resolve("string");
        });
        git.diff(mockRepo, pathToRepoFile);
        return expect(git.cmd).toHaveBeenCalledWith(['diff', '-p', '-U1', pathToRepoFile], {
          cwd: mockRepo.getWorkingDirectory()
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy9naXQtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUpBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUVBLEdBQUEsR0FBTSxPQUFBLENBQVEsWUFBUixDQUZOLENBQUE7O0FBQUEsRUFHQSxPQU1JLE9BQUEsQ0FBUSxZQUFSLENBTkosRUFDRSxZQUFBLElBREYsRUFFRSxzQkFBQSxjQUZGLEVBR0Usa0JBQUEsVUFIRixFQUlFLGtCQUFBLFVBSkYsRUFLRSxtQkFBQSxXQVJGLENBQUE7O0FBQUEsRUFVQSxtQkFBQSxHQUFzQixJQUFJLENBQUMsR0FBTCxDQUFTLHVCQUFULENBVnRCLENBQUE7O0FBQUEsRUFZQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLG1CQUFBLEVBQXFCLFNBQUEsR0FBQTthQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsbUJBQVQsRUFBSDtJQUFBLENBQXJCO0FBQUEsSUFDQSxhQUFBLEVBQWUsU0FBQSxHQUFBO2FBQUcsT0FBSDtJQUFBLENBRGY7QUFBQSxJQUVBLFVBQUEsRUFBWSxTQUFDLElBQUQsR0FBQTtBQUFVLE1BQUEsSUFBb0IsSUFBQSxLQUFRLGNBQTVCO2VBQUEsaUJBQUE7T0FBVjtJQUFBLENBRlo7QUFBQSxJQUdBLElBQUEsRUFDRTtBQUFBLE1BQUEsZ0JBQUEsRUFBa0IsU0FBQyxJQUFELEdBQUE7ZUFBVSxPQUFWO01BQUEsQ0FBbEI7S0FKRjtHQWJGLENBQUE7O0FBQUEsRUFtQkEsYUFBQSxHQUNFO0FBQUEsSUFBQSxtQkFBQSxFQUFxQixTQUFBLEdBQUE7YUFBRyxJ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

//# sourceURL=/Users/anas/.atom/packages/git-plus/spec/git-spec.coffee
