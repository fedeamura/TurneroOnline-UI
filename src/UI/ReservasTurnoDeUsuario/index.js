import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { goBack, push } from "connected-react-router";

//Componentes
import BigCalendar from "react-big-calendar";
import _ from "lodash";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import ButtonBase from "@material-ui/core/ButtonBase";
import memoizeOne from "memoize-one";

//Mis componentes
import MiCard from "@Componentes/MiCard";
import MiBaner from "@Componentes/MiBaner";
import DateUtils from "@Componentes/Utils/Date";
import _MiPagina from "../_MiPagina";

//Rules
import Rules_ReservaTurno from "@Rules/Rules_ReservaTurno";
import Rules_EstadoReservaTurno from "@Rules/Rules_EstadoReservaTurno";

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  goBack: () => {
    dispatch(goBack());
  },
  redirigir: url => {
    dispatch(push(url));
  }
});

class TurnosDeUsuario extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: true,
      data: [],
      mostrarError: false,
      error: undefined,
      estadosReservaTurno: [],
      filtroEstados: {}
    };

    this.añoActual = new Date().getFullYear();
  }

  componentDidMount() {
    this.setState({ cargando: true, mostrarError: false }, () => {
      Rules_EstadoReservaTurno.get()
        .then(estados => {
          Rules_ReservaTurno.getDeUsuarioLogeado()
            .then(data => {
              let filtroEstados = {};

              let estadoParametro = this.props.match.params.estado;

              estados.push({
                keyValue: -1,
                nombre: "Vencido",
                color: "violet"
              });

              _.forEach(estados, estado => {
                if (estadoParametro !== undefined) {
                  filtroEstados["" + estado.keyValue] = estado.keyValue == estadoParametro;
                } else {
                  filtroEstados["" + estado.keyValue] = true;
                }
              });

              data.forEach(item => {
                item.fechaDate = DateUtils.toDateTime(item.fecha);
              });

              //Ordeno por fecha
              data = _.orderBy(data, item => {
                return item.fechaDate;
              });

              //Invierto el orden
              data = _.reverse(data);

              this.setState({
                data: data,
                dataVisible: true,
                estadosReservaTurno: estados,
                filtroEstados: filtroEstados
              });
            })
            .catch(error => {
              this.setState({ mostrarError: true, error: error });
            })
            .finally(() => {
              this.setState({ cargando: false });
            });
        })
        .catch(error => {
          this.setState({ mostrarError: true, error: error, cargando: false });
        });
    });
  }

  onEstadoClick = e => {
    let keyValue = e.currentTarget.attributes["data-key-value"].value;

    this.setState({
      filtroEstados: {
        ...this.state.filtroEstados,
        [keyValue]: !this.state.filtroEstados[keyValue]
      }
    });
  };

  getTurnos = memoizeOne((data, filtroEstados) => {
    var estados = [];
    for (var property in filtroEstados) {
      if (filtroEstados.hasOwnProperty(property)) {
        if (filtroEstados[property] == true) {
          estados.push(property);
        }
      }
    }

    if (estados.length == 0) {
      return data;
    }

    return _.filter(data, item => {
      return estados.indexOf("" + item.estadoKeyValue) != -1;
    });
  });

  getMensajeSinTurnos = memoizeOne(filtroEstados => {
    var estados = [];
    for (var property in filtroEstados) {
      if (filtroEstados.hasOwnProperty(property)) {
        if (filtroEstados[property] == true) {
          estados.push(property);
        }
      }
    }

    if (estados.length == 0) {
      this.state.estadosReservaTurno.forEach(estado => {
        estados.push(estado.keyValue);
      });
    }

    estados = estados.map(estado => {
      let info = _.find(this.state.estadosReservaTurno, e => {
        return "" + e.keyValue == "" + estado;
      });
      return info.nombre;
    });

    if (estados.length == 0) return "";
    if (estados.length != 1) {
      let primeros = estados.slice(0, estados.length - 1);
      let ultimo = estados[estados.length - 1];

      return primeros.join(", ") + " o " + ultimo;
    } else {
      return estados[0];
    }
  });

  onTurnoClick = e => {
    let id = e.currentTarget.attributes["data-id"].value;
    this.props.redirigir("/Reserva/" + id);
  };

  getNombreMes = mes => {
    switch (mes) {
      case 0:
        return "Enero";

      case 1:
        return "Febrero";

      case 2:
        return "Marzo";

      case 3:
        return "Abril";
      case 4:
        return "Mayo";
      case 5:
        return "Junio";
      case 6:
        return "Julio";
      case 7:
        return "Agosto";
      case 8:
        return "Septiembre";
      case 9:
        return "Octubre";
      case 10:
        return "Noviembre";
      case 11:
        return "Dicimembre";
    }

    return "";
  };

  render() {
    const { classes } = this.props;
    const { data, estadosReservaTurno, filtroEstados, dataVisible } = this.state;
    let turnos = [];
    if (dataVisible) {
      turnos = this.getTurnos(data, this.state.filtroEstados);
    }

    return (
      <React.Fragment>
        <_MiPagina cargando={this.state.cargando} full>
          <MiBaner modo="error" mensaje={this.state.error} visible={this.state.mostrarError} />

          <Grid container spacing={16}>
            <Grid item xs={12}>
              <div className={classes.botonesFiltro}>
                {estadosReservaTurno &&
                  estadosReservaTurno.map((estado, index) => {
                    let resaltado = filtroEstados[estado.keyValue] == true;
                    return (
                      <ButtonBase
                        data-key-value={estado.keyValue}
                        onClick={this.onEstadoClick}
                        className={classNames("boton", resaltado && "resaltado")}
                        key={index}
                      >
                        <div
                          className="indicador"
                          style={{
                            backgroundColor: estado.color
                          }}
                        />
                        <Typography>{estado.nombre}</Typography>
                      </ButtonBase>
                    );
                  })}
              </div>
            </Grid>
            {turnos &&
              turnos.map((turno, index) => {
                let fecha = "";
                if (turno.fechaDate.getFullYear() == this.añoActual) {
                  fecha = turno.fechaDate.getDate() + " de " + this.getNombreMes(turno.fechaDate.getMonth());
                } else {
                  fecha = DateUtils.toDateString(turno.fechaDate);
                }

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <div onClick={this.onTurnoClick} data-id={turno.id}>
                      <MiCard padding={false}>
                        <div style={{ borderBottom: "2px solid rgba(0,0,0,0.1)", padding: 16 }}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="headline" style={{ flex: 1 }}>
                              {fecha}
                            </Typography>
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <div
                                style={{
                                  minWidth: 16,
                                  minHeight: 16,
                                  maxWidth: 16,
                                  maxHeight: 16,
                                  borderRadius: 16,
                                  marginRight: 8,
                                  backgroundColor: turno.estadoColor
                                }}
                              />
                              <Typography>{turno.estadoNombre}</Typography>
                            </div>
                          </div>
                          <Typography>{DateUtils.toTimeString(turno.fechaDate)}</Typography>
                        </div>

                        <div style={{ padding: 16 }}>
                          <Typography>
                            <b style={{ fontWeight: 300 }}>Código: </b>
                            {`${turno.codigo}/${turno.año}`}
                          </Typography>
                          <Typography>
                            <b style={{ fontWeight: 300 }}>Entidad: </b>
                            {turno.entidadNombre}
                          </Typography>
                          <Typography>
                            <b style={{ fontWeight: 300 }}>Trámite: </b>
                            {turno.tramiteNombre}
                          </Typography>
                          <Typography variant="body1">
                            <b style={{ fontWeight: 300 }}>Turnero: </b>
                            {turno.turneroNombre}
                          </Typography>
                        </div>
                      </MiCard>
                    </div>
                  </Grid>
                );
              })}
          </Grid>

          {dataVisible == true && (
            <div
              style={{
                pointerEvents: "none",
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                marginTop: 156,
                opacity: turnos.length == 0 ? 1 : 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                transition: "all 0.3s"
              }}
            >
              <Icon style={{ fontSize: 72, marginBottom: 16 }}>info_outline</Icon>
              <Typography variant="headline" style={{ textAlign: "center" }}>
                No tiene ningun turno {this.getMensajeSinTurnos(filtroEstados)}
              </Typography>
            </div>
          )}
        </_MiPagina>
      </React.Fragment>
    );
  }
}

let componente = TurnosDeUsuario;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withRouter(componente);
export default componente;
