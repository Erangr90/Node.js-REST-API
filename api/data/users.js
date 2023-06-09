import bcrypt from "bcryptjs";

const users = [
  {
    firstName: "Ziv",
    lastName: "Grady",
    email: "ziv132@gmail.com",
    password: bcrypt.hashSync("12345678", 10),
    subscription: "",
  },
  {
    firstName: "Adir",
    lastName: "Grady",
    email: "adir@gmail.com",
    password: bcrypt.hashSync("12345678", 10),
    isAdmin: true,
  },
];

export default users;
