const synonymMap = {
  reactjs: "react",
  "react.js": "react",
  nodejs: "node",
  "node.js": "node",
  expressjs: "express",
  "express.js": "express",
  mongo: "mongodb",
  js: "javascript",
  ts: "typescript",
  py: "python",
};

export const normalizeSkill = (skill) => {
  const cleaned = skill.trim().toLowerCase();
  return synonymMap[cleaned] || cleaned;
};

export const normalizeSkillList = (skills) => {
  return skills.map(normalizeSkill);
};