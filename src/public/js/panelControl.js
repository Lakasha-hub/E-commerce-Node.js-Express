import {
  createRowOfUsers,
  changeRoleToButton,
  deleteUserToButton,
} from "./functions.js";

/** Display Users Cards */
fetch("/api/users")
  .then((res) => res.json())
  .then((data) => {
    const users = data.payload;
    //Display cards of products
    createRowOfUsers(users);
    /** Create listeners to buttons */
    changeRoleToButton();
    deleteUserToButton();
  })
  .catch((error) => console.log(error));
