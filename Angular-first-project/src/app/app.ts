import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Counter } from './counter/counter';
import { CrudOperation } from './crud-operation/crud-operation';
import { RestApi } from './rest-api/rest-api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CrudOperation, Counter, RestApi],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Angular-first-project');

};
