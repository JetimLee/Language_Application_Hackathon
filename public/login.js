document.querySelector("#loginForm button").addEventListener("click", login);

function login(event) {
  event.preventDefault();
  console.log("Sent a login request");
  let em = document.querySelector("#loginForm .email").value;
  let pass = document.querySelector("#loginForm .pass").value;
  //TODO: Add form validation
  let user = { email: em, password: pass };
  let endpoint = "login";
  sendData(user, endpoint, loginSuccess);
}

function sendData(user, endpoint, callback) {
  let url = `http://localhost:333/${endpoint}`;
  let h = new Headers();
  h.append("Content-Type", "application/json");
  let req = new Request(url, {
    method: "POST",
    headers: h,
    body: JSON.stringify(user),
  });
  fetch(req)
    .then((res) => res.json())
    .then((content) => {
      //we have a response
      if ("error" in content) {
        console.log(content);
        //bad attempt
        failure(content.error);
      }
      if ("data" in content) {
        //it worked
        callback(content.data);
      }
    })
    .catch(failure);
}

function loginSuccess(data) {
  //we have a token so put it in localstorage
  console.log("token", data.token);
  sessionStorage.setItem("myapp-token", data.token);
  alert("You are logged in");
}

function failure(err) {
  alert(err.message);
  console.warn(err.code, err.message);
}
