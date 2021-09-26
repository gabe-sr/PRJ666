import SignUpForm from "./SignUpForm/SignUpForm";
import NavbarTemplate from "../common/navbar/NavbarTemplate";

const navItems = [
  {
    item: "Contact",
    href: "#",
    dropdown: [],
  },
  {
    item: "About us",
    href: "/about",
    dropdown: [],
  },
  {
    item: "Pricing",
    href: "/pricing",
    dropdown: [],
  },
  {
    item: "Sign Up",
    href: "/signup",
    dropdown: [],
  },
  {
    item: "Login",
    href: "/login",
    dropdown: [],
  },
];

const SignUp = () => {
  return (
    <>
      <NavbarTemplate navData={navItems} />
      <SignUpForm />
    </>
  );
};

export default SignUp;
