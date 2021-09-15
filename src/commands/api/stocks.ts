import { stripIndents } from 'common-tags';
import { stocks } from 'duck-duck-scrape';
import { CommandContext, VoltareClient } from 'voltare';
import { GeneralCommand } from '../../util/abstracts';

export default class StocksCommand extends GeneralCommand {
  constructor(client: VoltareClient<any>) {
    super(client, {
      name: 'stocks',
      description: 'Find the quotes of a symbol.',
      category: 'Utility',
      aliases: ['stock', 'nasdaq'],
      metadata: {
        usage: '<symbol>',
        examples: ['stocks GOOGL']
      }
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (!ctx.args[0]) return 'Give me something to search!';

    const stock = await stocks(ctx.args[0]);
    if (!stock) return 'No results were found!';

    const sign = stock.Last < 0 ? '' : '+';

    return stripIndents`
      # ${stock.Security.Name}
      **\`${stock.Security.Symbol.toUpperCase()}\`:** $\\tt\\$${stock.Last.toLocaleString()}$ $\\color{${
      sign === '+' ? 'green' : 'red'
    }}\\texttt{${sign}\\$${stock.ChangeFromPreviousClose.toFixed(2)} (${sign}${
      stock.PercentChangeFromPreviousClose
    }\\%)}$
      ** **
      **Previous Close:** $\\tt\\$${stock.PreviousClose.toLocaleString()}$
      **Share Volume:** ${stock.Volume.toLocaleString()}
      ** **
      [](a://a) | Today | 52-week
      -|-|-
      High | $\\tt\\$${stock.High.toLocaleString()}$ | $\\tt\\$${stock.High52Weeks.toLocaleString()}$
      Low | $\\tt\\$${stock.Low.toLocaleString()}$ | $\\tt\\$${stock.Low52Weeks.toLocaleString()}$
      \n\n
      [](a://a)
      [$\\footnotesize\\colorbox{#333333}{\\color{#ffffff}\\textsf{→ More on NASDAQ}}$](https://www.nasdaq.com/symbol/${
        stock.Security.Symbol
      }/real-time)
    `;
  }
}
