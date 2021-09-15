import { stripIndents } from 'common-tags';
import { decode } from 'html-entities';
import { dictionaryDefinition, dictionaryHyphenation, dictionaryPronunciation } from 'duck-duck-scrape';
import { CommandContext, VoltareClient } from 'voltare';
import { GeneralCommand } from '../../util/abstracts';

const PARTS_OF_SPEECH: Record<string, string> = {
  interjection: 'interj.',
  noun: 'n.',
  'intransitive verb': 'v.',
  'transitive verb': 'v.',
  adjective: 'adj.',
  adverb: 'adv.',
  verb: 'v.',
  pronoun: 'pro.',
  conjunction: 'conj.',
  preposition: 'prep.',
  'auxiliary-verb': 'v.',
  'noun-plural': 'n.',
  abbreviation: 'abbr.',
  'proper-noun': 'n.'
};

export default class DefineCommand extends GeneralCommand {
  constructor(client: VoltareClient<any>) {
    super(client, {
      name: 'define',
      description: 'Get the definition of a word.',
      category: 'Utility',
      aliases: ['def', 'definition', 'dictionary'],
      metadata: {
        examples: ['define love']
      }
    });

    this.filePath = __filename;
  }

  _replaceHTMLTags(text: string) {
    return decode(
      text
        .replace(/<\/?(b|strong)>/g, '**')
        .replace(/<\/?(em|i)>/g, '*')
        .replace(/<xref>([^<>]+)<\/xref>/g, '[$1](https://www.wordnik.com/words/$1)')
    );
  }

  async run(ctx: CommandContext) {
    if (!ctx.args[0]) return 'Give me something to define!';
    const query = ctx.args.join(' ');
    const definitions = await dictionaryDefinition(query);
    const definition = definitions[0];
    if (!definition) return 'That word cannot be found!';

    const word = definition.word;
    const hyphenations = await dictionaryHyphenation(word);
    const hyphenation = hyphenations.length ? hyphenations.map((p) => p.text).join('•') : null;
    const pronunciations = await dictionaryPronunciation(word);
    const ahd = pronunciations.find((p) => p.rawType.startsWith('ahd'));

    return stripIndents`
      ## ${hyphenation || word}**${ahd ? ` *(${ahd.raw})*` : ''}
      [](a://a)
      ${definitions
        .filter((d) => d.text)
        .map((d) => `*${PARTS_OF_SPEECH[d.partOfSpeech!] || '-'}* ${this._replaceHTMLTags(d.text!)}`)
        .join('\n')}
      ** **
      [$\\footnotesize\\colorbox{#333333}{\\color{#ffffff}\\textsf{→ More on Wordnik}}$](https://www.wordnik.com/words/${word})
    `;
  }
}
