# 🧪 Angular Unit Testing with Jasmine & Karma
## Complete Guide — Interview Ready (4+ Years Experience)

---

## 📚 Table of Contents

1. [Introduction to Jasmine & Karma](#1-introduction-to-jasmine--karma)
2. [Angular Unit Test Flow](#2-angular-unit-test-flow)
3. [How to Run Angular Unit Tests](#3-how-to-run-angular-unit-tests)
4. [Jasmine & Karma Configuration](#4-jasmine--karma-configuration)
5. [First Angular Unit Test Case](#5-first-angular-unit-test-case)
6. [Excluding Test Cases from Execution](#6-excluding-test-cases-from-execution)
7. [Jasmine Matchers](#7-jasmine-matchers)
8. [Advanced Topics](#8-advanced-topics)
9. [Interview Questions & Answers (4+ Years)](#9-interview-questions--answers-4-years)

---

## 1. Introduction to Jasmine & Karma

### 🔷 What is Jasmine?

Jasmine is an **open-source, behavior-driven development (BDD) JavaScript testing framework** that requires no DOM and has no external dependencies.

| Feature | Details |
|--------|---------|
| Type | BDD Testing Framework |
| Language | JavaScript / TypeScript |
| Dependency | None (standalone) |
| Async Support | Yes |
| Angular Default | Yes (CLI-generated projects) |

#### Key Characteristics of Jasmine

- **BDD-based**: Tests are written in plain English so both technical and non-technical stakeholders can understand them.
- **No external dependencies**: Jasmine works standalone without needing other libraries.
- **Async testing**: Supports testing of Promises, Observables, and async/await patterns.
- **Spies**: Built-in spy system to track function calls, mock implementations, and verify arguments.
- **Matchers**: Rich set of built-in matchers like `toBe`, `toEqual`, `toContain`, etc.

#### Jasmine Core Building Blocks

```typescript
// describe() - Test Suite: Groups related tests
describe('Calculator', () => {

  // it() or test() - Spec: Individual test case
  it('should add two numbers correctly', () => {

    // expect() - Assertion
    expect(1 + 2).toBe(3);
  });
});
```

#### Jasmine Lifecycle Hooks

```typescript
describe('UserService', () => {

  beforeAll(() => {
    // Runs ONCE before ALL tests in this describe block
    console.log('Suite started');
  });

  afterAll(() => {
    // Runs ONCE after ALL tests in this describe block
    console.log('Suite ended');
  });

  beforeEach(() => {
    // Runs before EACH individual test
    // Use for setup: initializing variables, creating fresh instances
  });

  afterEach(() => {
    // Runs after EACH individual test
    // Use for cleanup: resetting spies, clearing mocks
  });

  it('should do something', () => {
    // actual test
  });
});
```

---

### 🔷 What is Karma?

Karma is a **test runner** — it does not write or execute test logic itself, but it **launches browsers and runs your Jasmine tests inside them**.

| Feature | Details |
|--------|---------|
| Created by | Angular team (originally AngularJS) |
| Built on | Node.js |
| Type | Test Runner / Automation Tool |
| Browser Support | Chrome, Firefox, Safari, IE, PhantomJS, headless |
| CI Integration | Travis CI, Jenkins, CircleCI, GitHub Actions |

#### Key Characteristics of Karma

- **Cross-browser testing**: Runs the same tests in Chrome, Firefox, Safari simultaneously.
- **Real browser execution**: Unlike jsdom, tests run in actual browsers for accurate results.
- **Watch mode**: Automatically re-runs tests when files change.
- **CI/CD support**: Integrates easily with Jenkins, Travis CI, GitHub Actions.
- **Plugin ecosystem**: Supports coverage reporters (Istanbul), multiple browsers, preprocessors.

#### How Karma Works Internally

```
Your Test Files (.spec.ts)
        ↓
TypeScript Compiler (tsc / webpack)
        ↓
Karma Server (Node.js — serves compiled JS)
        ↓
Browser Launcher (Chrome, Firefox, etc.)
        ↓
Jasmine runs tests inside browser
        ↓
Results reported back to Karma
        ↓
Terminal / Coverage Report
```

---

## 2. Angular Unit Test Flow

### How Angular Unit Tests Work Step-by-Step

```
Angular CLI Project
  └── src/
       └── app/
            ├── app.component.ts         ← Component
            └── app.component.spec.ts    ← Test file (auto-generated)
```

#### Step 1 — Angular CLI Generates Spec Files Automatically

When you run `ng generate component myComp`, Angular creates:
- `my-comp.component.ts`
- `my-comp.component.spec.ts` ← test file scaffold

#### Step 2 — TestBed: Angular's Testing Module

`TestBed` is the primary API for writing Angular unit tests. It creates a mini Angular application in memory for testing.

```typescript
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  beforeEach(async () => {
    // Configure a testing module (like NgModule for tests)
    await TestBed.configureTestingModule({
      declarations: [AppComponent],  // declare component under test
      imports: [],                   // import required modules
      providers: [],                 // inject required services
    }).compileComponents();          // compile template + styles
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
```

#### Step 3 — ComponentFixture: The Test Wrapper

```typescript
const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);

// fixture.componentInstance  → Access the component class
// fixture.nativeElement      → Access the DOM element
// fixture.debugElement       → Wrapper around DOM (Angular's way)
// fixture.detectChanges()    → Trigger change detection
```

#### Step 4 — Change Detection in Tests

Angular does **NOT** automatically run change detection in tests. You must call it manually:

```typescript
it('should display title', () => {
  const fixture = TestBed.createComponent(AppComponent);
  fixture.componentInstance.title = 'Hello Angular';

  fixture.detectChanges(); // ← MUST call this to update the DOM

  const compiled = fixture.nativeElement as HTMLElement;
  expect(compiled.querySelector('h1')?.textContent).toContain('Hello Angular');
});
```

#### Full Test Execution Flow Diagram

```
ng test
  ↓
Angular CLI reads karma.conf.js
  ↓
Webpack bundles all *.spec.ts files
  ↓
Karma Server starts on localhost:9876
  ↓
Karma launches Chrome browser
  ↓
Jasmine test runner loads in browser
  ↓
TestBed creates isolated Angular module in memory
  ↓
Each describe/it block runs
  ↓
Results streamed back to terminal
  ↓
Coverage report generated (if configured)
```

---

## 3. How to Run Angular Unit Tests

### Basic Commands

```bash
# Run all tests (opens browser, watch mode ON)
ng test

# Run tests once (no watch, good for CI/CD)
ng test --watch=false

# Run with code coverage report
ng test --code-coverage

# Run tests for a specific project (in monorepo/workspace)
ng test my-project-name

# Run with a specific browser
ng test --browsers=ChromeHeadless

# Run tests matching a specific pattern
ng test --include='**/user.service.spec.ts'
```

### Understanding the Output

```
Chrome Headless 113.0.0.0 (Mac OS): Executed 12 of 12 SUCCESS (0.456 secs / 0.412 secs)
TOTAL: 12 SUCCESS

✔ Browser application bundle generation complete.
```

```
FAILED TESTS:
AppComponent > should have correct title
  Expected 'WrongTitle' to equal 'Angular App'.
    at UserContext.<anonymous> (app.component.spec.ts:25:28)
```

### Running in CI/CD (Headless)

```bash
# GitHub Actions / Jenkins — no GUI browser available
ng test --watch=false --browsers=ChromeHeadless

# With coverage for CI reports
ng test --watch=false --browsers=ChromeHeadless --code-coverage
```

### Viewing Code Coverage Report

After running `ng test --code-coverage`, open:

```
coverage/
  └── index.html   ← Open in browser to see line-by-line coverage
```

Coverage thresholds can be enforced in `karma.conf.js`:

```javascript
coverageReporter: {
  thresholds: {
    emitters: {
      global: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    }
  }
}
```

---

## 4. Jasmine & Karma Configuration

### karma.conf.js — Full Explained

When you create an Angular project, `karma.conf.js` is auto-generated at the root:

```javascript
// karma.conf.js
module.exports = function (config) {
  config.set({

    // ─── Frameworks ──────────────────────────────────────────────
    // Tells Karma to use Jasmine as the test framework
    frameworks: ['jasmine', '@angular-devkit/build-angular'],

    // ─── Plugins ─────────────────────────────────────────────────
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),       // Chrome browser
      require('karma-jasmine-html-reporter'), // HTML report in browser
      require('karma-coverage'),              // Code coverage
      require('@angular-devkit/build-angular/plugins/karma')
    ],

    // ─── Client Config ────────────────────────────────────────────
    client: {
      jasmine: {
        // Jasmine configuration options
        random: true,        // Randomize test order (reveals order-dependent bugs)
        seed: '12345',       // Seed for reproducible random order
        stopOnFailure: false // Don't stop on first failure
      },
      clearContext: false    // Keep Jasmine Spec Runner output in browser
    },

    // ─── Reporters ───────────────────────────────────────────────
    // 'progress' = terminal output
    // 'kjhtml' = browser HTML report
    jasmineHtmlReporter: {
      suppressAll: true   // Remove duplicates in browser reporter
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/my-app'),
      subdir: '.',
      reporters: [
        { type: 'html' },   // Detailed HTML report
        { type: 'text-summary' }, // Terminal summary
        { type: 'lcovonly' } // For CI tools like SonarQube
      ]
    },
    reporters: ['progress', 'kjhtml'],

    // ─── Browsers ─────────────────────────────────────────────────
    browsers: ['Chrome'],

    // ─── Ports ───────────────────────────────────────────────────
    port: 9876,

    // ─── Watch Mode ──────────────────────────────────────────────
    autoWatch: true,         // Re-run on file change
    singleRun: false,        // false = watch mode, true = run once and exit
    restartOnFileChange: true
  });
};
```

### Running with Multiple Browsers

```javascript
// karma.conf.js
browsers: ['Chrome', 'Firefox', 'ChromeHeadless'],

plugins: [
  require('karma-chrome-launcher'),
  require('karma-firefox-launcher'),
  // ...
]
```

### angular.json — Test Configuration

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "karmaConfig": "karma.conf.js",
            "polyfills": ["zone.js", "zone.js/testing"],
            "tsConfig": "tsconfig.spec.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.css"],
            "scripts": [],
            "codeCoverage": false,
            "sourceMap": false,
            "include": ["**/*.spec.ts"]
          }
        }
      }
    }
  }
}
```

### tsconfig.spec.json

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["jasmine"]  // ← Adds Jasmine types (describe, it, expect, etc.)
  },
  "include": [
    "src/**/*.spec.ts",   // Include all spec files
    "src/**/*.d.ts"
  ]
}
```

---

## 5. First Angular Unit Test Case

### Testing a Simple Component

**Component Under Test:**

```typescript
// counter.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <button (click)="increment()">Increment</button>
    <button (click)="decrement()">Decrement</button>
  `
})
export class CounterComponent {
  title = 'Counter App';
  count = 0;

  increment(): void {
    this.count++;
  }

  decrement(): void {
    if (this.count > 0) {
      this.count--;
    }
  }
}
```

**Test File:**

```typescript
// counter.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  // ─── Setup ─────────────────────────────────────────────
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CounterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial change detection
  });

  // ─── Test 1: Component Creation ────────────────────────
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ─── Test 2: Default Values ────────────────────────────
  it('should have initial count of 0', () => {
    expect(component.count).toBe(0);
  });

  // ─── Test 3: Title in DOM ──────────────────────────────
  it('should display title in h1', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Counter App');
  });

  // ─── Test 4: Increment Logic ───────────────────────────
  it('should increment count when increment() is called', () => {
    component.increment();
    expect(component.count).toBe(1);

    component.increment();
    expect(component.count).toBe(2);
  });

  // ─── Test 5: Decrement Logic ───────────────────────────
  it('should decrement count when decrement() is called', () => {
    component.count = 5;
    component.decrement();
    expect(component.count).toBe(4);
  });

  // ─── Test 6: Boundary Case ─────────────────────────────
  it('should NOT go below 0 when decrement is called at 0', () => {
    component.count = 0;
    component.decrement();
    expect(component.count).toBe(0); // Should stay at 0
  });

  // ─── Test 7: Button Click via DOM ─────────────────────
  it('should increment count when Increment button is clicked', () => {
    const btn = fixture.nativeElement.querySelector('button');
    btn.click();
    fixture.detectChanges();
    const para = fixture.nativeElement.querySelector('p');
    expect(para.textContent).toContain('Count: 1');
  });
});
```

### Testing a Service

```typescript
// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}
```

```typescript
// user.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService, User } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // ← Use mock HTTP, not real HTTP
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ← Ensure no outstanding HTTP requests remain
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all users', () => {
    const mockUsers: User[] = [
      { id: 1, name: 'Alice', email: 'alice@test.com' },
      { id: 2, name: 'Bob', email: 'bob@test.com' }
    ];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users[0].name).toBe('Alice');
    });

    // Intercept and flush the HTTP request with mock data
    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers); // ← Return mock data
  });

  it('should fetch user by id', () => {
    const mockUser: User = { id: 1, name: 'Alice', email: 'alice@test.com' };

    service.getUserById(1).subscribe(user => {
      expect(user.id).toBe(1);
      expect(user.name).toBe('Alice');
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users/1');
    req.flush(mockUser);
  });
});
```

---

## 6. Excluding Test Cases from Execution

### Methods to Skip or Focus Tests

#### Method 1: `x` prefix — Skip a Test

```typescript
// xit() — Skip a single test
xit('this test is skipped', () => {
  expect(1).toBe(1);
});

// xdescribe() — Skip an entire suite
xdescribe('SkippedSuite', () => {
  it('test 1', () => { /* skipped */ });
  it('test 2', () => { /* skipped */ });
});
```

#### Method 2: `f` prefix — Focus (Run ONLY this test)

```typescript
// fit() — Run ONLY this test (all others are skipped)
fit('only this test will run', () => {
  expect(2 + 2).toBe(4);
});

// fdescribe() — Run ONLY tests in this suite
fdescribe('FocusedSuite', () => {
  it('test 1', () => { /* runs */ });
  it('test 2', () => { /* runs */ });
});
```

> ⚠️ **Warning**: Never commit `fit()` or `fdescribe()` to your codebase — it prevents all other tests from running in CI.

#### Method 3: `pending()` — Mark as Pending

```typescript
it('should be implemented later', () => {
  pending('Feature not yet implemented');
});
```

#### Method 4: CLI `--include` Flag

```bash
# Run only specific spec files
ng test --include='**/user.service.spec.ts'
ng test --include='**/auth/**/*.spec.ts'
```

#### Method 5: `testPathPattern` in Karma Config

```javascript
// karma.conf.js — exclude specific files
files: [
  { pattern: 'src/**/*.spec.ts', watched: true },
],
exclude: [
  'src/legacy/**/*.spec.ts'
]
```

#### Summary Table

| Method | Scope | Effect |
|--------|-------|--------|
| `xit()` | Single test | Skipped, shown as pending |
| `xdescribe()` | Suite | All tests in suite skipped |
| `fit()` | Single test | Only this test runs |
| `fdescribe()` | Suite | Only this suite runs |
| `pending()` | Inside test | Marks test as pending with message |
| `--include` CLI | File-level | Only matching files run |

---

## 7. Jasmine Matchers

Matchers are chained after `expect()` and validate the actual value.

### Equality Matchers

```typescript
// toBe — Strict equality (===), use for primitives
expect(1 + 1).toBe(2);
expect('hello').toBe('hello');

// toEqual — Deep equality, use for objects and arrays
expect({ a: 1, b: 2 }).toEqual({ a: 1, b: 2 });
expect([1, 2, 3]).toEqual([1, 2, 3]);

// NOT the same:
expect({ a: 1 }).toBe({ a: 1 });    // FAILS — different references
expect({ a: 1 }).toEqual({ a: 1 }); // PASSES — same structure
```

### Truthiness Matchers

```typescript
expect(true).toBeTruthy();
expect(1).toBeTruthy();
expect('text').toBeTruthy();

expect(false).toBeFalsy();
expect(0).toBeFalsy();
expect('').toBeFalsy();
expect(null).toBeFalsy();
expect(undefined).toBeFalsy();

expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect('value').toBeDefined();
```

### Number Matchers

```typescript
expect(5).toBeGreaterThan(3);
expect(5).toBeGreaterThanOrEqual(5);
expect(3).toBeLessThan(5);
expect(3).toBeLessThanOrEqual(3);

// Floating-point precision
expect(0.1 + 0.2).toBeCloseTo(0.3, 1); // 1 decimal place precision
```

### String Matchers

```typescript
expect('Hello Angular').toContain('Angular');
expect('hello@test.com').toMatch(/^[a-z]+@[a-z]+\.[a-z]+$/); // Regex
expect('Hello').toMatch('Hell'); // Substring match
```

### Array Matchers

```typescript
expect([1, 2, 3]).toContain(2);
expect([]).toHaveSize(0);
expect([1, 2, 3]).toHaveSize(3);
```

### Exception Matchers

```typescript
function throwError(): void {
  throw new Error('Something went wrong!');
}

expect(() => throwError()).toThrow();
expect(() => throwError()).toThrowError('Something went wrong!');
expect(() => throwError()).toThrowError(Error);
expect(() => throwError()).toThrowError(/went wrong/);
```

### Negating Matchers with `.not`

```typescript
expect(5).not.toBe(3);
expect('hello').not.toContain('world');
expect(null).not.toBeDefined();
expect([1, 2]).not.toHaveSize(5);
```

### Spy Matchers

Spies allow you to mock functions and verify they were called:

```typescript
describe('Spy Matchers', () => {
  it('should track function calls', () => {
    const calculator = {
      add: (a: number, b: number) => a + b
    };

    // Create a spy
    spyOn(calculator, 'add').and.returnValue(10);

    const result = calculator.add(2, 3);

    expect(calculator.add).toHaveBeenCalled();
    expect(calculator.add).toHaveBeenCalledWith(2, 3);
    expect(calculator.add).toHaveBeenCalledTimes(1);
    expect(result).toBe(10); // Returns mocked value
  });

  it('should spy on a service method', () => {
    const userService = TestBed.inject(UserService);
    const spy = spyOn(userService, 'getUsers').and.returnValue(of([]));

    component.loadUsers();

    expect(spy).toHaveBeenCalled();
  });
});
```

### Complete Matchers Reference Table

| Matcher | Use Case |
|--------|---------|
| `toBe(val)` | Primitive strict equality |
| `toEqual(val)` | Deep object/array equality |
| `toBeTruthy()` | Truthy check |
| `toBeFalsy()` | Falsy check |
| `toBeNull()` | Null check |
| `toBeUndefined()` | Undefined check |
| `toBeDefined()` | Defined (not undefined) |
| `toContain(item)` | Array/string contains |
| `toHaveSize(n)` | Array/string length |
| `toMatch(regex)` | String regex match |
| `toBeGreaterThan(n)` | Number comparison |
| `toBeLessThan(n)` | Number comparison |
| `toBeCloseTo(n, precision)` | Float comparison |
| `toThrow()` | Function throws any error |
| `toThrowError(msg)` | Function throws specific error |
| `toHaveBeenCalled()` | Spy was called |
| `toHaveBeenCalledWith(args)` | Spy called with specific args |
| `toHaveBeenCalledTimes(n)` | Spy called N times |

---

## 8. Advanced Topics

### Testing Async Code

#### Using `fakeAsync` and `tick`

```typescript
import { fakeAsync, tick } from '@angular/core/testing';

it('should handle delayed operations', fakeAsync(() => {
  let value = 0;

  setTimeout(() => {
    value = 42;
  }, 1000);

  tick(1000); // Advance virtual clock by 1000ms

  expect(value).toBe(42);
}));
```

#### Using `async/await`

```typescript
it('should resolve a promise', async () => {
  const result = await Promise.resolve(42);
  expect(result).toBe(42);
});
```

#### Testing Observables

```typescript
import { of } from 'rxjs';

it('should test observable', (done) => {
  const obs$ = of(1, 2, 3);
  const results: number[] = [];

  obs$.subscribe({
    next: val => results.push(val),
    complete: () => {
      expect(results).toEqual([1, 2, 3]);
      done(); // Signal async test completion
    }
  });
});
```

### Mocking Dependencies

```typescript
describe('LoginComponent', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Create spy object — all methods are auto-spied
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'logout']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy } // Inject mock
      ]
    });
  });

  it('should call login on submit', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'abc123' }));

    component.email = 'test@test.com';
    component.password = '123456';
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@test.com', '123456');
  });
});
```

### Testing Input/Output Decorators

```typescript
// child.component.ts
@Component({ selector: 'app-child', template: '<div>{{message}}</div>' })
export class ChildComponent {
  @Input() message: string = '';
  @Output() clicked = new EventEmitter<string>();
}

// child.component.spec.ts
it('should receive @Input', () => {
  component.message = 'Test Message';
  fixture.detectChanges();
  const div = fixture.nativeElement.querySelector('div');
  expect(div.textContent).toContain('Test Message');
});

it('should emit @Output when clicked', () => {
  let emitted = '';
  component.clicked.subscribe((val: string) => emitted = val);
  component.clicked.emit('button-clicked');
  expect(emitted).toBe('button-clicked');
});
```

---

## 9. Interview Questions & Answers (4+ Years)

### 🔵 Conceptual Questions

---

**Q1. What is the difference between `toBe` and `toEqual`?**

> **`toBe`** uses strict reference equality (`===`). It should only be used for **primitives** (numbers, strings, booleans).
> **`toEqual`** performs **deep equality** — it recursively compares the structure and values of objects and arrays.
>
> ```typescript
> expect({ a: 1 }).toBe({ a: 1 });    // FAILS — different memory references
> expect({ a: 1 }).toEqual({ a: 1 }); // PASSES — same structure/values
> ```

---

**Q2. What is TestBed in Angular testing?**

> `TestBed` is Angular's primary testing utility that creates an isolated `NgModule` environment for component and service testing. It simulates the Angular module system, including DI, change detection, and template compilation.
>
> Key methods:
> - `TestBed.configureTestingModule({})` — Sets up the testing module
> - `TestBed.createComponent(MyComp)` — Creates a component instance
> - `TestBed.inject(Service)` — Retrieves an injected service

---

**Q3. Why do we need `fixture.detectChanges()`?**

> Angular's change detection does **NOT** run automatically in tests. `detectChanges()` manually triggers the change detection cycle, which updates the DOM based on component state. Without it, template bindings won't reflect updated values.
>
> You typically call it:
> 1. After `TestBed.createComponent()` — for initial rendering
> 2. After changing component state — to see DOM updates

---

**Q4. What is the difference between `fakeAsync` and `async` in Angular tests?**

> | | `fakeAsync` + `tick()` | `async` / `waitForAsync` |
> |---|---|---|
> | Time simulation | Virtual clock (synchronous) | Real async (Promise-based) |
> | Use case | setTimeout, setInterval | Promises, HTTP calls |
> | `tick()` | Required to advance time | Not needed |
> | Readability | Easier to read | More natural async/await style |

---

**Q5. How do you test a component that uses a service?**

> Two approaches:
>
> **1. Mock with `SpyObj` (recommended):**
> ```typescript
> const spy = jasmine.createSpyObj('UserService', ['getUsers']);
> spy.getUsers.and.returnValue(of([]));
> providers: [{ provide: UserService, useValue: spy }]
> ```
>
> **2. Use `HttpClientTestingModule` for HTTP services:**
> ```typescript
> imports: [HttpClientTestingModule],
> providers: [UserService]
> // Use HttpTestingController to intercept and mock HTTP calls
> ```

---

**Q6. What is the purpose of `HttpTestingController`?**

> `HttpTestingController` is provided by `HttpClientTestingModule`. It intercepts HTTP calls made during tests, allowing you to:
> - Verify that a specific URL was called
> - Return mock response data via `req.flush(mockData)`
> - Test error scenarios via `req.flush('error', { status: 500, statusText: 'Server Error' })`
> - Verify no unexpected HTTP calls happened via `httpMock.verify()`

---

**Q7. What is a Jasmine Spy and when would you use it?**

> A **Spy** is a test double that tracks function calls, arguments, return values, and can mock implementations.
>
> Use cases:
> - Track whether a method was called during a test
> - Mock a function to return controlled data
> - Prevent real HTTP calls or side effects
> - Test that callbacks fire correctly
>
> ```typescript
> spyOn(service, 'save').and.returnValue(of({ success: true }));
> // or
> const spy = jasmine.createSpy('callback').and.returnValue(42);
> ```

---

**Q8. How do you handle async operations in `beforeEach`?**

> Use `async/await` with `waitForAsync` or the standard `async` keyword:
>
> ```typescript
> beforeEach(async () => {
>   await TestBed.configureTestingModule({
>     declarations: [MyComponent]
>   }).compileComponents(); // compileComponents is async (loads external templates)
> });
> ```
>
> `compileComponents()` must be awaited because it asynchronously reads external HTML/CSS files.

---

**Q9. What is the difference between `shallow` and `deep` rendering in Angular tests?**

> **Shallow Rendering** (most common): Child components are not rendered. You use `NO_ERRORS_SCHEMA` or `CUSTOM_ELEMENTS_SCHEMA` to ignore unknown child elements.
>
> ```typescript
> TestBed.configureTestingModule({
>   declarations: [ParentComponent], // Child NOT declared
>   schemas: [NO_ERRORS_SCHEMA]      // Ignore child component errors
> });
> ```
>
> **Deep Rendering**: All child components are declared and fully rendered. Used when testing interaction between parent and child.

---

**Q10. How do you test a component with `@Input()` and `@Output()`?**

> ```typescript
> // @Input(): Simply set the property
> component.inputData = { id: 1, name: 'Test' };
> fixture.detectChanges();
>
> // @Output(): Subscribe to the EventEmitter
> let emittedValue: any;
> component.myOutput.subscribe(val => emittedValue = val);
> component.triggerMethod();
> expect(emittedValue).toEqual({ id: 1 });
> ```

---

### 🔴 Scenario-Based Questions

---

**Q11. Your test passes locally but fails in CI. What would you investigate?**

> - **Async timing**: Use `fakeAsync/tick` or `waitForAsync` instead of raw promises
> - **Browser differences**: CI uses headless Chrome — check if tests rely on DOM APIs not available headlessly
> - **Random order**: Karma randomizes test order — check for state leakage between tests
> - **Environment variables**: CI may not have the same `environment.ts` values
> - **Missing `fixture.detectChanges()`**: Some timing-dependent DOM updates need explicit change detection

---

**Q12. How would you test a component that has a Router dependency?**

> ```typescript
> import { RouterTestingModule } from '@angular/router/testing';
> import { Router } from '@angular/router';
>
> TestBed.configureTestingModule({
>   imports: [RouterTestingModule.withRoutes([])],
>   declarations: [MyComponent]
> });
>
> const router = TestBed.inject(Router);
> const navigateSpy = spyOn(router, 'navigate');
>
> component.goToHome();
> expect(navigateSpy).toHaveBeenCalledWith(['/home']);
> ```

---

**Q13. What code coverage percentage is generally considered acceptable?**

> Industry standard is **80% coverage** as a baseline, with critical business logic paths targeting **90%+**. However, coverage percentage alone is misleading — 80% meaningful tests > 100% trivial tests. Focus on:
> - All conditional branches (branch coverage)
> - Error handling paths
> - Public API of services and components

---

**Q14. How do you test a component that uses `ChangeDetectionStrategy.OnPush`?**

> With `OnPush`, Angular only runs change detection on:
> - Input reference changes
> - Events fired
> - Async pipe emissions
>
> In tests, you need to use `fixture.detectChanges()` after reference changes and use `markForCheck()` if needed:
>
> ```typescript
> // Trigger change detection manually for OnPush
> const changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
> changeDetectorRef.markForCheck();
> fixture.detectChanges();
> ```

---

**Q15. What is `NO_ERRORS_SCHEMA` vs `CUSTOM_ELEMENTS_SCHEMA`?**

> | Schema | What it does |
> |---|---|
> | `NO_ERRORS_SCHEMA` | Ignores ALL unknown elements and attributes |
> | `CUSTOM_ELEMENTS_SCHEMA` | Allows HTML custom elements (Web Components) only |
>
> Use `NO_ERRORS_SCHEMA` for shallow rendering when you don't want to declare all child components. Be careful — it can hide real errors.

---

## 📁 Project Structure Reference

```
my-angular-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── counter/
│   │   │   │   ├── counter.component.ts
│   │   │   │   └── counter.component.spec.ts ← Unit tests here
│   │   ├── services/
│   │   │   ├── user.service.ts
│   │   │   └── user.service.spec.ts
│   │   └── app.module.ts
│   └── test.ts                              ← Test entry point
├── coverage/                                ← Generated coverage reports
├── karma.conf.js                            ← Karma configuration
├── tsconfig.spec.json                       ← TypeScript config for tests
└── angular.json                             ← Build & test targets
```

---

## 🔧 Quick Reference Cheat Sheet

```typescript
// ─── Setup ───────────────────────────────────
TestBed.configureTestingModule({ declarations, imports, providers });
TestBed.createComponent(MyComponent);
TestBed.inject(MyService);

// ─── Lifecycle ────────────────────────────────
beforeAll(() => {});    // Once before suite
afterAll(() => {});     // Once after suite
beforeEach(() => {});   // Before each test
afterEach(() => {});    // After each test

// ─── Test Control ─────────────────────────────
it('test', () => {});    // Normal test
xit('test', () => {});   // Skip test
fit('test', () => {});   // Focus test (only this runs)
pending('reason');       // Mark as pending

// ─── Spies ────────────────────────────────────
spyOn(obj, 'method');
spyOn(obj, 'method').and.returnValue(value);
spyOn(obj, 'method').and.callFake((arg) => value);
spyOn(obj, 'method').and.callThrough();
jasmine.createSpyObj('Name', ['method1', 'method2']);

// ─── Key Matchers ─────────────────────────────
expect(x).toBe(y)             // ===
expect(x).toEqual(y)          // deep equal
expect(x).toBeTruthy()
expect(x).toBeFalsy()
expect(x).toContain(y)
expect(x).toThrowError(msg)
expect(spy).toHaveBeenCalled()
expect(spy).toHaveBeenCalledWith(args)
```

---

*Last Updated: 2025 | Angular 16+ | Jasmine 4.x | Karma 6.x*
