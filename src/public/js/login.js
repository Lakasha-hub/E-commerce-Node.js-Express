document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn-primary");
  btn.addEventListener("click", () => {
    const email = document.querySelector("#inputEmail4").value;
    const password = document.querySelector("#inputPassword4").value;

    if (!email.trim() || !password.trim()) {
      return Swal.fire({
        position: "top-end",
        title: "Complete all camps",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    fetch(`/api/users/?query=email=${email}/password=${password}`)
      .then((response) => response.json())
      .then((data) => {
        data = data.payload;
        window.location.replace("/products");
      })
      .catch((error) => {
        console.log(error)
        return Swal.fire({
          position: "top-end",
          title: "email or password is not correct",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  });
});
