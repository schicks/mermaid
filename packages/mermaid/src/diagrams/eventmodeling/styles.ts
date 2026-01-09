import type { DiagramStylesProvider } from '../../diagram-api/types.js';
import type { EventModelingStyleOptions } from './types.js';

const getStyles: DiagramStylesProvider = (options: EventModelingStyleOptions) =>
  `
  .eventmodeling-swimlanes .swimlane-bg {
    fill: ${options.emSwimlaneBgColor};
    stroke: ${options.emSwimlaneBorderColor};
    stroke-width: ${options.emSwimlaneBorderWidth};
  }

  .eventmodeling-swimlanes .swimlane-bg.swimlane-odd {
    fill: ${options.emSwimlaneAltBgColor};
  }

  .eventmodeling-swimlanes .swimlane-label {
    font-size: ${options.emSwimlaneLabelFontSize};
    font-weight: bold;
    fill: ${options.emSwimlaneLabelColor};
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
    font-size: ${options.emEntityLabelFontSize};
  }

  .eventmodeling-entities .entity-screen rect {
    fill: ${options.emScreenBgColor};
    stroke: ${options.emScreenBorderColor};
    stroke-width: ${options.emEntityBorderWidth};
  }

  .eventmodeling-entities .entity-screen .entity-label {
    fill: ${options.emScreenTextColor};
  }

  .eventmodeling-entities .entity-processor rect {
    fill: ${options.emProcessorBgColor};
    stroke: ${options.emProcessorBorderColor};
    stroke-width: ${options.emEntityBorderWidth};
  }

  .eventmodeling-entities .entity-processor .entity-label {
    fill: ${options.emProcessorTextColor};
  }

  .eventmodeling-entities .entity-command rect {
    fill: ${options.emCommandBgColor};
    stroke: ${options.emCommandBorderColor};
    stroke-width: ${options.emEntityBorderWidth};
  }

  .eventmodeling-entities .entity-command .entity-label {
    fill: ${options.emCommandTextColor};
  }

  .eventmodeling-entities .entity-event rect {
    fill: ${options.emEventBgColor};
    stroke: ${options.emEventBorderColor};
    stroke-width: ${options.emEntityBorderWidth};
  }

  .eventmodeling-entities .entity-event .entity-label {
    fill: ${options.emEventTextColor};
  }

  .eventmodeling-entities .entity-readmodel rect {
    fill: ${options.emReadModelBgColor};
    stroke: ${options.emReadModelBorderColor};
    stroke-width: ${options.emEntityBorderWidth};
  }

  .eventmodeling-entities .entity-readmodel .entity-label {
    fill: ${options.emReadModelTextColor};
  }

  .eventmodeling-edges .edge-path {
    fill: none;
    stroke: ${options.emEdgeColor};
    stroke-width: ${options.emEdgeWidth};
  }

  .eventmodeling-edges .edge-path:hover {
    stroke: ${options.emEdgeHoverColor};
    stroke-width: ${options.emEdgeHoverWidth};
  }

  .eventmodeling-edges .arrowhead {
    fill: ${options.emEdgeArrowColor};
  }
`;

export default getStyles;
