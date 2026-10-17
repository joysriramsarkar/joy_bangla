// Combined 500 New Strategic Initiatives (INIT-101 to INIT-600)
const p1 = require('./pillar1_ai_tech');
const p2 = require('./pillar2_literature');
const p3 = require('./pillar3_culture');
const p4 = require('./pillar4_science');
const p5 = require('./pillar5_governance');
const p6 = require('./pillar6_education');
const p7 = require('./pillar7_diaspora');
const p8 = require('./pillar8_commerce');
const p9 = require('./pillar9_accessibility');
const p10 = require('./pillar10_community');

const initiatives500 = [
  ...p1,
  ...p2,
  ...p3,
  ...p4,
  ...p5,
  ...p6,
  ...p7,
  ...p8,
  ...p9,
  ...p10,
];

module.exports = initiatives500;
