import { Component, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Post } from './api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-api-data',
  templateUrl: './api-data.html',
  styleUrl: './api-data.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiDataComponent implements OnInit {
  // Signals for state management (modern Angular approach)
  posts$ = signal<Post[]>([]);
  searchTerm = signal<string>('');
  currentPage = signal<number>(1);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  useProgressiveLoading = signal<boolean>(false);

  // Constants
  readonly itemsPerPage = 12;

  // Computed signals for derived state
  filteredPosts = computed(() => {
    const posts = this.posts$();
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) return posts;

    return posts.filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.body.toLowerCase().includes(term)
    );
  });

  paginatedPosts = computed(() => {
    const filtered = this.filteredPosts();
    const startIdx = (this.currentPage() - 1) * this.itemsPerPage;
    const endIdx = startIdx + this.itemsPerPage;
    return filtered.slice(startIdx, endIdx);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredPosts().length / this.itemsPerPage);
  });

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchPosts();
  }

  /**
   * Fetch posts using API service
   */
  fetchPosts() {
    this.isLoading.set(true);
    this.error.set(null);

    const method = this.useProgressiveLoading()
      ? this.apiService.getPostsProgressive(30, 10)
      : this.apiService.getPosts(30);

    method.subscribe({
      next: (data) => {
        this.posts$.set(data);
        this.currentPage.set(1);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Update search term and reset pagination
   */
  onSearchChange(term: string) {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  /**
   * Navigate to next page
   */
  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.scrollToTop();
    }
  }

  /**
   * Navigate to previous page
   */
  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.scrollToTop();
    }
  }

  /**
   * Jump to specific page
   */
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.scrollToTop();
    }
  }

  /**
   * Clear cache and refresh data
   */
  refreshData() {
    this.apiService.clearCache();
    this.searchTerm.set('');
    this.currentPage.set(1);
    this.fetchPosts();
  }

  /**
   * Toggle between normal and progressive loading
   */
  toggleProgressiveLoading() {
    this.useProgressiveLoading.update(val => !val);
    this.refreshData();
  }

  /**
   * Save posts to local storage
   */
  saveToLocalStorage() {
    localStorage.setItem('posts_cache', JSON.stringify({
      data: this.posts$(),
      timestamp: Date.now()
    }));
    alert('Data saved locally!');
  }

  /**
   * Load posts from local storage
   */
  loadFromLocalStorage() {
    const cached = localStorage.getItem('posts_cache');
    if (cached) {
      try {
        const { data } = JSON.parse(cached);
        this.posts$.set(data);
        this.currentPage.set(1);
        alert('Data loaded from local storage!');
      } catch (err) {
        alert('Failed to load cached data');
      }
    } else {
      alert('No cached data found');
    }
  }

  /**
   * Scroll to top smoothly
   */
  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
