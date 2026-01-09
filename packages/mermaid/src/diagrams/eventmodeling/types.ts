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

export interface EventModelingStyleOptions {
  // Swimlane styles
  emSwimlaneBgColor: string;
  emSwimlaneAltBgColor: string;
  emSwimlaneBorderColor: string;
  emSwimlaneBorderWidth: string;
  emSwimlaneLabelColor: string;
  emSwimlaneLabelFontSize: string;

  // Entity styles
  emEntityBorderWidth: string;
  emEntityLabelFontSize: string;

  // Screen styles
  emScreenBgColor: string;
  emScreenBorderColor: string;
  emScreenTextColor: string;

  // Processor styles
  emProcessorBgColor: string;
  emProcessorBorderColor: string;
  emProcessorTextColor: string;

  // Command styles
  emCommandBgColor: string;
  emCommandBorderColor: string;
  emCommandTextColor: string;

  // Event styles
  emEventBgColor: string;
  emEventBorderColor: string;
  emEventTextColor: string;

  // Read Model styles
  emReadModelBgColor: string;
  emReadModelBorderColor: string;
  emReadModelTextColor: string;

  // Edge styles
  emEdgeColor: string;
  emEdgeWidth: string;
  emEdgeArrowColor: string;
  emEdgeHoverColor: string;
  emEdgeHoverWidth: string;
}
