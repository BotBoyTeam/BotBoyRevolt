import { CommandContext, VoltareCommand } from 'voltare';
import { Message } from 'revolt.js/dist/maps/Messages';
import { CHANNEL_REGEX, USER_REGEX } from '.';
import APIModule from '../modules/api';

export class GeneralCommand extends VoltareCommand {
  get api() {
    return this.client.modules.get('api')! as APIModule<any>;
  }

  cleanContent(content: string, message: Message) {
    return content
      .replace(USER_REGEX, (matched, id) => {
        // TODO fetch users instead
        if (!message.mentions) return matched;
        const user = message.mentions.find((m) => m && m._id === id);
        return user ? `@${user.username}` : matched;
      })
      .replace(CHANNEL_REGEX, (matched, id) => {
        if (!message.channel?.server) return matched;
        const channel = message.channel.server.channels.find((r) => r && r._id === id);
        return channel ? `#${channel.name}` : matched;
      });
  }

  onError(err: Error, ctx: CommandContext) {
    this.client.commands.logger.error(err);
    return ctx.reply(`An error occurred while running the \`${this.name}\` command.`);
  }

  finalize(response: any, ctx: CommandContext) {
    if (
      typeof response === 'string' ||
      (response && response.constructor && response.constructor.name === 'Object')
    )
      return ctx.reply(response);
  }
}
