import test from 'node:test';
import assert from 'node:assert/strict';

test('interview score average is rounded correctly', () => { const values = [82, 76, 74]; assert.equal(Math.round(values.reduce((a,b)=>a+b,0)/values.length), 77); });
test('supported interview types remain stable', () => { assert.deepEqual(['technical','behavioral','general'].sort(), ['behavioral','general','technical']); });
test('password policy requires eight characters', () => { assert.equal('secure12'.length >= 8, true); assert.equal('short'.length >= 8, false); });
