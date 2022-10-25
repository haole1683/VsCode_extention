import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	test('Sample test', () => {
		console.log("test in extension.test.ts");

		// assert.strictEqual(-1, [1, 2, 3].indexOf(1));  Test Failure
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});
});
