window.onload = function () {
  // ngrokでホストする
  BASE_URL = 'http://localhost:8080';

  const simpleRequestButton = document.getElementById('simple-request');
  const prefligtRequestButton = document.getElementById('preflight-request');

  simpleRequestButton.addEventListener('click', event => {
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    reqestCorsServer(headers).then(data => console.log(data));
  });

  prefligtRequestButton.addEventListener('click', event => {
    let headers = {
      'Content-Type': 'application/json'
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
};
