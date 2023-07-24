document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD
  const btn = document.querySelector("#btnRegister");
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    const first_name = document.querySelector("#first_name").value;
    const last_name = document.querySelector("#last_name").value;
    const age = document.querySelector("#age").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
=======
  const btn = document.querySelector(".btn-primary");
  btn.addEventListener("click", () => {
    const first_name = document.querySelector("#first_name").value;
    const last_name = document.querySelector("#last_name").value;
    const age = document.querySelector("#age").value;
    const email = document.querySelector("#inputEmail4").value;
    const password = document.querySelector("#inputPassword4").value;
>>>>>>> 452099c85866f764a3463ff278240186caab9e9c

    if (
      !first_name.trim() ||
      !last_name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !age.trim()
    ) {
      return Swal.fire({
        position: "top-end",
        title: "Complete all camps",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    fetch("/api/sessions/register", {
      method: "POST",
      body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        email: email,
        age: age,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const responseData = await response.json();
        if (response.status !== 201) {
          throw new Error(responseData.error);
        }
        return responseData;
      })
      .then((data) => {
<<<<<<< HEAD
        Swal.fire({
          position: "top-end",
          showConfirmButton: false,
          title: "Register Completed",
          text: "we redirect you to log in",
          color: "#fff",
          background: "#555",
          timer: 2000,
        });
        setTimeout(() => {
          window.location.replace("/login");
        }, 2000);
=======
        window.location.replace("/login");
>>>>>>> 452099c85866f764a3463ff278240186caab9e9c
      })
      .catch((error) => {
        return Swal.fire({
          position: "top-end",
<<<<<<< HEAD
          showConfirmButton: false,
          title: `${error}`,
          color: "#fff",
          background: "#555",
=======
          title: `${error}`,
          showConfirmButton: false,
>>>>>>> 452099c85866f764a3463ff278240186caab9e9c
          timer: 2000,
        });
      });
  });
});
