document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn-primary");
<<<<<<< HEAD
  btn.addEventListener("click", function btnListener(event) {
    event.preventDefault();
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
=======
  btn.addEventListener("click", function btnListener() {
    const email = document.querySelector("#inputEmail4").value;
    const password = document.querySelector("#inputPassword4").value;
>>>>>>> 452099c85866f764a3463ff278240186caab9e9c

    if (!email.trim() || !password.trim()) {
      return Swal.fire({
        position: "top-end",
<<<<<<< HEAD
        showConfirmButton: false,
        title: `Complete all camps`,
        color: "#fff",
        background: "#555",
=======
        title: "Complete all camps",
        showConfirmButton: false,
>>>>>>> 452099c85866f764a3463ff278240186caab9e9c
        timer: 2000,
      });
    }

    fetch(`/api/sessions/login`, {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const responseData = await response.json();
        if (response.status !== 200) throw new Error(responseData.error);
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
