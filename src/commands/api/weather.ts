import { stripIndents } from 'common-tags';
import { forecast } from 'duck-duck-scrape';
import { CommandContext, VoltareClient } from 'voltare';
import { GeneralCommand } from '../../util/abstracts';

const ICON_MAP: Record<string, string> = {
  'partly-cloudy-day': ':partly_sunny:',
  'partly-cloudy-night': ':partly_sunny:',
  cloudy: ':cloud:',
  rain: ':cloud_rain:',
  'clear-day': ':sunny:',
  snow: ':snowflake:',
  fog: ':fog:',
  'clear-night': ':moon:'
};

export default class WeatherCommand extends GeneralCommand {
  constructor(client: VoltareClient<any>) {
    super(client, {
      name: 'weather',
      description: 'Get the forecast of an area.',
      category: 'Utility',
      aliases: ['w', 'forecast'],
      metadata: {
        usage: '<area>',
        examples: ['weather California']
      }
    });

    this.filePath = __filename;
  }

  toCelsius(degree: number) {
    return Math.round(((degree - 32) * 5) / 9);
  }

  getCardinal(angle: number) {
    const degreePerDirection = 360 / 8;
    const offsetAngle = angle + degreePerDirection / 2;

    return offsetAngle >= 0 * degreePerDirection && offsetAngle < 1 * degreePerDirection
      ? 'N'
      : offsetAngle >= 1 * degreePerDirection && offsetAngle < 2 * degreePerDirection
      ? 'NE'
      : offsetAngle >= 2 * degreePerDirection && offsetAngle < 3 * degreePerDirection
      ? 'E'
      : offsetAngle >= 3 * degreePerDirection && offsetAngle < 4 * degreePerDirection
      ? 'SE'
      : offsetAngle >= 4 * degreePerDirection && offsetAngle < 5 * degreePerDirection
      ? 'S'
      : offsetAngle >= 5 * degreePerDirection && offsetAngle < 6 * degreePerDirection
      ? 'SW'
      : offsetAngle >= 6 * degreePerDirection && offsetAngle < 7 * degreePerDirection
      ? 'W'
      : 'NW';
  }

  async run(ctx: CommandContext) {
    if (!ctx.args[0]) return 'Give me something to search!';
    const query = ctx.args.join(' ');

    const weather = await forecast(query);
    if (!weather) return 'No results were found!';

    const temperature = Math.round(weather.currently.temperature);
    const apparentTemperature = Math.round(weather.currently.apparentTemperature);

    return stripIndents`
      # ${weather.flags['ddg-location']}

      ### ${ICON_MAP[weather.hourly.icon] ?? ''} ${weather.hourly.summary}
      ** **
      **Temperature**: ${temperature}°F (${this.toCelsius(temperature)}°C)
      **Humidity:** ${weather.currently.humidity * 100}%
      Apparent Temperature: ${apparentTemperature}°F (${this.toCelsius(apparentTemperature)}°C)
      ${
        weather.currently.nearestStormDistance
          ? `Nearest Storm: ${weather.currently.nearestStormDistance} mi ${this.getCardinal(
              weather.currently.nearestStormBearing
            )}\n`
          : ''
      }
      ** **
      ### Percepitation
      Chance: ${weather.currently.precipProbability * 100}%
      Intensity: ${weather.currently.precipIntensity * 100} inches of water per hour${
      weather.currently.precipIntensity !== 0 ? ` (${(weather.currently as any).precipType})` : ''
    }
      [](a://a)
      [$\\footnotesize\\colorbox{#333333}{\\color{#ffffff}\\textsf{→ More on Dark Sky}}$](https://darksky.net/forecast/${
        weather.latitude
      },${weather.longitude})
    `;
  }
}
