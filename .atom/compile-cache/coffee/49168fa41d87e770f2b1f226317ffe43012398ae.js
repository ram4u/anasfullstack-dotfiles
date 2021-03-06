(function() {
  var TagView, cwd, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  TagView = require('../../lib/views/tag-view');

  cwd = repo.getWorkingDirectory();

  describe("TagView", function() {
    beforeEach(function() {
      this.tag = 'tag1';
      return this.view = new TagView(repo, this.tag);
    });
    it("displays 5 commands for the tag", function() {
      return expect(this.view.items.length).toBe(5);
    });
    it("gets the remotes to push to when the push command is selected", function() {
      spyOn(git, 'cmd').andCallFake(function() {
        return Promise.resolve('remotes');
      });
      this.view.confirmed(this.view.items[1]);
      return expect(git.cmd).toHaveBeenCalledWith(['remote'], {
        cwd: cwd
      });
    });
    it("calls git.cmd with 'checkout' to checkout the tag when checkout is selected", function() {
      spyOn(git, 'cmd').andCallFake(function() {
        return Promise.resolve('success');
      });
      this.view.confirmed(this.view.items[2]);
      return expect(git.cmd).toHaveBeenCalledWith(['checkout', this.tag], {
        cwd: cwd
      });
    });
    it("calls git.cmd with 'verify' when verify is selected", function() {
      spyOn(git, 'cmd').andCallFake(function() {
        return Promise.resolve('success');
      });
      this.view.confirmed(this.view.items[3]);
      return expect(git.cmd).toHaveBeenCalledWith(['tag', '--verify', this.tag], {
        cwd: cwd
      });
    });
    return it("calls git.cmd with 'delete' when delete is selected", function() {
      spyOn(git, 'cmd').andCallFake(function() {
        return Promise.resolve('success');
      });
      this.view.confirmed(this.view.items[4]);
      return expect(git.cmd).toHaveBeenCalledWith(['tag', '--delete', this.tag], {
        cwd: cwd
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvc3BlYy92aWV3cy90YWctdmlldy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1QkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUixDQUFOLENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSwwQkFBUixDQUZWLENBQUE7O0FBQUEsRUFJQSxHQUFBLEdBQU0sSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FKTixDQUFBOztBQUFBLEVBTUEsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLElBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLEdBQUQsR0FBTyxNQUFQLENBQUE7YUFDQSxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsT0FBQSxDQUFRLElBQVIsRUFBYyxJQUFDLENBQUEsR0FBZixFQUZIO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUlBLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7YUFDcEMsTUFBQSxDQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQW5CLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsQ0FBaEMsRUFEb0M7SUFBQSxDQUF0QyxDQUpBLENBQUE7QUFBQSxJQU9BLEVBQUEsQ0FBRywrREFBSCxFQUFvRSxTQUFBLEdBQUE7QUFDbEUsTUFBQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxXQUFsQixDQUE4QixTQUFBLEdBQUE7ZUFBRyxPQUFPLENBQUMsT0FBUixDQUFnQixTQUFoQixFQUFIO01BQUEsQ0FBOUIs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

//# sourceURL=/Users/anas/.atom/packages/git-plus/spec/views/tag-view-spec.coffee
