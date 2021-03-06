import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

declare let window:any;
declare let require:any;
const Client = require('../../../../../client');
const settings = require('../../../../../.server-config.json');
const CORE_HOST = settings.host;

const STORAGE_KEY = 'onedb_auth';

@Injectable()
export class OneDBService {
  client:any;
  user:any;

  onLogin = new BehaviorSubject(null);

  constructor(private zone:NgZone) {
    window.onedbService = this;
    this.client = new Client({
      hosts: {
        core: {
          location: CORE_HOST,
        }
      },
      onLogin: user => {
        this.zone.run(_ => this.onLogin.next(user));
      },
      scope: ['alpha_chat:read', 'alpha_chat:create', 'alpha_chat:write', 'alpha_chat:delete', 'alpha_chat:modify_acl', 'alpha_chat:append'],
    });
    this.maybeRestore();
    this.onLogin.subscribe(user => {
      this.user = user;
      if (!window.localStorage) return
      const toStore = {
        hosts: this.client.hosts,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
    })
  }

  async maybeRestore() {
    if (!window.localStorage) return;
    let existing:any = window.localStorage.getItem(STORAGE_KEY);
    if (!existing) return;
    existing = JSON.parse(existing);
    if (!existing || !existing.hosts) return;
    await this.client.setHosts(existing.hosts);
  }
}
