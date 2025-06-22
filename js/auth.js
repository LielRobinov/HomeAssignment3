//  הרשמה והתחברות (usersList, currentUser)

function Registration(event){
    event.preventDefault();
    window.location.href = "register.html";
}

function SignUp(event){
    event.preventDefault();
    const userName = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    if(!userName.trim() || !password.trim()){
    showPopupMessage("Please fill in both username and password.");
    return;}

    if (password.length < 8){
    showPopupMessage("The password must have a minimum of 8 characters.");
    return;}

    let usersList = localStorage.getItem("usersList");
    if (usersList){
    usersList = JSON.parse(usersList);
    }
    else{
    usersList = []; }


    for (let i =0; i < usersList.length; i++)
    {
        if(usersList[i].username === userName)
        {
            showPopupMessage("This username already exists. Please try again.");
            return;
        }
    }

usersList.push({username: userName, password: password});
localStorage.setItem("usersList" , JSON.stringify(usersList));


window.location.href = "index.html";
}

function LogIn(){
const userName = document.querySelector("#username").value;
const password = document.querySelector("#password").value;

let usersList = localStorage.getItem("usersList");

if (usersList){
    usersList = JSON.parse(usersList);
}
else{
    usersList = [];
}

if(!userName || !password)
{
    showPopupMessage("Please fill in both username and password.");
    return;
}

let user = false;
for (let i=0 ; i< usersList.length; i++)
{
    if(usersList[i].username === userName)
    {
        user = true;
        if(usersList[i].password === password){
            localStorage.setItem("currentUser" , JSON.stringify(usersList[i]));
            setTimeout(function() {
            window.location.href = "index.html";}, 100);
            return;
        }
        else{
            showPopupMessage("Incorrect password");
            return;
        }
    }
}
if (!user) {
        showPopupMessage("User not found. Please register first.");
    }

}


function LogIn2(event){
    event.preventDefault();
    window.location.href = "login.html";
}

function showPopupMessage(message) {
  var popup = document.getElementById("popupMessage");
  popup.textContent = message;
  popup.classList.remove("hidden");
  
  setTimeout(function() {
    popup.classList.add("show");
  }, 10)
    setTimeout(function() {
    popup.classList.remove("show");
    setTimeout(function() {
      popup.classList.add("hidden");
    }, 300);
  }, 3000);
}

