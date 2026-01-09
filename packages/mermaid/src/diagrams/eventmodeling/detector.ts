import type { DiagramDetector, ExternalDiagramDefinition } from '../../diagram-api/types.js';

export const detector: DiagramDetector = (txt: string) => {
  return /^\s*eventmodeling/.test(txt);
};

const loader = async () => {
  const { diagram } = await import('./diagram.js');
  return { id: 'eventmodeling', diagram };
};

export const eventmodeling: ExternalDiagramDefinition = {
  id: 'eventmodeling',
  detector,
  loader,
};
