import { VoltareClient, BaseConfig } from 'voltare';
import config from 'config';
import path from 'path';
import WinstonModule from './modules/winston';
import APIModule from './modules/api';

export const PRODUCTION = process.env.NODE_ENV === 'production';

export interface PhotoBoxConfig extends BaseConfig {
  prefix: string | string[];
  mentionPrefix: boolean;

  logger: {
    level: string;
    inspectOptions?: any;
  };

  api: Record<string, string | undefined>;
}

export const client = new VoltareClient(config.get('voltare') as PhotoBoxConfig);

client.loadModules(WinstonModule, APIModule);
client.commands.registerDefaults(['eval', 'kill', 'ping', 'exec', 'load', 'unload', 'reload']);
client.commands.registerFromFolder(path.join(config.get('commandsPath' as string)));

client.permissions.register('server.dbots', (object) => {
  if (object.message) return object.message.channel?.server_id === '01FE62ASTHZFMSTCBBVAK4TZE1';
  return false;
});

process.once('SIGINT', async () => {
  client.emit('logger', 'warn', 'sys', ['Caught SIGINT']);
  await client.disconnect();
  process.exit(0);
});

process.once('beforeExit', async () => {
  client.emit('logger', 'warn', 'sys', ['Exiting....']);
  await disconnect();
  process.exit(0);
});

process.on('unhandledRejection', (reason, p) => {
  client.emit('logger', 'error', 'sys', ['Unhandled rejection', reason, p]);
});

process.on('uncaughtException', async (err) => {
  client.emit('logger', 'error', 'sys', ['Uncaught exception', err]);
  await disconnect();
  process.exit(1);
});

client.once('disconnected', () => connect());

export async function connect() {
  await client.connect();
  client.bot.users.edit({
    // @ts-ignore
    status: PRODUCTION
      ? { text: `^help`, presence: 'Online' }
      : { text: `DEVELOPER MODE / !help`, presence: 'Busy' }
  });
}

export async function disconnect() {
  await client.disconnect();
}
