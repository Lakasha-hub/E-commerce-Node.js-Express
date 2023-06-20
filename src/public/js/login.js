document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn-primary");
  btn.addEventListener("click", function btnListener() {
    const email = document.querySelector("#inputEmail4").value;
    const password = document.querySelector("#inputPassword4").value;

    if (!email.trim() || !password.trim()) {
      return Swal.fire({
        position: "top-end",
        title: "Complete all camps",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    fetch(`/api/sessions/login/?email=${email}&&password=${password}`)
      .then(async (response) => {
        const responseData = await response.json();
        if (responseData.error) throw new Error(responseData.error);
        return responseData;
      })
      .then((data) => {
        window.location.replace("/products");
      })
      .catch((error) => {
        if (error == "Error: Attempts limit reached")
          btn.removeEventListener("click", btnListener);
        return Swal.fire({
          position: "top-end",
          title: `${error}`,
          showConfirmButton: false,
          timer: 2000,
        });
      });
  });
});
