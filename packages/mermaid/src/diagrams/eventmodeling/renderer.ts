import type { DrawDefinition, SVG } from '../../diagram-api/types.js';
import type { Diagram } from '../../Diagram.js';
import { log } from '../../logger.js';
import { selectSvgElement } from '../../rendering-util/selectSvgElement.js';
import { setupGraphViewbox } from '../../setupGraphViewbox.js';
import type { EventModelingDB } from './db.js';
import { drawEdges, drawEntities, drawSwimlanes, layoutEventModeling } from './svgDraw.js';

export const draw: DrawDefinition = (text, id, _version, diagObj: Diagram) => {
  const db = diagObj.db as EventModelingDB;

  log.debug('EventModeling renderer called');

  const systems = db.getSystems();
  const entities = db.getEntities();
  const edges = db.getEdges();

  const svg: SVG = selectSvgElement(id);

  // Create layers for rendering
  const swimlanesElem = svg.append('g');
  swimlanesElem.attr('class', 'eventmodeling-swimlanes');

  const entitiesElem = svg.append('g');
  entitiesElem.attr('class', 'eventmodeling-entities');

  const edgesElem = svg.append('g');
  edgesElem.attr('class', 'eventmodeling-edges');

  // Calculate layout
  const layout = layoutEventModeling(systems, entities, edges);

  // Draw in order: swimlanes, entities, edges
  drawSwimlanes(swimlanesElem, layout);
  drawEntities(entitiesElem, layout);
  drawEdges(edgesElem, layout);

  // Setup graph view box with padding
  const padding = 20;
  const useMaxWidth = true;
  setupGraphViewbox(undefined, svg, padding, useMaxWidth);
};

export const renderer = { draw };
