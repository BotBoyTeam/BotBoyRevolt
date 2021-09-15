import { stripIndents } from 'common-tags';
import { SafeSearchType, search } from 'duck-duck-scrape';
import { CommandContext, VoltareClient } from 'voltare';
import { GeneralCommand } from '../../util/abstracts';

export default class SearchCommand extends GeneralCommand {
  constructor(client: VoltareClient<any>) {
    super(client, {
      name: 'search',
      description: 'Search the web with DuckDuckGo.',
      category: 'Utility',
      aliases: ['g', 'google', 'ddg'],
      metadata: {
        usage: '<query>',
        examples: ['search Snazzah']
      }
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (!ctx.args[0]) return 'Give me something to search!';
    const query = ctx.args.join(' ');
    const results = await search(query, { safeSearch: SafeSearchType.STRICT });
    if (results.noResults) return 'No results were found!';

    const topResult = results.results[0];
    return stripIndents`
      ## ${topResult.title}
      ${topResult.description.replace(/<\/?b>/g, '**')}
      ** **
      *${topResult.url}*
      ** **
      [$\\footnotesize\\colorbox{#333333}{\\color{#ffffff}\\textsf{→ More on DuckDuckGo}}$](https://duckduckgo.com/?q=${encodeURIComponent(
        query
      )}&ia=web)
    `;
  }
}
