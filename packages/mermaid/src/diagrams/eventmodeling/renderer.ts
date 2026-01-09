import type { Diagram } from '../../Diagram.js';
import { log } from '../../logger.js';
import type { EventModelingDB } from './db.js';

export const renderer = {
  draw: (_text: string, _id: string, _version: string, _diagram: Diagram) => {
    const db = _diagram.db as EventModelingDB;
    // TODO: Implement rendering logic
    log.warn('EventModeling diagram rendering not yet implemented', db);
  },
};
