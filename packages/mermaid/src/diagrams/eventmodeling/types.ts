import type { DiagramDB } from '../../diagram-api/types.js';

// Entity types that can be connected
export type EventModelingEntity =
  | EventModelingScreen
  | EventModelingCommand
  | EventModelingReadModel
  | EventModelingProcessor
  | EventModelingEvent;

export interface EventModelingScreen {
  id: string;
  type: 'screen';
  title?: string;
}

export interface EventModelingCommand {
  id: string;
  type: 'command';
  data?: string;
  title?: string;
}

export interface EventModelingReadModel {
  id: string;
  type: 'readmodel';
  data?: string;
  title?: string;
}

export interface EventModelingProcessor {
  id: string;
  type: 'processor';
  title?: string;
}

export interface EventModelingEvent {
  id: string;
  type: 'event';
  systemId: string;
  data?: string;
}

export interface EventModelingSystem {
  id: string;
  title?: string;
  events: EventModelingEvent[];
}

export interface EventModelingEdge {
  source: string;
  target: string;
  arrow: string;
}

export interface EventModelingDB extends DiagramDB {
  getSystems: () => EventModelingSystem[];
  getSystem: (id: string) => EventModelingSystem | undefined;
  getEntities: () => EventModelingEntity[];
  getEntity: (id: string) => EventModelingEntity | undefined;
  getEvents: () => EventModelingEvent[];
  getEdges: () => EventModelingEdge[];
}

export interface EventModelingData {
  systems: EventModelingSystem[];
  entities: EventModelingEntity[];
  edges: EventModelingEdge[];
}
