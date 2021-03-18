import { Component, OnInit, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UserService } from "../../../../../_core/_services/user.service";
import { AlertifyService } from "../../../../../_core/_services/alertify.service";
import { PaginatedResult, Pagination } from "../../../../../_core/_models/pagination";
import { User } from "../../../../../_core/_models/user";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"]
})
export class UserListComponent implements OnInit {
  mesUser: User[];
  user: User = JSON.parse(localStorage.getItem("user"));
  text: string;
  searchKey = false;
  pagination: Pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 1,
    totalPages: 1
  };
  modalRef: BsModalRef;
  userID:string;
  userName:string;
  modalUser: any;
  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.loadMesUser();
  }

  loadMesUser() {
    debugger;
    //this.spinner.show();
    if (this.searchKey === false) {
      this.userService
        .getMesUser(this.pagination.currentPage, this.pagination.itemsPerPage)
        .subscribe(
          (res: PaginatedResult<User[]>) => {
            console.log(res);
            this.mesUser = res.result;
            this.pagination = res.pagination;
            //this.spinner.hide();
          },
          error => {
            this.alertify.error(error);
          }
        );
    } else {
      this.userService
        .search(
          this.pagination.currentPage,
          this.pagination.itemsPerPage,
          this.text
        )
        .subscribe(
          (res: PaginatedResult<User[]>) => {
            this.mesUser = res.result;
            this.pagination = res.pagination;
            console.log("Search: ", this.mesUser);
          },
          error => {
            this.alertify.error(error);
          }
        );
    }
  }

  searchMesUser() {
    if (this.text !== "") {
      this.searchKey = true;
      this.userService
        .search(
          this.pagination.currentPage,
          this.pagination.itemsPerPage,
          this.text
        )
        .subscribe(
          (res: PaginatedResult<User[]>) => {
            this.mesUser = res.result;
            this.pagination = res.pagination;
          },
          error => {
            this.alertify.error(error);  
          }
        );
    } else {
      this.searchKey = false;
      this.loadMesUser();
    }
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMesUser();
  }
  authorize(template: TemplateRef<any>,item) {
    this.userID =item.user_ID;
    this.userName =item.user_Name;
    debugger;
      this.userService
        .GetRoleByUser(item.user_ID).subscribe(res=>{
          this.modalUser =res;
        })
    this.modalRef = this.modalService.show(template);
  }
  authorizeSave(){
    this.userService.SaveRoleUser(this.modalUser).subscribe((res) => {
      if (res) {
        this.alertify.success("Save success");
        this.modalRef.hide();

      } else {
        this.alertify.error("Save failed");
      }
    });
  }
  checkChange(item){

    item.status = !item.status;
    console.log(this.modalUser);
  }
}
