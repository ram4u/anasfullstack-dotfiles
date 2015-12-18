(function() {
  var $, $$$, DEFAULT_HEADING_TEXT, ResultView, View, clickablePaths, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$$ = _ref.$$$, View = _ref.View;

  clickablePaths = require('./clickable-paths');

  DEFAULT_HEADING_TEXT = 'Mocha test results';

  module.exports = ResultView = (function(_super) {
    __extends(ResultView, _super);

    function ResultView() {
      this.resizeView = __bind(this.resizeView, this);
      return ResultView.__super__.constructor.apply(this, arguments);
    }

    ResultView.content = function() {
      return this.div({
        "class": 'mocha-test-runner'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'panel'
          }, function() {
            _this.div({
              outlet: 'heading',
              "class": 'heading'
            }, function() {
              _this.div({
                "class": 'pull-right'
              }, function() {
                return _this.span({
                  outlet: 'closeButton',
                  "class": 'close-icon'
                });
              });
              return _this.span({
                outlet: 'headingText'
              }, DEFAULT_HEADING_TEXT);
            });
            return _this.div({
              "class": 'panel-body'
            }, function() {
              return _this.pre({
                outlet: 'results',
                "class": 'results'
              });
            });
          });
        };
      })(this));
    };

    ResultView.prototype.initialize = function(state) {
      var height;
      height = state != null ? state.height : void 0;
      this.openHeight = Math.max(140, state != null ? state.openHeight : void 0, height);
      this.height(height);
      this.heading.on('dblclick', (function(_this) {
        return function() {
          return _this.toggleCollapse();
        };
      })(this));
      this.closeButton.on('click', (function(_this) {
        return function() {
          return atom.commands.dispatch(_this, 'result-view:close');
        };
      })(this));
      this.heading.on('mousedown', (function(_this) {
        return function(e) {
          return _this.resizeStarted(e);
        };
      })(this));
      this.results.addClass('native-key-bindings');
      this.results.attr('tabindex', -1);
      return clickablePaths.attachClickHandler();
    };

    ResultView.prototype.serialize = function() {
      return {
        height: this.height(),
        openHeight: this.openHeight
      };
    };

    ResultView.prototype.destroy = function() {
      return clickablePaths.removeClickHandler();
    };

    ResultView.prototype.resizeStarted = function(_arg) {
      var pageY;
      pageY = _arg.pageY;
      this.resizeData = {
        pageY: pageY,
        height: this.height()
      };
      $(document.body).on('mousemove', this.resizeView);
      return $(document.body).one('mouseup', this.resizeStopped.bind(this));
    };

    ResultView.prototype.resizeStopped = function() {
      var currentHeight;
      $(document.body).off('mousemove', this.resizeView);
      currentHeight = this.height();
      if (currentHeight > this.heading.outerHeight()) {
        return this.openHeight = currentHeight;
      }
    };

    ResultView.prototype.resizeView = function(_arg) {
      var headingHeight, pageY;
      pageY = _arg.pageY;
      headingHeight = this.heading.outerHeight();
      return this.height(Math.max(this.resizeData.height + this.resizeData.pageY - pageY, headingHeight));
    };

    ResultView.prototype.reset = function() {
      this.heading.removeClass('alert-success alert-danger');
      this.heading.addClass('alert-info');
      this.headingText.html("" + DEFAULT_HEADING_TEXT + "...");
      return this.results.empty();
    };

    ResultView.prototype.updateResultPanelHeight = function() {
      var panelBody;
      panelBody = this.find('.panel-body');
      return panelBody.height(this.height() - this.heading.outerHeight());
    };

    ResultView.prototype.addLine = function(line) {
      if (line !== '\n') {
        return this.results.append(line);
      }
    };

    ResultView.prototype.success = function(stats) {
      this.heading.removeClass('alert-info');
      this.heading.addClass('alert-success');
      return this.updateResultPanelHeight();
    };

    ResultView.prototype.failure = function(stats) {
      this.heading.removeClass('alert-info');
      this.heading.addClass('alert-danger');
      return this.updateResultPanelHeight();
    };

    ResultView.prototype.updateSummary = function(stats) {
      if (!(stats != null ? stats.length : void 0)) {
        return;
      }
      return this.headingText.html("" + DEFAULT_HEADING_TEXT + ": " + (stats.join(', ')));
    };

    ResultView.prototype.toggleCollapse = function() {
      var headingHeight, viewHeight;
      headingHeight = this.heading.outerHeight();
      viewHeight = this.height();
      if (!(headingHeight > 0)) {
        return;
      }
      if (viewHeight > headingHeight) {
        this.openHeight = viewHeight;
        return this.height(headingHeight);
      } else {
        return this.height(this.openHeight);
      }
    };

    return ResultView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvbW9jaGEtdGVzdC1ydW5uZXIvbGliL3Jlc3VsdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvRUFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQWlCLE9BQUEsQ0FBUSxzQkFBUixDQUFqQixFQUFDLFNBQUEsQ0FBRCxFQUFJLFdBQUEsR0FBSixFQUFTLFlBQUEsSUFBVCxDQUFBOztBQUFBLEVBQ0EsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FEakIsQ0FBQTs7QUFBQSxFQUdBLG9CQUFBLEdBQXVCLG9CQUh2QixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLGlDQUFBLENBQUE7Ozs7O0tBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxtQkFBUDtPQUFMLEVBQWlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQy9CLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxPQUFQO1dBQUwsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsTUFBQSxFQUFRLFNBQVI7QUFBQSxjQUFtQixPQUFBLEVBQU8sU0FBMUI7YUFBTCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsY0FBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLFlBQVA7ZUFBTCxFQUEwQixTQUFBLEdBQUE7dUJBQ3hCLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxrQkFBQSxNQUFBLEVBQVEsYUFBUjtBQUFBLGtCQUF1QixPQUFBLEVBQU8sWUFBOUI7aUJBQU4sRUFEd0I7Y0FBQSxDQUExQixDQUFBLENBQUE7cUJBRUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGdCQUFBLE1BQUEsRUFBUSxhQUFSO2VBQU4sRUFBNkIsb0JBQTdCLEVBSHdDO1lBQUEsQ0FBMUMsQ0FBQSxDQUFBO21CQUlBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxZQUFQO2FBQUwsRUFBMEIsU0FBQSxHQUFBO3FCQUN4QixLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsZ0JBQUEsTUFBQSxFQUFRLFNBQVI7QUFBQSxnQkFBbUIsT0FBQSxFQUFPLFNBQTFCO2VBQUwsRUFEd0I7WUFBQSxDQUExQixFQUxtQjtVQUFBLENBQXJCLEVBRCtCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSx5QkFVQSxVQUFBLEdBQVksU0FBQyxLQUFELEdBQUE7QUFDVixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsbUJBQVMsS0FBSyxDQUFFLGVBQWhCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxHQUFULGtCQUFhLEtBQUssQ0FBRSxtQkFBcEIsRUFBK0IsTUFBL0IsQ0FEZCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsTUFBRCxDQUFRLE1BQVIsQ0FGQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxVQUFaLEVBQXdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLGNBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEIsQ0FKQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsV0FBVyxDQUFDLEVBQWIsQ0FBZ0IsT0FBaEIsRUFBeUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsS0FBdkIsRUFBNkIsbUJBQTdCLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QixDQUxBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLFdBQVosRUFBeUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsQ0FBRCxHQUFBO2lCQUFPLEtBQUMsQ0FBQSxhQUFELENBQWUsQ0FBZixFQUFQO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekIsQ0FOQSxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVQsQ0FBa0IscUJBQWxCLENBUEEsQ0FBQTtBQUFBLE1BUUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsVUFBZCxFQUEwQixDQUFBLENBQTFCLENBUkEsQ0FBQTthQVVBLGNBQWMsQ0FBQyxrQkFBZixDQUFBLEVBWFU7SUFBQSxDQVZaLENBQUE7O0FBQUEseUJBdUJBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVDtBQUFBLFFBQUEsTUFBQSxFQUFRLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBUjtBQUFBLFFBQ0EsVUFBQSxFQUFZLElBQUMsQ0FBQSxVQURiO1FBRFM7SUFBQSxDQXZCWCxDQUFBOztBQUFBLHlCQTJCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsY0FBYyxDQUFDLGtCQUFmLENBQUEsRUFETztJQUFBLENBM0JULENBQUE7O0FBQUEseUJBOEJBLGFBQUEsR0FBZSxTQUFDLElBQUQsR0FBQTtBQUNiLFVBQUEsS0FBQTtBQUFBLE1BRGUsUUFBRCxLQUFDLEtBQ2YsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFVBQUQsR0FDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEtBQVA7QUFBQSxRQUNBLE1BQUEsRUFBUSxJQUFDLENBQUEsTUFBRCxDQUFBLENBRFI7T0FERixDQUFBO0FBQUEsTUFHQSxDQUFBLENBQUUsUUFBUSxDQUFDLElBQVgsQ0FBZ0IsQ0FBQyxFQUFqQixDQUFvQixXQUFwQixFQUFpQyxJQUFDLENBQUEsVUFBbEMsQ0FIQSxDQUFBO2FBSUEsQ0FBQSxDQUFFLFFBQVEsQ0FBQyxJQUFYLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBckIsRUFBZ0MsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQW9CLElBQXBCLENBQWhDLEVBTGE7SUFBQSxDQTlCZixDQUFBOztBQUFBLHlCQXFDQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSxhQUFBO0FBQUEsTUFBQSxDQUFBLENBQUUsUUFBUSxDQUFDLElBQVgsQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixXQUFyQixFQUFrQyxJQUFDLENBQUEsVUFBbkMsQ0FBQSxDQUFBO0FBQUEsTUFFQSxhQUFBLEdBQWdCLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FGaEIsQ0FBQTtBQUdBLE1BQUEsSUFBRyxhQUFBLEdBQWdCLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFBLENBQW5CO2VBQ0UsSUFBQyxDQUFBLFVBQUQsR0FBYyxjQURoQjtPQUphO0lBQUEsQ0FyQ2YsQ0FBQTs7QUFBQSx5QkE0Q0EsVUFBQSxHQUFZLFNBQUMsSUFBRCxHQUFBO0FBQ1YsVUFBQSxvQkFBQTtBQUFBLE1BRFksUUFBRCxLQUFDLEtBQ1osQ0FBQTtBQUFBLE1BQUEsYUFBQSxHQUFpQixJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBQSxDQUFqQixDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixHQUFxQixJQUFDLENBQUEsVUFBVSxDQUFDLEtBQWpDLEdBQXlDLEtBQWxELEVBQXdELGFBQXhELENBQVIsRUFGVTtJQUFBLENBNUNaLENBQUE7O0FBQUEseUJBZ0RBLEtBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxNQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQiw0QkFBckIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVQsQ0FBa0IsWUFBbEIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsRUFBQSxHQUFHLG9CQUFILEdBQXdCLEtBQTFDLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxDQUFBLEVBSks7SUFBQSxDQWhEUCxDQUFBOztBQUFBLHlCQXNEQSx1QkFBQSxHQUF5QixTQUFBLEdBQUE7QUFDdkIsVUFBQSxTQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksSUFBQyxDQUFBLElBQUQsQ0FBTSxhQUFOLENBQVosQ0FBQTthQUNBLFNBQVMsQ0FBQyxNQUFWLENBQWtCLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBQSxHQUFZLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFBLENBQTlCLEVBRnVCO0lBQUEsQ0F0RHpCLENBQUE7O0FBQUEseUJBMERBLE9BQUEsR0FBUyxTQUFDLElBQUQsR0FBQTtBQUNQLE1BQUEsSUFBRyxJQUFBLEtBQVUsSUFBYjtlQUNFLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixJQUFoQixFQURGO09BRE87SUFBQSxDQTFEVCxDQUFBOztBQUFBLHlCQThEQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFxQixZQUFyQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsUUFBVCxDQUFrQixlQUFsQixDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsdUJBQUQsQ0FBQSxFQUhPO0lBQUEsQ0E5RFQsQ0FBQTs7QUFBQSx5QkFtRUEsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsWUFBckIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFFBQVQsQ0FBa0IsY0FBbEIsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLHVCQUFELENBQUEsRUFITztJQUFBLENBbkVULENBQUE7O0FBQUEseUJBd0VBLGFBQUEsR0FBZSxTQUFDLEtBQUQsR0FBQTtBQUNiLE1BQUEsSUFBQSxDQUFBLGlCQUFjLEtBQUssQ0FBRSxnQkFBckI7QUFBQSxjQUFBLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixFQUFBLEdBQUcsb0JBQUgsR0FBd0IsSUFBeEIsR0FBMkIsQ0FBQyxLQUFLLENBQUMsSUFBTixDQUFXLElBQVgsQ0FBRCxDQUE3QyxFQUZhO0lBQUEsQ0F4RWYsQ0FBQTs7QUFBQSx5QkE0RUEsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxVQUFBLHlCQUFBO0FBQUEsTUFBQSxhQUFBLEdBQWdCLElBQUMsQ0FBQSxPQUFPLENBQUMsV0FBVCxDQUFBLENBQWhCLENBQUE7QUFBQSxNQUNBLFVBQUEsR0FBYSxJQUFDLENBQUEsTUFBRCxDQUFBLENBRGIsQ0FBQTtBQUdBLE1BQUEsSUFBQSxDQUFBLENBQWMsYUFBQSxHQUFnQixDQUE5QixDQUFBO0FBQUEsY0FBQSxDQUFBO09BSEE7QUFLQSxNQUFBLElBQUcsVUFBQSxHQUFhLGFBQWhCO0FBQ0UsUUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLFVBQWQsQ0FBQTtlQUNBLElBQUMsQ0FBQSxNQUFELENBQVEsYUFBUixFQUZGO09BQUEsTUFBQTtlQUlFLElBQUMsQ0FBQSxNQUFELENBQVEsSUFBQyxDQUFBLFVBQVQsRUFKRjtPQU5jO0lBQUEsQ0E1RWhCLENBQUE7O3NCQUFBOztLQUZ1QixLQU56QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/anas/.atom/packages/mocha-test-runner/lib/result-view.coffee