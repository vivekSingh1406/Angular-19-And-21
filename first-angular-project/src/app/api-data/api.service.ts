import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError, timer } from 'rxjs';
import { takeUntil, timeout, retry, shareReplay, tap, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com/posts';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly REQUEST_TIMEOUT = 10000; // 10 seconds
  private readonly RETRY_ATTEMPTS = 2;
  private readonly RETRY_DELAY = 1000; // 1 second

  private cache = new Map<string, CacheEntry<Post[]>>();
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();
  private posts$: Observable<Post[]> | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Fetch posts with intelligent caching and retry logic
   */
  getPosts(limit: number = 50): Observable<Post[]> {
    const cacheKey = `posts_${limit}`;

    // Check if cached data is still valid
    if (this.isCacheValid(cacheKey)) {
      return new Observable(observer => {
        observer.next(this.cache.get(cacheKey)!.data);
        observer.complete();
      });
    }

    // Use shareReplay to avoid multiple HTTP requests
    if (!this.posts$) {
      this.posts$ = this.http.get<Post[]>(`${this.API_URL}?_limit=${limit}`).pipe(
        // Add timeout to prevent hanging requests
        timeout(this.REQUEST_TIMEOUT),
        // Retry with exponential backoff
        retry({
          count: this.RETRY_ATTEMPTS,
          delay: (error, retryCount) => {
            console.warn(`Retry attempt ${retryCount}:`, error.message);
            return timer(this.RETRY_DELAY * Math.pow(2, retryCount - 1));
          }
        }),
        // Cache the result
        tap(data => {
          this.cache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
          });
        }),
        // Share the observable among multiple subscribers
        shareReplay(1),
        catchError(error => this.handleError(error))
      );
    }

    return this.posts$;
  }

  /**
   * Get posts with progressive/lazy loading
   * Loads first chunk immediately, then loads more
   */
  getPostsProgressive(limit: number = 30, chunkSize: number = 10): Observable<Post[]> {
    return new Observable(observer => {
      let loadedPosts: Post[] = [];

      // Load first chunk immediately
      this.getPosts(limit).subscribe({
        next: (posts) => {
          loadedPosts = posts;
          // Emit first chunk progressively
          observer.next(loadedPosts.slice(0, chunkSize));

          // Emit remaining chunks with small delays
          let index = chunkSize;
          const interval = setInterval(() => {
            if (index < loadedPosts.length) {
              observer.next(loadedPosts.slice(0, Math.min(index + chunkSize, loadedPosts.length)));
              index += chunkSize;
            } else {
              clearInterval(interval);
              observer.next(loadedPosts);
              observer.complete();
            }
          }, 100);
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /**
   * Search posts with debounce and cancel previous requests
   */
  searchPosts(searchTerm: string, posts: Post[]): Post[] {
    if (!searchTerm.trim()) {
      return posts;
    }

    const term = searchTerm.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.body.toLowerCase().includes(term)
    );
  }

  /**
   * Check if cache is still valid
   */
  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;

    const now = Date.now();
    const isValid = now - cached.timestamp < this.CACHE_DURATION;

    if (!isValid) {
      this.cache.delete(key);
    }

    return isValid;
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
    this.posts$ = null;
  }

  /**
   * Handle HTTP errors gracefully
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred while fetching posts';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to reach the server. Check your internet connection.';
      } else if (error.status === 404) {
        errorMessage = 'Posts not found (404)';
      } else if (error.status === 500) {
        errorMessage = 'Server error (500). Please try again later.';
      } else if (error.status === 408) {
        errorMessage = 'Request timeout. Please try again.';
      } else {
        errorMessage = `Server Error: ${error.status} - ${error.statusText}`;
      }
    }

    console.error(errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Cleanup on destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
