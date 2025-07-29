import type { FlowVertex, FlowEdge } from '../flowchart/types.js';

export interface Swimlane {
  id: string;
  title: string;
  vertices: string[]; // vertex IDs in this lane
}

export interface SwimlaneData {
  lanes: Swimlane[];
  vertices: Map<string, FlowVertex>;
  edges: FlowEdge[];
}