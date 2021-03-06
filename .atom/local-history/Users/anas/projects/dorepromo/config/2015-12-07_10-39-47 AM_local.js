module.exports = {
		ssl: {
			ca: require('fs').readFileSync(__dirname + '/ssl/server.crt'),
			key: require('fs').readFileSync(__dirname + '/ssl/server.key'),
			cert: require('fs').readFileSync(__dirname + '/ssl/server.crt')
		},

		port: process.env.PORT || 1337,

		environment: process.env.NODE_ENV || 'development',

		socialIds: {
			facebook: {
				clientID: '1691653437712832',
				clientSecret: '9788c31fb307b47cc9a10da2c0b7ffbf',
				callbackURL: 'https://127.0.0.1:1337/auth/facebook/callbackRemove'
			},
			twitter: {
				consumerKey: 'get_your_own',
				consumerSecret: 'get_your_own',
				callbackURL: "https://127.0.0.1:1337/auth/twitter/callback"
			},
			github: {
				clientID: 'get_your_own',
				clientSecret: 'get_your_own',
				callbackURL: "http://127.0.0.1:1337/auth/github/callback"
			},
			google: {
				clientID: 'get_your_own',
				clientSecret: 'get_your_own',
				callbackURL: 'http://127.0.0.1:1337/auth/google/callback'
			},
			instagram: {
				clientID: '355e09c24f294d5382956c792faded08',
				clientSecret: 'get_your_own',
				callbackURL: 'http://127.0.0.1:1337/auth/instagram/callback'
			}
		};
