(function() {
  var DB, os;

  DB = require('../lib/db');

  os = require('os');

  describe("DB", function() {
    var data, db;
    db = null;
    data = null;
    beforeEach(function() {
      db = new DB();
      data = {
        testproject1: {
          title: "Test project 1",
          group: "Test",
          paths: ["/Users/project-1"]
        },
        testproject2: {
          _id: 'testproject2',
          title: "Test project 2",
          paths: ["/Users/project-2"]
        }
      };
      spyOn(db, 'readFile').andCallFake(function(callback) {
        return callback(data);
      });
      return spyOn(db, 'writeFile').andCallFake(function(projects, callback) {
        data = projects;
        return callback();
      });
    });
    describe("::Find", function() {
      it("finds all projects when given no query", function() {
        return db.find(function(projects) {
          return expect(projects.length).toBe(2);
        });
      });
      it("finds project from path", function() {
        db.setSearchQuery('paths', ['/Users/project-2']);
        expect(db.searchKey).toBe('paths');
        expect(db.searchValue).toEqual(['/Users/project-2']);
        return db.find(function(project) {
          return expect(project.title).toBe('Test project 2');
        });
      });
      it("finds project from title", function() {
        db.setSearchQuery('title', 'Test project 1');
        return db.find(function(project) {
          return expect(project.title).toBe('Test project 1');
        });
      });
      it("finds project from id", function() {
        db.setSearchQuery('_id', 'testproject2');
        return db.find(function(project) {
          return expect(project.title).toBe('Test project 2');
        });
      });
      return it("finds nothing if query is wrong", function() {
        db.setSearchQuery('_id', 'noproject');
        return db.find(function(project) {
          return expect(project).toBe(false);
        });
      });
    });
    it("can add a project", function() {
      var newProject;
      newProject = {
        title: "New Project",
        paths: ["/Users/new-project"]
      };
      return db.add(newProject, function(id) {
        expect(id).toBe('newproject');
        return db.find(function(projects) {
          return expect(projects.length).toBe(3);
        });
      });
    });
    it("can remove a project", function() {
      return db["delete"]("testproject1", function() {
        return db.find(function(projects) {
          return expect(projects.length).toBe(1);
        });
      });
    });
    return describe("Environment specific settings", function() {
      it("loads a generic file if not set", function() {
        var filedir;
        atom.config.set('project-manager.environmentSpecificProjects', false);
        filedir = atom.getConfigDirPath();
        return expect(db.file()).toBe("" + filedir + "/projects.cson");
      });
      return it("loads a environment specific file is set to true", function() {
        var filedir, hostname;
        atom.config.set('project-manager.environmentSpecificProjects', true);
        hostname = os.hostname().split('.').shift().toLowerCase();
        filedir = atom.getConfigDirPath();
        return expect(db.file()).toBe("" + filedir + "/projects." + hostname + ".cson");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvcHJvamVjdC1tYW5hZ2VyL3NwZWMvZGItc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsTUFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsV0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLElBQVQsRUFBZSxTQUFBLEdBQUE7QUFDYixRQUFBLFFBQUE7QUFBQSxJQUFBLEVBQUEsR0FBSyxJQUFMLENBQUE7QUFBQSxJQUNBLElBQUEsR0FBTyxJQURQLENBQUE7QUFBQSxJQUdBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLEVBQUEsR0FBUyxJQUFBLEVBQUEsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUVBLElBQUEsR0FDRTtBQUFBLFFBQUEsWUFBQSxFQUNFO0FBQUEsVUFBQSxLQUFBLEVBQU8sZ0JBQVA7QUFBQSxVQUNBLEtBQUEsRUFBTyxNQURQO0FBQUEsVUFFQSxLQUFBLEVBQU8sQ0FDTCxrQkFESyxDQUZQO1NBREY7QUFBQSxRQU1BLFlBQUEsRUFDRTtBQUFBLFVBQUEsR0FBQSxFQUFLLGNBQUw7QUFBQSxVQUNBLEtBQUEsRUFBTyxnQkFEUDtBQUFBLFVBRUEsS0FBQSxFQUFPLENBQ0wsa0JBREssQ0FGUDtTQVBGO09BSEYsQ0FBQTtBQUFBLE1BZ0JBLEtBQUEsQ0FBTSxFQUFOLEVBQVUsVUFBVixDQUFxQixDQUFDLFdBQXRCLENBQWtDLFNBQUMsUUFBRCxHQUFBO2VBQ2hDLFFBQUEsQ0FBUyxJQUFULEVBRGdDO01BQUEsQ0FBbEMsQ0FoQkEsQ0FBQTthQWtCQSxLQUFBLENBQU0sRUFBTixFQUFVLFdBQVYsQ0FBc0IsQ0FBQyxXQUF2QixD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

//# sourceURL=/Users/anas/.atom/packages/project-manager/spec/db-spec.coffee
