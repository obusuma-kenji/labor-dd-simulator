export { stage1Scenario } from './stage1Scenario';
export { stage2Scenario } from './stage2Scenario';
export { stage3Scenario } from './stage3Scenario';
export { stage4Scenario } from './stage4Scenario';
export { stage5Scenario } from './stage5Scenario';
export { stage6Scenario } from './stage6Scenario';

import { stage1Scenario } from './stage1Scenario';
import { stage2Scenario } from './stage2Scenario';
import { stage3Scenario } from './stage3Scenario';
import { stage4Scenario } from './stage4Scenario';
import { stage5Scenario } from './stage5Scenario';
import { stage6Scenario } from './stage6Scenario';
import { StageScenario } from '../types';

export const allStages: StageScenario[] = [
  stage1Scenario,
  stage2Scenario,
  stage3Scenario,
  stage4Scenario,
  stage5Scenario,
  stage6Scenario
];
