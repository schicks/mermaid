import { getConfig } from '../../diagram-api/diagramAPI.js';
import { createText } from '../../rendering-util/createText.js';
import type { D3Element } from '../../types.js';
import type { EventModelingEdge, EventModelingEntity, EventModelingSystem } from './types.js';

// Layout configuration
const SWIMLANE_HEIGHT = 120;
const ENTITY_WIDTH = 140;
const ENTITY_HEIGHT = 80;
const ENTITY_SPACING = 60;
const SWIMLANE_PADDING = 20;
const EDGE_ARROW_SIZE = 8;

// Swimlane types and their vertical positions
const SWIMLANE_TYPES = {
  triggers: 0, // Screens and Processors
  commands: 1, // Commands
  events: 2, // Events (grouped by system)
  readModels: 3, // Read Models
} as const;

// Entity colors following Event Modeling conventions
const ENTITY_COLORS = {
  screen: '#FFFFFF', // White
  processor: '#9B59B6', // Purple
  command: '#3498DB', // Blue
  event: '#E67E22', // Orange
  readmodel: '#27AE60', // Green
} as const;

const ENTITY_BORDER_COLORS = {
  screen: '#2C3E50',
  processor: '#7D3C98',
  command: '#2874A6',
  event: '#CA6F1E',
  readmodel: '#1E8449',
} as const;

interface LayoutEntity {
  entity: EventModelingEntity;
  x: number;
  y: number;
  width: number;
  height: number;
  swimlane: number;
}

interface LayoutEdge {
  edge: EventModelingEdge;
  sourceEntity: LayoutEntity;
  targetEntity: LayoutEntity;
}

interface Swimlane {
  type: string;
  label: string;
  y: number;
  height: number;
  systems?: string[]; // For event swimlanes grouped by system
}

export interface EventModelingLayout {
  entities: LayoutEntity[];
  edges: LayoutEdge[];
  swimlanes: Swimlane[];
  width: number;
  height: number;
}

/**
 * Calculate the swimlane for an entity based on its type
 */
function getSwimlaneForEntity(entity: EventModelingEntity, systems: EventModelingSystem[]): number {
  switch (entity.type) {
    case 'screen':
    case 'processor':
      return SWIMLANE_TYPES.triggers;
    case 'command':
      return SWIMLANE_TYPES.commands;
    case 'event': {
      // Events are in system-specific swimlanes
      // Find which system this event belongs to
      const systemIndex = systems.findIndex((s) => s.id === entity.systemId);
      return SWIMLANE_TYPES.events + systemIndex;
    }
    case 'readmodel':
      return SWIMLANE_TYPES.readModels + systems.length;
    default:
      return 0;
  }
}

/**
 * Layout the event modeling diagram
 * Uses a timeline-based layout where entities are positioned left-to-right based on their connections
 */
export function layoutEventModeling(
  systems: EventModelingSystem[],
  entities: EventModelingEntity[],
  edges: EventModelingEdge[]
): EventModelingLayout {
  // Build entity map for quick lookup
  const entityMap = new Map<string, EventModelingEntity>();
  entities.forEach((e) => entityMap.set(e.id, e));

  // Build adjacency list for topological ordering
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  entities.forEach((e) => {
    adjacency.set(e.id, []);
    inDegree.set(e.id, 0);
  });

  edges.forEach((edge) => {
    const sourceList = adjacency.get(edge.source);
    if (sourceList) {
      sourceList.push(edge.target);
    }
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  });

  // Topological sort to determine left-to-right ordering
  const queue: string[] = [];
  const levels = new Map<string, number>();

  // Start with entities that have no incoming edges
  entities.forEach((e) => {
    if ((inDegree.get(e.id) ?? 0) === 0) {
      queue.push(e.id);
      levels.set(e.id, 0);
    }
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentLevel = levels.get(current) ?? 0;

    const neighbors = adjacency.get(current) ?? [];
    neighbors.forEach((neighbor) => {
      const degree = (inDegree.get(neighbor) ?? 0) - 1;
      inDegree.set(neighbor, degree);

      // Update level to be max of current level + 1 and existing level
      const newLevel = currentLevel + 1;
      const existingLevel = levels.get(neighbor) ?? 0;
      levels.set(neighbor, Math.max(newLevel, existingLevel));

      if (degree === 0) {
        queue.push(neighbor);
      }
    });
  }

  // Handle entities with no connections
  entities.forEach((e) => {
    if (!levels.has(e.id)) {
      levels.set(e.id, 0);
    }
  });

  // Create swimlanes
  const swimlanes: Swimlane[] = [
    {
      type: 'triggers',
      label: 'UI / Processors',
      y: SWIMLANE_PADDING,
      height: SWIMLANE_HEIGHT,
    },
    {
      type: 'commands',
      label: 'Commands',
      y: SWIMLANE_PADDING + SWIMLANE_HEIGHT,
      height: SWIMLANE_HEIGHT,
    },
  ];

  // Add system-specific event swimlanes
  systems.forEach((system, index) => {
    swimlanes.push({
      type: 'events',
      label: `Events: ${system.title ?? system.id}`,
      y: SWIMLANE_PADDING + SWIMLANE_HEIGHT * (2 + index),
      height: SWIMLANE_HEIGHT,
      systems: [system.id],
    });
  });

  // Add read models swimlane
  swimlanes.push({
    type: 'readModels',
    label: 'Read Models',
    y: SWIMLANE_PADDING + SWIMLANE_HEIGHT * (2 + systems.length),
    height: SWIMLANE_HEIGHT,
  });

  // Position entities based on levels and swimlanes
  const layoutEntities: LayoutEntity[] = [];
  const maxLevel = Math.max(...[...levels.values()], 0);

  entities.forEach((entity) => {
    const level = levels.get(entity.id) ?? 0;
    const swimlane = getSwimlaneForEntity(entity, systems);

    const x = SWIMLANE_PADDING + level * (ENTITY_WIDTH + ENTITY_SPACING);
    const swimlaneY = swimlanes[swimlane]?.y ?? SWIMLANE_PADDING;
    const y = swimlaneY + (SWIMLANE_HEIGHT - ENTITY_HEIGHT) / 2;

    layoutEntities.push({
      entity,
      x,
      y,
      width: ENTITY_WIDTH,
      height: ENTITY_HEIGHT,
      swimlane,
    });
  });

  // Create layout edges
  const layoutEdges: LayoutEdge[] = [];
  edges.forEach((edge) => {
    const sourceEntity = layoutEntities.find((le) => le.entity.id === edge.source);
    const targetEntity = layoutEntities.find((le) => le.entity.id === edge.target);

    if (sourceEntity && targetEntity) {
      layoutEdges.push({
        edge,
        sourceEntity,
        targetEntity,
      });
    }
  });

  // Calculate total dimensions
  const width = SWIMLANE_PADDING * 2 + (maxLevel + 1) * (ENTITY_WIDTH + ENTITY_SPACING);
  const height = SWIMLANE_PADDING * 2 + swimlanes.length * SWIMLANE_HEIGHT;

  return {
    entities: layoutEntities,
    edges: layoutEdges,
    swimlanes,
    width,
    height,
  };
}

/**
 * Draw swimlanes as horizontal bands
 */
export function drawSwimlanes(swimlanesElem: D3Element, layout: EventModelingLayout): void {
  layout.swimlanes.forEach((swimlane, index) => {
    const g = swimlanesElem.append('g').attr('class', 'swimlane');

    // Draw swimlane background
    g.append('rect')
      .attr('x', 0)
      .attr('y', swimlane.y)
      .attr('width', layout.width)
      .attr('height', swimlane.height)
      .attr('class', `swimlane-bg swimlane-${index % 2 === 0 ? 'even' : 'odd'}`);

    // Draw swimlane label
    g.append('text')
      .attr('x', 10)
      .attr('y', swimlane.y + 20)
      .attr('class', 'swimlane-label')
      .text(swimlane.label);
  });
}

/**
 * Draw entities as colored rectangles with labels
 */
export function drawEntities(entitiesElem: D3Element, layout: EventModelingLayout): void {
  const config = getConfig();

  layout.entities.forEach((layoutEntity) => {
    const { entity, x, y, width, height } = layoutEntity;
    const g = entitiesElem.append('g').attr('class', `entity entity-${entity.type}`);

    // Draw entity rectangle
    const fillColor = ENTITY_COLORS[entity.type];
    const borderColor = ENTITY_BORDER_COLORS[entity.type];

    g.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', width)
      .attr('height', height)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', fillColor)
      .attr('stroke', borderColor)
      .attr('stroke-width', 2);

    // Determine label text
    let labelText = entity.id;
    if ('title' in entity && entity.title) {
      labelText = entity.title;
    }

    // Add data if present
    if ('data' in entity && entity.data) {
      labelText += `\n(${entity.data})`;
    }

    // Draw entity label
    const textElem = g.append('g');
    void createText(
      textElem,
      labelText,
      {
        useHtmlLabels: false,
        width: width - 10,
        classes: 'entity-label',
      },
      config
    );

    textElem
      .attr('transform', `translate(${x + width / 2}, ${y + height / 2})`)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle');
  });
}

/**
 * Draw edges as arrows connecting entities
 */
export function drawEdges(edgesElem: D3Element, layout: EventModelingLayout): void {
  layout.edges.forEach((layoutEdge) => {
    const { sourceEntity, targetEntity } = layoutEdge;

    // Calculate connection points
    const sourceX = sourceEntity.x + sourceEntity.width;
    const sourceY = sourceEntity.y + sourceEntity.height / 2;
    const targetX = targetEntity.x;
    const targetY = targetEntity.y + targetEntity.height / 2;

    const g = edgesElem.append('g').attr('class', 'edge');

    // Draw edge path
    let pathD: string;

    if (sourceEntity.swimlane === targetEntity.swimlane) {
      // Same swimlane: straight line
      pathD = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
    } else {
      // Different swimlanes: use a curved path
      const midX = (sourceX + targetX) / 2;
      pathD = `M ${sourceX},${sourceY} L ${midX},${sourceY} L ${midX},${targetY} L ${targetX},${targetY}`;
    }

    g.append('path')
      .attr('d', pathD)
      .attr('class', 'edge-path')
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

    // Add arrowhead marker (defined once in defs)
    const svg = edgesElem.node()?.ownerSVGElement;
    if (svg && !svg.querySelector('#arrowhead')) {
      const defs = edgesElem.append('defs');
      defs
        .append('marker')
        .attr('id', 'arrowhead')
        .attr('markerWidth', EDGE_ARROW_SIZE)
        .attr('markerHeight', EDGE_ARROW_SIZE)
        .attr('refX', EDGE_ARROW_SIZE)
        .attr('refY', EDGE_ARROW_SIZE / 2)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', `0 0, ${EDGE_ARROW_SIZE} ${EDGE_ARROW_SIZE / 2}, 0 ${EDGE_ARROW_SIZE}`)
        .attr('fill', '#333');
    }
  });
}
