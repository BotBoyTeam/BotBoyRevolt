module.exports = {
  voltare: {
    login: {
      type: 'bot',
      token: 'XXXXXXXXXXXXXXXXXXXX'
    },
    revoltOptions: {},
    elevated: ['ABC123'],

    prefix: ['^', 'botboy'],
    mentionPrefix: true,

    logger: {
      level: 'info'
    }
  },

  commandsPath: './commands'
};
