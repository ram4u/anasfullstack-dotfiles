(function() {
  var config;

  config = require("../lib/config");

  describe("config", function() {
    it("get default value", function() {
      return expect(config.get("fileExtension")).toEqual(".markdown");
    });
    it("get engine value", function() {
      config.set("siteEngine", "jekyll");
      expect(config.getEngine("codeblock.before")).not.toBeNull();
      expect(config.getEngine("imageTag")).not.toBeDefined();
      config.set("siteEngine", "not-exists");
      return expect(config.getEngine("imageTag")).not.toBeDefined();
    });
    it("get default value from engine or user config", function() {
      config.set("siteEngine", "jekyll");
      expect(config.get("codeblock.before")).toEqual(config.getEngine("codeblock.before"));
      config.set("codeblock.before", "changed");
      return expect(config.get("codeblock.before")).toEqual("changed");
    });
    it("get modified value", function() {
      atom.config.set("markdown-writer.test", "special");
      return expect(config.get("test")).toEqual("special");
    });
    return it("set key and value", function() {
      config.set("test", "value");
      return expect(atom.config.get("markdown-writer.test")).toEqual("value");
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvY29uZmlnLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLE1BQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVIsQ0FBVCxDQUFBOztBQUFBLEVBRUEsUUFBQSxDQUFTLFFBQVQsRUFBbUIsU0FBQSxHQUFBO0FBQ2pCLElBQUEsRUFBQSxDQUFHLG1CQUFILEVBQXdCLFNBQUEsR0FBQTthQUN0QixNQUFBLENBQU8sTUFBTSxDQUFDLEdBQVAsQ0FBVyxlQUFYLENBQVAsQ0FBbUMsQ0FBQyxPQUFwQyxDQUE0QyxXQUE1QyxFQURzQjtJQUFBLENBQXhCLENBQUEsQ0FBQTtBQUFBLElBR0EsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUEsR0FBQTtBQUNyQixNQUFBLE1BQU0sQ0FBQyxHQUFQLENBQVcsWUFBWCxFQUF5QixRQUF6QixDQUFBLENBQUE7QUFBQSxNQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsU0FBUCxDQUFpQixrQkFBakIsQ0FBUCxDQUE0QyxDQUFDLEdBQUcsQ0FBQyxRQUFqRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFVBQWpCLENBQVAsQ0FBb0MsQ0FBQyxHQUFHLENBQUMsV0FBekMsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUlBLE1BQU0sQ0FBQyxHQUFQLENBQVcsWUFBWCxFQUF5QixZQUF6QixDQUpBLENBQUE7YUFLQSxNQUFBLENBQU8sTUFBTSxDQUFDLFNBQVAsQ0FBaUIsVUFBakIsQ0FBUCxDQUFvQyxDQUFDLEdBQUcsQ0FBQyxXQUF6QyxDQUFBLEVBTnFCO0lBQUEsQ0FBdkIsQ0FIQSxDQUFBO0FBQUEsSUFXQSxFQUFBLENBQUcsOENBQUgsRUFBbUQsU0FBQSxHQUFBO0FBQ2pELE1BQUEsTUFBTSxDQUFDLEdBQVAsQ0FBVyxZQUFYLEVBQXlCLFFBQXpCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxHQUFQLENBQVcsa0JBQVgsQ0FBUCxDQUNFLENBQUMsT0FESCxDQUNXLE1BQU0sQ0FBQyxTQUFQLENBQWlCLGtCQUFqQixDQURYLENBREEsQ0FBQTtBQUFBLE1BSUEsTUFBTSxDQUFDLEdBQVAsQ0FBVyxrQkFBWCxFQUErQixTQUEvQixDQUpBLENBQUE7YUFLQSxNQUFBLENBQU8sTUFBTSxDQUFDLEdBQVAsQ0FBVyxrQkFBWCxDQUFQLENBQ0UsQ0FBQyxPQURILENBQ1csU0FEWCxFQU5pRDtJQUFBLENBQW5ELENBWEEsQ0FBQTtBQUFBLElBb0JBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBLEdBQUE7QUFDdkIsTUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLFNBQXhDLENBQUEsQ0FBQTthQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsR0FBUCxDQUFXLE1BQVgsQ0FBUCxDQUEwQixDQUFDLE9BQTNCLENBQW1DLFNBQW5DLEVBRnVCO0lBQUEsQ0FBekIsQ0FwQkEsQ0FBQTtXQXdCQSxFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLE1BQUEsTUFBTSxDQUFDLEdBQVAsQ0FBVyxNQUFYLEVBQW1CLE9BQW5CLENBQUEsQ0FBQTthQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLENBQVAsQ0FBK0MsQ0FBQyxPQUFoRCxDQUF3RCxPQUF4RCxFQUZzQjtJQUFBLENBQXhCLEVBekJpQjtFQUFBLENBQW5CLENBRkEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/anas/.atom/packages/markdown-writer/spec/config-spec.coffee