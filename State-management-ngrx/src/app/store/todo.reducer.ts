import { createReducer, on } from '@ngrx/store';
import * as TodoActions from './todo.actions';
import { Todo } from '../models/todo.model';

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error?: any;
}

export const initialState: TodoState = {
  todos: [],
  loading: false,
};

export const todoReducer = createReducer(
  initialState,
  on(TodoActions.loadTodos, state => ({ ...state, loading: true })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos, loading: false })),
  on(TodoActions.addTodo, state => ({ ...state, loading: true })),
  on(TodoActions.addTodoSuccess, (state, { todo }) => ({ ...state, todos: [...state.todos, todo], loading: false })),
  on(TodoActions.toggleTodo, state => ({ ...state, loading: true })),
  on(TodoActions.toggleTodoSuccess, (state, { todo }) => ({ ...state, todos: state.todos.map(t => (t.id === todo.id ? todo : t)), loading: false })),
  on(TodoActions.deleteTodo, state => ({ ...state, loading: true })),
  on(TodoActions.deleteTodoSuccess, (state, { id }) => ({ ...state, todos: state.todos.filter(t => t.id !== id), loading: false })),
  on(TodoActions.failure, (state, { error }) => ({ ...state, error, loading: false }))
);
