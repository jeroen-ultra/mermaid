import { describe, it, beforeEach, expect } from 'vitest';
import { db } from './swimlaneDb.js';

describe('Swimlane Database', () => {
  beforeEach(() => {
    db.clear();
  });

  it('should clear all data', () => {
    db.addLane('lane1', 'System A');
    db.addVertex('A', 'Node A', 'rect');
    db.clear();
    
    const data = db.getData();
    expect(data.lanes).toHaveLength(0);
    expect(data.vertices.size).toBe(0);
    expect(data.edges).toHaveLength(0);
  });

  it('should add lanes correctly', () => {
    db.addLane('lane1', 'System A');
    db.addLane('lane2', 'System B');
    
    const data = db.getData();
    expect(data.lanes).toHaveLength(2);
    expect(data.lanes[0].id).toBe('lane1');
    expect(data.lanes[0].title).toBe('System A');
    expect(data.lanes[1].id).toBe('lane2');
    expect(data.lanes[1].title).toBe('System B');
  });

  it('should add vertices to the current lane', () => {
    db.addLane('lane1', 'System A');
    db.addVertex('A', 'Node A', 'rect');
    db.addVertex('B', 'Node B', 'rect');
    
    const data = db.getData();
    expect(data.vertices.size).toBe(2);
    expect(data.lanes[0].vertices).toEqual(['A', 'B']);
    
    const vertexA = data.vertices.get('A');
    expect(vertexA?.text).toBe('Node A');
    expect(vertexA?.type).toBe('rect');
  });

  it('should add edges correctly', () => {
    db.addEdge('A', 'B', 'label', 'arrow');
    
    const data = db.getData();
    expect(data.edges).toHaveLength(1);
    expect(data.edges[0].start).toBe('A');
    expect(data.edges[0].end).toBe('B');
    expect(data.edges[0].text).toBe('label');
    expect(data.edges[0].type).toBe('arrow');
  });

  it('should handle multiple lanes with vertices', () => {
    db.addLane('lane1', 'System A');
    db.addVertex('A', 'Node A', 'rect');
    
    db.addLane('lane2', 'System B');
    db.addVertex('B', 'Node B', 'rect');
    db.addVertex('C', 'Node C', 'rect');
    
    const data = db.getData();
    expect(data.lanes).toHaveLength(2);
    expect(data.lanes[0].vertices).toEqual(['A']);
    expect(data.lanes[1].vertices).toEqual(['B', 'C']);
  });

  it('should not duplicate vertices when referenced in different lanes', () => {
    db.addLane('lane1', 'System A');
    db.addVertex('A', 'Node A', 'rect');
    
    db.addLane('lane2', 'System B');
    // Trying to add A again should not duplicate it
    db.addVertex('A', 'Node A', 'rect');
    db.addVertex('B', 'Node B', 'rect');
    
    const data = db.getData();
    expect(data.lanes).toHaveLength(2);
    expect(data.lanes[0].vertices).toEqual(['A']);
    expect(data.lanes[1].vertices).toEqual(['B']); // A should not be in lane2
    expect(data.vertices.size).toBe(2); // Only A and B, no duplicates
  });

  it('should handle cross-lane edges correctly', () => {
    db.addLane('lane1', 'System A');
    db.addVertex('A', 'Node A', 'rect');
    
    db.addLane('lane2', 'System B');
    db.addVertex('B', 'Node B', 'rect');
    
    // Cross-lane edge
    db.addEdge('A', 'B', 'cross-lane');
    
    const data = db.getData();
    expect(data.edges).toHaveLength(1);
    expect(data.edges[0].start).toBe('A');
    expect(data.edges[0].end).toBe('B');
    expect(data.edges[0].text).toBe('cross-lane');
  });
});