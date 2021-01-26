window.onload = function () {
  // ngrokでホストする
  BASE_URL = 'http://localhost:8080';

  const requestButton = document.getElementById('unauthorized-request');
  requestButton.addEventListener('click', event => {
    let headers = {
      'Content-Type': 'application/json',
    }
    reqestCorsServer(headers).then(data => console.log(data));
  });

  const reqestCorsServer = async (headers) => {
    const response = await fetch(BASE_URL, {
      method: 'post',
      mode: 'cors',
      headers: headers
    });
    return response.json();
  }
}
