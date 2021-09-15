import axios from 'axios';
import { stripIndents } from 'common-tags';
import { VoltareClient } from 'voltare';
import { GeneralCommand } from '../../util/abstracts';

export default class DiscordStatusCommand extends GeneralCommand {
  constructor(client: VoltareClient<any>) {
    super(client, {
      name: 'discordstatus',
      description: "Get a quick insight on Discord's status.",
      category: 'Utility',
      aliases: ['ds', 'isdiscorddown'],
      metadata: {
        examples: ['discordstatus']
      }
    });

    this.filePath = __filename;
  }

  async run() {
    const apiGraph = await axios('https://discordstatus.com/metrics-display/5k2rt9f7pmny/day.json');
    const status = await axios('https://discordstatus.com/api/v2/status.json');

    return stripIndents`
      ## $\\color{${status.data.status.indicator !== 'none' ? 'orange' : 'green'}}•$ ${
      status.data.status.description
    }
      [](a://a)
      #### API Response Time
      Last Ping: $\\color{${
        apiGraph.data.summary.last > 800 ? 'red' : apiGraph.data.summary.last > 100 ? 'orange' : 'green'
      }}\\texttt{${apiGraph.data.summary.last.toLocaleString()} ms}$
      Average Ping: $\\color{${
        apiGraph.data.summary.mean > 800 ? 'red' : apiGraph.data.summary.mean > 100 ? 'orange' : 'green'
      }}\\texttt{${Math.round(apiGraph.data.summary.mean).toLocaleString()} ms}$
      ** **
      [$\\footnotesize\\colorbox{#333333}{\\color{#ffffff}\\textsf{→ More on discordstatus.com}}$](https://discordstatus.com/)
    `;
  }
}
