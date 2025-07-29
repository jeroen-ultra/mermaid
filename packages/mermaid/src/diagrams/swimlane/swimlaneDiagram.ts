import type { DiagramDefinition } from '../../diagram-api/types.js';
import { parser } from './swimlaneParser.js';
import { db } from './swimlaneDb.js';
import { renderer } from './swimlaneRenderer.js';
import { styles } from './swimlaneStyles.js';

export const diagram: DiagramDefinition = {
  parser,
  db,
  renderer,
  styles,
};