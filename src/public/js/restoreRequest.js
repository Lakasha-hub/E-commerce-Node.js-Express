document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value;

    if (!email.trim()) {
      return Swal.fire({
        position: "top-end",
        title: "Complete all camps",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    fetch(`/api/sessions/restoreRequest`, {
      method: "POST",
      body: JSON.stringify({
        email,
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
          icon: "info",
          title: "Password Reset",
          color: "#fff",
          background: "#202020",
          html: `we sent an email to <b>${email}</b>, please check your inbox or spam box to proceed with your password change.`,
          showConfirmButton: false,
          showCancelButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
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
