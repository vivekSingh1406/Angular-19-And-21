import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudComponent } from './crud/crud';
import { ApiDataComponent } from './api-data/api-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
  imports: [CommonModule, CrudComponent, ApiDataComponent]
})
export class App {
  activeTab = 'crud';

  switchTab(tab: string) {
    this.activeTab = tab;
  }
}
