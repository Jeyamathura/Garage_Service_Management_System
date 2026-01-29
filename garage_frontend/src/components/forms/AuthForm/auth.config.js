export const LOGIN_CONFIG = {
  title: "Welcome Back",
  subtitle: "Log in to manage your services, bookings, and vehicles",
  submitLabel: "Login",
  redirectText: {
    text: "Don't have an account?",
    linkLabel: "Sign Up",
    linkTo: "/signup",
  },
  fields: [
    { name: "username", type: "text", placeholder: "Username" },
    { name: "password", type: "password", placeholder: "Password" },
  ],
};

export const SIGNUP_CONFIG = {
  title: "Create Account",
  subtitle: "Sign up to manage your bookings and vehicles",
  submitLabel: "Register",
  redirectText: {
    text: "Already have an account?",
    linkLabel: "Login",
    linkTo: "/login",
  },
  fields: [
    { name: "firstName", type: "text", placeholder: "First Name" },
    { name: "lastName", type: "text", placeholder: "Last Name" },
    { name: "username", type: "text", placeholder: "Username" },
    { name: "email", type: "email", placeholder: "Email" },
    { name: "password", type: "password", placeholder: "Password" },
    { name: "confirmPassword", type: "password", placeholder: "Confirm Password" },
  ],
};
