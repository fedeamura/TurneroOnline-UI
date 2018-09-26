const metodos = {
  get: () => {
    let url = window.Config.WS_CORDOBA_GEO + "/barrios?conPoligono=false";

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.estado != "OK") {
            reject(data.error);
            return;
          }
          resolve(data.info);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  }
};

export default metodos;
