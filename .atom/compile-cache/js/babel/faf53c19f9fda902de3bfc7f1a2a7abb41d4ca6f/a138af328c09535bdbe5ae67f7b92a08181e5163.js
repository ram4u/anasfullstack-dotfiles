Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _mixto = require('mixto');

var _mixto2 = _interopRequireDefault(_mixto);

var _atom = require('atom');

var _decoration2 = require('../decoration');

var _decoration3 = _interopRequireDefault(_decoration2);

/**
 * The mixin that provides the decorations API to the minimap editor
 * view.
 *
 * This mixin is injected into the `Minimap` prototype, so every methods defined
 * in this file will be available on any `Minimap` instance.
 */
'use babel';

var DecorationManagement = (function (_Mixin) {
  _inherits(DecorationManagement, _Mixin);

  function DecorationManagement() {
    _classCallCheck(this, DecorationManagement);

    _get(Object.getPrototypeOf(DecorationManagement.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DecorationManagement, [{
    key: 'initializeDecorations',

    /**
     * Initializes the decorations related properties.
     */
    value: function initializeDecorations() {
      if (this.emitter == null) {
        /**
         * The minimap emitter, lazily created if not created yet.
         * @type {Emitter}
         * @access private
         */
        this.emitter = new _atom.Emitter();
      }

      /**
       * A map with the decoration id as key and the decoration as value.
       * @type {Object}
       * @access private
       */
      this.decorationsById = {};
      /**
       * The decorations stored in an array indexed with their marker id.
       * @type {Object}
       * @access private
       */
      this.decorationsByMarkerId = {};
      /**
       * The subscriptions to the markers `did-change` event indexed using the
       * marker id.
       * @type {Object}
       * @access private
       */
      this.decorationMarkerChangedSubscriptions = {};
      /**
       * The subscriptions to the markers `did-destroy` event indexed using the
       * marker id.
       * @type {Object}
       * @access private
       */
      this.decorationMarkerDestroyedSubscriptions = {};
      /**
       * The subscriptions to the decorations `did-change-properties` event
       * indexed using the decoration id.
       * @type {Object}
       * @access private
       */
      this.decorationUpdatedSubscriptions = {};
      /**
       * The subscriptions to the decorations `did-destroy` event indexed using
       * the decoration id.
       * @type {Object}
       * @access private
       */
      this.decorationDestroyedSubscriptions = {};
    }

    /**
     * Returns all the decorations registered in the current `Minimap`.
     *
     * @return {Array<Decoration>} all the decorations in this `Minimap`
     */
  }, {
    key: 'getDecorations',
    value: function getDecorations() {
      var decorations = this.decorationsById;
      var results = [];

      for (var id in decorations) {
        results.push(decorations[id]);
      }

      return results;
    }

    /**
     * Registers an event listener to the `did-add-decoration` event.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                               event is triggered.
     *                                               the callback will be called
     *                                               with an event object with
     *                                               the following properties:
     * - marker: the marker object that was decorated
     * - decoration: the decoration object that was created
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidAddDecoration',
    value: function onDidAddDecoration(callback) {
      return this.emitter.on('did-add-decoration', callback);
    }

    /**
     * Registers an event listener to the `did-remove-decoration` event.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                               event is triggered.
     *                                               the callback will be called
     *                                               with an event object with
     *                                               the following properties:
     * - marker: the marker object that was decorated
     * - decoration: the decoration object that was created
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidRemoveDecoration',
    value: function onDidRemoveDecoration(callback) {
      return this.emitter.on('did-remove-decoration', callback);
    }

    /**
     * Registers an event listener to the `did-change-decoration` event.
     *
     * This event is triggered when the marker targeted by the decoration
     * was changed.
     *
     * @param  {function(event:Object):void} callback a function to call when the
     *                                               event is triggered.
     *                                               the callback will be called
     *                                               with an event object with
     *                                               the following properties:
     * - marker: the marker object that was decorated
     * - decoration: the decoration object that was created
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidChangeDecoration',
    value: function onDidChangeDecoration(callback) {
      return this.emitter.on('did-change-decoration', callback);
    }

    /**
     * Registers an event listener to the `did-update-decoration` event.
     *
     * This event is triggered when the decoration itself is modified.
     *
     * @param  {function(decoration:Decoration):void} callback a function to call
     *                                                         when the event is
     *                                                         triggered
     * @return {Disposable} a disposable to stop listening to the event
     */
  }, {
    key: 'onDidUpdateDecoration',
    value: function onDidUpdateDecoration(callback) {
      return this.emitter.on('did-update-decoration', callback);
    }

    /**
     * Returns the decoration with the passed-in id.
     *
     * @param  {number} id the decoration id
     * @return {Decoration} the decoration with the given id
     */
  }, {
    key: 'decorationForId',
    value: function decorationForId(id) {
      return this.decorationsById[id];
    }

    /**
     * Returns all the decorations that intersect the passed-in row range.
     *
     * @param  {number} startScreenRow the first row of the range
     * @param  {number} endScreenRow the last row of the range
     * @return {Array<Decoration>} the decorations that intersect the passed-in
     *                             range
     */
  }, {
    key: 'decorationsForScreenRowRange',
    value: function decorationsForScreenRowRange(startScreenRow, endScreenRow) {
      var decorationsByMarkerId = {};
      var markers = this.findMarkers({
        intersectsScreenRowRange: [startScreenRow, endScreenRow]
      });

      for (var i = 0, len = markers.length; i < len; i++) {
        var marker = markers[i];
        var decorations = this.decorationsByMarkerId[marker.id];

        if (decorations != null) {
          decorationsByMarkerId[marker.id] = decorations;
        }
      }

      return decorationsByMarkerId;
    }

    /**
     * Returns the decorations that intersects the passed-in row range
     * in a structured way.
     *
     * At the first level, the keys are the available decoration types.
     * At the second level, the keys are the row index for which there
     * are decorations available. The value is an array containing the
     * decorations that intersects with the corresponding row.
     *
     * @return {Object} the decorations grouped by type and then rows
     * @property {Object} line all the line decorations by row
     * @property {Array<Decoration>} line[row] all the line decorations
     *                                    at a given row
     * @property {Object} highlight-under all the highlight-under decorations
     *                                    by row
     * @property {Array<Decoration>} highlight-under[row] all the highlight-under
     *                                    decorations at a given row
     * @property {Object} highlight-over all the highlight-over decorations
     *                                    by row
     * @property {Array<Decoration>} highlight-over[row] all the highlight-over
     *                                    decorations at a given row
     * @property {Object} highlight-outine all the highlight-outine decorations
     *                                    by row
     * @property {Array<Decoration>} highlight-outine[row] all the
     *                                    highlight-outine decorations at a given
     *                                    row
     */
  }, {
    key: 'decorationsByTypeThenRows',
    value: function decorationsByTypeThenRows() {
      if (this.decorationsByTypeThenRowsCache != null) {
        return this.decorationsByTypeThenRowsCache;
      }

      var cache = {};
      for (var id in this.decorationsById) {
        var decoration = this.decorationsById[id];
        var range = decoration.marker.getScreenRange();
        var type = decoration.getProperties().type;

        if (cache[type] == null) {
          cache[type] = {};
        }

        for (var row = range.start.row, len = range.end.row; row <= len; row++) {
          if (cache[type][row] == null) {
            cache[type][row] = [];
          }

          cache[type][row].push(decoration);
        }
      }

      /**
       * The grouped decorations cache.
       * @type {Object}
       * @access private
       */
      this.decorationsByTypeThenRowsCache = cache;
      return cache;
    }

    /**
     * Invalidates the decoration by screen rows cache.
     */
  }, {
    key: 'invalidateDecorationForScreenRowsCache',
    value: function invalidateDecorationForScreenRowsCache() {
      this.decorationsByTypeThenRowsCache = null;
    }

    /**
     * Adds a decoration that tracks a `Marker`. When the marker moves,
     * is invalidated, or is destroyed, the decoration will be updated to reflect
     * the marker's state.
     *
     * @param  {Marker} marker the marker you want this decoration to follow
     * @param  {Object} decorationParams the decoration properties
     * @param  {string} decorationParams.type the decoration type in the following
     *                                        list:
     * - __line__: Fills the line background with the decoration color.
     * - __highlight__: Renders a colored rectangle on the minimap. The highlight
     *   is rendered above the line's text.
     * - __highlight-over__: Same as __highlight__.
     * - __highlight-under__: Renders a colored rectangle on the minimap. The
     *   highlight is rendered below the line's text.
     * - __highlight-outline__: Renders a colored outline on the minimap. The
     *   highlight box is rendered above the line's text.
     * @param  {string} decorationParams.class the CSS class to use to retrieve
     *                                        the background color of the
     *                                        decoration by building a scop
     *                                        corresponding to
     *                                        `.minimap .editor <your-class>`
     * @param  {string} decorationParams.scope the scope to use to retrieve the
     *                                        decoration background. Note that if
     *                                        the `scope` property is set, the
     *                                        `class` won't be used.
     * @param  {string} decorationParams.color the CSS color to use to render the
     *                                        decoration. When set, neither
     *                                        `scope` nor `class` are used.
     * @return {Decoration} the created decoration
     * @emits  {did-add-decoration} when the decoration is created successfully
     * @emits  {did-change} when the decoration is created successfully
     */
  }, {
    key: 'decorateMarker',
    value: function decorateMarker(marker, decorationParams) {
      var _this = this;

      if (this.destroyed || marker == null) {
        return;
      }

      var id = marker.id;

      if (decorationParams.type === 'highlight') {
        decorationParams.type = 'highlight-over';
      }

      if (decorationParams.scope == null && decorationParams['class'] != null) {
        var cls = decorationParams['class'].split(' ').join('.');
        decorationParams.scope = '.minimap .' + cls;
      }

      if (this.decorationMarkerDestroyedSubscriptions[id] == null) {
        this.decorationMarkerDestroyedSubscriptions[id] = marker.onDidDestroy(function () {
          _this.removeAllDecorationsForMarker(marker);
        });
      }

      if (this.decorationMarkerChangedSubscriptions[id] == null) {
        this.decorationMarkerChangedSubscriptions[id] = marker.onDidChange(function (event) {
          var decorations = _this.decorationsByMarkerId[id];

          _this.invalidateDecorationForScreenRowsCache();

          if (decorations != null) {
            for (var i = 0, len = decorations.length; i < len; i++) {
              var _decoration = decorations[i];
              _this.emitter.emit('did-change-decoration', {
                marker: marker,
                decoration: _decoration,
                event: event
              });
            }
          }
          var oldStart = event.oldTailScreenPosition;
          var oldEnd = event.oldHeadScreenPosition;
          var newStart = event.newTailScreenPosition;
          var newEnd = event.newHeadScreenPosition;

          if (oldStart.row > oldEnd.row) {
            var _ref = [oldEnd, oldStart];
            oldStart = _ref[0];
            oldEnd = _ref[1];
          }
          if (newStart.row > newEnd.row) {
            var _ref2 = [newEnd, newStart];
            newStart = _ref2[0];
            newEnd = _ref2[1];
          }

          var rangesDiffs = _this.computeRangesDiffs(oldStart, oldEnd, newStart, newEnd);

          for (var i = 0, len = rangesDiffs.length; i < len; i++) {
            var _rangesDiffs$i = _slicedToArray(rangesDiffs[i], 2);

            var start = _rangesDiffs$i[0];
            var end = _rangesDiffs$i[1];

            _this.emitRangeChanges({
              start: start,
              end: end
            }, 0);
          }
        });
      }

      var decoration = new _decoration3['default'](marker, this, decorationParams);

      if (this.decorationsByMarkerId[id] == null) {
        this.decorationsByMarkerId[id] = [];
      }

      this.decorationsByMarkerId[id].push(decoration);
      this.decorationsById[decoration.id] = decoration;

      if (this.decorationUpdatedSubscriptions[decoration.id] == null) {
        this.decorationUpdatedSubscriptions[decoration.id] = decoration.onDidChangeProperties(function (event) {
          _this.emitDecorationChanges(decoration);
        });
      }

      this.decorationDestroyedSubscriptions[decoration.id] = decoration.onDidDestroy(function () {
        _this.removeDecoration(decoration);
      });

      this.emitDecorationChanges(decoration);
      this.emitter.emit('did-add-decoration', {
        marker: marker,
        decoration: decoration
      });

      return decoration;
    }

    /**
     * Given two ranges, it returns an array of ranges representing the
     * differences between them.
     *
     * @param  {number} oldStart the row index of the first range start
     * @param  {number} oldEnd the row index of the first range end
     * @param  {number} newStart the row index of the second range start
     * @param  {number} newEnd the row index of the second range end
     * @return {Array<Object>} the array of diff ranges
     * @access private
     */
  }, {
    key: 'computeRangesDiffs',
    value: function computeRangesDiffs(oldStart, oldEnd, newStart, newEnd) {
      var diffs = [];

      if (oldStart.isLessThan(newStart)) {
        diffs.push([oldStart, newStart]);
      } else if (newStart.isLessThan(oldStart)) {
        diffs.push([newStart, oldStart]);
      }

      if (oldEnd.isLessThan(newEnd)) {
        diffs.push([oldEnd, newEnd]);
      } else if (newEnd.isLessThan(oldEnd)) {
        diffs.push([newEnd, oldEnd]);
      }

      return diffs;
    }

    /**
     * Emits a change in the `Minimap` corresponding to the
     * passed-in decoration.
     *
     * @param  {Decoration} decoration the decoration for which emitting an event
     * @access private
     */
  }, {
    key: 'emitDecorationChanges',
    value: function emitDecorationChanges(decoration) {
      if (decoration.marker.displayBuffer.isDestroyed()) {
        return;
      }

      this.invalidateDecorationForScreenRowsCache();

      var range = decoration.marker.getScreenRange();
      if (range == null) {
        return;
      }

      this.emitRangeChanges(range, 0);
    }

    /**
     * Emits a change for the specified range.
     *
     * @param  {Object} range the range where changes occured
     * @param  {number} [screenDelta] an optional screen delta for the
     *                                change object
     * @access private
     */
  }, {
    key: 'emitRangeChanges',
    value: function emitRangeChanges(range, screenDelta) {
      var startScreenRow = range.start.row;
      var endScreenRow = range.end.row;
      var lastRenderedScreenRow = this.getLastVisibleScreenRow();
      var firstRenderedScreenRow = this.getFirstVisibleScreenRow();

      if (screenDelta == null) {
        screenDelta = lastRenderedScreenRow - firstRenderedScreenRow - (endScreenRow - startScreenRow);
      }

      var changeEvent = {
        start: startScreenRow,
        end: endScreenRow,
        screenDelta: screenDelta
      };

      this.emitChanges(changeEvent);
    }

    /**
     * Removes a `Decoration` from this minimap.
     *
     * @param  {Decoration} decoration the decoration to remove
     * @emits  {did-change} when the decoration is removed
     * @emits  {did-remove-decoration} when the decoration is removed
     */
  }, {
    key: 'removeDecoration',
    value: function removeDecoration(decoration) {
      if (decoration == null) {
        return;
      }

      var marker = decoration.marker;
      var subscription = undefined;

      delete this.decorationsById[decoration.id];

      subscription = this.decorationUpdatedSubscriptions[decoration.id];
      if (subscription != null) {
        subscription.dispose();
      }

      subscription = this.decorationDestroyedSubscriptions[decoration.id];
      if (subscription != null) {
        subscription.dispose();
      }

      delete this.decorationUpdatedSubscriptions[decoration.id];
      delete this.decorationDestroyedSubscriptions[decoration.id];

      var decorations = this.decorationsByMarkerId[marker.id];
      if (!decorations) {
        return;
      }

      this.emitDecorationChanges(decoration);

      var index = decorations.indexOf(decoration);
      if (index > -1) {
        decorations.splice(index, 1);

        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });

        if (decorations.length === 0) {
          this.removedAllMarkerDecorations(marker);
        }
      }
    }

    /**
     * Removes all the decorations registered for the passed-in marker.
     *
     * @param  {Marker} marker the marker for which removing its decorations
     * @emits  {did-change} when a decoration have been removed
     * @emits  {did-remove-decoration} when a decoration have been removed
     */
  }, {
    key: 'removeAllDecorationsForMarker',
    value: function removeAllDecorationsForMarker(marker) {
      if (marker == null) {
        return;
      }

      var decorations = this.decorationsByMarkerId[marker.id];
      if (!decorations) {
        return;
      }

      for (var i = 0, len = decorations.length; i < len; i++) {
        var decoration = decorations[i];

        this.emitDecorationChanges(decoration);
        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });
      }

      this.removedAllMarkerDecorations(marker);
    }

    /**
     * Performs the removal of a decoration for a given marker.
     *
     * @param  {Marker} marker the marker for which removing decorations
     * @access private
     */
  }, {
    key: 'removedAllMarkerDecorations',
    value: function removedAllMarkerDecorations(marker) {
      if (marker == null) {
        return;
      }

      this.decorationMarkerChangedSubscriptions[marker.id].dispose();
      this.decorationMarkerDestroyedSubscriptions[marker.id].dispose();

      delete this.decorationsByMarkerId[marker.id];
      delete this.decorationMarkerChangedSubscriptions[marker.id];
      delete this.decorationMarkerDestroyedSubscriptions[marker.id];
    }

    /**
     * Removes all the decorations that was created in the current `Minimap`.
     */
  }, {
    key: 'removeAllDecorations',
    value: function removeAllDecorations() {
      for (var id in this.decorationMarkerChangedSubscriptions) {
        this.decorationMarkerChangedSubscriptions[id].dispose();
      }

      for (var id in this.decorationMarkerDestroyedSubscriptions) {
        this.decorationMarkerDestroyedSubscriptions[id].dispose();
      }

      for (var id in this.decorationUpdatedSubscriptions) {
        this.decorationUpdatedSubscriptions[id].dispose();
      }

      for (var id in this.decorationDestroyedSubscriptions) {
        this.decorationDestroyedSubscriptions[id].dispose();
      }

      for (var id in this.decorationsById) {
        this.decorationsById[id].destroy();
      }

      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      this.decorationDestroyedSubscriptions = {};
    }
  }]);

  return DecorationManagement;
})(_mixto2['default']);

exports['default'] = DecorationManagement;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL21pbmltYXAvbGliL21peGlucy9kZWNvcmF0aW9uLW1hbmFnZW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFFa0IsT0FBTzs7OztvQkFDSCxNQUFNOzsyQkFDTCxlQUFlOzs7Ozs7Ozs7OztBQUp0QyxXQUFXLENBQUE7O0lBYVUsb0JBQW9CO1lBQXBCLG9CQUFvQjs7V0FBcEIsb0JBQW9COzBCQUFwQixvQkFBb0I7OytCQUFwQixvQkFBb0I7OztlQUFwQixvQkFBb0I7Ozs7OztXQUtqQixpQ0FBRztBQUN2QixVQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFOzs7Ozs7QUFNeEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO09BQzdCOzs7Ozs7O0FBT0QsVUFBSSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUE7Ozs7OztBQU16QixVQUFJLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFBOzs7Ozs7O0FBTy9CLFVBQUksQ0FBQyxvQ0FBb0MsR0FBRyxFQUFFLENBQUE7Ozs7Ozs7QUFPOUMsVUFBSSxDQUFDLHNDQUFzQyxHQUFHLEVBQUUsQ0FBQTs7Ozs7OztBQU9oRCxVQUFJLENBQUMsOEJBQThCLEdBQUcsRUFBRSxDQUFBOzs7Ozs7O0FBT3hDLFVBQUksQ0FBQyxnQ0FBZ0MsR0FBRyxFQUFFLENBQUE7S0FDM0M7Ozs7Ozs7OztXQU9jLDBCQUFHO0FBQ2hCLFVBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUE7QUFDdEMsVUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFBOztBQUVoQixXQUFLLElBQUksRUFBRSxJQUFJLFdBQVcsRUFBRTtBQUFFLGVBQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7T0FBRTs7QUFFN0QsYUFBTyxPQUFPLENBQUE7S0FDZjs7Ozs7Ozs7Ozs7Ozs7OztXQWNrQiw0QkFBQyxR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YW5hcy8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9taXhpbnMvZGVjb3JhdGlvbi1tYW5hZ2VtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IE1peGluIGZyb20gJ21peHRvJ1xuaW1wb3J0IHtFbWl0dGVyfSBmcm9tICdhdG9tJ1xuaW1wb3J0IERlY29yYXRpb24gZnJvbSAnLi4vZGVjb3JhdGlvbidcblxuLyoqXG4gKiBUaGUgbWl4aW4gdGhhdCBwcm92aWRlcyB0aGUgZGVjb3JhdGlvbnMgQVBJIHRvIHRoZSBtaW5pbWFwIGVkaXRvclxuICogdmlldy5cbiAqXG4gKiBUaGlzIG1peGluIGlzIGluamVjdGVkIGludG8gdGhlIGBNaW5pbWFwYCBwcm90b3R5cGUsIHNvIGV2ZXJ5IG1ldGhvZHMgZGVmaW5lZFxuICogaW4gdGhpcyBmaWxlIHdpbGwgYmUgYXZhaWxhYmxlIG9uIGFueSBgTWluaW1hcGAgaW5zdGFuY2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlY29yYXRpb25NYW5hZ2VtZW50IGV4dGVuZHMgTWl4aW4ge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgZGVjb3JhdGlvbnMgcmVsYXRlZCBwcm9wZXJ0aWVzLlxuICAgKi9cbiAgaW5pdGlhbGl6ZURlY29yYXRpb25zICgpIHtcbiAgICBpZiAodGhpcy5lbWl0dGVyID09IG51bGwpIHtcbiAgICAgIC8qKlxuICAgICAgICogVGhlIG1pbmltYXAgZW1pdHRlciwgbGF6aWx5IGNyZWF0ZWQgaWYgbm90IGNyZWF0ZWQgeWV0LlxuICAgICAgICogQHR5cGUge0VtaXR0ZXJ9XG4gICAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEEgbWFwIHdpdGggdGhlIGRlY29yYXRpb24gaWQgYXMga2V5IGFuZCB0aGUgZGVjb3JhdGlvbiBhcyB2YWx1ZS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZGVjb3JhdGlvbnNCeUlkID0ge31cbiAgICAvKipcbiAgICAgKiBUaGUgZGVjb3JhdGlvbnMgc3RvcmVkIGluIGFuIGFycmF5IGluZGV4ZWQgd2l0aCB0aGVpciBtYXJrZXIgaWQuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRlY29yYXRpb25zQnlNYXJrZXJJZCA9IHt9XG4gICAgLyoqXG4gICAgICogVGhlIHN1YnNjcmlwdGlvbnMgdG8gdGhlIG1hcmtlcnMgYGRpZC1jaGFuZ2VgIGV2ZW50IGluZGV4ZWQgdXNpbmcgdGhlXG4gICAgICogbWFya2VyIGlkLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kZWNvcmF0aW9uTWFya2VyQ2hhbmdlZFN1YnNjcmlwdGlvbnMgPSB7fVxuICAgIC8qKlxuICAgICAqIFRoZSBzdWJzY3JpcHRpb25zIHRvIHRoZSBtYXJrZXJzIGBkaWQtZGVzdHJveWAgZXZlbnQgaW5kZXhlZCB1c2luZyB0aGVcbiAgICAgKiBtYXJrZXIgaWQuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmRlY29yYXRpb25NYXJrZXJEZXN0cm95ZWRTdWJzY3JpcHRpb25zID0ge31cbiAgICAvKipcbiAgICAgKiBUaGUgc3Vic2NyaXB0aW9ucyB0byB0aGUgZGVjb3JhdGlvbnMgYGRpZC1jaGFuZ2UtcHJvcGVydGllc2AgZXZlbnRcbiAgICAgKiBpbmRleGVkIHVzaW5nIHRoZSBkZWNvcmF0aW9uIGlkLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kZWNvcmF0aW9uVXBkYXRlZFN1YnNjcmlwdGlvbnMgPSB7fVxuICAgIC8qKlxuICAgICAqIFRoZSBzdWJzY3JpcHRpb25zIHRvIHRoZSBkZWNvcmF0aW9ucyBgZGlkLWRlc3Ryb3lgIGV2ZW50IGluZGV4ZWQgdXNpbmdcbiAgICAgKiB0aGUgZGVjb3JhdGlvbiBpZC5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZGVjb3JhdGlvbkRlc3Ryb3llZFN1YnNjcmlwdGlvbnMgPSB7fVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYWxsIHRoZSBkZWNvcmF0aW9ucyByZWdpc3RlcmVkIGluIHRoZSBjdXJyZW50IGBNaW5pbWFwYC5cbiAgICpcbiAgICogQHJldHVybiB7QXJyYXk8RGVjb3JhdGlvbj59IGFsbCB0aGUgZGVjb3JhdGlvbnMgaW4gdGhpcyBgTWluaW1hcGBcbiAgICovXG4gIGdldERlY29yYXRpb25zICgpIHtcbiAgICBsZXQgZGVjb3JhdGlvbnMgPSB0aGlzLmRlY29yYXRpb25zQnlJZFxuICAgIGxldCByZXN1bHRzID0gW11cblxuICAgIGZvciAobGV0IGlkIGluIGRlY29yYXRpb25zKSB7IHJlc3VsdHMucHVzaChkZWNvcmF0aW9uc1tpZF0pIH1cblxuICAgIHJldHVybiByZXN1bHRzXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBgZGlkLWFkZC1kZWNvcmF0aW9uYCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZXZlbnQ6T2JqZWN0KTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aCBhbiBldmVudCBvYmplY3Qgd2l0aFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgKiAtIG1hcmtlcjogdGhlIG1hcmtlciBvYmplY3QgdGhhdCB3YXMgZGVjb3JhdGVkXG4gICAqIC0gZGVjb3JhdGlvbjogdGhlIGRlY29yYXRpb24gb2JqZWN0IHRoYXQgd2FzIGNyZWF0ZWRcbiAgICogQHJldHVybiB7RGlzcG9zYWJsZX0gYSBkaXNwb3NhYmxlIHRvIHN0b3AgbGlzdGVuaW5nIHRvIHRoZSBldmVudFxuICAgKi9cbiAgb25EaWRBZGREZWNvcmF0aW9uIChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1hZGQtZGVjb3JhdGlvbicsIGNhbGxiYWNrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgYGRpZC1yZW1vdmUtZGVjb3JhdGlvbmAgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKGV2ZW50Ok9iamVjdCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGggYW4gZXZlbnQgb2JqZWN0IHdpdGhcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBtYXJrZXI6IHRoZSBtYXJrZXIgb2JqZWN0IHRoYXQgd2FzIGRlY29yYXRlZFxuICAgKiAtIGRlY29yYXRpb246IHRoZSBkZWNvcmF0aW9uIG9iamVjdCB0aGF0IHdhcyBjcmVhdGVkXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkUmVtb3ZlRGVjb3JhdGlvbiAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtcmVtb3ZlLWRlY29yYXRpb24nLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtY2hhbmdlLWRlY29yYXRpb25gIGV2ZW50LlxuICAgKlxuICAgKiBUaGlzIGV2ZW50IGlzIHRyaWdnZXJlZCB3aGVuIHRoZSBtYXJrZXIgdGFyZ2V0ZWQgYnkgdGhlIGRlY29yYXRpb25cbiAgICogd2FzIGNoYW5nZWQuXG4gICAqXG4gICAqIEBwYXJhbSAge2Z1bmN0aW9uKGV2ZW50Ok9iamVjdCk6dm9pZH0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgY2FsbGJhY2sgd2lsbCBiZSBjYWxsZWRcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGggYW4gZXZlbnQgb2JqZWN0IHdpdGhcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcbiAgICogLSBtYXJrZXI6IHRoZSBtYXJrZXIgb2JqZWN0IHRoYXQgd2FzIGRlY29yYXRlZFxuICAgKiAtIGRlY29yYXRpb246IHRoZSBkZWNvcmF0aW9uIG9iamVjdCB0aGF0IHdhcyBjcmVhdGVkXG4gICAqIEByZXR1cm4ge0Rpc3Bvc2FibGV9IGEgZGlzcG9zYWJsZSB0byBzdG9wIGxpc3RlbmluZyB0byB0aGUgZXZlbnRcbiAgICovXG4gIG9uRGlkQ2hhbmdlRGVjb3JhdGlvbiAoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLWRlY29yYXRpb24nLCBjYWxsYmFjaylcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGBkaWQtdXBkYXRlLWRlY29yYXRpb25gIGV2ZW50LlxuICAgKlxuICAgKiBUaGlzIGV2ZW50IGlzIHRyaWdnZXJlZCB3aGVuIHRoZSBkZWNvcmF0aW9uIGl0c2VsZiBpcyBtb2RpZmllZC5cbiAgICpcbiAgICogQHBhcmFtICB7ZnVuY3Rpb24oZGVjb3JhdGlvbjpEZWNvcmF0aW9uKTp2b2lkfSBjYWxsYmFjayBhIGZ1bmN0aW9uIHRvIGNhbGxcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGVuIHRoZSBldmVudCBpc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJlZFxuICAgKiBAcmV0dXJuIHtEaXNwb3NhYmxlfSBhIGRpc3Bvc2FibGUgdG8gc3RvcCBsaXN0ZW5pbmcgdG8gdGhlIGV2ZW50XG4gICAqL1xuICBvbkRpZFVwZGF0ZURlY29yYXRpb24gKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZS1kZWNvcmF0aW9uJywgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZGVjb3JhdGlvbiB3aXRoIHRoZSBwYXNzZWQtaW4gaWQuXG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0gaWQgdGhlIGRlY29yYXRpb24gaWRcbiAgICogQHJldHVybiB7RGVjb3JhdGlvbn0gdGhlIGRlY29yYXRpb24gd2l0aCB0aGUgZ2l2ZW4gaWRcbiAgICovXG4gIGRlY29yYXRpb25Gb3JJZCAoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5kZWNvcmF0aW9uc0J5SWRbaWRdXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbGwgdGhlIGRlY29yYXRpb25zIHRoYXQgaW50ZXJzZWN0IHRoZSBwYXNzZWQtaW4gcm93IHJhbmdlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IHN0YXJ0U2NyZWVuUm93IHRoZSBmaXJzdCByb3cgb2YgdGhlIHJhbmdlXG4gICAqIEBwYXJhbSAge251bWJlcn0gZW5kU2NyZWVuUm93IHRoZSBsYXN0IHJvdyBvZiB0aGUgcmFuZ2VcbiAgICogQHJldHVybiB7QXJyYXk8RGVjb3JhdGlvbj59IHRoZSBkZWNvcmF0aW9ucyB0aGF0IGludGVyc2VjdCB0aGUgcGFzc2VkLWluXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYW5nZVxuICAgKi9cbiAgZGVjb3JhdGlvbnNGb3JTY3JlZW5Sb3dSYW5nZSAoc3RhcnRTY3JlZW5Sb3csIGVuZFNjcmVlblJvdykge1xuICAgIGxldCBkZWNvcmF0aW9uc0J5TWFya2VySWQgPSB7fVxuICAgIGxldCBtYXJrZXJzID0gdGhpcy5maW5kTWFya2Vycyh7XG4gICAgICBpbnRlcnNlY3RzU2NyZWVuUm93UmFuZ2U6IFtzdGFydFNjcmVlblJvdywgZW5kU2NyZWVuUm93XVxuICAgIH0pXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbWFya2Vycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGV0IG1hcmtlciA9IG1hcmtlcnNbaV1cbiAgICAgIGxldCBkZWNvcmF0aW9ucyA9IHRoaXMuZGVjb3JhdGlvbnNCeU1hcmtlcklkW21hcmtlci5pZF1cblxuICAgICAgaWYgKGRlY29yYXRpb25zICE9IG51bGwpIHtcbiAgICAgICAgZGVjb3JhdGlvbnNCeU1hcmtlcklkW21hcmtlci5pZF0gPSBkZWNvcmF0aW9uc1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWNvcmF0aW9uc0J5TWFya2VySWRcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBkZWNvcmF0aW9ucyB0aGF0IGludGVyc2VjdHMgdGhlIHBhc3NlZC1pbiByb3cgcmFuZ2VcbiAgICogaW4gYSBzdHJ1Y3R1cmVkIHdheS5cbiAgICpcbiAgICogQXQgdGhlIGZpcnN0IGxldmVsLCB0aGUga2V5cyBhcmUgdGhlIGF2YWlsYWJsZSBkZWNvcmF0aW9uIHR5cGVzLlxuICAgKiBBdCB0aGUgc2Vjb25kIGxldmVsLCB0aGUga2V5cyBhcmUgdGhlIHJvdyBpbmRleCBmb3Igd2hpY2ggdGhlcmVcbiAgICogYXJlIGRlY29yYXRpb25zIGF2YWlsYWJsZS4gVGhlIHZhbHVlIGlzIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlXG4gICAqIGRlY29yYXRpb25zIHRoYXQgaW50ZXJzZWN0cyB3aXRoIHRoZSBjb3JyZXNwb25kaW5nIHJvdy5cbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGUgZGVjb3JhdGlvbnMgZ3JvdXBlZCBieSB0eXBlIGFuZCB0aGVuIHJvd3NcbiAgICogQHByb3BlcnR5IHtPYmplY3R9IGxpbmUgYWxsIHRoZSBsaW5lIGRlY29yYXRpb25zIGJ5IHJvd1xuICAgKiBAcHJvcGVydHkge0FycmF5PERlY29yYXRpb24+fSBsaW5lW3Jvd10gYWxsIHRoZSBsaW5lIGRlY29yYXRpb25zXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXQgYSBnaXZlbiByb3dcbiAgICogQHByb3BlcnR5IHtPYmplY3R9IGhpZ2hsaWdodC11bmRlciBhbGwgdGhlIGhpZ2hsaWdodC11bmRlciBkZWNvcmF0aW9uc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5IHJvd1xuICAgKiBAcHJvcGVydHkge0FycmF5PERlY29yYXRpb24+fSBoaWdobGlnaHQtdW5kZXJbcm93XSBhbGwgdGhlIGhpZ2hsaWdodC11bmRlclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY29yYXRpb25zIGF0IGEgZ2l2ZW4gcm93XG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBoaWdobGlnaHQtb3ZlciBhbGwgdGhlIGhpZ2hsaWdodC1vdmVyIGRlY29yYXRpb25zXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnkgcm93XG4gICAqIEBwcm9wZXJ0eSB7QXJyYXk8RGVjb3JhdGlvbj59IGhpZ2hsaWdodC1vdmVyW3Jvd10gYWxsIHRoZSBoaWdobGlnaHQtb3ZlclxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY29yYXRpb25zIGF0IGEgZ2l2ZW4gcm93XG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBoaWdobGlnaHQtb3V0aW5lIGFsbCB0aGUgaGlnaGxpZ2h0LW91dGluZSBkZWNvcmF0aW9uc1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5IHJvd1xuICAgKiBAcHJvcGVydHkge0FycmF5PERlY29yYXRpb24+fSBoaWdobGlnaHQtb3V0aW5lW3Jvd10gYWxsIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodC1vdXRpbmUgZGVjb3JhdGlvbnMgYXQgYSBnaXZlblxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd1xuICAgKi9cbiAgZGVjb3JhdGlvbnNCeVR5cGVUaGVuUm93cyAoKSB7XG4gICAgaWYgKHRoaXMuZGVjb3JhdGlvbnNCeVR5cGVUaGVuUm93c0NhY2hlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLmRlY29yYXRpb25zQnlUeXBlVGhlblJvd3NDYWNoZVxuICAgIH1cblxuICAgIGxldCBjYWNoZSA9IHt9XG4gICAgZm9yIChsZXQgaWQgaW4gdGhpcy5kZWNvcmF0aW9uc0J5SWQpIHtcbiAgICAgIGxldCBkZWNvcmF0aW9uID0gdGhpcy5kZWNvcmF0aW9uc0J5SWRbaWRdXG4gICAgICBsZXQgcmFuZ2UgPSBkZWNvcmF0aW9uLm1hcmtlci5nZXRTY3JlZW5SYW5nZSgpXG4gICAgICBsZXQgdHlwZSA9IGRlY29yYXRpb24uZ2V0UHJvcGVydGllcygpLnR5cGVcblxuICAgICAgaWYgKGNhY2hlW3R5cGVdID09IG51bGwpIHsgY2FjaGVbdHlwZV0gPSB7fSB9XG5cbiAgICAgIGZvciAobGV0IHJvdyA9IHJhbmdlLnN0YXJ0LnJvdywgbGVuID0gcmFuZ2UuZW5kLnJvdzsgcm93IDw9IGxlbjsgcm93KyspIHtcbiAgICAgICAgaWYgKGNhY2hlW3R5cGVdW3Jvd10gPT0gbnVsbCkgeyBjYWNoZVt0eXBlXVtyb3ddID0gW10gfVxuXG4gICAgICAgIGNhY2hlW3R5cGVdW3Jvd10ucHVzaChkZWNvcmF0aW9uKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBncm91cGVkIGRlY29yYXRpb25zIGNhY2hlLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5kZWNvcmF0aW9uc0J5VHlwZVRoZW5Sb3dzQ2FjaGUgPSBjYWNoZVxuICAgIHJldHVybiBjYWNoZVxuICB9XG5cbiAgLyoqXG4gICAqIEludmFsaWRhdGVzIHRoZSBkZWNvcmF0aW9uIGJ5IHNjcmVlbiByb3dzIGNhY2hlLlxuICAgKi9cbiAgaW52YWxpZGF0ZURlY29yYXRpb25Gb3JTY3JlZW5Sb3dzQ2FjaGUgKCkge1xuICAgIHRoaXMuZGVjb3JhdGlvbnNCeVR5cGVUaGVuUm93c0NhY2hlID0gbnVsbFxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBkZWNvcmF0aW9uIHRoYXQgdHJhY2tzIGEgYE1hcmtlcmAuIFdoZW4gdGhlIG1hcmtlciBtb3ZlcyxcbiAgICogaXMgaW52YWxpZGF0ZWQsIG9yIGlzIGRlc3Ryb3llZCwgdGhlIGRlY29yYXRpb24gd2lsbCBiZSB1cGRhdGVkIHRvIHJlZmxlY3RcbiAgICogdGhlIG1hcmtlcidzIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0gIHtNYXJrZXJ9IG1hcmtlciB0aGUgbWFya2VyIHlvdSB3YW50IHRoaXMgZGVjb3JhdGlvbiB0byBmb2xsb3dcbiAgICogQHBhcmFtICB7T2JqZWN0fSBkZWNvcmF0aW9uUGFyYW1zIHRoZSBkZWNvcmF0aW9uIHByb3BlcnRpZXNcbiAgICogQHBhcmFtICB7c3RyaW5nfSBkZWNvcmF0aW9uUGFyYW1zLnR5cGUgdGhlIGRlY29yYXRpb24gdHlwZSBpbiB0aGUgZm9sbG93aW5nXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3Q6XG4gICAqIC0gX19saW5lX186IEZpbGxzIHRoZSBsaW5lIGJhY2tncm91bmQgd2l0aCB0aGUgZGVjb3JhdGlvbiBjb2xvci5cbiAgICogLSBfX2hpZ2hsaWdodF9fOiBSZW5kZXJzIGEgY29sb3JlZCByZWN0YW5nbGUgb24gdGhlIG1pbmltYXAuIFRoZSBoaWdobGlnaHRcbiAgICogICBpcyByZW5kZXJlZCBhYm92ZSB0aGUgbGluZSdzIHRleHQuXG4gICAqIC0gX19oaWdobGlnaHQtb3Zlcl9fOiBTYW1lIGFzIF9faGlnaGxpZ2h0X18uXG4gICAqIC0gX19oaWdobGlnaHQtdW5kZXJfXzogUmVuZGVycyBhIGNvbG9yZWQgcmVjdGFuZ2xlIG9uIHRoZSBtaW5pbWFwLiBUaGVcbiAgICogICBoaWdobGlnaHQgaXMgcmVuZGVyZWQgYmVsb3cgdGhlIGxpbmUncyB0ZXh0LlxuICAgKiAtIF9faGlnaGxpZ2h0LW91dGxpbmVfXzogUmVuZGVycyBhIGNvbG9yZWQgb3V0bGluZSBvbiB0aGUgbWluaW1hcC4gVGhlXG4gICAqICAgaGlnaGxpZ2h0IGJveCBpcyByZW5kZXJlZCBhYm92ZSB0aGUgbGluZSdzIHRleHQuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gZGVjb3JhdGlvblBhcmFtcy5jbGFzcyB0aGUgQ1NTIGNsYXNzIHRvIHVzZSB0byByZXRyaWV2ZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgYmFja2dyb3VuZCBjb2xvciBvZiB0aGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjb3JhdGlvbiBieSBidWlsZGluZyBhIHNjb3BcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVzcG9uZGluZyB0b1xuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgLm1pbmltYXAgLmVkaXRvciA8eW91ci1jbGFzcz5gXG4gICAqIEBwYXJhbSAge3N0cmluZ30gZGVjb3JhdGlvblBhcmFtcy5zY29wZSB0aGUgc2NvcGUgdG8gdXNlIHRvIHJldHJpZXZlIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWNvcmF0aW9uIGJhY2tncm91bmQuIE5vdGUgdGhhdCBpZlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGUgYHNjb3BlYCBwcm9wZXJ0eSBpcyBzZXQsIHRoZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgY2xhc3NgIHdvbid0IGJlIHVzZWQuXG4gICAqIEBwYXJhbSAge3N0cmluZ30gZGVjb3JhdGlvblBhcmFtcy5jb2xvciB0aGUgQ1NTIGNvbG9yIHRvIHVzZSB0byByZW5kZXIgdGhlXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY29yYXRpb24uIFdoZW4gc2V0LCBuZWl0aGVyXG4gICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBzY29wZWAgbm9yIGBjbGFzc2AgYXJlIHVzZWQuXG4gICAqIEByZXR1cm4ge0RlY29yYXRpb259IHRoZSBjcmVhdGVkIGRlY29yYXRpb25cbiAgICogQGVtaXRzICB7ZGlkLWFkZC1kZWNvcmF0aW9ufSB3aGVuIHRoZSBkZWNvcmF0aW9uIGlzIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5XG4gICAqIEBlbWl0cyAge2RpZC1jaGFuZ2V9IHdoZW4gdGhlIGRlY29yYXRpb24gaXMgY3JlYXRlZCBzdWNjZXNzZnVsbHlcbiAgICovXG4gIGRlY29yYXRlTWFya2VyIChtYXJrZXIsIGRlY29yYXRpb25QYXJhbXMpIHtcbiAgICBpZiAodGhpcy5kZXN0cm95ZWQgfHwgbWFya2VyID09IG51bGwpIHsgcmV0dXJuIH1cblxuICAgIGxldCB7aWR9ID0gbWFya2VyXG5cbiAgICBpZiAoZGVjb3JhdGlvblBhcmFtcy50eXBlID09PSAnaGlnaGxpZ2h0Jykge1xuICAgICAgZGVjb3JhdGlvblBhcmFtcy50eXBlID0gJ2hpZ2hsaWdodC1vdmVyJ1xuICAgIH1cblxuICAgIGlmIChkZWNvcmF0aW9uUGFyYW1zLnNjb3BlID09IG51bGwgJiYgZGVjb3JhdGlvblBhcmFtc1snY2xhc3MnXSAhPSBudWxsKSB7XG4gICAgICBsZXQgY2xzID0gZGVjb3JhdGlvblBhcmFtc1snY2xhc3MnXS5zcGxpdCgnICcpLmpvaW4oJy4nKVxuICAgICAgZGVjb3JhdGlvblBhcmFtcy5zY29wZSA9IGAubWluaW1hcCAuJHtjbHN9YFxuICAgIH1cblxuICAgIGlmICh0aGlzLmRlY29yYXRpb25NYXJrZXJEZXN0cm95ZWRTdWJzY3JpcHRpb25zW2lkXSA9PSBudWxsKSB7XG4gICAgICB0aGlzLmRlY29yYXRpb25NYXJrZXJEZXN0cm95ZWRTdWJzY3JpcHRpb25zW2lkXSA9XG4gICAgICBtYXJrZXIub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgdGhpcy5yZW1vdmVBbGxEZWNvcmF0aW9uc0Zvck1hcmtlcihtYXJrZXIpXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmICh0aGlzLmRlY29yYXRpb25NYXJrZXJDaGFuZ2VkU3Vic2NyaXB0aW9uc1tpZF0gPT0gbnVsbCkge1xuICAgICAgdGhpcy5kZWNvcmF0aW9uTWFya2VyQ2hhbmdlZFN1YnNjcmlwdGlvbnNbaWRdID1cbiAgICAgIG1hcmtlci5vbkRpZENoYW5nZSgoZXZlbnQpID0+IHtcbiAgICAgICAgbGV0IGRlY29yYXRpb25zID0gdGhpcy5kZWNvcmF0aW9uc0J5TWFya2VySWRbaWRdXG5cbiAgICAgICAgdGhpcy5pbnZhbGlkYXRlRGVjb3JhdGlvbkZvclNjcmVlblJvd3NDYWNoZSgpXG5cbiAgICAgICAgaWYgKGRlY29yYXRpb25zICE9IG51bGwpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gZGVjb3JhdGlvbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkZWNvcmF0aW9uID0gZGVjb3JhdGlvbnNbaV1cbiAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWRlY29yYXRpb24nLCB7XG4gICAgICAgICAgICAgIG1hcmtlcjogbWFya2VyLFxuICAgICAgICAgICAgICBkZWNvcmF0aW9uOiBkZWNvcmF0aW9uLFxuICAgICAgICAgICAgICBldmVudDogZXZlbnRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBvbGRTdGFydCA9IGV2ZW50Lm9sZFRhaWxTY3JlZW5Qb3NpdGlvblxuICAgICAgICBsZXQgb2xkRW5kID0gZXZlbnQub2xkSGVhZFNjcmVlblBvc2l0aW9uXG4gICAgICAgIGxldCBuZXdTdGFydCA9IGV2ZW50Lm5ld1RhaWxTY3JlZW5Qb3NpdGlvblxuICAgICAgICBsZXQgbmV3RW5kID0gZXZlbnQubmV3SGVhZFNjcmVlblBvc2l0aW9uXG5cbiAgICAgICAgaWYgKG9sZFN0YXJ0LnJvdyA+IG9sZEVuZC5yb3cpIHtcbiAgICAgICAgICBbb2xkU3RhcnQsIG9sZEVuZF0gPSBbb2xkRW5kLCBvbGRTdGFydF1cbiAgICAgICAgfVxuICAgICAgICBpZiAobmV3U3RhcnQucm93ID4gbmV3RW5kLnJvdykge1xuICAgICAgICAgIFtuZXdTdGFydCwgbmV3RW5kXSA9IFtuZXdFbmQsIG5ld1N0YXJ0XVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJhbmdlc0RpZmZzID0gdGhpcy5jb21wdXRlUmFuZ2VzRGlmZnMoXG4gICAgICAgICAgb2xkU3RhcnQsIG9sZEVuZCxcbiAgICAgICAgICBuZXdTdGFydCwgbmV3RW5kXG4gICAgICAgIClcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gcmFuZ2VzRGlmZnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBsZXQgW3N0YXJ0LCBlbmRdID0gcmFuZ2VzRGlmZnNbaV1cbiAgICAgICAgICB0aGlzLmVtaXRSYW5nZUNoYW5nZXMoe1xuICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICAgICAgZW5kOiBlbmRcbiAgICAgICAgICB9LCAwKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIGxldCBkZWNvcmF0aW9uID0gbmV3IERlY29yYXRpb24obWFya2VyLCB0aGlzLCBkZWNvcmF0aW9uUGFyYW1zKVxuXG4gICAgaWYgKHRoaXMuZGVjb3JhdGlvbnNCeU1hcmtlcklkW2lkXSA9PSBudWxsKSB7XG4gICAgICB0aGlzLmRlY29yYXRpb25zQnlNYXJrZXJJZFtpZF0gPSBbXVxuICAgIH1cblxuICAgIHRoaXMuZGVjb3JhdGlvbnNCeU1hcmtlcklkW2lkXS5wdXNoKGRlY29yYXRpb24pXG4gICAgdGhpcy5kZWNvcmF0aW9uc0J5SWRbZGVjb3JhdGlvbi5pZF0gPSBkZWNvcmF0aW9uXG5cbiAgICBpZiAodGhpcy5kZWNvcmF0aW9uVXBkYXRlZFN1YnNjcmlwdGlvbnNbZGVjb3JhdGlvbi5pZF0gPT0gbnVsbCkge1xuICAgICAgdGhpcy5kZWNvcmF0aW9uVXBkYXRlZFN1YnNjcmlwdGlvbnNbZGVjb3JhdGlvbi5pZF0gPVxuICAgICAgZGVjb3JhdGlvbi5vbkRpZENoYW5nZVByb3BlcnRpZXMoKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdERlY29yYXRpb25DaGFuZ2VzKGRlY29yYXRpb24pXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuZGVjb3JhdGlvbkRlc3Ryb3llZFN1YnNjcmlwdGlvbnNbZGVjb3JhdGlvbi5pZF0gPVxuICAgIGRlY29yYXRpb24ub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlRGVjb3JhdGlvbihkZWNvcmF0aW9uKVxuICAgIH0pXG5cbiAgICB0aGlzLmVtaXREZWNvcmF0aW9uQ2hhbmdlcyhkZWNvcmF0aW9uKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtYWRkLWRlY29yYXRpb24nLCB7XG4gICAgICBtYXJrZXI6IG1hcmtlcixcbiAgICAgIGRlY29yYXRpb246IGRlY29yYXRpb25cbiAgICB9KVxuXG4gICAgcmV0dXJuIGRlY29yYXRpb25cbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiB0d28gcmFuZ2VzLCBpdCByZXR1cm5zIGFuIGFycmF5IG9mIHJhbmdlcyByZXByZXNlbnRpbmcgdGhlXG4gICAqIGRpZmZlcmVuY2VzIGJldHdlZW4gdGhlbS5cbiAgICpcbiAgICogQHBhcmFtICB7bnVtYmVyfSBvbGRTdGFydCB0aGUgcm93IGluZGV4IG9mIHRoZSBmaXJzdCByYW5nZSBzdGFydFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IG9sZEVuZCB0aGUgcm93IGluZGV4IG9mIHRoZSBmaXJzdCByYW5nZSBlbmRcbiAgICogQHBhcmFtICB7bnVtYmVyfSBuZXdTdGFydCB0aGUgcm93IGluZGV4IG9mIHRoZSBzZWNvbmQgcmFuZ2Ugc3RhcnRcbiAgICogQHBhcmFtICB7bnVtYmVyfSBuZXdFbmQgdGhlIHJvdyBpbmRleCBvZiB0aGUgc2Vjb25kIHJhbmdlIGVuZFxuICAgKiBAcmV0dXJuIHtBcnJheTxPYmplY3Q+fSB0aGUgYXJyYXkgb2YgZGlmZiByYW5nZXNcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBjb21wdXRlUmFuZ2VzRGlmZnMgKG9sZFN0YXJ0LCBvbGRFbmQsIG5ld1N0YXJ0LCBuZXdFbmQpIHtcbiAgICBsZXQgZGlmZnMgPSBbXVxuXG4gICAgaWYgKG9sZFN0YXJ0LmlzTGVzc1RoYW4obmV3U3RhcnQpKSB7XG4gICAgICBkaWZmcy5wdXNoKFtvbGRTdGFydCwgbmV3U3RhcnRdKVxuICAgIH0gZWxzZSBpZiAobmV3U3RhcnQuaXNMZXNzVGhhbihvbGRTdGFydCkpIHtcbiAgICAgIGRpZmZzLnB1c2goW25ld1N0YXJ0LCBvbGRTdGFydF0pXG4gICAgfVxuXG4gICAgaWYgKG9sZEVuZC5pc0xlc3NUaGFuKG5ld0VuZCkpIHtcbiAgICAgIGRpZmZzLnB1c2goW29sZEVuZCwgbmV3RW5kXSlcbiAgICB9IGVsc2UgaWYgKG5ld0VuZC5pc0xlc3NUaGFuKG9sZEVuZCkpIHtcbiAgICAgIGRpZmZzLnB1c2goW25ld0VuZCwgb2xkRW5kXSlcbiAgICB9XG5cbiAgICByZXR1cm4gZGlmZnNcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyBhIGNoYW5nZSBpbiB0aGUgYE1pbmltYXBgIGNvcnJlc3BvbmRpbmcgdG8gdGhlXG4gICAqIHBhc3NlZC1pbiBkZWNvcmF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gIHtEZWNvcmF0aW9ufSBkZWNvcmF0aW9uIHRoZSBkZWNvcmF0aW9uIGZvciB3aGljaCBlbWl0dGluZyBhbiBldmVudFxuICAgKiBAYWNjZXNzIHByaXZhdGVcbiAgICovXG4gIGVtaXREZWNvcmF0aW9uQ2hhbmdlcyAoZGVjb3JhdGlvbikge1xuICAgIGlmIChkZWNvcmF0aW9uLm1hcmtlci5kaXNwbGF5QnVmZmVyLmlzRGVzdHJveWVkKCkpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuaW52YWxpZGF0ZURlY29yYXRpb25Gb3JTY3JlZW5Sb3dzQ2FjaGUoKVxuXG4gICAgbGV0IHJhbmdlID0gZGVjb3JhdGlvbi5tYXJrZXIuZ2V0U2NyZWVuUmFuZ2UoKVxuICAgIGlmIChyYW5nZSA9PSBudWxsKSB7IHJldHVybiB9XG5cbiAgICB0aGlzLmVtaXRSYW5nZUNoYW5nZXMocmFuZ2UsIDApXG4gIH1cblxuICAvKipcbiAgICogRW1pdHMgYSBjaGFuZ2UgZm9yIHRoZSBzcGVjaWZpZWQgcmFuZ2UuXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gcmFuZ2UgdGhlIHJhbmdlIHdoZXJlIGNoYW5nZXMgb2NjdXJlZFxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IFtzY3JlZW5EZWx0YV0gYW4gb3B0aW9uYWwgc2NyZWVuIGRlbHRhIGZvciB0aGVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZSBvYmplY3RcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICBlbWl0UmFuZ2VDaGFuZ2VzIChyYW5nZSwgc2NyZWVuRGVsdGEpIHtcbiAgICBsZXQgc3RhcnRTY3JlZW5Sb3cgPSByYW5nZS5zdGFydC5yb3dcbiAgICBsZXQgZW5kU2NyZWVuUm93ID0gcmFuZ2UuZW5kLnJvd1xuICAgIGxldCBsYXN0UmVuZGVyZWRTY3JlZW5Sb3cgPSB0aGlzLmdldExhc3RWaXNpYmxlU2NyZWVuUm93KClcbiAgICBsZXQgZmlyc3RSZW5kZXJlZFNjcmVlblJvdyA9IHRoaXMuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93KClcblxuICAgIGlmIChzY3JlZW5EZWx0YSA9PSBudWxsKSB7XG4gICAgICBzY3JlZW5EZWx0YSA9IChsYXN0UmVuZGVyZWRTY3JlZW5Sb3cgLSBmaXJzdFJlbmRlcmVkU2NyZWVuUm93KSAtXG4gICAgICAgICAgICAgICAgICAgIChlbmRTY3JlZW5Sb3cgLSBzdGFydFNjcmVlblJvdylcbiAgICB9XG5cbiAgICBsZXQgY2hhbmdlRXZlbnQgPSB7XG4gICAgICBzdGFydDogc3RhcnRTY3JlZW5Sb3csXG4gICAgICBlbmQ6IGVuZFNjcmVlblJvdyxcbiAgICAgIHNjcmVlbkRlbHRhOiBzY3JlZW5EZWx0YVxuICAgIH1cblxuICAgIHRoaXMuZW1pdENoYW5nZXMoY2hhbmdlRXZlbnQpXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIGBEZWNvcmF0aW9uYCBmcm9tIHRoaXMgbWluaW1hcC5cbiAgICpcbiAgICogQHBhcmFtICB7RGVjb3JhdGlvbn0gZGVjb3JhdGlvbiB0aGUgZGVjb3JhdGlvbiB0byByZW1vdmVcbiAgICogQGVtaXRzICB7ZGlkLWNoYW5nZX0gd2hlbiB0aGUgZGVjb3JhdGlvbiBpcyByZW1vdmVkXG4gICAqIEBlbWl0cyAge2RpZC1yZW1vdmUtZGVjb3JhdGlvbn0gd2hlbiB0aGUgZGVjb3JhdGlvbiBpcyByZW1vdmVkXG4gICAqL1xuICByZW1vdmVEZWNvcmF0aW9uIChkZWNvcmF0aW9uKSB7XG4gICAgaWYgKGRlY29yYXRpb24gPT0gbnVsbCkgeyByZXR1cm4gfVxuXG4gICAgbGV0IG1hcmtlciA9IGRlY29yYXRpb24ubWFya2VyXG4gICAgbGV0IHN1YnNjcmlwdGlvblxuXG4gICAgZGVsZXRlIHRoaXMuZGVjb3JhdGlvbnNCeUlkW2RlY29yYXRpb24uaWRdXG5cbiAgICBzdWJzY3JpcHRpb24gPSB0aGlzLmRlY29yYXRpb25VcGRhdGVkU3Vic2NyaXB0aW9uc1tkZWNvcmF0aW9uLmlkXVxuICAgIGlmIChzdWJzY3JpcHRpb24gIT0gbnVsbCkgeyBzdWJzY3JpcHRpb24uZGlzcG9zZSgpIH1cblxuICAgIHN1YnNjcmlwdGlvbiA9IHRoaXMuZGVjb3JhdGlvbkRlc3Ryb3llZFN1YnNjcmlwdGlvbnNbZGVjb3JhdGlvbi5pZF1cbiAgICBpZiAoc3Vic2NyaXB0aW9uICE9IG51bGwpIHsgc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKSB9XG5cbiAgICBkZWxldGUgdGhpcy5kZWNvcmF0aW9uVXBkYXRlZFN1YnNjcmlwdGlvbnNbZGVjb3JhdGlvbi5pZF1cbiAgICBkZWxldGUgdGhpcy5kZWNvcmF0aW9uRGVzdHJveWVkU3Vic2NyaXB0aW9uc1tkZWNvcmF0aW9uLmlkXVxuXG4gICAgbGV0IGRlY29yYXRpb25zID0gdGhpcy5kZWNvcmF0aW9uc0J5TWFya2VySWRbbWFya2VyLmlkXVxuICAgIGlmICghZGVjb3JhdGlvbnMpIHsgcmV0dXJuIH1cblxuICAgIHRoaXMuZW1pdERlY29yYXRpb25DaGFuZ2VzKGRlY29yYXRpb24pXG5cbiAgICBsZXQgaW5kZXggPSBkZWNvcmF0aW9ucy5pbmRleE9mKGRlY29yYXRpb24pXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIGRlY29yYXRpb25zLnNwbGljZShpbmRleCwgMSlcblxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1yZW1vdmUtZGVjb3JhdGlvbicsIHtcbiAgICAgICAgbWFya2VyOiBtYXJrZXIsXG4gICAgICAgIGRlY29yYXRpb246IGRlY29yYXRpb25cbiAgICAgIH0pXG5cbiAgICAgIGlmIChkZWNvcmF0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5yZW1vdmVkQWxsTWFya2VyRGVjb3JhdGlvbnMobWFya2VyKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGFsbCB0aGUgZGVjb3JhdGlvbnMgcmVnaXN0ZXJlZCBmb3IgdGhlIHBhc3NlZC1pbiBtYXJrZXIuXG4gICAqXG4gICAqIEBwYXJhbSAge01hcmtlcn0gbWFya2VyIHRoZSBtYXJrZXIgZm9yIHdoaWNoIHJlbW92aW5nIGl0cyBkZWNvcmF0aW9uc1xuICAgKiBAZW1pdHMgIHtkaWQtY2hhbmdlfSB3aGVuIGEgZGVjb3JhdGlvbiBoYXZlIGJlZW4gcmVtb3ZlZFxuICAgKiBAZW1pdHMgIHtkaWQtcmVtb3ZlLWRlY29yYXRpb259IHdoZW4gYSBkZWNvcmF0aW9uIGhhdmUgYmVlbiByZW1vdmVkXG4gICAqL1xuICByZW1vdmVBbGxEZWNvcmF0aW9uc0Zvck1hcmtlciAobWFya2VyKSB7XG4gICAgaWYgKG1hcmtlciA9PSBudWxsKSB7IHJldHVybiB9XG5cbiAgICBsZXQgZGVjb3JhdGlvbnMgPSB0aGlzLmRlY29yYXRpb25zQnlNYXJrZXJJZFttYXJrZXIuaWRdXG4gICAgaWYgKCFkZWNvcmF0aW9ucykgeyByZXR1cm4gfVxuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGRlY29yYXRpb25zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgZGVjb3JhdGlvbiA9IGRlY29yYXRpb25zW2ldXG5cbiAgICAgIHRoaXMuZW1pdERlY29yYXRpb25DaGFuZ2VzKGRlY29yYXRpb24pXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXJlbW92ZS1kZWNvcmF0aW9uJywge1xuICAgICAgICBtYXJrZXI6IG1hcmtlcixcbiAgICAgICAgZGVjb3JhdGlvbjogZGVjb3JhdGlvblxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLnJlbW92ZWRBbGxNYXJrZXJEZWNvcmF0aW9ucyhtYXJrZXIpXG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgdGhlIHJlbW92YWwgb2YgYSBkZWNvcmF0aW9uIGZvciBhIGdpdmVuIG1hcmtlci5cbiAgICpcbiAgICogQHBhcmFtICB7TWFya2VyfSBtYXJrZXIgdGhlIG1hcmtlciBmb3Igd2hpY2ggcmVtb3ZpbmcgZGVjb3JhdGlvbnNcbiAgICogQGFjY2VzcyBwcml2YXRlXG4gICAqL1xuICByZW1vdmVkQWxsTWFya2VyRGVjb3JhdGlvbnMgKG1hcmtlcikge1xuICAgIGlmIChtYXJrZXIgPT0gbnVsbCkgeyByZXR1cm4gfVxuXG4gICAgdGhpcy5kZWNvcmF0aW9uTWFya2VyQ2hhbmdlZFN1YnNjcmlwdGlvbnNbbWFya2VyLmlkXS5kaXNwb3NlKClcbiAgICB0aGlzLmRlY29yYXRpb25NYXJrZXJEZXN0cm95ZWRTdWJzY3JpcHRpb25zW21hcmtlci5pZF0uZGlzcG9zZSgpXG5cbiAgICBkZWxldGUgdGhpcy5kZWNvcmF0aW9uc0J5TWFya2VySWRbbWFya2VyLmlkXVxuICAgIGRlbGV0ZSB0aGlzLmRlY29yYXRpb25NYXJrZXJDaGFuZ2VkU3Vic2NyaXB0aW9uc1ttYXJrZXIuaWRdXG4gICAgZGVsZXRlIHRoaXMuZGVjb3JhdGlvbk1hcmtlckRlc3Ryb3llZFN1YnNjcmlwdGlvbnNbbWFya2VyLmlkXVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIHRoZSBkZWNvcmF0aW9ucyB0aGF0IHdhcyBjcmVhdGVkIGluIHRoZSBjdXJyZW50IGBNaW5pbWFwYC5cbiAgICovXG4gIHJlbW92ZUFsbERlY29yYXRpb25zICgpIHtcbiAgICBmb3IgKGxldCBpZCBpbiB0aGlzLmRlY29yYXRpb25NYXJrZXJDaGFuZ2VkU3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5kZWNvcmF0aW9uTWFya2VyQ2hhbmdlZFN1YnNjcmlwdGlvbnNbaWRdLmRpc3Bvc2UoKVxuICAgIH1cblxuICAgIGZvciAobGV0IGlkIGluIHRoaXMuZGVjb3JhdGlvbk1hcmtlckRlc3Ryb3llZFN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuZGVjb3JhdGlvbk1hcmtlckRlc3Ryb3llZFN1YnNjcmlwdGlvbnNbaWRdLmRpc3Bvc2UoKVxuICAgIH1cblxuICAgIGZvciAobGV0IGlkIGluIHRoaXMuZGVjb3JhdGlvblVwZGF0ZWRTdWJzY3JpcHRpb25zKSB7XG4gICAgICB0aGlzLmRlY29yYXRpb25VcGRhdGVkU3Vic2NyaXB0aW9uc1tpZF0uZGlzcG9zZSgpXG4gICAgfVxuXG4gICAgZm9yIChsZXQgaWQgaW4gdGhpcy5kZWNvcmF0aW9uRGVzdHJveWVkU3Vic2NyaXB0aW9ucykge1xuICAgICAgdGhpcy5kZWNvcmF0aW9uRGVzdHJveWVkU3Vic2NyaXB0aW9uc1tpZF0uZGlzcG9zZSgpXG4gICAgfVxuXG4gICAgZm9yIChsZXQgaWQgaW4gdGhpcy5kZWNvcmF0aW9uc0J5SWQpIHtcbiAgICAgIHRoaXMuZGVjb3JhdGlvbnNCeUlkW2lkXS5kZXN0cm95KClcbiAgICB9XG5cbiAgICB0aGlzLmRlY29yYXRpb25zQnlJZCA9IHt9XG4gICAgdGhpcy5kZWNvcmF0aW9uc0J5TWFya2VySWQgPSB7fVxuICAgIHRoaXMuZGVjb3JhdGlvbk1hcmtlckNoYW5nZWRTdWJzY3JpcHRpb25zID0ge31cbiAgICB0aGlzLmRlY29yYXRpb25NYXJrZXJEZXN0cm95ZWRTdWJzY3JpcHRpb25zID0ge31cbiAgICB0aGlzLmRlY29yYXRpb25VcGRhdGVkU3Vic2NyaXB0aW9ucyA9IHt9XG4gICAgdGhpcy5kZWNvcmF0aW9uRGVzdHJveWVkU3Vic2NyaXB0aW9ucyA9IHt9XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/anas/.atom/packages/minimap/lib/mixins/decoration-management.js
