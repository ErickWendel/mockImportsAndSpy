# mockImportsAndSpy

`mockImportsAndSpy` is a utility module designed to simplify the mocking and spying of internal modules in JavaScript applications, especially when dealing with dynamically created or non-existent functions. This is particularly useful in scenarios where directly interacting with certain modules (like `blessed`) can cause unintended side effects during testing, such as altering your terminal state.

## Features

- **Dynamic Mocking**: Automatically create mocks for any functions or properties accessed on the imported modules, even if they don’t exist.
- **Spy Functionality**: Keep track of function calls, arguments, and execution counts, helping you validate the behavior of your code during testing.
- **Seamless Integration**: Easily override modules to work with your existing test setup, ensuring that all functions and properties are proxied and ready to be spied on.

## Installation

```bash
npm install @erickwendel/mock-imports-and-spy
```

## Usage

### Basic Example

Imagine you are using a module like `blessed` that directly interacts with the terminal, making testing difficult. `mockImportsAndSpy` allows you to override these modules so that any method calls become proxies, which can be easily mocked and spied on.

```javascript
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
```

### Full Example with Tests


## API

### `overrideModules(modules)`

Overrides the provided modules by applying proxies that dynamically create and spy on any accessed methods or properties.

- **modules**: An array of modules you wish to override.

### Proxies Created by `mockImportsAndSpy`

Any accessed method or property on the overridden module will:
- Return a mock function that can be spied on.
- Automatically create nested mocks for any sub-properties or methods.

## Contributing

If you'd like to contribute to `mockImportsAndSpy`, please fork the repository, make your changes, and submit a pull request. We welcome all contributions!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Known Bugs

See the [example.js](./example.js) to check the known bugs