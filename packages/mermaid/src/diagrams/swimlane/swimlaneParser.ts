import type { ParserDefinition } from '../../diagram-api/types.js';
import { db } from './swimlaneDb.js';
import { log } from '../../logger.js';

export const parser: ParserDefinition = {
  parse: async (input: string): Promise<void> => {
    const lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let currentLaneId = '';
    let laneCounter = 0;
    let insideLane = false;
    
    for (const line of lines) {
      // Skip the initial "swimlane" keyword
      if (line === 'swimlane') {
        continue;
      }
      
      // Handle lane definition: lane "System A"
      const laneMatch = line.match(/^lane\s+"([^"]+)"$/);
      if (laneMatch) {
        currentLaneId = `lane-${laneCounter++}`;
        db.addLane(currentLaneId, laneMatch[1]);
        insideLane = true;
        continue;
      }
      
      // Handle end of lane
      if (line === 'end') {
        insideLane = false;
        currentLaneId = '';
        continue;
      }
      
      // Only parse flowchart syntax when inside a lane
      if (!insideLane) {
        continue;
      }
      
      // Handle vertex definitions: A[Node A]
      const vertexMatch = line.match(/^([A-Za-z0-9_]+)\[([^\]]+)\]$/);
      if (vertexMatch) {
        const [, id, text] = vertexMatch;
        db.addVertex(id, text, 'rect');
        continue;
      }
      
      // Handle edge definitions: A --> B
      const edgeMatch = line.match(/^([A-Za-z0-9_]+)\s*-->\s*([A-Za-z0-9_]+)$/);
      if (edgeMatch) {
        const [, start, end] = edgeMatch;
        db.addEdge(start, end);
        continue;
      }
      
      // Handle edge with label: A -->|label| B
      const edgeWithLabelMatch = line.match(/^([A-Za-z0-9_]+)\s*-->\|([^|]+)\|\s*([A-Za-z0-9_]+)$/);
      if (edgeWithLabelMatch) {
        const [, start, label, end] = edgeWithLabelMatch;
        db.addEdge(start, end, label);
        continue;
      }
      
      // Handle combined vertex and edge: A[Node A] --> B[Node B]
      const combinedMatch = line.match(/^([A-Za-z0-9_]+)\[([^\]]+)\]\s*-->\s*([A-Za-z0-9_]+)(?:\[([^\]]+)\])?$/);
      if (combinedMatch) {
        const [, startId, startText, endId, endText] = combinedMatch;
        db.addVertex(startId, startText, 'rect');
        if (endText) {
          db.addVertex(endId, endText, 'rect');
        }
        db.addEdge(startId, endId);
        continue;
      }
      
      // Handle combined with label: A[Node A] -->|label| B[Node B]
      const combinedWithLabelMatch = line.match(/^([A-Za-z0-9_]+)\[([^\]]+)\]\s*-->\|([^|]+)\|\s*([A-Za-z0-9_]+)(?:\[([^\]]+)\])?$/);
      if (combinedWithLabelMatch) {
        const [, startId, startText, label, endId, endText] = combinedWithLabelMatch;
        db.addVertex(startId, startText, 'rect');
        if (endText) {
          db.addVertex(endId, endText, 'rect');
        }
        db.addEdge(startId, endId, label);
        continue;
      }
      
      log.warn('Unknown line in swimlane diagram:', line);
    }
    
    log.debug('Parsed swimlane diagram:', db.getData());
  },
};