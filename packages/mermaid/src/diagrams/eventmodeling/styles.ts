import type { DiagramStylesProvider } from '../../diagram-api/types.js';

const getStyles: DiagramStylesProvider = () => `
  .eventmodeling-swimlanes .swimlane-bg {
    fill: #f9f9f9;
    stroke: #ddd;
    stroke-width: 1;
  }

  .eventmodeling-swimlanes .swimlane-bg.swimlane-odd {
    fill: #f0f0f0;
  }

  .eventmodeling-swimlanes .swimlane-label {
    font-size: 14px;
    font-weight: bold;
    fill: #666;
  }

  .eventmodeling-entities .entity {
    cursor: pointer;
  }

  .eventmodeling-entities .entity rect {
    transition: opacity 0.2s;
  }

  .eventmodeling-entities .entity:hover rect {
    opacity: 0.8;
  }

  .eventmodeling-entities .entity-label {
    font-size: 12px;
    fill: #333;
  }

  .eventmodeling-entities .entity-screen .entity-label {
    fill: #333;
  }

  .eventmodeling-entities .entity-processor .entity-label {
    fill: #fff;
  }

  .eventmodeling-entities .entity-command .entity-label {
    fill: #fff;
  }

  .eventmodeling-entities .entity-event .entity-label {
    fill: #fff;
  }

  .eventmodeling-entities .entity-readmodel .entity-label {
    fill: #fff;
  }

  .eventmodeling-edges .edge-path {
    fill: none;
    stroke: #333;
    stroke-width: 2;
  }

  .eventmodeling-edges .edge-path:hover {
    stroke: #555;
    stroke-width: 3;
  }
`;

export default getStyles;
