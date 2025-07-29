import type { DiagramDB } from '../../diagram-api/types.js';
import type { BaseDiagramConfig } from '../../config.type.js';
import { getConfig } from '../../diagram-api/diagramAPI.js';
import { log } from '../../logger.js';
import {
  setAccTitle,
  getAccTitle,
  getAccDescription,
  setAccDescription,
  clear as commonClear,
  setDiagramTitle,
  getDiagramTitle,
} from '../common/commonDb.js';
import type { FlowVertex, FlowEdge } from '../flowchart/types.js';
import type { Swimlane, SwimlaneData } from './swimlaneTypes.js';

let config = getConfig();

class SwimlaneDB implements DiagramDB {
  private lanes: Swimlane[] = [];
  private vertices = new Map<string, FlowVertex>();
  private edges: FlowEdge[] = [];
  private currentLane: Swimlane | null = null;
  
  constructor() {
    this.clear();
  }

  clear = (): void => {
    this.lanes = [];
    this.vertices.clear();
    this.edges = [];
    this.currentLane = null;
    config = getConfig();
    commonClear();
  };

  addLane = (id: string, title: string): void => {
    const lane: Swimlane = {
      id,
      title,
      vertices: [],
    };
    this.lanes.push(lane);
    this.currentLane = lane;
    log.debug('Added lane:', lane);
  };

  addVertex = (id: string, text: string, type: string, style?: string, classes?: string, dir?: string): void => {
    // Only create vertex if it doesn't exist
    if (!this.vertices.has(id)) {
      const vertex: FlowVertex = {
        id,
        text,
        type: type as any, // Cast to satisfy FlowVertex type requirements
        domId: id,
        labelType: 'text' as const,
        styles: style ? [style] : [],
        classes: classes ? [classes] : [],
        dir: dir || '',
      };
      this.vertices.set(id, vertex);
      
      if (this.currentLane) {
        this.currentLane.vertices.push(id);
      }
      
      log.debug('Added vertex:', vertex, 'to lane:', this.currentLane?.id);
    } else {
      // Vertex already exists, don't add to current lane
      log.debug('Vertex already exists:', id, 'not adding to current lane');
    }
  };

  addEdge = (start: string, end: string, text?: string, type?: string): void => {
    const edge: FlowEdge = {
      start,
      end,
      text: text || '',
      type: type || 'arrow',
      isUserDefinedId: false,
      labelType: 'text' as const,
      classes: [],
    };
    this.edges.push(edge);
    log.debug('Added edge:', edge);
  };

  getLanes = (): Swimlane[] => this.lanes;
  getVertices = (): Map<string, FlowVertex> => this.vertices;
  getEdges = (): FlowEdge[] => this.edges;
  
  getData = (): SwimlaneData => ({
    lanes: this.lanes,
    vertices: this.vertices,
    edges: this.edges,
  });

  // Required DiagramDB methods
  getConfig = (): BaseDiagramConfig | undefined => config as BaseDiagramConfig;
  setAccTitle = setAccTitle;
  getAccTitle = getAccTitle;
  setAccDescription = setAccDescription;
  getAccDescription = getAccDescription;
  setDiagramTitle = setDiagramTitle;
  getDiagramTitle = getDiagramTitle;
}

export const db = new SwimlaneDB();