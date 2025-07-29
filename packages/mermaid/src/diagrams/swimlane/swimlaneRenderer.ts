import { select } from 'd3';
import { log } from '../../logger.js';
import { db } from './swimlaneDb.js';
import type { DiagramRenderer, DrawDefinition, SVG } from '../../diagram-api/types.js';
import { setupGraphViewbox } from '../../setupGraphViewbox.js';
import type { Swimlane, SwimlaneData } from './swimlaneTypes.js';
import type { Diagram } from '../../Diagram.js';

const LANE_HEIGHT = 200;
const LANE_LABEL_WIDTH = 150;
const NODE_WIDTH = 100;
const NODE_HEIGHT = 40;
const NODE_SPACING = 150;

const draw: DrawDefinition = (text: string, id: string, version: string, diagram: Diagram): void => {
  log.debug('Rendering swimlane diagram', { text, id, version });
  
  const data = db.getData();
  const svg: SVG = select(`#${id}`);
  
  svg.selectAll('*').remove();
  
  const g = svg.append('g').attr('class', 'swimlane-diagram');
  
  // Calculate dimensions
  const diagramWidth = Math.max(600, LANE_LABEL_WIDTH + (getMaxNodesInLane(data) * NODE_SPACING));
  const diagramHeight = data.lanes.length * LANE_HEIGHT;
  
  // Draw swimlanes
  data.lanes.forEach((lane, laneIndex) => {
    const laneY = laneIndex * LANE_HEIGHT;
    
    // Draw lane background
    g.append('rect')
      .attr('class', 'swimlane-bg')
      .attr('x', 0)
      .attr('y', laneY)
      .attr('width', diagramWidth)
      .attr('height', LANE_HEIGHT)
      .attr('fill', laneIndex % 2 === 0 ? '#f9f9f9' : '#ffffff')
      .attr('stroke', '#cccccc')
      .attr('stroke-width', 1);
    
    // Draw lane label
    g.append('rect')
      .attr('class', 'swimlane-label-bg')
      .attr('x', 0)
      .attr('y', laneY)
      .attr('width', LANE_LABEL_WIDTH)
      .attr('height', LANE_HEIGHT)
      .attr('fill', '#e6e6e6')
      .attr('stroke', '#999999')
      .attr('stroke-width', 1);
    
    g.append('text')
      .attr('class', 'swimlane-label')
      .attr('x', LANE_LABEL_WIDTH / 2)
      .attr('y', laneY + LANE_HEIGHT / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(lane.title)
      .style('font-family', 'Arial, sans-serif')
      .style('font-size', '14px')
      .style('font-weight', 'bold');
    
    // Draw nodes in this lane
    lane.vertices.forEach((vertexId, nodeIndex) => {
      const vertex = data.vertices.get(vertexId);
      if (vertex) {
        const nodeX = LANE_LABEL_WIDTH + 50 + (nodeIndex * NODE_SPACING);
        const nodeY = laneY + (LANE_HEIGHT - NODE_HEIGHT) / 2;
        
        // Draw node rectangle
        g.append('rect')
          .attr('class', 'swimlane-node')
          .attr('id', `node-${vertexId}`)
          .attr('x', nodeX)
          .attr('y', nodeY)
          .attr('width', NODE_WIDTH)
          .attr('height', NODE_HEIGHT)
          .attr('fill', '#ffffff')
          .attr('stroke', '#333333')
          .attr('stroke-width', 2)
          .attr('rx', 5);
        
        // Draw node text
        g.append('text')
          .attr('class', 'swimlane-node-text')
          .attr('x', nodeX + NODE_WIDTH / 2)
          .attr('y', nodeY + NODE_HEIGHT / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .text(vertex.text)
          .style('font-family', 'Arial, sans-serif')
          .style('font-size', '12px');
      }
    });
  });
  
  // Draw edges
  data.edges.forEach(edge => {
    const startNode = findNodePosition(data, edge.start);
    const endNode = findNodePosition(data, edge.end);
    
    if (startNode && endNode) {
      // Calculate edge path
      const startX = startNode.x + NODE_WIDTH;
      const startY = startNode.y + NODE_HEIGHT / 2;
      const endX = endNode.x;
      const endY = endNode.y + NODE_HEIGHT / 2;
      
      // Draw edge line
      g.append('line')
        .attr('class', 'swimlane-edge')
        .attr('x1', startX)
        .attr('y1', startY)
        .attr('x2', endX)
        .attr('y2', endY)
        .attr('stroke', '#333333')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');
      
      // Draw edge text if present
      if (edge.text) {
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        g.append('text')
          .attr('class', 'swimlane-edge-text')
          .attr('x', midX)
          .attr('y', midY - 5)
          .attr('text-anchor', 'middle')
          .text(edge.text)
          .style('font-family', 'Arial, sans-serif')
          .style('font-size', '10px')
          .style('fill', '#666666');
      }
    }
  });
  
  // Add arrowhead marker
  const defs = svg.append('defs');
  defs.append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 9)
    .attr('refY', 3)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,0 L0,6 L9,3 z')
    .attr('fill', '#333333');
  
  setupGraphViewbox(undefined, svg, 0, false);
};

export const renderer: DiagramRenderer = {
  draw,
};

function getMaxNodesInLane(data: SwimlaneData): number {
  return Math.max(...data.lanes.map(lane => lane.vertices.length), 1);
}

function findNodePosition(data: SwimlaneData, nodeId: string): { x: number; y: number } | null {
  for (let laneIndex = 0; laneIndex < data.lanes.length; laneIndex++) {
    const lane = data.lanes[laneIndex];
    const nodeIndex = lane.vertices.indexOf(nodeId);
    if (nodeIndex !== -1) {
      const x = LANE_LABEL_WIDTH + 50 + (nodeIndex * NODE_SPACING);
      const y = laneIndex * LANE_HEIGHT + (LANE_HEIGHT - NODE_HEIGHT) / 2;
      return { x, y };
    }
  }
  return null;
}