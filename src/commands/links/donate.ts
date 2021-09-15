import { stripIndents } from 'common-tags';
import { VoltareClient } from 'voltare';
import { GeneralCommand } from '../../util/abstracts';

export default class DonateCommand extends GeneralCommand {
  constructor(client: VoltareClient<any>) {
    super(client, {
      name: 'donate',
      description: "Sends the bot owner's patreon link.",
      category: 'General',
      aliases: ['patreon', 'paypal', 'kofi'],
      metadata: {
        examples: ['donate']
      }
    });

    this.filePath = __filename;
  }

  async run() {
    return stripIndents`
      If you like the bot and want to support the creator, here are some links!
      - https://patreon.com/Snazzah/
      - https://ko-fi.com/Snazzah/
    `;
  }
}
