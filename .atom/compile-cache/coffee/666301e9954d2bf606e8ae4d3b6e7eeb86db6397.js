(function() {
  var Change, Delete, Insert, InsertAboveWithNewline, InsertAfter, InsertAfterEndOfLine, InsertAtBeginningOfLine, InsertBelowWithNewline, Motions, Operator, ReplaceMode, TransactionBundler, settings, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Motions = require('../motions/index');

  _ref = require('./general-operators'), Operator = _ref.Operator, Delete = _ref.Delete;

  _ = require('underscore-plus');

  settings = require('../settings');

  Insert = (function(_super) {
    __extends(Insert, _super);

    function Insert() {
      return Insert.__super__.constructor.apply(this, arguments);
    }

    Insert.prototype.standalone = true;

    Insert.prototype.isComplete = function() {
      return this.standalone || Insert.__super__.isComplete.apply(this, arguments);
    };

    Insert.prototype.confirmChanges = function(changes) {
      var bundler;
      bundler = new TransactionBundler(changes, this.editor);
      return this.typedText = bundler.buildInsertText();
    };

    Insert.prototype.execute = function() {
      var cursor, _i, _len, _ref1;
      if (this.typingCompleted) {
        if (!((this.typedText != null) && this.typedText.length > 0)) {
          return;
        }
        this.editor.insertText(this.typedText, {
          normalizeLineEndings: true,
          autoIndent: true
        });
        _ref1 = this.editor.getCursors();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          cursor = _ref1[_i];
          if (!cursor.isAtBeginningOfLine()) {
            cursor.moveLeft();
          }
        }
      } else {
        this.vimState.activateInsertMode();
        this.typingCompleted = true;
      }
    };

    Insert.prototype.inputOperator = function() {
      return true;
    };

    return Insert;

  })(Operator);

  ReplaceMode = (function(_super) {
    __extends(ReplaceMode, _super);

    function ReplaceMode() {
      return ReplaceMode.__super__.constructor.apply(this, arguments);
    }

    ReplaceMode.prototype.execute = function() {
      if (this.typingCompleted) {
        if (!((this.typedText != null) && this.typedText.length > 0)) {
          return;
        }
        return this.editor.transact((function(_this) {
          return function() {
            var count, cursor, selection, toDelete, _i, _j, _len, _len1, _ref1, _ref2, _results;
            _this.editor.insertText(_this.typedText, {
              normalizeLineEndings: true
            });
            toDelete = _this.typedText.length - _this.countChars('\n', _this.typedText);
            _ref1 = _this.editor.getSelections();
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              selection = _ref1[_i];
              count = toDelete;
              while (count-- && !selection.cursor.isAtEndOfLine()) {
                selection["delete"]();
              }
            }
            _ref2 = _this.editor.getCursors();
            _results = [];
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              cursor = _ref2[_j];
              if (!cursor.isAtBeginningOfLine()) {
                _results.push(cursor.moveLeft());
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          };
        })(this));
      } else {
        this.vimState.activateReplaceMode();
        return this.typingCompleted = true;
      }
    };

    ReplaceMode.prototype.countChars = function(char, string) {
      return string.split(char).length - 1;
    };

    return ReplaceMode;

  })(Insert);

  InsertAfter = (function(_super) {
    __extends(InsertAfter, _super);

    function InsertAfter() {
      return InsertAfter.__super__.constructor.apply(this, arguments);
    }

    InsertAfter.prototype.execute = function() {
      if (!this.editor.getLastCursor().isAtEndOfLine()) {
        this.editor.moveRight();
      }
      return InsertAfter.__super__.execute.apply(this, arguments);
    };

    return InsertAfter;

  })(Insert);

  InsertAfterEndOfLine = (function(_super) {
    __extends(InsertAfterEndOfLine, _super);

    function InsertAfterEndOfLine() {
      return InsertAfterEndOfLine.__super__.constructor.apply(this, arguments);
    }

    InsertAfterEndOfLine.prototype.execute = function() {
      this.editor.moveToEndOfLine();
      return InsertAfterEndOfLine.__super__.execute.apply(this, arguments);
    };

    return InsertAfterEndOfLine;

  })(Insert);

  InsertAtBeginningOfLine = (function(_super) {
    __extends(InsertAtBeginningOfLine, _super);

    function InsertAtBeginningOfLine() {
      return InsertAtBeginningOfLine.__super__.constructor.apply(this, arguments);
    }

    InsertAtBeginningOfLine.prototype.execute = function() {
      this.editor.moveToBeginningOfLine();
      this.editor.moveToFirstCharacterOfLine();
      return InsertAtBeginningOfLine.__super__.execute.apply(this, arguments);
    };

    return InsertAtBeginningOfLine;

  })(Insert);

  InsertAboveWithNewline = (function(_super) {
    __extends(InsertAboveWithNewline, _super);

    function InsertAboveWithNewline() {
      return InsertAboveWithNewline.__super__.constructor.apply(this, arguments);
    }

    InsertAboveWithNewline.prototype.execute = function() {
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      this.editor.insertNewlineAbove();
      this.editor.getLastCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return InsertAboveWithNewline.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode();
      return this.typingCompleted = true;
    };

    return InsertAboveWithNewline;

  })(Insert);

  InsertBelowWithNewline = (function(_super) {
    __extends(InsertBelowWithNewline, _super);

    function InsertBelowWithNewline() {
      return InsertBelowWithNewline.__super__.constructor.apply(this, arguments);
    }

    InsertBelowWithNewline.prototype.execute = function() {
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      this.editor.insertNewlineBelow();
      this.editor.getLastCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return InsertBelowWithNewline.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode();
      return this.typingCompleted = true;
    };

    return InsertBelowWithNewline;

  })(Insert);

  Change = (function(_super) {
    __extends(Change, _super);

    Change.prototype.standalone = false;

    Change.prototype.register = null;

    function Change(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.register = settings.defaultRegister();
    }

    Change.prototype.execute = function(count) {
      var selection, _base, _i, _j, _len, _len1, _ref1, _ref2;
      if (_.contains(this.motion.select(count, {
        excludeWhitespace: true
      }), true)) {
        if (!this.typingCompleted) {
          this.vimState.setInsertionCheckpoint();
        }
        this.setTextRegister(this.register, this.editor.getSelectedText());
        if ((typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0) && !this.typingCompleted) {
          _ref1 = this.editor.getSelections();
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            selection = _ref1[_i];
            if (selection.getBufferRange().end.row === 0) {
              selection.deleteSelectedText();
            } else {
              selection.insertText("\n", {
                autoIndent: true
              });
            }
            selection.cursor.moveLeft();
          }
        } else {
          _ref2 = this.editor.getSelections();
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            selection = _ref2[_j];
            selection.deleteSelectedText();
          }
        }
        if (this.typingCompleted) {
          return Change.__super__.execute.apply(this, arguments);
        }
        this.vimState.activateInsertMode();
        return this.typingCompleted = true;
      } else {
        return this.vimState.activateNormalMode();
      }
    };

    return Change;

  })(Insert);

  TransactionBundler = (function() {
    function TransactionBundler(changes, editor) {
      this.changes = changes;
      this.editor = editor;
      this.start = null;
      this.end = null;
    }

    TransactionBundler.prototype.buildInsertText = function() {
      var change, _i, _len, _ref1;
      _ref1 = this.changes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        change = _ref1[_i];
        this.addChange(change);
      }
      if (this.start != null) {
        return this.editor.getTextInBufferRange([this.start, this.end]);
      } else {
        return "";
      }
    };

    TransactionBundler.prototype.addChange = function(change) {
      if (change.newRange == null) {
        return;
      }
      if (this.isRemovingFromPrevious(change)) {
        this.subtractRange(change.oldRange);
      }
      if (this.isAddingWithinPrevious(change)) {
        return this.addRange(change.newRange);
      }
    };

    TransactionBundler.prototype.isAddingWithinPrevious = function(change) {
      if (!this.isAdding(change)) {
        return false;
      }
      if (this.start === null) {
        return true;
      }
      return this.start.isLessThanOrEqual(change.newRange.start) && this.end.isGreaterThanOrEqual(change.newRange.start);
    };

    TransactionBundler.prototype.isRemovingFromPrevious = function(change) {
      if (!(this.isRemoving(change) && (this.start != null))) {
        return false;
      }
      return this.start.isLessThanOrEqual(change.oldRange.start) && this.end.isGreaterThanOrEqual(change.oldRange.end);
    };

    TransactionBundler.prototype.isAdding = function(change) {
      return change.newText.length > 0;
    };

    TransactionBundler.prototype.isRemoving = function(change) {
      return change.oldText.length > 0;
    };

    TransactionBundler.prototype.addRange = function(range) {
      var cols, rows;
      if (this.start === null) {
        this.start = range.start, this.end = range.end;
        return;
      }
      rows = range.end.row - range.start.row;
      if (range.start.row === this.end.row) {
        cols = range.end.column - range.start.column;
      } else {
        cols = 0;
      }
      return this.end = this.end.translate([rows, cols]);
    };

    TransactionBundler.prototype.subtractRange = function(range) {
      var cols, rows;
      rows = range.end.row - range.start.row;
      if (range.end.row === this.end.row) {
        cols = range.end.column - range.start.column;
      } else {
        cols = 0;
      }
      return this.end = this.end.translate([-rows, -cols]);
    };

    return TransactionBundler;

  })();

  module.exports = {
    Insert: Insert,
    InsertAfter: InsertAfter,
    InsertAfterEndOfLine: InsertAfterEndOfLine,
    InsertAtBeginningOfLine: InsertAtBeginningOfLine,
    InsertAboveWithNewline: InsertAboveWithNewline,
    InsertBelowWithNewline: InsertBelowWithNewline,
    ReplaceMode: ReplaceMode,
    Change: Change
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvdmltLW1vZGUvbGliL29wZXJhdG9ycy9pbnB1dC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseU1BQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVIsQ0FBVixDQUFBOztBQUFBLEVBQ0EsT0FBcUIsT0FBQSxDQUFRLHFCQUFSLENBQXJCLEVBQUMsZ0JBQUEsUUFBRCxFQUFXLGNBQUEsTUFEWCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FIWCxDQUFBOztBQUFBLEVBU007QUFDSiw2QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEscUJBQUEsVUFBQSxHQUFZLElBQVosQ0FBQTs7QUFBQSxxQkFFQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFVBQUQsSUFBZSx3Q0FBQSxTQUFBLEVBQWxCO0lBQUEsQ0FGWixDQUFBOztBQUFBLHFCQUlBLGNBQUEsR0FBZ0IsU0FBQyxPQUFELEdBQUE7QUFDZCxVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBYyxJQUFBLGtCQUFBLENBQW1CLE9BQW5CLEVBQTRCLElBQUMsQ0FBQSxNQUE3QixDQUFkLENBQUE7YUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLE9BQU8sQ0FBQyxlQUFSLENBQUEsRUFGQztJQUFBLENBSmhCLENBQUE7O0FBQUEscUJBUUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsdUJBQUE7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLGVBQUo7QUFDRSxRQUFBLElBQUEsQ0FBQSxDQUFjLHdCQUFBLElBQWdCLElBQUMsQ0FBQSxTQUFTLENB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

//# sourceURL=/Users/anas/.atom/packages/vim-mode/lib/operators/input.coffee
