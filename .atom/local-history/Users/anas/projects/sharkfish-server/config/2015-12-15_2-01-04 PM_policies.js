module.exports.policies = {
  '*': 'passport',
  'testController': {
    'public': 'passport',
    'private': ['passport', 'sessionAuth']
  }
};
