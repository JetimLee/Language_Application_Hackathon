// function sendData(user, endpoint, callback) {
//   let url = `http://localhost:4000/${endpoint}`;
//   let h = new Headers();
//   h.append("Content-Type", "application/json");
//   let req = new Request(url, {
//     method: "POST",
//     headers: h,
//     body: JSON.stringify(user),
//   });
//   fetch(req)
//     .then((res) => res.json())
//     .then((content) => {
//       //we have a response
//       if ("error" in content) {
//         //bad attempt
//         failure(content.error);
//       }
//       if ("data" in content) {
//         //it worked
//         callback(content.data);
//       }
//     })
//     .catch(failure);
// }
