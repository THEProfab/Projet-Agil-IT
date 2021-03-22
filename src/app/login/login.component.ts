import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthentificationService} from '../_services/authentification.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    email: null,
    password: null
  };
  loading = false;
  returnUrl: string;
  error = '';

  formulaire = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthentificationService, private router: Router) {
  }

  ngOnInit(): void {
  }

  get email(): AbstractControl {
    return this.formulaire.get('email');
  }

  get password(): AbstractControl {
    return this.formulaire.get('password');
  }

  onSubmit(): void {
    this.form = {...this.form, ...this.formulaire.value};
    this.loading = true;
    this.authService.login(this.form.email, this.form.password)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });

/*
    this.authService.login(this.email.value, this.password.value).subscribe(
      data => {
        this.tokenStorage.saveToken(data.access_token);
        this.tokenStorage.saveUser(data.user);

        this.roles = this.tokenStorage.getUser().roles;
        this.router.navigate(['/']);
      },
      err => {
        this.formulaire.reset();
        this.formulaire.patchValue({email: this.form.email});
        this.tokenStorage.signOut();
        this.messageService.add({severity: 'error', summary: 'Erreur', detail: err.error.data.values[0], key: 'main'});
      }
    );
*/

  }
}