import {
  computed,
  inject,
  signal
} from '@angular/core';

import { HttpService } from '../../../core/services/http';
import { PaginatedResponse } from '../../../models/paginations/pagination';
import { ListQuery } from '../../../models/Lists/ListQuery';
import { ApiResponse } from '../../../models/api-response';


export abstract class BaseList<T> {

  protected readonly http = inject(HttpService);

  readonly items = signal<T[]>([]);

  readonly loading = signal(false);

  readonly errorMessage = signal('');

  readonly page = signal(1);

  readonly pageSize = signal(10);

  readonly rowCount = signal(0);

  readonly totalPages = signal(1);

  readonly searchText = signal('');

  readonly selectedSearchField = signal('');

  readonly selectedOrderField = signal('');

  readonly selectedOrderDirection =
    signal<'asc' | 'desc'>('desc');


  readonly pages = computed(() =>
    Array.from(
      { length: this.totalPages() },
      (_, index) => index + 1
    )
  );

  protected abstract getEndpoint(): string;

  protected buildFilter(): string | undefined {
    return undefined;
  }

  protected buildOrderBy(): string | undefined {

    const field = this.selectedOrderField();

    if (!field) {
      return undefined;
    }

    return this.selectedOrderDirection() === 'desc'
      ? `${field} desc`
      : field;
  }

  loadItems(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    const query: ListQuery = {
      page: this.page(),
      pageSize: this.pageSize(),
      orderBy: this.buildOrderBy()
    };

    const filter = this.buildFilter();

    if (filter) {
      query.filter = filter;
    }

    this.http
      .get<ApiResponse<PaginatedResponse<T>>>(
        this.getEndpoint(),
        query
      )
      .subscribe({
        next: response => {

          const data = response.data;

          this.items.set(data.items);

          this.page.set(data.page);

          this.pageSize.set(data.pageSize);

          this.rowCount.set(data.rowCount);

          this.totalPages.set(data.totalPages);

          this.loading.set(false);
        },

        error: error => {

          console.error(error);

          this.items.set([]);

          this.errorMessage.set(
            'دریافت اطلاعات با خطا مواجه شد.'
          );

          this.loading.set(false);
        }
      });
  }

  search(): void {

    this.page.set(1);

    this.loadItems();
  }

  clearSearch(): void {

    this.searchText.set('');

    this.page.set(1);

    this.loadItems();
  }

  changePage(page: number): void {

    const currentPage = this.page();
    const totalPages = this.totalPages();

    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    this.page.set(page);

    this.loadItems();
  }

  changePageSize(pageSize: number): void {

    if (pageSize <= 0 || pageSize === this.pageSize()) {
      return;
    }

    this.pageSize.set(pageSize);

    this.page.set(1);

    this.loadItems();
  }
}
