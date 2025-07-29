const getStyles = (options: any) =>
  `
    .swimlane-diagram {
      font-family: 'Arial', sans-serif;
    }

    .swimlane-bg {
      stroke: #cccccc;
      stroke-width: 1;
    }

    .swimlane-label-bg {
      fill: #e6e6e6;
      stroke: #999999;
      stroke-width: 1;
    }

    .swimlane-label {
      font-size: 14px;
      font-weight: bold;
      fill: #333333;
    }

    .swimlane-node {
      fill: #ffffff;
      stroke: #333333;
      stroke-width: 2;
      cursor: pointer;
    }

    .swimlane-node:hover {
      fill: #f0f0f0;
    }

    .swimlane-node-text {
      font-size: 12px;
      fill: #333333;
      pointer-events: none;
    }

    .swimlane-edge {
      stroke: #333333;
      stroke-width: 2;
      fill: none;
    }

    .swimlane-edge-text {
      font-size: 10px;
      fill: #666666;
      text-anchor: middle;
    }
  `;

export const styles = getStyles;