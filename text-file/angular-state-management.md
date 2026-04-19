# 📘 Angular State Management – NgRx (Complete Detailed Guide)

# 📑 Table of Contents

1. [What is State in Frontend?](#1-what-is-state-in-frontend)
2. [Problems Without State Management](#2-problems-without-state-management)
3. [What is NgRx?](#3-what-is-ngrx)
4. [NgRx Architecture](#4-ngrx-architecture--unidirectional-data-flow)
5. [Actions](#5-ngrx-actions--in-depth)
6. [Reducers](#6-ngrx-reducers--state-transition-logic)
7. [Store & Dispatch](#7-ngrx-store--dispatch)
8. [Effects](#8-ngrx-effects--handling-side-effects)
9. [Selectors](#9-ngrx-selectors--reading-state-efficiently)
10. [NgRx Setup — Step by Step](#10-setting-up-ngrx--step-by-step)
11. [Advantages & Disadvantages](#11-ngrx--advantages--disadvantages)
12. [Interview Questions & Answers](#12-interview-questions--answers--5-years-level)

---

## 1. What is State in Frontend?

> State = The data that controls your UI at any given time. Whenever state changes → UI updates automatically.
> Every visible UI element is powered by some underlying data. Understanding state is the foundation of all state management.

### Common Types of State

| State Type | Example |
|---|---|
| **Server / Remote State** | Products from API, User profile, Orders |
| **UI / Local State** | Modal open/closed, active tab, loading spinner |
| **Session State** | Logged-in user info, auth token |
| **Form State** | Input values, validation errors, dirty/touched |
| **Route / Navigation State** | Current URL, route params, query params |
| **Shared / Global State** | Cart items shared by Header, CartPage, Checkout |

### 🧾 Example State Object

```ts
{
  user: { name: 'Vivek', isLoggedIn: true },
  cart: [{ id: 1, name: 'Phone', price: 20000 }],
  products: [],
  loading: false,
  error: null
}
```

---

## 2. Problems Without State Management

### Problem 1 — Props Drilling

Passing data through many unnecessary component layers.
Even intermediate components that don't need  the data must pass it along. Code becomes messy, hard to maintain, and tightly coupled.

```
App → Dashboard → Sidebar → Profile → Avatar
```

---

### Problem 2 — API Duplication

Without centralized state, multiple components call the same API independently:

- Navbar → calls `/api/user`
- Profile → calls `/api/user`
- Dashboard → calls `/api/user`

3 network requests for the same data → performance issues + data inconsistency.

---

### Problem 3 — Inconsistent UI

Component A updates data locally. Component B still shows stale data. Cart count in the header doesn't match the cart page count.

---

### Problem 4 — Hard to Debug

No clear log of what changed, when, and why. Bugs are difficult to reproduce and fix.

---

### Problem 5 — Tight Coupling

Components depend directly on each other — changing one breaks others.

---

### Solution: Centralized State Management (NgRx)

- Store all data in **ONE place** (NgRx Store)
- All components read from and write to the same store
- UI is always **consistent** — state changes are **predictable** and **traceable**

---

## 3. What is NgRx?

> **NgRx = Angular + RxJS + Redux pattern**
> NgRx is a reactive state management library for Angular, built on RxJS Observables.

It keeps all application state in a **single immutable Store** and enforces a strict unidirectional data flow:

```
Actions → Reducers → Store → UI
```

### NgRx vs Redux vs Flux

| Library | Description |
|---|---|
| **Flux** (Facebook 2014) | Original pattern — introduced unidirectional flow concept |
| **Redux** (React) | Simplified Flux — single store, pure reducers |
| **NgRx** (Angular) | Redux for Angular — adds RxJS Observables, Effects, Selectors |

### When to Use NgRx?

| Scenario | Recommendation |
|---|---|
| Large enterprise app with many shared states | ✅ Use NgRx |
| Multiple features need same API data | ✅ Use NgRx |
| Need Redux DevTools / time-travel debugging | ✅ Use NgRx |
| Complex async flows (WebSocket, polling) | ✅ Use NgRx Effects |
| Small app with 2–3 pages | ❌ Use BehaviorSubject / Service |
| State is local to one component | ❌ Use ComponentStore or local state |

---

## 4. NgRx Architecture — Unidirectional Data Flow

> 🔑 **The golden rule:** Data flows in ONE direction only.

```
Component → dispatch(Action) → Reducer → Store → Selector → Component
                                    ↕
                                 Effects
                               (HTTP/API)
```

### Complete NgRx Data Flow — Step by Step

```
┌────────────┐   dispatch()   ┌──────────────────────────────┐
│ Component  │ ─────────────► │        Actions Stream         │
└────────────┘                └───────────┬──────────────────┘
      ▲                                   │
      │                          ┌────────┴────────┐
      │                          │                 │
  Selector                   Reducers           Effects
  (reads state)           (pure functions)   (side effects)
      │                          │                 │
      │                     new State         HTTP / API
      │                          │                 │
      │                    ┌─────▼─────┐    dispatch new
      └────────────────────│   Store   │◄── Action (success/fail)
                           └───────────┘
```

### 5 Core Building Blocks

| Block | Role | Key Fact |
|---|---|---|
| 🏪 **Store** | Single source of truth | Observable — all components read from here |
| 🎯 **Action** | Describes what happened | Plain object with `type` + optional payload |
| 🔁 **Reducer** | Produces new state | Pure function — no side effects allowed |
| 🌊 **Effect** | Handles async/side effects | RxJS stream — calls APIs, navigates router |
| 🔍 **Selector** | Reads/derives state | Memoized pure function — prevents unnecessary re-renders |

---

## 5. NgRx Actions — In Depth

> 🎯 An Action = an **event** that describes something that happened in the app.
> Actions are the **ONLY** way to trigger state changes in NgRx.
> They describe **WHAT happened** — not HOW to change state (that's the Reducer's job).

### Action Structure

```ts
import { createAction, props } from '@ngrx/store';

// Minimal action — no payload
export const loadUsers = createAction('[User List] Load Users');

// Action with payload
export const addToCart = createAction(
  '[Cart Page] Add Item',
  props<{ product: Product }>()
);

// Success / Failure pair (standard pattern)
export const loadUsersSuccess = createAction(
  '[User API] Load Users Success',
  props<{ users: User[] }>()
);

export const loadUsersFailure = createAction(
  '[User API] Load Users Failure',
  props<{ error: string }>()
);
```

### Action Naming Convention: `[Source] Event`

| Format | Example |
|---|---|
| `[Page] Event in past tense` | `[Login Page] Login Button Clicked` |
| `[Feature API] Result` | `[Auth API] Login Success` |
| `[Feature API] Result` | `[Auth API] Login Failure` |
| `[Component] User action` | `[Cart Page] Remove Item Clicked` |

> 💡 **Action Hygiene:** Write actions that describe **WHAT happened** (events), not **HOW** to update state (commands).
> Good: `[Cart Page] Remove Item Clicked` ✅
> Bad: `REMOVE_ITEM_FROM_CART` ❌

### Dispatching Actions in Component

```ts
constructor(private store: Store) {}

// Without payload
this.store.dispatch(loadUsers());

// With payload
this.store.dispatch(addToCart({ product: selectedProduct }));
```

---

## 6. NgRx Reducers — State Transition Logic

> 🔁 **Reducer = (currentState, action) => newState**
> MUST be a pure function: no HTTP, no `console.log`, no `Math.random()`, no mutation.

### Complete Reducer Example

```ts
import { createReducer, on } from '@ngrx/store';
import { loadUsers, loadUsersSuccess, loadUsersFailure } from './user.actions';

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,

  on(loadUsers, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(loadUsersSuccess, (state, { users }) => ({
    ...state,
    loading: false,
    users
  })),

  on(loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
```

### `on()` Function Explained

`on()` registers an action handler inside `createReducer`. You can handle multiple actions with the same logic:

```ts
// Handle multiple actions with one handler
on(loadUsers, loadUsersRetry, state => ({ ...state, loading: true }))
```

### ⚠️ Immutability — Critical Rule

> NgRx uses **reference equality**. If you mutate state in place, the reference doesn't change → Angular's change detection won't fire → UI won't update → **silent bugs!**

```ts
// ❌ WRONG — mutates array directly
on(addItem, (state, { item }) => {
  state.items.push(item);  // BAD! same reference
  return state;
})

// ✅ CORRECT — returns new object and array reference
on(addItem, (state, { item }) => ({
  ...state,
  items: [...state.items, item]   // new array reference
}))
```

### Reducer Pure Function Rules

- ✅ Always return a **new state object** using spread `...state`
- ✅ Must be **synchronous** — all async work goes to Effects
- ✅ Return **current state** for unknown actions (NgRx handles this automatically)
- ❌ Never call HTTP, localStorage, `Date.now()`, `Math.random()`
- ❌ Never mutate arrays or objects — always create new ones

---

## 7. NgRx Store & Dispatch

> 🏪 The Store is a **single, centralized, immutable** state container — the single source of truth.

### What is the Store?

The Store is an **Observable of your application state**. It is an RxJS Subject under the hood that holds the current state and emits new values whenever state changes.

```ts
// Injecting the Store
constructor(private store: Store<AppState>) {}

// Reading state (returns Observable)
this.products$ = this.store.select(selectAllProducts);

// Writing state (dispatch an action)
this.store.dispatch(loadProducts());
```

### How `dispatch()` Works Internally — 7 Steps

1. Action is passed to the Store's internal dispatcher
2. All registered **Effects** receive the action through the Actions stream
3. All registered **Reducers** receive the action — each checks if it handles this action type
4. Matching reducers produce **new state** — non-matching ones return current state unchanged
5. Store **combines** all reducer outputs into the new global state tree
6. New state is **emitted** on the Store Observable — all active selectors re-evaluate
7. Only selectors whose **derived value changed** emit to their subscribers

---

## 8. NgRx Effects — Handling Side Effects

> 🌊 Effects are RxJS streams that listen to Actions, perform async work (HTTP, localStorage, Router), and dispatch new Actions based on the result.
> **Reducers are pure — ALL side effects must live in Effects.**

### Complete Effect Example

```ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class UserEffects {

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),                    // 1. Listen only to this action
      switchMap(() =>                       // 2. Cancel previous if re-triggered
        this.userService.getAll().pipe(
          map(users =>
            loadUsersSuccess({ users })     // 3. Dispatch success action
          ),
          catchError(err =>
            of(loadUsersFailure({ error: err.message }))  // 4. Dispatch failure
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService: UserService
  ) {}
}
```

### RxJS Operators in Effects — Which One to Use?

| Operator | Behaviour | Use Case |
|---|---|---|
| `switchMap` | Cancels previous request when new action fires | Search, load data (latest wins) |
| `mergeMap` | All requests run in parallel | File uploads, parallel API calls |
| `concatMap` | Queues requests one after another | Sequential API calls, order matters |
| `exhaustMap` | Ignores new triggers while current is in-flight | Login button, payment form (no duplicate submit) |

> ⚠️ **Common Mistake:** Using `switchMap` for a form submit — should be `exhaustMap`. Wrong operator causes duplicate submissions!

---

## 9. NgRx Selectors — Reading State Efficiently

> 🔍 Selectors are pure functions that read and derive data from the Store.
> Built-in **memoization**: projector only re-runs if inputs change.
> They are the **API contract** between your state shape and your components.

### Why Selectors?

- **Encapsulation** — components don't know the shape of the state tree
- **Memoization** — only recomputes when inputs change → performance
- **Composability** — selectors can be built from other selectors
- **Testability** — pure functions, zero dependencies, trivial to test
- **DRY** — define state-reading logic once, reuse everywhere

### Selector Types with Code

```ts
import { createSelector, createFeatureSelector } from '@ngrx/store';

// Step 1 — createFeatureSelector: typed entry point to feature state
export const selectUserState =
  createFeatureSelector<UserState>('users');

// Step 2 — Simple slice selectors
export const selectAllUsers = createSelector(
  selectUserState,
  state => state.users
);

export const selectUsersLoading = createSelector(
  selectUserState,
  state => state.loading
);

// Step 3 — Derived/computed selectors (memoized automatically)
export const selectActiveUsers = createSelector(
  selectAllUsers,
  users => users.filter(u => u.isActive)
);

// Step 4 — Combining multiple selectors
export const selectCartSummary = createSelector(
  selectCartItemCount,
  selectCartTotal,
  (count, total) => ({ count, total, isEmpty: count === 0 })
);

// Step 5 — Parameterized selector (factory pattern)
export const selectUserById = (id: string) => createSelector(
  selectAllUsers,
  users => users.find(u => u.id === id)
);
```

### Using Selectors in Components

```ts
// Component class
users$       = this.store.select(selectAllUsers);
loading$     = this.store.select(selectUsersLoading);
activeUsers$ = this.store.select(selectActiveUsers);

// Parameterized
product$ = this.store.select(selectProductById(this.productId));
```

```html
<!-- Template — always use async pipe (auto subscribe/unsubscribe) -->
<div *ngFor="let user of users$ | async">{{ user.name }}</div>
<app-spinner *ngIf="loading$ | async"></app-spinner>
```

---

## 10. Setting Up NgRx — Step by Step

### Step 1 — Install

```bash
ng add @ngrx/store@latest
ng add @ngrx/effects@latest
ng add @ngrx/store-devtools@latest
```

### Step 2 — Register in AppModule

```ts
// app.module.ts
imports: [
  StoreModule.forRoot({ users: userReducer }),
  EffectsModule.forRoot([UserEffects]),
  StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
]
```

### Step 3 — Lazy Feature Modules

```ts
// products.module.ts
imports: [
  StoreModule.forFeature('products', productReducer),
  EffectsModule.forFeature([ProductEffects])
]
```

### Step 4 — Recommended File Structure

```
src/app/
├── store/
│   ├── app.state.ts           ← Root AppState interface
│   └── app.reducers.ts        ← Root reducer map
│
└── features/
    └── products/
        ├── store/
        │   ├── products.actions.ts
        │   ├── products.reducer.ts
        │   ├── products.effects.ts
        │   ├── products.selectors.ts
        │   └── products.state.ts
        └── products.module.ts
```

---

## 11. NgRx — Advantages & Disadvantages

| ✅ Advantages | ❌ Disadvantages |
|---|---|
| Centralized, single source of truth | Boilerplate: actions, reducers, effects, selectors |
| Predictable & traceable state changes | Steep learning curve (RxJS + Redux) |
| Redux DevTools: time-travel debugging | Overkill for small / simple apps |
| Scales to large team development | More files to manage per feature |
| Eliminates props drilling completely | Debugging Effects can be complex |
| Memoized selectors improve performance | Initial setup time is significant |
| Effects isolate side effects cleanly | Requires strong RxJS knowledge |

---

## 12. Interview Questions & Answers — 5+ Years Level

---

### Q1: What is State Management and why is it needed in Angular?

**Answer:**

State management is a pattern for storing, updating, and sharing application data in a controlled, predictable way. Without it, data is scattered across components and services, leading to:

- Props drilling through unnecessary layers
- Duplicate API calls from multiple components
- Inconsistent UI across the app
- Tight coupling between components

**In Angular, state management is needed when:**
- Multiple unrelated components share the same data (cart, user session)
- Async operations (HTTP) need to update shared state
- Application grows and developers need a standard, debuggable pattern

Solutions range from `BehaviorSubject` (simple apps) to NgRx (complex enterprise apps).

---

### Q2: Explain NgRx's unidirectional data flow with a real-world example.

**Answer:**

NgRx enforces one-way data flow — state can only move forward through defined steps.

**Real example — E-commerce "Add to Cart":**

1. User clicks "Add to Cart" button
2. Component dispatches: `store.dispatch(addToCart({ product }))`
3. Action hits the Actions stream
4. `CartReducer` intercepts — returns: `{ ...state, items: [...state.items, product] }`
5. Effect fires — calls `POST /api/cart` for backend persistence
6. Store updates with new state
7. `selectCartCount` selector re-emits new count
8. Header component's cart badge updates automatically via `async` pipe

No component communicates directly with another — all communication goes through the Store. This makes the entire state change **auditable and reproducible**.

---

### Q3: What is the difference between switchMap, mergeMap, concatMap, and exhaustMap in Effects?

**Answer:**

| Operator | Behaviour | Use Case |
|---|---|---|
| `switchMap` | Cancels previous request when new fires | Search typeahead, load data |
| `mergeMap` | All requests run in parallel | File uploads, parallel saves |
| `concatMap` | Queues — each waits for previous | Sequential API calls |
| `exhaustMap` | Ignores new triggers while in-flight | Login button, payment submit |

**Senior-level insight:** Using `switchMap` for a form submit is a **common bug** — it should be `exhaustMap`. Wrong operator → duplicate submissions → double charges in payments. Always choose based on business semantics, not habit.

---

### Q4: How does memoization in NgRx selectors improve performance?

**Answer:**

`createSelector` creates a memoized function. It stores the last input values and last computed result. The projector function re-runs **only when its input selectors return a new reference**.

```ts
const selectExpensiveList = createSelector(
  selectProducts,
  products => products.filter(p => p.price > 500).sort(...)  // expensive
);
```

**Scenario:** User opens a modal → `ui` state changes → Store emits new state object. But `selectProducts` returns the **same array reference** (products didn't change). So `selectExpensiveList`'s projector does **NOT re-run** — it returns the cached result.

Without memoization: filter + sort runs on **every state change**, even unrelated ones. With memoization: only runs when `products` actually change. Critical for large lists.

---

### Q5: Why must reducers be pure functions? What breaks if they are not?

**Answer:**

**Pure function requirements:**
- Same inputs always produce the same output
- No side effects — no HTTP, no localStorage, no `Math.random()`, no `Date.now()`
- Must NEVER mutate — always return new objects/arrays

**What breaks if reducers are impure:**

| Violation | Consequence |
|---|---|
| Mutation (same reference) | NgRx/Angular won't detect the change → UI doesn't update |
| `Math.random()` | Redux DevTools time-travel breaks — replaying gives different state |
| HTTP in reducer | Uncontrolled side effects, untestable, unpredictable behavior |
| `Date.now()` | Non-deterministic — impossible to reproduce past state |

> NgRx development mode has `runtimeChecks.strictStateImmutability` that throws if mutation is detected.

---

### Q6: What is the difference between NgRx Store and ComponentStore?

**Answer:**

| Feature | NgRx Global Store | ComponentStore |
|---|---|---|
| Scope | App-wide, shared by all | Local to one component/service instance |
| Lifetime | Lives for the entire app session | Destroyed with the component |
| Best for | User session, cart, shared features | Data grids, wizards, multi-step forms |
| Access | Available anywhere via DI | Only within that component tree |

```ts
// Global: available everywhere
this.store.dispatch(loadUsers());

// Local: only this component's instance
this.usersStore.setLoading(true);
```

**5+ years senior answer:** Don't put everything in the global store. Use `ComponentStore` for component-level state, global NgRx Store only for truly shared state. **Mixing both is the professional pattern** in large Angular apps.

---

### Q7: How do you handle loading and error states in NgRx? Show the full pattern.

**Answer:**

Standard pattern — always model **3 states**: loading, success, error.

```ts
// State interface
interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

// Reducer handles 3 actions
on(loadProducts, s => ({ ...s, loading: true, error: null })),
on(loadProductsSuccess, (s, { items }) => ({ ...s, loading: false, items })),
on(loadProductsFailure, (s, { error }) => ({ ...s, loading: false, error }))

// Selectors
export const selectLoading = createSelector(selectState, s => s.loading);
export const selectError   = createSelector(selectState, s => s.error);
```

```html
<!-- Template -->
<app-spinner *ngIf="loading$ | async"></app-spinner>
<app-error   *ngIf="error$ | async as err">{{ err }}</app-error>
<div *ngFor="let item of items$ | async">{{ item.name }}</div>
```

This pattern ensures UI always knows exactly what state the data fetch is in.

---

### Q8: How do you test NgRx — Actions, Reducers, Selectors, and Effects?

**Answer:**

Each NgRx piece is tested differently:

**Reducers — pure functions, easiest to test:**
```ts
it('should set loading true on loadUsers', () => {
  const state = userReducer(initialState, loadUsers());
  expect(state.loading).toBe(true);
});

it('should store users on success', () => {
  const users = [{ id: '1', name: 'Vivek' }];
  const state = userReducer(initialState, loadUsersSuccess({ users }));
  expect(state.users).toEqual(users);
  expect(state.loading).toBe(false);
});
```

**Selectors — use `.projector()` to bypass memoization:**
```ts
it('selectActiveUsers should filter inactive users', () => {
  const users = [{ id: '1', active: true }, { id: '2', active: false }];
  const result = selectActiveUsers.projector(users);
  expect(result.length).toBe(1);
});
```

**Effects — use `provideMockActions`:**
```ts
actions$ = of(loadUsers());
effects.loadUsers$.subscribe(action => {
  expect(action).toEqual(loadUsersSuccess({ users: mockUsers }));
});
```

---

### Q9: What is @ngrx/entity and when should you use it?

**Answer:**

`@ngrx/entity` provides `EntityAdapter` — a utility for managing collections of entities (normalized state). Instead of an array, it stores:

```ts
{
  ids: ['1', '2', '3'],
  entities: {
    '1': { id: '1', name: 'Phone' },
    '2': { id: '2', name: 'Laptop' }
  }
}
```

**Why normalize?** Finding/updating by ID is O(1) vs O(n) array scan.

```ts
const adapter = createEntityAdapter<Product>();
const initialState = adapter.getInitialState({ loading: false });

// Reducer operations
adapter.setAll(products, state)           // replace all
adapter.addOne(product, state)            // add single
adapter.updateOne({ id, changes }, state) // partial update
adapter.removeOne(id, state)              // delete
adapter.upsertMany(products, state)       // add or update many
```

Adapter also **auto-generates selectors**: `selectAll`, `selectEntities`, `selectIds`, `selectTotal`.

**Use entity when:** you have a list of items you CRUD — products, users, orders, messages.

---

### Q10: How do you avoid memory leaks when using NgRx Store in components?

**Answer:**

**1. `async` pipe (ALWAYS PREFERRED):**
```ts
// Component
users$ = this.store.select(selectAllUsers);
```
```html
<!-- Template — Angular auto-subscribes and auto-unsubscribes -->
<div *ngFor="let user of users$ | async">{{ user.name }}</div>
```

**2. `takeUntilDestroyed` (Angular 16+ — for imperative needs):**
```ts
this.store.select(selectUser)
  .pipe(takeUntilDestroyed())
  .subscribe(u => this.user = u);
```

**3. `Subject` + `takeUntil` (legacy pattern):**
```ts
private destroy$ = new Subject<void>();

ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

this.store.select(selectUser)
  .pipe(takeUntil(this.destroy$))
  .subscribe(u => this.user = u);
```

> ❌ **NEVER do this without cleanup:**
> `this.store.select(...).subscribe(x => this.data = x);`
> This creates zombie subscriptions that cause memory leaks and ghost updates in SPAs.

---

### Q11: How would you structure NgRx in a large enterprise Angular application?

**Answer:**

Feature-based structure with lazy loading:

```
src/app/
├── store/
│   ├── app.state.ts           ← Root AppState interface
│   └── app.reducers.ts        ← Root reducer map
│
└── features/
    ├── auth/
    │   └── store/
    │       ├── auth.actions.ts
    │       ├── auth.reducer.ts
    │       ├── auth.effects.ts
    │       └── auth.selectors.ts
    │
    └── products/
        └── store/
            ├── products.actions.ts
            ├── products.reducer.ts
            ├── products.effects.ts
            ├── products.selectors.ts
            └── products.state.ts
```

**Key architectural decisions:**
- **Root state** (auth, layout, router) — registered in `AppModule`
- **Feature state** — lazy-loaded with `StoreModule.forFeature()` in each feature module
- **Selectors are the API** — components never access raw state directly
- **Effects own all HTTP** — no service calls in components or reducers
- **ComponentStore** for local component state — don't pollute global store

---

### Q12: What is optimistic UI update in NgRx? Implement it.

**Answer:**

Optimistic UI updates state **immediately** before the server confirms, then rolls back on failure. This gives instant user feedback.

```ts
// Step 1: Reducer updates state immediately
on(likePost, (state, { postId }) =>
  adapter.updateOne({ id: postId, changes: { liked: true }}, state)
),

// Rollback on failure
on(likePostFailure, (state, { postId }) =>
  adapter.updateOne({ id: postId, changes: { liked: false }}, state)
)

// Step 2: Effect calls API — dispatches rollback on failure
likePost$ = createEffect(() =>
  this.actions$.pipe(
    ofType(likePost),
    mergeMap(({ postId }) =>
      this.api.likePost(postId).pipe(
        map(() => likePostSuccess({ postId })),
        catchError(() => of(likePostFailure({ postId })))  // triggers rollback
      )
    )
  )
);
```

**Result:** User sees instant feedback. If API fails, the UI rolls back automatically.

---

### Q13: How do you handle NgRx state persistence across browser refresh?

**Answer:**

NgRx state is in-memory — browser refresh clears it. Three strategies:

**Strategy 1 — Meta-reducer with localStorage:**
```ts
export function localStorageMetaReducer(reducer) {
  return (state, action) => {
    const nextState = reducer(state, action);
    localStorage.setItem('appState', JSON.stringify(nextState));
    return nextState;
  };
}

// Register in StoreModule
StoreModule.forRoot(reducers, {
  metaReducers: [localStorageMetaReducer]
})
```

**Strategy 2 — `ngrx-store-localstorage` library** (recommended for production):
Handles serialization, partial state keys, merge strategies, and TTL.

**Strategy 3 — Rehydration Effect on app start:**
```ts
rehydrate$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || 'null');
      return cart ? rehydrateCart({ cart }) : noopAction();
    })
  )
);
```

> ⚠️ **Security:** Never persist sensitive data (auth tokens) in localStorage. Use secure HttpOnly cookies instead.

---

## 📋 Quick Reference Cheat Sheet

```
DISPATCH   →  store.dispatch(actionCreator({ payload }))
READ       →  store.select(selectorFn)
ACTION     →  createAction('[Source] Event', props<{ data: Type }>())
REDUCER    →  createReducer(initialState, on(action, (state, { payload }) => ({ ...state, payload })))
EFFECT     →  createEffect(() => actions$.pipe(ofType(action), switchMap(() => api$.pipe(map(success), catchError(failure)))))
SELECTOR   →  createSelector(inputSelector, projectorFn)
FEATURE    →  createFeatureSelector<FeatureState>('featureKey')
```

---

*Angular State Management — NgRx Complete Guide | 5+ Years Interview Preparation*


