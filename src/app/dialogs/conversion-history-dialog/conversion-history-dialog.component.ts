import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {  MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource,MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-conversion-history-dialog',
  standalone: true,
  imports: [MatPaginatorModule, CommonModule,MatCardModule,MatTableModule],
  templateUrl: './conversion-history-dialog.component.html',
  styleUrls: ['./conversion-history-dialog.component.css']
})
export class ConversionHistoryDialogComponent implements OnInit {
  displayedColumns: string[] = ['amount', 'from', 'to', 'result', 'date'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConversionHistoryDialogComponent>
  ) {}

  ngOnInit() {
    this.dataSource.data = JSON.parse(localStorage.getItem('history') || '[]').reverse();
    // this.dataSource.paginator = this.paginator;
  }

  onPaginateChange(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    // Call the method to fetch new data based on pagination
    this.fetchConversionHistory(pageIndex, pageSize);
  }

  // Method to fetch new conversion history
  fetchConversionHistory(pageIndex: number, pageSize: number) {
    // Call the parent component method to fetch new data
    this.data.fetchNewData(pageIndex, pageSize).subscribe((response: any) => {
      this.dataSource.data = response.products; // Update the data
      this.paginator.length = response.total; // Update the paginator length
    }, (error:any) => {
      console.error('Error fetching conversion history', error);
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
