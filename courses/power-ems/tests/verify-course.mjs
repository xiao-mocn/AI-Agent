import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('courses/power-ems');
const requiredFiles = [
  'MISSION.md',
  'NOTES.md',
  'RESOURCES.md',
  'reference/microgrid-ems-glossary.html',
  'lessons/0001-ems-monitoring-basics.html',
];

for (const relativePath of requiredFiles) {
  assert.ok(existsSync(resolve(root, relativePath)), `Missing ${relativePath}`);
}

const mission = readFileSync(resolve(root, 'MISSION.md'), 'utf8');
assert.match(mission, /微电网 EMS/);
assert.match(mission, /每天 30 分钟/);

const resources = readFileSync(resolve(root, 'RESOURCES.md'), 'utf8');
assert.match(resources, /nrel\.gov/);
assert.match(resources, /energy\.gov/);
assert.match(resources, /ieee\.org/);

const glossary = readFileSync(resolve(root, 'reference/microgrid-ems-glossary.html'), 'utf8');
for (const term of ['功率', '能量', 'SOC', '并网', '离网', '测点时效']) {
  assert.match(glossary, new RegExp(term));
}

const lesson = readFileSync(resolve(root, 'lessons/0001-ems-monitoring-basics.html'), 'utf8');
for (const requiredText of [
  '功率不是能量',
  '需按项目约定确认',
  '控制指令',
  'answerQuestion',
  'microgrid-ems-glossary.html',
]) {
  assert.match(lesson, new RegExp(requiredText));
}

assert.match(lesson, /<meta charset="UTF-8">/);
assert.match(lesson, /viewport/);

const lesson2 = readFileSync(resolve(root, 'lessons/0002-data-freshness-and-trust.html'), 'utf8');
for (const requiredText of [
  '数据新鲜度',
  '过期',
  '可信状态',
  'resolveDisplayState',
  'class="goal"',
  'class="step"',
  'class="quiz"',
]) {
  assert.match(lesson2, new RegExp(requiredText));
}

assert.match(lesson2, /<meta charset="UTF-8">/);
assert.match(lesson2, /viewport/);
console.log('Power EMS course structure verified.');
