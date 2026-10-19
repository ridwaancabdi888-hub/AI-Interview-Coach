import test from 'node:test';
import assert from 'node:assert/strict';
import { focusTrapTarget } from '../src/lib/navigation/focus-trap.mjs';

const first = { id: 'first' };
const middle = { id: 'middle' };
const last = { id: 'last' };
const items = [first, middle, last];

test('moves forward from the last item to the first', () => {
  assert.equal(focusTrapTarget(items, last, false), first);
});

test('moves backward from the first item to the last', () => {
  assert.equal(focusTrapTarget(items, first, true), last);
});

test('keeps normal tab order for an item inside the dialog', () => {
  assert.equal(focusTrapTarget(items, middle, false), null);
  assert.equal(focusTrapTarget(items, middle, true), null);
});

test('recovers focus when the active element is outside the dialog', () => {
  assert.equal(focusTrapTarget(items, { id: 'outside' }, false), first);
  assert.equal(focusTrapTarget(items, { id: 'outside' }, true), last);
});

test('handles a dialog without focusable controls', () => {
  assert.equal(focusTrapTarget([], null, false), null);
});
