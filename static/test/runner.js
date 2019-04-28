import {deepEqual} from './equality.js';

const tests = new Set();
const onlyTests = new Set();

export function test(description, fn) {
	tests.add([fn && description, fn || description]);
}

test.only = function only(description, fn) {
	onlyTests.add([fn && description, fn || description]);
}

test.title = function title(description) {
	test(`\n# ${description}\n# `, () => null);
}

export async function run() {
	console.log('TAP version 13');

  let total = 0;
  let passed = 0;
  let failed = 0;

  const assert = {
    comment(message) {
      console.log(`# ${message}`);
    },

    ok(value, message = 'should be ok', ...rest) {
      const output = `ok ${++total} ${message}`;

      if (value) {
        ++passed;
        console.log(output);
      } else {
        ++failed;
        console.log(`not ${output}`);
        console.error(...rest);
      }
    },

    equal(actual, expected, message = 'should be equal') {
      assert.ok(Object.is(actual, expected), message, { actual, expected });
    },

    notEqual(actual, expected, message = 'should not be equal') {
      assert.ok(!Object.is(actual, expected), message, { actual, expected });
    },

    deepEqual(actual, expected, message = 'should be deeply equal') {
      assert.ok(deepEqual(actual, expected), message, { actual, expected });
    },

    notDeepEqual(actual, expected, message = 'should not be deeply equal') {
      assert.ok(!deepEqual(actual, expected), message, { actual, expected });
    },
  };

  const testsToRun = onlyTests.size ? onlyTests : tests;

	for (const [description, fn] of testsToRun) {
		if (description) {
			console.log(`# ${description}`);
		}

    try {
		  await fn(assert);
    } catch (e) {
      ++failed;
      console.error(e);
    }
	}

	console.log(`# pass: ${passed}`);
	console.log(`# fail: ${failed}`);
	console.log(`1..${total}`);
}