Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var init = function init() {
	var configFile = _path2['default'].join(atom.project.getPaths()[0], '.editorconfig');

	var conf = {
		core: atom.config.get('core'),
		editor: atom.config.get('editor'),
		whitespace: atom.config.get('whitespace')
	};

	var indent = conf.editor.softTabs ? 'indent_style = space\nindent_size = ' + conf.editor.tabLength : 'indent_style = tab';

	var endOfLine = process.platform === 'win32' ? 'crlf' : 'lf';
	var charset = conf.core.fileEncoding.replace('utf8', 'utf-8') || 'utf-8';

	var ret = 'root = true\n\n[*]\n' + indent + '\nend_of_line = ' + endOfLine + '\ncharset = ' + charset + '\ntrim_trailing_whitespace = ' + conf.whitespace.removeTrailingWhitespace + '\ninsert_final_newline = ' + conf.whitespace.ensureSingleTrailingNewline + '\n\n[*.md]\ntrim_trailing_whitespace = false\n';

	_fs2['default'].access(configFile, function (err) {
		if (err) {
			_fs2['default'].writeFile(configFile, ret, function (err) {
				if (err) {
					atom.notifications.addError(err);
					return;
				}

				atom.notifications.addSuccess('.editorconfig file successfully generated', {
					detail: 'An .editorconfig file was successfully generated in your project based on your current settings.'
				});
			});
		} else {
			atom.notifications.addError('An .editorconfig file already exists in your project root.');
		}
	});
};

exports['default'] = function () {
	atom.commands.add('atom-workspace', 'EditorConfig:generate-config', init);
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2VkaXRvcmNvbmZpZy9jb21tYW5kcy9nZW5lcmF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBQ2UsSUFBSTs7OztvQkFDRixNQUFNOzs7O0FBRnZCLFdBQVcsQ0FBQzs7QUFJWixJQUFNLElBQUksR0FBRyxTQUFQLElBQUksR0FBUztBQUNsQixLQUFNLFVBQVUsR0FBRyxrQkFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLENBQUMsQ0FBQzs7QUFFMUUsS0FBTSxJQUFJLEdBQUc7QUFDWixNQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0FBQzdCLFFBQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDakMsWUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztFQUN6QyxDQUFDOztBQUVGLEtBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSw0Q0FDTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FDNUQsb0JBQW9CLENBQUM7O0FBRXhCLEtBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDL0QsS0FBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUM7O0FBRTNFLEtBQU0sR0FBRyw0QkFJUixNQUFNLHdCQUNRLFNBQVMsb0JBQ2IsT0FBTyxxQ0FDVSxJQUFJLENBQUMsVUFBVSxDQUFDLHdCQUF3QixpQ0FDNUMsSUFBSSxDQUFDLFVBQVUsQ0FBQywyQkFBMkIsbURBSW5FLENBQUM7O0FBRUQsaUJBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxVQUFBLEdBQUcsRUFBSTtBQUM1QixNQUFJLEdBQUcsRUFBRTtBQUNSLG1CQUFHLFNBQVMsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLFVBQUEsR0FBRyxFQUFJO0FBQ3BDLFFBQUksR0FBRyxFQUFFO0FBQ1IsU0FBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakMsWUFBTztLQUNQOztBQUVELFFBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLDJDQUEyQyxFQUFFO0FBQzFFLFdBQU0sRUFBRSxrR0FBa0c7S0FDMUcsQ0FBQyxDQUFDO0lBQ0gsQ0FBQyxDQUFDO0dBQ0gsTUFBTTtBQUNOLE9BQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLDREQUE0RCxDQUFDLENBQUM7R0FDMUY7RUFDRCxDQUFDLENBQUM7Q0FDSCxDQUFDOztxQkFFYSxZQUFNO0FBQ3BCLEtBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLDhCQUE4QixFQUFFLElBQUksQ0FBQyxDQUFDO0NBQzFFIiwiZmlsZSI6Ii9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2VkaXRvcmNvbmZpZy9jb21tYW5kcy9nZW5lcmF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBpbml0ID0gKCkgPT4ge1xuXHRjb25zdCBjb25maWdGaWxlID0gcGF0aC5qb2luKGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdLCAnLmVkaXRvcmNvbmZpZycpO1xuXG5cdGNvbnN0IGNvbmYgPSB7XG5cdFx0Y29yZTogYXRvbS5jb25maWcuZ2V0KCdjb3JlJyksXG5cdFx0ZWRpdG9yOiBhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvcicpLFxuXHRcdHdoaXRlc3BhY2U6IGF0b20uY29uZmlnLmdldCgnd2hpdGVzcGFjZScpXG5cdH07XG5cblx0Y29uc3QgaW5kZW50ID0gY29uZi5lZGl0b3Iuc29mdFRhYnMgP1xuXHRcdFx0XHRgaW5kZW50X3N0eWxlID0gc3BhY2VcXG5pbmRlbnRfc2l6ZSA9ICR7Y29uZi5lZGl0b3IudGFiTGVuZ3RofWAgOlxuXHRcdFx0XHQnaW5kZW50X3N0eWxlID0gdGFiJztcblxuXHRjb25zdCBlbmRPZkxpbmUgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInID8gJ2NybGYnIDogJ2xmJztcblx0Y29uc3QgY2hhcnNldCA9IGNvbmYuY29yZS5maWxlRW5jb2RpbmcucmVwbGFjZSgndXRmOCcsICd1dGYtOCcpIHx8ICd1dGYtOCc7XG5cblx0Y29uc3QgcmV0ID1cbmByb290ID0gdHJ1ZVxuXG5bKl1cbiR7aW5kZW50fVxuZW5kX29mX2xpbmUgPSAke2VuZE9mTGluZX1cbmNoYXJzZXQgPSAke2NoYXJzZXR9XG50cmltX3RyYWlsaW5nX3doaXRlc3BhY2UgPSAke2NvbmYud2hpdGVzcGFjZS5yZW1vdmVUcmFpbGluZ1doaXRlc3BhY2V9XG5pbnNlcnRfZmluYWxfbmV3bGluZSA9ICR7Y29uZi53aGl0ZXNwYWNlLmVuc3VyZVNpbmdsZVRyYWlsaW5nTmV3bGluZX1cblxuWyoubWRdXG50cmltX3RyYWlsaW5nX3doaXRlc3BhY2UgPSBmYWxzZVxuYDtcblxuXHRmcy5hY2Nlc3MoY29uZmlnRmlsZSwgZXJyID0+IHtcblx0XHRpZiAoZXJyKSB7XG5cdFx0XHRmcy53cml0ZUZpbGUoY29uZmlnRmlsZSwgcmV0LCBlcnIgPT4ge1xuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0YXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGVycik7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoJy5lZGl0b3Jjb25maWcgZmlsZSBzdWNjZXNzZnVsbHkgZ2VuZXJhdGVkJywge1xuXHRcdFx0XHRcdGRldGFpbDogJ0FuIC5lZGl0b3Jjb25maWcgZmlsZSB3YXMgc3VjY2Vzc2Z1bGx5IGdlbmVyYXRlZCBpbiB5b3VyIHByb2plY3QgYmFzZWQgb24geW91ciBjdXJyZW50IHNldHRpbmdzLidcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0YXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdBbiAuZWRpdG9yY29uZmlnIGZpbGUgYWxyZWFkeSBleGlzdHMgaW4geW91ciBwcm9qZWN0IHJvb3QuJyk7XG5cdFx0fVxuXHR9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0ICgpID0+IHtcblx0YXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ0VkaXRvckNvbmZpZzpnZW5lcmF0ZS1jb25maWcnLCBpbml0KTtcbn07XG4iXX0=
//# sourceURL=/Users/anas/.atom/packages/editorconfig/commands/generate.js
