import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  editingMode = false;
  userId: number | null = null;
  user: User | undefined;

  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];
  years: number[] = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      username: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
      dobDay: ['', [Validators.required]],
      dobMonth: ['', [Validators.required]],
      dobYear: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      zipcode: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const userId = params['id'];
      if (userId) {
        this.userId = +userId;
        this.user = this.userService.getUserById(this.userId);
        if (this.user) {
          const dob = new Date(this.user.dob);
          this.userForm.patchValue({
            name: this.user.name,
            username: this.user.username,
            dobDay: dob.getDate(),
            dobMonth: dob.getMonth() + 1,
            dobYear: dob.getFullYear(),
            email: this.user.email,
            password: this.user.password,
            zipcode: this.user.zipcode,
          });
          this.editingMode = true;
        }
      }
    });
  }


  loadUserData(): void {
    const user = this.userService.getUser(this.userId!);
    if (user) {
      this.userForm.patchValue(user);
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const dob = new Date(
        this.userForm.value.dobYear,
        this.userForm.value.dobMonth - 1,
        this.userForm.value.dobDay
      );
      const user: User = {
        id: this.userId || Date.now(),
        name: this.userForm.value.name,
        username: this.userForm.value.username,
        dob: dob.toISOString(),
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        zipcode: this.userForm.value.zipcode,
      };

      if (this.editingMode) {
        this.userService.updateUser(user);
      } else {
        this.userService.addUser(user);
      }

      this.router.navigate(['/home']);
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
