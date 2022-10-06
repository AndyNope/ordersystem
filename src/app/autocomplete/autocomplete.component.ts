import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AutocompleteService } from './autocomplete.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  autocompleteList: any;

  constructor(
    private autocompleteService: AutocompleteService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  getList(): void {
    this.autocompleteList = [];
    this.autocompleteService.getAutocompleteList().subscribe(
      res => {
        this.autocompleteList = res.body;
      }
    );
    this.cdRef.detectChanges();
  }

  deleteAutocomplete(id: number) {
    console.log(id);

    this.autocompleteService.deleteAutocomplete(id).subscribe(
      res => {
        this.getList();
      }
    );
  }

}
