import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as TodoActions from '../store/todo.actions';
import { selectAllTodos, selectLoading } from '../store/todo.selectors';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.css']
})
export class TodoListComponent implements OnInit {
  todos$!: Observable<Todo[]>;
  loading$!: Observable<boolean>;
  title = new FormControl('');

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.todos$ = this.store.select(selectAllTodos);
    this.loading$ = this.store.select(selectLoading);
    this.store.dispatch(TodoActions.loadTodos());
  }

  add() {
    const value = (this.title.value || '').toString().trim();
    if (!value) return;
    this.store.dispatch(TodoActions.addTodo({ title: value }));
    this.title.setValue('');
  }

  toggle(id: string) {
    this.store.dispatch(TodoActions.toggleTodo({ id }));
  }

  remove(id: string) {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }
}
