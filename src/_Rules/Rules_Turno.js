import _ from "lodash";

const metodos = {
  reservar: id => {
    const url = window.Config.WS_TURNERO + "/v1/Turno/Reservar/" + id;
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token")
        }
      })
        .then(data => {
          if (data.ok == false) {
            reject("Error procesando la solicitud");
            return;
          }
          return data.json();
        })
        .then(data => {
          if (data == undefined) {
            reject("Error procesando la solicitud");
            return;
          }

          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  }
};

export default metodos;
