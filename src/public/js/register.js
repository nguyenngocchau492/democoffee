const name = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const rePass = document.getElementById("password-repeat");
const registerFrom = document.querySelector(".user-form");
const term = document.querySelector("#check");
function validateEmail(email) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

registerFrom.addEventListener("submit", (e) => {
  // e.preventDefault();

  // document.querySelector(".emty-name").innerHTML =
  //   name.value.trim() === "" ? "Please enter name" : "";

  // document.querySelector(".emty-email").innerHTML =
  //   email.value.trim() === "" || !validateEmail(email.value)
  //     ? "Please enter valid email"
  //     : "";

  // document.querySelector(".empty-password").innerHTML =
  //   password.value.trim() === "" || password.value.length < 6
  //     ? "Please enter valid password"
  //     : "";

  // document.querySelector(".wrong-repass").innerHTML =
  //   password.value !== rePass.value ? "Wrong re-password" : "";

 
});
