import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import * as TodoActions from './todo.actions';
import { TodoService } from '../services/todo.service';

@Injectable()
export class TodoEffects {
  loadTodos$: any;
  addTodo$: any;
  toggleTodo$: any;
  deleteTodo$: any;

  constructor(private actions$: Actions, private service: TodoService) {
    this.loadTodos$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TodoActions.loadTodos),
        switchMap(() =>
          this.service.getTodos().pipe(
            map(todos => TodoActions.loadTodosSuccess({ todos })),
            catchError(error => of(TodoActions.failure({ error })))
          )
        )
      )
    );

    this.addTodo$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TodoActions.addTodo),
        mergeMap(({ title }) =>
          this.service.addTodo(title).pipe(
            map(todo => TodoActions.addTodoSuccess({ todo })),
            catchError(error => of(TodoActions.failure({ error })))
          )
        )
      )
    );

    this.toggleTodo$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TodoActions.toggleTodo),
        mergeMap(({ id }) =>
          this.service.toggleTodo(id).pipe(
            map(todo => TodoActions.toggleTodoSuccess({ todo: todo as any })),
            catchError(error => of(TodoActions.failure({ error })))
          )
        )
      )
    );

    this.deleteTodo$ = createEffect(() =>
      this.actions$.pipe(
        ofType(TodoActions.deleteTodo),
        mergeMap(({ id }) =>
          this.service.deleteTodo(id).pipe(
            map(() => TodoActions.deleteTodoSuccess({ id })),
            catchError(error => of(TodoActions.failure({ error })))
          )
        )
      )
    );
  }
}
