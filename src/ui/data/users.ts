/**
 * Credentials published on the Swag Labs login page.
 * They are demo accounts, not secrets.
 */
export const users = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  invalid: {
    username: 'not_a_user',
    password: 'wrong_password',
  },
} as const;

export const messages = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
  orderComplete: 'Thank you for your order!',
} as const;

export const customer = {
  firstName: 'Maxat',
  lastName: 'Shaimardinov',
  postalCode: '050000',
} as const;
