import type { EventModeling, Event } from '@mermaid-js/parser';
import { parse } from '@mermaid-js/parser';
import type { ParserDefinition } from '../../diagram-api/types.js';
import { log } from '../../logger.js';
import { populateCommonDb } from '../common/populateCommonDb.js';
import { EventModelingDB } from './db.js';
import type {
  EventModelingEntity,
  EventModelingEvent,
  EventModelingEdge,
  EventModelingSystem,
} from './types.js';

const populate = (ast: EventModeling, db: EventModelingDB) => {
  populateCommonDb(ast, db);

  // Process systems and their events
  for (const system of ast.systems) {
    const events: EventModelingEvent[] = system.events.map((event: Event) => ({
      id: event.id,
      type: 'event' as const,
      systemId: system.id,
      data: event.data,
    }));

    const eventModelingSystem: EventModelingSystem = {
      id: system.id,
      title: system.title,
      events,
    };

    db.addSystem(eventModelingSystem);

    // Also add events as entities so they can be referenced in edges
    for (const event of events) {
      db.addEntity(event);
    }
  }

  // Process entities (screens, commands, read models, processors)
  for (const entity of ast.entities) {
    let eventModelingEntity: EventModelingEntity;

    switch (entity.$type) {
      case 'Screen': {
        eventModelingEntity = {
          id: entity.id,
          type: 'screen',
          title: entity.title,
        };
        break;
      }
      case 'Command': {
        eventModelingEntity = {
          id: entity.id,
          type: 'command',
          data: entity.data,
          title: entity.title,
        };
        break;
      }
      case 'ReadModel': {
        eventModelingEntity = {
          id: entity.id,
          type: 'readmodel',
          data: entity.data,
          title: entity.title,
        };
        break;
      }
      case 'Processor': {
        eventModelingEntity = {
          id: entity.id,
          type: 'processor',
          title: entity.title,
        };
        break;
      }
      default:
        continue;
    }

    db.addEntity(eventModelingEntity);
  }

  // Process edges
  for (const edge of ast.edges) {
    // EventModeling edges have source and target fields
    // Architecture edges have different structure, but we only care about EventModeling edges here
    if (edge.source && edge.target && edge.arrow) {
      const eventModelingEdge: EventModelingEdge = {
        source: edge.source,
        target: edge.target,
        arrow: edge.arrow,
      };
      db.addEdge(eventModelingEdge);
    }
  }
};

export const parser: ParserDefinition = {
  parser: { yy: {} as EventModelingDB },
  parse: async (input: string): Promise<void> => {
    const ast = await parse('eventmodeling', input);
    const db = parser.parser?.yy;
    if (!(db instanceof EventModelingDB)) {
      throw new Error(
        'parser.parser?.yy was not an EventModelingDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.'
      );
    }
    log.debug(ast);
    populate(ast, db);
  },
};
