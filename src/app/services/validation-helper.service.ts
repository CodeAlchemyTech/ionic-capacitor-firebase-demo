import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationHelper {
  public validationMessages = {
    fullname: [{ type: 'required', message: 'Fullname is required!' }],
    email: [
      { type: 'required', message: 'Email is required!' },
      { type: 'pattern', message: 'Invalid email address!' },
    ],
    password: [
      { type: 'required', message: 'Password is required!' },
      {
        type: 'minlength',
        message: 'Password must be at least 6 characters long.',
      },
    ],
    confirmpassword: [
      {
        type: 'Confirm password is required!',
        message: 'form-fields.confirmpassword.errors.required',
      },
      {
        type: 'confirmedValidator',
        message: 'Password and confirm password must be same!',
      },
    ],
  };
  constructor() {}

  confirmedValidator(controlName: string, matchingControlName: any) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
