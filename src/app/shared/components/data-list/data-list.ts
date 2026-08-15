import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output
} from '@angular/core';


export interface ListOption {
  label: string;
  value: string;
}


@Component({
  selector: 'app-data-list',

  standalone: true,

  templateUrl: './data-list.html',

  styleUrl: './data-list.css',

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataList {

  // =========================================================
  // General
  // =========================================================

  readonly title = input('');

  readonly description = input('');

  readonly tableTitle = input('');


  // =========================================================
  // Data
  // =========================================================

  readonly items = input<readonly unknown[]>([]);

  readonly loading = input(false);

  readonly errorMessage = input('');


  // =========================================================
  // Pagination
  // =========================================================

  readonly page = input(1);

  readonly pageSize = model(10);

  readonly rowCount = input(0);

  readonly totalPages = input(1);

  readonly isAddable = input(true);


  // =========================================================
  // Search
  // =========================================================

  readonly searchText = model('');

  readonly searchField = model('');

  readonly searchFields =
    input<readonly ListOption[]>([]);


  // =========================================================
  // Order
  // =========================================================

  readonly orderField = model('');

  readonly orderDirection =
    model<'asc' | 'desc'>('desc');

  readonly orderFields =
    input<readonly ListOption[]>([]);


  // =========================================================
  // Events
  // =========================================================

  readonly search = output<void>();

  readonly clear = output<void>();

  readonly pageChange = output<number>();


  // =========================================================
  // Computed
  // =========================================================

  readonly pages = computed(() =>
    Array.from(
      { length: this.totalPages() },
      (_, index) => index + 1
    )
  );


  // =========================================================
  // Actions
  // =========================================================

  onSearch(): void {
    this.search.emit();
  }


  onClear(): void {
    this.clear.emit();
  }


  onPageChange(page: number): void {

    const currentPage = this.page();
    const totalPages = this.totalPages();

    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    this.pageChange.emit(page);
  }


  onPageSizeChange(value: string): void {

    const pageSize = Number(value);

    if (
      !Number.isFinite(pageSize) ||
      pageSize <= 0
    ) {
      return;
    }

    this.pageSize.set(pageSize);
  }
}
