import { stripIndents } from 'common-tags';
import { CommandContext, VoltareClient } from 'voltare';
import { CHANNEL_REGEX } from '../../util';
import { GeneralCommand } from '../../util/abstracts';
import { Channel } from 'revolt.js/dist/maps/Channels';

export default class IconCommand extends GeneralCommand {
  constructor(client: VoltareClient<any>) {
    super(client, {
      name: 'icon',
      description: 'Gets the icon of the server or a channel.',
      category: 'General',
      aliases: ['icn', 'ico'],
      metadata: {
        examples: ['icon', 'icon #general']
      },
      userPermissions: ['voltare.inserver']
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    let channel: Channel | null = null;
    if (ctx.args[0] && CHANNEL_REGEX.test(ctx.args[0])) {
      const id = ctx.args[0].match(CHANNEL_REGEX)![1];
      const mention: Channel | undefined = ctx.server?.channels.find(
        (channel) => channel?._id === id && channel.icon
      );
      if (mention) channel = mention;
    }

    if (!channel) {
      if (!ctx.server!.icon) return 'This server has no icon set.';

      return stripIndents`
        ## ${ctx.server!.name}'s Icon
        [Image Link](${ctx.server!.generateIconURL(undefined, true)})
      `;
    }

    if (!channel.icon) return 'That channel has no icon set.';

    return stripIndents`
      ## #${channel.name}'s Icon
      [Image Link](${this.client.bot.generateFileURL(channel.icon)})
    `;
  }
}
