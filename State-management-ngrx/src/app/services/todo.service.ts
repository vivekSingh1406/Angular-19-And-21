import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  
  private todos: Todo[] = [
    { id: '1', title: 'Learn NgRx fundamentals', completed: false },
    { id: '2', title: 'Build a small example app', completed: false },
  ];

  getTodos(): Observable<Todo[]> {
    return of(this.todos).pipe(delay(300));
  }

  addTodo(title: string): Observable<Todo> {
    const todo: Todo = { id: String(Date.now()), title, completed: false };
    this.todos = [...this.todos, todo];
    return of(todo).pipe(delay(200));
  }

  toggleTodo(id: string): Observable<Todo | undefined> {
    this.todos = this.todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
    return of(this.todos.find(t => t.id === id)).pipe(delay(150));
  }

  deleteTodo(id: string): Observable<string> {
    this.todos = this.todos.filter(t => t.id !== id);
    return of(id).pipe(delay(150));
  }
}
