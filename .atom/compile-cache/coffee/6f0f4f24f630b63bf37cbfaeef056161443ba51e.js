(function() {
  var ManagePostCategoriesView, ManagePostTagsView;

  ManagePostCategoriesView = require("../../lib/views/manage-post-categories-view");

  ManagePostTagsView = require("../../lib/views/manage-post-tags-view");

  describe("ManageFrontMatterView", function() {
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open("front-matter.markdown");
      });
    });
    describe("ManagePostCategoriesView", function() {
      var categoriesView, editor, _ref;
      _ref = [], editor = _ref[0], categoriesView = _ref[1];
      beforeEach(function() {
        return categoriesView = new ManagePostCategoriesView({});
      });
      describe("when editor has malformed front matter", function() {
        return it("does nothing", function() {
          atom.confirm = function() {
            return {};
          };
          editor = atom.workspace.getActiveTextEditor();
          editor.setText("---\ntitle: Markdown Writer (Jekyll)\n----\n---");
          categoriesView.display();
          return expect(categoriesView.panel.isVisible()).toBe(false);
        });
      });
      return describe("when editor has front matter", function() {
        beforeEach(function() {
          editor = atom.workspace.getActiveTextEditor();
          return editor.setText("---\ntitle: Markdown Writer (Jekyll)\ndate: 2015-08-12 23:19\ncategories: Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
        });
        it("display edit panel", function() {
          categoriesView.display();
          return expect(categoriesView.panel.isVisible()).toBe(true);
        });
        return it("updates editor text", function() {
          categoriesView.display();
          categoriesView.saveFrontMatter();
          expect(categoriesView.panel.isVisible()).toBe(false);
          return expect(editor.getText()).toBe("---\ntitle: Markdown Writer (Jekyll)\ndate: '2015-08-12 23:19'\ncategories:\n  - Markdown\ntags:\n  - Writer\n  - Jekyll\n---\n\nsome random text 1\nsome random text 2");
        });
      });
    });
    return describe("ManagePostTagsView", function() {
      var editor, tagsView, _ref;
      _ref = [], editor = _ref[0], tagsView = _ref[1];
      beforeEach(function() {
        return tagsView = new ManagePostTagsView({});
      });
      it("rank tags", function() {
        var fixture, tags;
        fixture = "ab ab cd ab ef gh ef";
        tags = ["ab", "cd", "ef", "ij"].map(function(t) {
          return {
            name: t
          };
        });
        tagsView.rankTags(tags, fixture);
        return expect(tags).toEqual([
          {
            name: "ab",
            count: 3
          }, {
            name: "ef",
            count: 2
          }, {
            name: "cd",
            count: 1
          }, {
            name: "ij",
            count: 0
          }
        ]);
      });
      return it("rank tags with regex escaped", function() {
        var fixture, tags;
        fixture = "c++ c.c^abc $10.0 +abc";
        tags = ["c++", "\\", "^", "$", "+abc"].map(function(t) {
          return {
            name: t
          };
        });
        tagsView.rankTags(tags, fixture);
        return expect(tags).toEqual([
          {
            name: "c++",
            count: 1
          }, {
            name: "^",
            count: 1
          }, {
            name: "$",
            count: 1
          }, {
            name: "+abc",
            count: 1
          }, {
            name: "\\",
            count: 0
          }
        ]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvdmlld3MvbWFuYWdlLWZyb250LW1hdHRlci12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBOztBQUFBLEVBQUEsd0JBQUEsR0FBMkIsT0FBQSxDQUFRLDZDQUFSLENBQTNCLENBQUE7O0FBQUEsRUFDQSxrQkFBQSxHQUFxQixPQUFBLENBQVEsdUNBQVIsQ0FEckIsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsSUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsdUJBQXBCLEVBQUg7TUFBQSxDQUFoQixFQURTO0lBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxJQUdBLFFBQUEsQ0FBUywwQkFBVCxFQUFxQyxTQUFBLEdBQUE7QUFDbkMsVUFBQSw0QkFBQTtBQUFBLE1BQUEsT0FBMkIsRUFBM0IsRUFBQyxnQkFBRCxFQUFTLHdCQUFULENBQUE7QUFBQSxNQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxjQUFBLEdBQXFCLElBQUEsd0JBQUEsQ0FBeUIsRUFBekIsRUFEWjtNQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsTUFLQSxRQUFBLENBQVMsd0NBQVQsRUFBbUQsU0FBQSxHQUFBO2VBQ2pELEVBQUEsQ0FBRyxjQUFILEVBQW1CLFNBQUEsR0FBQTtBQUNqQixVQUFBLElBQUksQ0FBQyxPQUFMLEdBQWUsU0FBQSxHQUFBO21CQUFHLEdBQUg7VUFBQSxDQUFmLENBQUE7QUFBQSxVQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FEVCxDQUFBO0FBQUEsVUFFQSxNQUFNLENBQUMsT0FBUCxDQUFlLGlEQUFmLENBRkEsQ0FBQTtBQUFBLFVBU0EsY0FBYyxDQUFDLE9BQWYsQ0FBQSxDQVRBLENBQUE7aUJBVUEsTUFBQSxDQUFPLGNBQWMsQ0FBQyxLQUFLLENBQUMsU0FBckIsQ0FBQSxDQUFQLENBQXdDLENBQUMsSUFBekMsQ0FBOEMsS0FBOUMsRUFYaUI7UUFBQSxDQUFuQixFQURpRDtNQUFBLENBQW5ELENBTEEsQ0FBQTthQW1CQSxRQUFBLENBQVMsOEJBQVQsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7aUJBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBZSxrS0FBZixFQUZTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQWdCQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFVBQUEsY0FBYyxDQUFDLE9BQWYsQ0FBQSxDQUFBLENBQUE7aUJBQ0EsTUFBQSxDQUFPLGNBQWMsQ0FBQyxLQUFLLENBQUMsU0FBckIsQ0FBQSxDQUFQLENBQXdDLENBQUMsSUFBekMsQ0FBOEMsSUFBOUMsRUFGdUI7UUFBQSxDQUF6QixDQWhCQSxDQUFBO2VBb0JBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsVUFBQSxjQUFjLENBQUMsT0FBZixDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQ0EsY0FBYyxDQUFDLGVBQWYsQ0FBQSxDQURBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDLFNBQXJCLENBQUEsQ0FBUCxDQUF3QyxDQUFDLElBQXpDLENBQThDLEtBQTlDLENBSEEsQ0FBQTtpQkFJQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIseUtBQTlCLEVBTHdCO1FBQUEsQ0FBMUIsRUFyQnVDO01BQUEsQ0FBekMsRUFwQm1DO0lBQUEsQ0FBckMsQ0FIQSxDQUFBO1dBZ0VBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7QUFDN0IsVUFBQSxzQkFBQTtBQUFBLE1BQUEsT0FBcUIsRUFBckIsRUFBQyxnQkFBRCxFQUFTLGtCQUFULENBQUE7QUFBQSxNQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxRQUFBLEdBQWUsSUFBQSxrQkFBQSxDQUFtQixFQUFuQixFQUROO01BQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxNQUtBLEVBQUEsQ0FBRyxXQUFILEVBQWdCLFNBQUEsR0FBQTtBQUNkLFlBQUEsYUFBQTtBQUFBLFFBQUEsT0FBQSxHQUFVLHNCQUFWLENBQUE7QUFBQSxRQUNBLElBQUEsR0FBTyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixJQUFuQixDQUF3QixDQUFDLEdBQXpCLENBQTZCLFNBQUMsQ0FBRCxHQUFBO2lCQUFPO0FBQUEsWUFBQSxJQUFBLEVBQU0sQ0FBTjtZQUFQO1FBQUEsQ0FBN0IsQ0FEUCxDQUFBO0FBQUEsUUFHQSxRQUFRLENBQUMsUUFBVCxDQUFrQixJQUFsQixFQUF3QixPQUF4QixDQUhBLENBQUE7ZUFLQSxNQUFBLENBQU8sSUFBUCxDQUFZLENBQUMsT0FBYixDQUFxQjtVQUNuQjtBQUFBLFlBQUMsSUFBQSxFQUFNLElBQVA7QUFBQSxZQUFhLEtBQUEsRUFBTyxDQUFwQjtXQURtQixFQUVuQjtBQUFBLFlBQUMsSUFBQSxFQUFNLElBQVA7QUFBQSxZQUFhLEtBQUEsRUFBTyxDQUFwQjtXQUZtQixFQUduQjtBQUFBLFlBQUMsSUFBQSxFQUFNLElBQVA7QUFBQSxZQUFhLEtBQUEsRUFBTyxDQUFwQjtXQUhtQixFQUluQjtBQUFBLFlBQUMsSUFBQSxFQUFNLElBQVA7QUFBQSxZQUFhLEtBQUEsRUFBTyxDQUFwQjtXQUptQjtTQUFyQixFQU5jO01BQUEsQ0FBaEIsQ0FMQSxDQUFBO2FBa0JBLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsWUFBQSxhQUFBO0FBQUEsUUFBQSxPQUFBLEdBQVUsd0JBQVYsQ0FBQTtBQUFBLFFBQ0EsSUFBQSxHQUFPLENBQUMsS0FBRCxFQUFRLElBQVIsRUFBYyxHQUFkLEVBQW1CLEdBQW5CLEVBQXdCLE1BQXhCLENBQStCLENBQUMsR0FBaEMsQ0FBb0MsU0FBQyxDQUFELEdBQUE7aUJBQU87QUFBQSxZQUFBLElBQUEsRUFBTSxDQUFOO1lBQVA7UUFBQSxDQUFwQyxDQURQLENBQUE7QUFBQSxRQUdBLFFBQVEsQ0FBQyxRQUFULENBQWtCLElBQWxCLEVBQXdCLE9BQXhCLENBSEEsQ0FBQTtlQUtBLE1BQUEsQ0FBTyxJQUFQLENBQVksQ0FBQyxPQUFiLENBQXFCO1VBQ25CO0FBQUEsWUFBQyxJQUFBLEVBQU0sS0FBUDtBQUFBLFlBQWMsS0FBQSxFQUFPLENBQXJCO1dBRG1CLEVBRW5CO0FBQUEsWUFBQyxJQUFBLEVBQU0sR0FBUDtBQUFBLFlBQVksS0FBQSxFQUFPLENBQW5CO1dBRm1CLEVBR25CO0FBQUEsWUFBQyxJQUFBLEVBQU0sR0FBUDtBQUFBLFlBQVksS0FBQSxFQUFPLENBQW5CO1dBSG1CLEVBSW5CO0FBQUEsWUFBQyxJQUFBLEVBQU0sTUFBUDtBQUFBLFlBQWUsS0FBQSxFQUFPLENBQXRCO1dBSm1CLEVBS25CO0FBQUEsWUFBQyxJQUFBLEVBQU0sSUFBUDtBQUFBLFlBQWEsS0FBQSxFQUFPLENBQXBCO1dBTG1CO1NBQXJCLEVBTmlDO01BQUEsQ0FBbkMsRUFuQjZCO0lBQUEsQ0FBL0IsRUFqRWdDO0VBQUEsQ0FBbEMsQ0FIQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/markdown-writer/spec/views/manage-front-matter-view-spec.coffee
