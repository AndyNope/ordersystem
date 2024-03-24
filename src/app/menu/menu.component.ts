import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menuList: any;
  loading: boolean = false;

  constructor(
    private menuService: MenuService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  getList(): void {
    this.loading = true;
    this.menuList = [];
    this.menuService.getMenuList().subscribe(
      res => {
        this.menuList = res.body;
        this.loading = false;
        this.cdRef.detectChanges();
        this.cdRef.markForCheck();
      }
    );
  }

  deleteMenu(id: number) {
    console.log(id);

    this.menuService.deleteMenu(id).subscribe(
      () => {
        this.getList();
      }
    );
  }

}
