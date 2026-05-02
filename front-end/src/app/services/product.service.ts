import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import is from '@angular/common/locales/extra/is';


export interface ReviewItem {
  id?: number;
  rating?: number;
  comment?: string;
  date?: string;
  reviewerName?: string;
  reviewerEmail?: string;
}

export interface ProductItem {
  id: number;
  title: string;
  description?: string;
  price?: number;
  brand?: string;
  category?: string;
  rating?: number;
  stock?: number;
  thumbnail?: string;

  reviews?: ReviewItem[];
}

@Injectable({ providedIn: 'root' })
export class ProductService {

    private baseUrl = 'http://localhost:8080/api/products';

    constructor(private http: HttpClient) {}

    getAllProducts(): Observable<ProductItem[]> {

        return this.http.get<ProductItem[]>(
        `${this.baseUrl}/all`
        );
    }

    getCategories(): Observable<string[]> {

        return this.http.get<string[]>(
        `${this.baseUrl}/categories`
        );
    }
}
