import { CommandContext } from 'voltare';

export const USER_REGEX = /<@([A-Z\d]{26})>/;
export const CHANNEL_REGEX = /<#([A-Z\d]{26})>/;
export const ID_REGEX = /[A-Z\d]{26}/;
export const URL_REGEX = /https?:\/\/[^\s<|]+[^<.,:;"')\]\s>|*_~`]/i;

interface FlagOption<T = string> {
  shortFlag?: string;
  name: T;
  aliases?: string[];
  getsString?: boolean;
}
interface FlagResult<T extends string> {
  result: Record<T, string | boolean>;
  args: string[];
}

export function readFlags<T extends string>(flags: FlagOption<T>[], ctx: CommandContext): FlagResult<T> {
  const result: Record<string, string | boolean> = {};
  const args: string[] = [];

  let assignTo: string | null = null;
  for (const arg of ctx.args) {
    const targ = arg.trim();

    // Match full names
    if (targ.startsWith('--') && !/\s/.test(targ)) {
      const flagName = targ.slice(2);
      const flag = flags.find(
        (f) =>
          f.name.toLowerCase() === flagName.toLowerCase() ||
          (f.aliases && f.aliases.find((al) => al.toLowerCase() === flagName.toLowerCase())) ||
          f.shortFlag === flagName
      );

      if (flag) result[flag.name] = true;
      if (flag?.getsString) assignTo = flag.name;
      continue;
    }

    // Match short names
    if (targ.startsWith('-') && !/\s/.test(targ)) {
      for (const shortFlag of targ.slice(1)) {
        const flag = flags.find((f) => f.shortFlag === shortFlag);
        if (flag) result[flag.name] = true;
        if (flag?.getsString) assignTo = flag.name;
      }
      continue;
    }

    // If the previous arg had an assign
    if (assignTo) {
      result[assignTo] = arg;
      assignTo = null;
      continue;
    }

    args.push(arg);
  }

  return { result, args };
}

export function randint(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
