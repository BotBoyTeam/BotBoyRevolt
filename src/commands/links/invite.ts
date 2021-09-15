import { VoltareClient } from 'voltare';
import { GeneralCommand } from '../../util/abstracts';

export default class InviteCommand extends GeneralCommand {
  constructor(client: VoltareClient<any>) {
    super(client, {
      name: 'invite',
      description: 'Gets the bot invite link.',
      category: 'General',
      aliases: ['inv'],
      metadata: {
        examples: ['invite']
      }
    });

    this.filePath = __filename;
  }

  async run() {
    return '[$\\colorbox{#6ce69f}{\\color{#ffffff}\\textsf{+ Add BotBoy}}$](/bot/01FE6KEHQW7C2WHN0PY55NGTBX)';
  }
}
