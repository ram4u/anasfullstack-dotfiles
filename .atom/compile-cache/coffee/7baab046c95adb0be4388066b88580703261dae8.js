(function() {
  var fuzzy, levenshtein;

  fuzzy = {};

  module.exports = fuzzy;

  fuzzy.simpleFilter = function(pattern, array) {
    return array.filter(function(string) {
      return fuzzy.test(pattern, string);
    });
  };

  fuzzy.test = function(pattern, string) {
    return fuzzy.match(pattern, string) !== null;
  };

  fuzzy.match = function(pattern, string, opts) {
    var ch, compareChar, compareString, currScore, idx, len, patternIdx, post, pre, result, totalScore;
    if (opts == null) {
      opts = {};
    }
    patternIdx = 0;
    result = [];
    len = string.length;
    totalScore = 0;
    currScore = 0;
    pre = opts.pre || "";
    post = opts.post || "";
    compareString = opts.caseSensitive && string || string.toLowerCase();
    ch = void 0;
    compareChar = void 0;
    pattern = opts.caseSensitive && pattern || pattern.toLowerCase();
    idx = 0;
    while (idx < len) {
      if (pattern[patternIdx] === ' ') {
        patternIdx++;
      }
      ch = string[idx];
      if (compareString[idx] === pattern[patternIdx]) {
        ch = pre + ch + post;
        patternIdx += 1;
        currScore += 1 + currScore;
      } else {
        currScore = 0;
      }
      totalScore += currScore;
      result[result.length] = ch;
      idx++;
    }
    if (patternIdx === pattern.length) {
      return {
        rendered: result.join(""),
        score: totalScore
      };
    }
  };

  fuzzy.filter = function(pattern, arr, opts) {
    var highlighted;
    if (opts == null) {
      opts = {};
    }
    highlighted = arr.reduce(function(prev, element, idx, arr) {
      var rendered, str;
      str = element;
      if (opts.extract) {
        str = opts.extract(element);
      }
      rendered = fuzzy.match(pattern, str, opts);
      if (rendered != null) {
        prev[prev.length] = {
          string: rendered.rendered,
          score: rendered.score,
          index: idx,
          original: element
        };
      }
      return prev;
    }, []).sort(function(a, b) {
      var compare;
      compare = b.score - a.score;
      if (compare === 0) {
        if (opts.extract) {
          return opts.extract(a.original).length - opts.extract(b.original).length;
        }
        return a.original.length - b.original.length;
      }
      if (compare) {
        return compare;
      }
      return a.index - b.index;
    });
    if (highlighted.length < 1) {
      highlighted = arr.reduce(function(prev, element, idx, arr) {
        var str;
        str = element;
        if (opts.extract) {
          str = opts.extract(element);
        }
        prev[prev.length] = {
          string: str,
          score: levenshtein(pattern, str),
          index: idx,
          original: element
        };
        return prev;
      }, []).sort(function(a, b) {
        var compare;
        compare = a.score - b.score;
        if (compare) {
          return compare;
        }
        return b.index - a.index;
      });
    }
    return highlighted;
  };


  /*
   * Copyright (c) 2011 Andrei Mackenzie
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy of
   * this software and associated documentation files (the "Software"), to deal in
   * the Software without restriction, including without limitation the rights to
   * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
   * the Software, and to permit persons to whom the Software is furnished to do so,
   * subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
   * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
   * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
   * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
   * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */

  levenshtein = function(a, b) {
    var i, j, matrix;
    if (a.length === 0) {
      return b.length;
    }
    if (b.length === 0) {
      return a.length;
    }
    matrix = [];
    i = void 0;
    i = 0;
    while (i <= b.length) {
      matrix[i] = [i];
      i++;
    }
    j = void 0;
    j = 0;
    while (j <= a.length) {
      matrix[0][j] = j;
      j++;
    }
    i = 1;
    while (i <= b.length) {
      j = 1;
      while (j <= a.length) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
        }
        j++;
      }
      i++;
    }
    return matrix[b.length][a.length];
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL21vZGVscy9mdXp6eS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFNQTtBQUFBLE1BQUEsa0JBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsRUFBUixDQUFBOztBQUFBLEVBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsS0FEakIsQ0FBQTs7QUFBQSxFQUtBLEtBQUssQ0FBQyxZQUFOLEdBQXFCLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtXQUNuQixLQUFLLENBQUMsTUFBTixDQUFhLFNBQUMsTUFBRCxHQUFBO2FBQ1gsS0FBSyxDQUFDLElBQU4sQ0FBVyxPQUFYLEVBQW9CLE1BQXBCLEVBRFc7SUFBQSxDQUFiLEVBRG1CO0VBQUEsQ0FMckIsQ0FBQTs7QUFBQSxFQVVBLEtBQUssQ0FBQyxJQUFOLEdBQWEsU0FBQyxPQUFELEVBQVUsTUFBVixHQUFBO1dBQ1gsS0FBSyxDQUFDLEtBQU4sQ0FBWSxPQUFaLEVBQXFCLE1BQXJCLENBQUEsS0FBa0MsS0FEdkI7RUFBQSxDQVZiLENBQUE7O0FBQUEsRUFlQSxLQUFLLENBQUMsS0FBTixHQUFjLFNBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsSUFBbEIsR0FBQTtBQUNaLFFBQUEsOEZBQUE7O01BRDhCLE9BQUs7S0FDbkM7QUFBQSxJQUFBLFVBQUEsR0FBYSxDQUFiLENBQUE7QUFBQSxJQUNBLE1BQUEsR0FBUyxFQURULENBQUE7QUFBQSxJQUVBLEdBQUEsR0FBTSxNQUFNLENBQUMsTUFGYixDQUFBO0FBQUEsSUFHQSxVQUFBLEdBQWEsQ0FIYixDQUFBO0FBQUEsSUFJQSxTQUFBLEdBQVksQ0FKWixDQUFBO0FBQUEsSUFPQSxHQUFBLEdBQU0sSUFBSSxDQUFDLEdBQUwsSUFBWSxFQVBsQixDQUFBO0FBQUEsSUFVQSxJQUFBLEdB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

//# sourceURL=/Users/anas/.atom/packages/git-plus/lib/models/fuzzy.coffee
