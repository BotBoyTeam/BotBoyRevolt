import { CommandContext, VoltareClient } from 'voltare';
import { GeneralCommand } from '../../util/abstracts';
import { USER_REGEX } from '../../util';
import { stripIndents } from 'common-tags';

export default class AvatarCommand extends GeneralCommand {
  constructor(client: VoltareClient<any>) {
    super(client, {
      name: 'avatar',
      description: 'Gets the avatar of a user.',
      category: 'General',
      aliases: ['avy', 'av', 'pfp'],
      metadata: {
        examples: ['avatar', 'avatar @mention'],
        usage: '[@mention]'
      }
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    let user = ctx.author;
    if (ctx.args[0] && USER_REGEX.test(ctx.args[0])) {
      const id = ctx.args[0].match(USER_REGEX)![1];
      const mention = await this.client.bot.users.fetch(id);
      if (mention) user = mention;
    }

    return stripIndents`
      ## ${user.username}'s Avatar
      [Image Link](${user.generateAvatarURL(undefined, true)})
    `;
  }
}
