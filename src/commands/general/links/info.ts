import { stripIndents } from 'common-tags';
import { CommandContext, VoltareClient } from 'voltare';
import prettyMilliseconds from 'pretty-ms';
import { GeneralCommand } from '../../../util/abstracts';

export default class InfoCommand extends GeneralCommand {
  constructor(client: VoltareClient<any>) {
    super(client, {
      name: 'info',
      description: 'Gets general info about the bot.',
      aliases: ['botinfo'],
      category: 'General',
      metadata: {
        examples: ['info']
      },
      throttling: {
        usages: 1,
        duration: 1,
        bypass: ['voltare.elevated']
      }
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    await ctx.reply(stripIndents`
      $\\Large\\colorbox{#6ce69f}{\\color{#ffffff}\\textsf{BotBoy}}$
      $\\color{#ffffff}\\textsf{A Revolt bot that can provide rich information from multiple sources.}$
      ** **
      $\\textsf{📊 \\textbf{${this.client.bot.servers.size.toLocaleString()}} \\textsf{servers}}$
      $\\textsf{🤖 \\textbf{${prettyMilliseconds(Math.round(process.uptime()) * 1000)}} \\textsf{uptime}}$
    `);
  }
}
