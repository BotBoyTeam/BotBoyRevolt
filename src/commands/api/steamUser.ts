import { stripIndents } from 'common-tags';
import { CommandContext, VoltareClient } from 'voltare';
import { GeneralCommand } from '../../util/abstracts';

export default class SteamUserCommand extends GeneralCommand {
  constructor(client: VoltareClient<any>) {
    super(client, {
      name: 'steamuser',
      description: 'Get the Steam profile of a user.',
      category: 'Games',
      aliases: ['su', 'steamu'],
      metadata: {
        examples: ['steamuser Snazzah']
      }
    });

    this.filePath = __filename;
  }

  async run(ctx: CommandContext) {
    if (!ctx.args[0]) return 'Give the Steam ID or the custom URL of a Steam user!';
    const profile = await this.api.getSteamProfile(ctx.args[0]);
    if (profile.ok === false) return profile.error;

    if (profile.private)
      return stripIndents`
        $\\Large\\color{#ffffff}\\textsf{${profile.username}}$
        > This profile is private.
      `;

    let state = 'Unknown';
    let stateColor = '333333';
    switch (profile.status.state) {
      case 'offline':
        state = 'Currently Offline';
        break;
      case 'online':
        state = 'Currently Online';
        stateColor = '57cbde';
        break;
      case 'in-game':
        state = `Currently In-Game: ${profile.status.game}`;
        stateColor = '90ba3c';
        break;
    }

    let color = '9b9b9b';
    const levelDist = profile.level.value % 100;
    if (levelDist >= 10 && levelDist < 20) color = 'c02942';
    else if (levelDist >= 20 && levelDist < 30) color = 'd95b43';
    else if (levelDist >= 30 && levelDist < 40) color = 'fecc23';
    else if (levelDist >= 40 && levelDist < 50) color = '467a3c';
    else if (levelDist >= 50 && levelDist < 60) color = '4e8ddb';
    else if (levelDist >= 60 && levelDist < 70) color = '7652c9';
    else if (levelDist >= 70 && levelDist < 80) color = 'c252c9';
    else if (levelDist >= 80 && levelDist < 90) color = '542437';
    else if (levelDist >= 90 && levelDist < 100) color = '997c52';

    return stripIndents`
      [$\\Large\\color{#ffffff}\\textsf{${profile.username}}$](https://steamcommunity.com/profiles/${
      profile.steamid[64]
    })
      \`${profile.steamid[2]}\` - \`${profile.steamid[64]}\`
      $\\colorbox{#${stateColor}}{\\color{#ffffff}\\textsf{${state}}}$ $\\fcolorbox{#${color}}{#333333}{\\color{#ffffff}\\textsf{Level ${
      profile.level.estimate
    }}}$
      ** **
      ${
        profile.badge
          ? `**Badge:** [${profile.badge.name}](${profile.badge.url}) - ${profile.badge.meta} (${profile.badge.xp.estimate} xp)`
          : ''
      }
      ${
        profile.primary_group
          ? `**Group:** [${profile.primary_group.name}](${profile.primary_group.url}) - ${profile.primary_group.member_count.estimate} member(s)`
          : ''
      }
      ${
        profile.recent_activity
          ? `
            ** **
            ### Recent Activity
            **${profile.recent_activity.playtime.formatted}** hours of playtime since the last 2 weeks
                ${profile.recent_activity.games
                  .map((game) => `**[${game.name}](${game.url})** - ${game.hours.formatted} hours`)
                  .join('\n')}
            `
          : ''
      }
      ** **
    `;
  }
}
