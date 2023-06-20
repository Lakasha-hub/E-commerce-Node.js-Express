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
        timer: 2000,
      });
    }

    fetch(`/api/sessions/restorePassword`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const responseData = await response.json();
        if (responseData.error) throw new Error(responseData.error);
        return responseData;
      })
      .then((data) => {
        Swal.fire({
          position: "top-end",
          title: "Password successfully reset",
          showConfirmButton: false,
          timer: 2000,
        });
        setTimeout(() => {
          window.location.replace("/login");
        }, 2000);
      })
      .catch((error) => {
        return Swal.fire({
          position: "top-end",
          title: `${error}`,
          showConfirmButton: false,
          timer: 2000,
        });
      });
  });
});
