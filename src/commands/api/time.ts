import { stripIndents } from 'common-tags';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { time, TimeLocation } from 'duck-duck-scrape';
import { CommandContext, VoltareClient } from 'voltare';
import { GeneralCommand } from '../../util/abstracts';
dayjs.extend(utc);
dayjs.extend(localizedFormat);

export default class TimeCommand extends GeneralCommand {
  constructor(client: VoltareClient<any>) {
    super(client, {
      name: 'time',
      description: 'Get the time of a location.',
      category: 'Utility',
      aliases: ['timezone', 'tz'],
      metadata: {
        examples: ['time Snazzah']
      }
    });

    this.filePath = __filename;
  }

  emojiTime(location: TimeLocation) {
    const hour = (location.time.datetime.hour % 12) + 1;
    const halfHour = Math.round(location.time.datetime.minute / 60) > 30;
    return `:clock${hour}${halfHour ? '30' : ''}:`;
  }

  async run(ctx: CommandContext) {
    if (!ctx.args[0]) return 'Give me something to search!';
    const query = ctx.args.join(' ');
    const results = await time(query);
    if (!results.locations || !results.locations.length) return 'No results were found!';

    const location = results.locations[0];
    const date = dayjs(location.time.iso).utcOffset(location.time.timezone.offset);
    return stripIndents`
      ${this.emojiTime(location)} **${location.geo.name}, ${location.geo.state || location.geo.country.name}**
      ${date.format('LLLL')}
      ${location.time.timezone.zonename} (${location.time.timezone.zoneabb}, ${location.time.timezone.offset})
      [](a://a)
      [$\\footnotesize\\colorbox{#333333}{\\color{#ffffff}\\textsf{→ More on timeanddate.com}}$](http://www.timeanddate.com/worldclock/city.html?n=${
        location.id
      })
    `;
  }
}
