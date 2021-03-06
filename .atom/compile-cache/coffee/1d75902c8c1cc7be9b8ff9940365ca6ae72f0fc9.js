(function() {
  describe('BottomPanelMount', function() {
    var statusBar, statusBarService, workspaceElement, _ref;
    _ref = [], statusBar = _ref[0], statusBarService = _ref[1], workspaceElement = _ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.packages.activatePackage('status-bar').then(function(pack) {
          statusBar = workspaceElement.querySelector('status-bar');
          return statusBarService = pack.mainModule.provideStatusBar();
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function(pack) {
          return atom.packages.getActivePackage('linter').mainModule.consumeStatusBar(statusBar);
        });
      });
      return waitsForPromise(function() {
        return atom.workspace.open();
      });
    });
    it('can mount to left status-bar', function() {
      var tile;
      tile = statusBar.getLeftTiles()[0];
      return expect(tile.item.localName).toBe('linter-bottom-container');
    });
    it('can mount to right status-bar', function() {
      var tile;
      atom.config.set('linter.statusIconPosition', 'Right');
      tile = statusBar.getRightTiles()[0];
      return expect(tile.item.localName).toBe('linter-bottom-container');
    });
    it('defaults to visible', function() {
      var tile;
      tile = statusBar.getLeftTiles()[0];
      return expect(tile.item.visibility).toBe(true);
    });
    return it('toggles on config change', function() {
      var tile;
      tile = statusBar.getLeftTiles()[0];
      atom.config.set('linter.displayLinterInfo', false);
      expect(tile.item.visibility).toBe(false);
      atom.config.set('linter.displayLinterInfo', true);
      return expect(tile.item.visibility).toBe(true);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvdWkvYm90dG9tLXBhbmVsLW1vdW50LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFDM0IsUUFBQSxtREFBQTtBQUFBLElBQUEsT0FBa0QsRUFBbEQsRUFBQyxtQkFBRCxFQUFZLDBCQUFaLEVBQThCLDBCQUE5QixDQUFBO0FBQUEsSUFDQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7QUFBQSxNQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFlBQTlCLENBQTJDLENBQUMsSUFBNUMsQ0FBaUQsU0FBQyxJQUFELEdBQUE7QUFDL0MsVUFBQSxTQUFBLEdBQVksZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsWUFBL0IsQ0FBWixDQUFBO2lCQUNBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWhCLENBQUEsRUFGNEI7UUFBQSxDQUFqRCxFQURjO01BQUEsQ0FBaEIsQ0FEQSxDQUFBO0FBQUEsTUFLQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixRQUE5QixDQUF1QyxDQUFDLElBQXhDLENBQTZDLFNBQUMsSUFBRCxHQUFBO2lCQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLFFBQS9CLENBQXdDLENBQUMsVUFBVSxDQUFDLGdCQUFwRCxDQUFxRSxTQUFyRSxFQUQyQztRQUFBLENBQTdDLEVBRGM7TUFBQSxDQUFoQixDQUxBLENBQUE7YUFRQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLEVBRGM7TUFBQSxDQUFoQixFQVRTO0lBQUEsQ0FBWCxDQURBLENBQUE7QUFBQSxJQWFBLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sU0FBUyxDQUFDLFlBQVYsQ0FBQSxDQUF5QixDQUFBLENBQUEsQ0FBaEMsQ0FBQTthQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQWpCLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMseUJBQWpDLEVBRmlDO0lBQUEsQ0FBbkMsQ0FiQSxDQUFBO0FBQUEsSUFpQkEsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUEsR0FBQTtBQUNsQyxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwyQkFBaEIsRUFBNkMsT0FBN0MsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQU8sU0FBUyxDQUFDLGFBQVYsQ0FBQSxDQUEwQixDQUFBLENBQUEsQ0FEakMsQ0FBQTthQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQWpCLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMseUJBQWpDLEVBSGtDO0lBQUEsQ0FBcEMsQ0FqQkEsQ0FBQTtBQUFBLElBc0JBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sU0FBUyxDQUFDLFlBQVYsQ0FBQSxDQUF5QixDQUFBLENBQUEsQ0FBaEMsQ0FBQTthQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQWpCLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsSUFBbEMsRUFGd0I7SUFBQSxDQUExQixDQXRCQSxDQUFBO1dBMEJBLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBLEdBQUE7QUFDN0IsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sU0FBUyxDQUFDLFlBQVYsQ0FBQSxDQUF5QixDQUFBLENBQUEsQ0FBaEMsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixFQUE0QyxLQUE1QyxDQURBLENBQUE7QUFBQSxNQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQWpCLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEMsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLEVBQTRDLElBQTVDLENBSEEsQ0FBQTthQUlBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQWpCLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsSUFBbEMsRUFMNkI7SUFBQSxDQUEvQixFQTNCMkI7RUFBQSxDQUE3QixDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/anas/.atom/packages/linter/spec/ui/bottom-panel-mount-spec.coffee
