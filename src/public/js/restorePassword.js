document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("submit", (event) => {
    event.preventDefault();

    const newPassword = document.querySelector("#newPassword").value;
    const confirmPassword = document.querySelector("#confirmPassword").value;
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const token = params.tkn;

    if (!newPassword.trim() || !confirmPassword.trim()) {
      return Swal.fire({
        position: "top-end",
        title: "Complete all camps",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    if (newPassword !== confirmPassword) {
      return Swal.fire({
        position: "top-end",
        title: "Passwords do not match",
        showConfirmButton: false,
        timer: 3000,
      });
    }

    fetch(`/api/sessions/restorePassword`, {
      method: "POST",
      body: JSON.stringify({
        newPassword,
        confirmPassword,
        token
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
