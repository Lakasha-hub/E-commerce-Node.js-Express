document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn-primary");
  btn.addEventListener("click", () => {
    const first_name = document.querySelector("#first_name").value;
    const last_name = document.querySelector("#last_name").value;
    const email = document.querySelector("#inputEmail4").value;
    const password = document.querySelector("#inputPassword4").value;

    if (
      !first_name.trim() ||
      !last_name.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      return Swal.fire({
        position: "top-end",
        title: "Complete all camps",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    fetch("/api/users/", {
      method: "POST",
      body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data = data.payload;
        window.location.replace("/login");
      })
      .catch((error) => console.log(error));
  });
});
