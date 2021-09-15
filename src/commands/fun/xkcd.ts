import axios from 'axios';
import { stripIndents, oneLine } from 'common-tags';
import { CommandContext, VoltareClient } from 'voltare';
import { randint } from '../../util';
import { GeneralCommand } from '../../util/abstracts';

export default class XKCDCommand extends GeneralCommand {
  latestComic = 100;

  constructor(client: VoltareClient<any>) {
    super(client, {
      name: 'xkcd',
      description: 'Get an XKCD comic.',
      category: 'Fun',
      metadata: {
        examples: ['xkcd 2506', 'xkcd random', 'xkcd latest'],
        usage: '[number]',
        details: oneLine`
          The comic number can also be for the "latest" one or a "random" one.
        `
      }
    });

    this.filePath = __filename;
  }

  async preload() {
    this.latestComic = (await axios('https://xkcd.com/info.0.json')).data.num;
  }

  async run(ctx: CommandContext) {
    let comicNum = parseInt(ctx.args[0]);
    if (!ctx.args[0] || ['c', 'latest', 'last', 'current', 'l'].includes(ctx.args[0].toLowerCase()))
      comicNum = this.latestComic;
    if (ctx.args[0] && ['r', 'random'].includes(ctx.args[0].toLowerCase()))
      comicNum = randint(1, this.latestComic);
    if (!comicNum || isNaN(comicNum) || comicNum < 1 || comicNum > this.latestComic)
      return 'Invalid comic number!';

    const comic = await axios(`https://xkcd.com/${comicNum}/info.0.json`);
    return stripIndents`
      # ${comic.data.num}: ${comic.data.title}
      [Image Link](${comic.data.img})${
      comic.data.link ? ` - [Link in Comic](${comic.data.link})` : ''
    } - [URL](${comic.data.url}) - [Explain It!](https://www.explainxkcd.com/wiki/index.php/${comic.data.num})
      ** **
      ${comic.data.alt}
    `;
  }
}
