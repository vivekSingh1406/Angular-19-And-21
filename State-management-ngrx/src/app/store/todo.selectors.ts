import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodoState } from './todo.reducer';

// Selectors-1 : Select the entire feature state
export const selectTodosState = createFeatureSelector<TodoState>('todos');

// Selectors-2 : Select specific pieces of state
export const selectAllTodos = createSelector(selectTodosState, s => s.todos);

// Selectors-3 : Select derived data
export const selectLoading = createSelector(selectTodosState, s => s.loading);
