import _ from "lodash";
import utils from "@Componentes/utils";

const metodos = {
  anular: id => {
    const url = window.Config.WS_TURNERO + "/v1/ReservaTurno/anular/";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--Id": id
        }
      })
        .then(data => data.json())
        .then(data => {
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
  },
  getDeUsuarioLogeado: () => {
    const url = window.Config.WS_TURNERO + "/v1/ReservaTurno";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token")
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          _.forEach(data.return, item => {
            let fechaTurno = utils.toDateTime(item.fecha);
            if (item.estadoKeyValue == 1 && fechaTurno.getTime() < new Date().getTime()) {
              item.estadoKeyValue = -1;
              item.estadoNombre = "Vencido";
              item.estadoColor = "violet";
            }
          });

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  getDetalle: id => {
    const url = window.Config.WS_TURNERO + "/v1/ReservaTurno/Detalle";
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "--Token": localStorage.getItem("token"),
          "--Id": id
        }
      })
        .then(data => data.json())
        .then(data => {
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
