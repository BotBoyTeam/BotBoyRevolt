import axios, { AxiosError } from 'axios';
import { VoltareModule, VoltareClient } from 'voltare';
import { PhotoBoxConfig } from '../bot';

/* #region  api.snaz.in */
export interface APISnazIntegerFormat {
  estimate: string;
  formatted: string;
  value: number;
}

export interface APISnazError {
  error: string;
  ok: false;
}
/* #endregion */

/* #region  steam */
export type SteamProfileCountType =
  | 'awards'
  | 'badges'
  | 'games'
  | 'groups'
  | 'reviews'
  | 'friends'
  | 'screenshots'
  | 'workshop_files'
  | 'guides'
  | 'artwork'
  | 'videos';

export type SteamProfileBanType = 'none' | 'one' | 'multiple';

export type SteamProfileStatusState = 'offline' | 'online' | 'in-game';

export interface SteamPrivateProfile {
  avatar: string;
  ok: true;
  private: true;
  username: string;
  bans: {
    community: boolean;
    days_since_last: APISnazIntegerFormat | null;
    game: SteamProfileBanType;
    trade: boolean;
    vac: SteamProfileBanType;
  };
  steamid: {
    '2': string;
    '3': string;
    '32': number;
    '64': string;
  };
  custom_url: string | null;
}

export interface SteamBadge {
  image: string;
  meta: string;
  name: string;
  url: string;
  xp: APISnazIntegerFormat;
}

export interface SteamPrimaryGroup {
  member_count: APISnazIntegerFormat;
  name: string;
  url: string;
}

export interface SteamRecentActivity {
  games: SteamRecentActivityGame[];
  playtime: APISnazIntegerFormat;
}

export interface SteamRecentActivityGame {
  achievement_progress: {
    completed: APISnazIntegerFormat;
    total: APISnazIntegerFormat;
  };
  banner_image: string;
  hours: APISnazIntegerFormat;
  last_played: 'in-game' | string;
  name: string;
  url: string;
}

export interface SteamPublicProfile extends Omit<SteamPrivateProfile, 'private'> {
  animated_background_url: string | null;
  avatar: string;
  avatar_border_url: string | null;
  background_url: string | null;
  badge: SteamBadge | null;
  bans: {
    community: boolean;
    days_since_last: APISnazIntegerFormat | null;
    game: SteamProfileBanType;
    trade: boolean;
    vac: SteamProfileBanType;
  };
  can_comment: boolean;
  counts: {
    [key: string]: APISnazIntegerFormat | null;
  };
  created: number;
  flag: string | null;
  level: APISnazIntegerFormat;
  location: string | null;
  primary_group: SteamPrimaryGroup | null;
  private: false;
  real_name: string;
  recent_activity: SteamRecentActivity | null;
  status: {
    state: SteamProfileStatusState;
    game?: string;
    server_ip?: string;
  };
  summary: {
    raw: string;
    text: string;
  };
  username: string;
}

export type SteamProfile = SteamPrivateProfile | SteamPublicProfile;
export type SteamProfileResult = SteamProfile | APISnazError;
/* #endregion */

export default class APIModule<T extends VoltareClient<PhotoBoxConfig>> extends VoltareModule<T> {
  constructor(client: T) {
    super(client, {
      name: 'api',
      description: 'API handler module'
    });

    this.filePath = __filename;
  }

  get config() {
    return this.client.config.api;
  }

  async getSteamProfile(id: string) {
    try {
      const res = await axios.get(
        `https://api.snaz.in/v2/steam/user-profile/${encodeURIComponent(id.toLowerCase())}`
      );
      return res.data as SteamProfile;
    } catch (err) {
      const e = err as AxiosError<APISnazError>;
      if (e.isAxiosError && e.response) {
        if (e.response.status === 404)
          return {
            error: 'That profile could not be found!',
            ok: false
          } as APISnazError;
        else
          return {
            error:
              (e.response.data as APISnazError).error ||
              `The service gave us a ${e.response.status}! Try again later!`,
            ok: false
          } as APISnazError;
      } else
        return {
          error: 'An error occurred with the API!',
          ok: false
        } as APISnazError;
    }
  }
}
