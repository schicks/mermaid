import { getConfig as commonGetConfig } from '../../config.js';
import type { BaseDiagramConfig } from '../../config.type.js';
import type { DiagramDB } from '../../diagram-api/types.js';
import {
  clear as commonClear,
  getAccDescription,
  getAccTitle,
  getDiagramTitle,
  setAccDescription,
  setAccTitle,
  setDiagramTitle,
} from '../common/commonDb.js';
import type {
  EventModelingEntity,
  EventModelingEvent,
  EventModelingEdge,
  EventModelingSystem,
} from './types.js';

export class EventModelingDB implements DiagramDB {
  private systems = new Map<string, EventModelingSystem>();
  private entities = new Map<string, EventModelingEntity>();
  private edges: EventModelingEdge[] = [];

  constructor() {
    this.clear();
  }

  public clear(): void {
    this.systems.clear();
    this.entities.clear();
    this.edges = [];
    commonClear();
  }

  public addSystem(system: EventModelingSystem): void {
    this.systems.set(system.id, system);
  }

  public getSystems(): EventModelingSystem[] {
    return [...this.systems.values()];
  }

  public getSystem(id: string): EventModelingSystem | undefined {
    return this.systems.get(id);
  }

  public addEntity(entity: EventModelingEntity): void {
    this.entities.set(entity.id, entity);
  }

  public getEntities(): EventModelingEntity[] {
    return [...this.entities.values()];
  }

  public getEntity(id: string): EventModelingEntity | undefined {
    return this.entities.get(id);
  }

  public getEvents(): EventModelingEvent[] {
    const events: EventModelingEvent[] = [];
    for (const system of this.systems.values()) {
      events.push(...system.events);
    }
    return events;
  }

  public addEdge(edge: EventModelingEdge): void {
    this.edges.push(edge);
  }

  public getEdges(): EventModelingEdge[] {
    return this.edges;
  }

  public getConfig(): BaseDiagramConfig {
    return commonGetConfig() as BaseDiagramConfig;
  }

  public setAccTitle = setAccTitle;
  public getAccTitle = getAccTitle;
  public setDiagramTitle = setDiagramTitle;
  public getDiagramTitle = getDiagramTitle;
  public getAccDescription = getAccDescription;
  public setAccDescription = setAccDescription;
}
