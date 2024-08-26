import blessed from 'blessed';
import { overrideModules } from './index.js';
import assert from 'node:assert';
import { describe, it, beforeEach } from 'node:test';

describe('Example', () => {

    beforeEach(() => {
        overrideModules([blessed]);
    });

    it('should register form call without calling the original internal module', (context) => {
        // Normally, calling blessed.screen() would alter the terminal UI,
        // making it difficult to run automated tests. By overriding the module,
        // we ensure that this call is safe and does not have side effects.
        const screen = blessed.screen();

        // The 'key' method on the 'screen' object is also proxied.
        // This means that even if it doesn't exist or is not defined,
        // the proxy will handle it gracefully and create a mock function.
        const key = screen.key(['esc'], () => { });

        // Create a form object using blessed.form().
        // The 'form' object and all its methods are now proxied.
        const form = blessed.form({});

        // Define a simple function 'hey' that would be triggered on form submission.
        const hey = (data) => { };

        // Register the 'hey' function as an event listener for the 'submit' event.
        form.on('submit', hey);

        // Check that the 'on' method was called exactly once.
        assert.strictEqual(form.on.mock.callCount(), 1);

        // Verify that the first call to the 'on' method had the correct arguments.
        // Specifically, it should have registered the 'submit' event with the 'hey' function.
        assert.deepStrictEqual(form.on.mock.calls[0].arguments, ['submit', hey]);
    });

    it('known bug', (context) => {

        // known bug, first level functions are not being mocked
        // assert.strictEqual(blessed.screen.mock.callCount(), 1);

        // instead you'd mock them directly as
        const screenMock = context.mock.method(blessed, "screen");

        blessed.screen();

        assert.strictEqual(screenMock.mock.callCount(), 1)
    })
});
