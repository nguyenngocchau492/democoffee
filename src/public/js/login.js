const resetBtn = document.querySelector("#reset")
const email = document.querySelector("#email")
const password = document.querySelector("#password")
resetBtn.addEventListener("click",()=>{
email.value = ""
password.value = ""
})