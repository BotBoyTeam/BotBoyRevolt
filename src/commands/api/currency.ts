import { oneLine, stripIndents } from 'common-tags';
import { currency } from 'duck-duck-scrape';
import { CommandContext, VoltareClient } from 'voltare';
import { GeneralCommand } from '../../util/abstracts';

export default class SearchCommand extends GeneralCommand {
  constructor(client: VoltareClient<any>) {
    super(client, {
      name: 'currency',
      description: 'Get the conversion rates between currencies.',
      category: 'Utility',
      aliases: ['value', 'money', 'xe', 'currencyconvert', 'cc'],
      metadata: {
        usage: '<amount> <from> <to>',
        examples: ['currency 2 eur usd']
      }
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (ctx.args[0] && (isNaN(parseFloat(ctx.args[0])) || parseFloat(ctx.args[2]) <= 0))
      return 'Invalid amount!';
    if (!ctx.args[1]) return 'Provide a currency to convert from!';
    if (!ctx.args[2]) return 'Provide a currency to convert to!';

    const exchange = await currency(ctx.args[1], ctx.args[2], parseFloat(ctx.args[0]));
    const url = `http://www.xe.com/currencyconverter/convert/?Amount=${exchange.conversion['from-amount']}&From=${exchange.conversion['from-currency-symbol']}&To=${exchange.conversion['to-currency-symbol']}`;
    return stripIndents`
      [](a://a)${oneLine`
        $\\tt{${exchange.conversion['from-amount']}}\\textsf{ ${exchange.conversion['from-currency-name']} (${exchange.conversion['from-currency-symbol']})}$
        |
        $\\tt{${exchange.conversion['converted-amount']}}\\textsf{ ${exchange.conversion['to-currency-name']} (${exchange.conversion['to-currency-symbol']})}$
      `}
      -:|:-
      ${exchange.topConversions
        .map(
          (conv) =>
            oneLine`
            $\\footnotesize\\tt{${conv['from-amount']}}\\textsf{ ${conv['from-currency-name']} (${conv['from-currency-symbol']})}$
            |
            $\\footnotesize\\tt{${conv['converted-amount']}}\\textsf{ ${conv['to-currency-name']} (${conv['to-currency-symbol']})}$
            `
        )
        .slice(0, 3)
        .join('\n')}
      \n\n
      [$\\footnotesize\\colorbox{#333333}{\\color{#ffffff}\\textsf{→ More on xe.com}}$](${url})
    `;
  }

  async onError(err: Error, ctx: CommandContext) {
    const msg = err.message;
    if (msg === 'ERROR: Invalid from_currency_symbol.') return ctx.reply('The `from` currency is invalid.');
    else if (msg === 'ERROR: Invalid to_currency_symbol.') return ctx.reply('The `to` currency is invalid.');
    else return ctx.reply('An error occurred with the API.\n' + msg);
  }
}
