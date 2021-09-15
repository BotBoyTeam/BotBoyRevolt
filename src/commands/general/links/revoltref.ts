import { stripIndents } from 'common-tags';
import { VoltareClient } from 'voltare';
import { GeneralCommand } from '../../../util/abstracts';

export default class RevoltRefCommand extends GeneralCommand {
  constructor(client: VoltareClient<any>) {
    super(client, {
      name: 'revoltref',
      description: 'Get some reference links to Revolt.',
      category: 'General',
      aliases: ['revolt', 'rref', 'rvlt'],
      metadata: {
        examples: ['revoltref']
      }
    });

    this.filePath = __filename;
  }

  async run() {
    return stripIndents`
      ### Revolt Reference[](a://a)
      Developer Docs: https://developers.revolt.chat/
      KaTex: https://katex.org/docs/supported.html
    `;
  }
}
