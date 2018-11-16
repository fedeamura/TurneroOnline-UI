import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import styles from "./styles";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { goBack, push } from "connected-react-router";
import { mostrarAlerta } from "@Redux/Actions/alerta";

//Componentes
import _ from "lodash";
import BigCalendar from "react-big-calendar";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

//Mis componentes
import MiPanelMensaje from "@Componentes/MiPanelMensaje";
import MiCard from "@Componentes/MiCard";
import _MiPagina from "../_MiPagina";
import DateUtils from "@Componentes/Utils/Date";

//Rules
import Rules_Turnero from "@Rules/Rules_Turnero";
import Rules_Turno from "@Rules/Rules_Turno";

//Globalizacion
import moment from "moment";
import "moment/locale/es";
moment.locale("es");

const localizer = BigCalendar.momentLocalizer(moment);

const mapStateToProps = state => {
  return {
    token: state.Usuario.token,
    usuario: state.Usuario.usuario
  };
};

const mapDispatchToProps = dispatch => ({
  mostrarAlerta: mensaje => {
    dispatch(mostrarAlerta({ texto: mensaje }));
  },
  goBack: () => {
    dispatch(goBack());
  },
  redirigir: url => {
    dispatch(push(url));
  }
});

class TurneroCalendario extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      infoTurnero: undefined,
      dataDelMes: undefined,
      mesSeleccionado: new Date(),
      diaSeleccionado: undefined,
      eventos: [],
      primeraVez: true,
      alertaDia: undefined,

      dialogoErrorReservandoVisible: false,
      errorReservando: undefined,

      turnoSeleccionado: undefined,
      horarioTurnoSeleccionado: undefined
    };
  }

  componentDidMount() {
    this.setState({ cargando: true }, () => {
      Rules_Turnero.getDetalle(this.state.id)
        .then(data => {
          this.setState({ infoTurnero: data });
          this.buscarInfoDelMes(new Date().getMonth() + 1, new Date().getFullYear());
        })
        .catch(error => {
          this.setState({ error: error, cargando: false });
        });
    });
  }

  buscarInfoDelMes = (mes, año) => {
    this.setState({ cargando: true }, () => {
      let fechaInicio = undefined;
      if (mes == new Date().getMonth() + 1) {
        let dateHoy = new Date();
        let diaInicio = dateHoy.getDate();
        if (diaInicio < 10) diaInicio = "0" + diaInicio;
        let mesInicio = dateHoy.getMonth() + 1;
        if (mesInicio < 10) mesInicio = "0" + mesInicio;
        let añoInicio = dateHoy.getFullYear();
        fechaInicio = diaInicio + "/" + mesInicio + "/" + añoInicio;
      } else {
        if (mes < 10) mes = "0" + mes;
        fechaInicio = "01/" + mes + "/" + año;
      }

      let dateFin = new Date();
      dateFin.setDate(1);
      dateFin.setMonth(mes);

      let diaFin = dateFin.getDate();
      if (diaFin < 10) diaFin = "0" + diaFin;
      let mesFin = dateFin.getMonth() + 1;
      if (mesFin < 10) mesFin = "0" + mesFin;
      let añoFin = dateFin.getFullYear();
      let fechaFin = diaFin + "/" + mesFin + "/" + añoFin;

      Rules_Turnero.getTurnos({
        idTurnero: this.state.id,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      })
        .then(data => {
          if (this.state.primeraVez == true) {
            this.setState({ primeraVez: false });

            let diaMinimo = _.min(data, "fecha", "inicio");
            if (diaMinimo != undefined) {
              let partesDia = diaMinimo.fecha.split("T")[0].split("-");
              this.onDiaClick(new Date(partesDia[0], parseInt(partesDia[1]) - 1, partesDia[2]));
            }
          }
          this.setState({ dataDelMes: data });
        })
        .catch(error => {
          this.setState({ error: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  };

  onDiaClick = e => {
    let diaActual = new Date();
    diaActual.setHours(0);
    diaActual.setMilliseconds(0);
    diaActual.setMinutes(0);
    diaActual.setSeconds(0);
    if (e < diaActual) {
      this.props.mostrarAlerta("Seleccione una fecha superior a la actual");
      return;
    }

    let mesActual = this.state.mesSeleccionado.getMonth();
    if (e.getMonth() != this.state.mesSeleccionado.getMonth()) {
      if (e.getMonth() > mesActual) {
        document.getElementById("btn_MesSiguiente").click();
      } else {
        document.getElementById("btn_MesAnterior").click();
      }
    }

    this.setState(
      {
        calendarioDiaVisible: false,
        horarioTurnoSeleccionado: undefined
      },
      () => {
        setTimeout(() => {
          let eventos = _.filter(this.state.dataDelMes, item => {
            let fecha = item.fecha;
            let partes = fecha.split("T")[0].split("-");
            let dia = parseInt(partes[2]);
            let mes = parseInt(partes[1]);
            let año = parseInt(partes[0]);

            return e.getDate() == dia && e.getMonth() + 1 == mes && e.getFullYear() == año;
          });

          let agrupados = _.groupBy(eventos, "inicio", "duracion");

          let resultado = [];
          for (var property in agrupados) {
            if (agrupados.hasOwnProperty(property)) {
              let item = agrupados[property];
              if (item.length != 0) {
                let fecha = item[0].fecha;
                let partes = fecha.split("T")[0].split("-");
                let dia = parseInt(partes[2]);
                let mes = parseInt(partes[1]) - 1;
                let año = parseInt(partes[0]);

                let fechaInicio = new Date(año, mes, dia);
                fechaInicio.setMinutes(item[0].inicio * 5);

                let fechaFin = new Date(año, mes, dia);
                fechaFin.setMinutes(item[0].inicio * 5);
                fechaFin.setMinutes(fechaFin.getMinutes() + item[0].duracion * 5);

                resultado.push({
                  id: item[0].id,
                  start: fechaInicio,
                  end: fechaFin,
                  title: "Turno disponible"
                });
              }
            }
          }

          let alertaDia = undefined;
          if (resultado.length == 0) {
            alertaDia = "No hay turnos disponibles para el día seleccionado";
          }

          // document.getElementsByClassName("rbc-time-content")[0].scrollTop = 0;
          this.setState({
            diaSeleccionado: e,
            eventos: resultado,
            calendarioDiaVisible: true,
            alertaDia: alertaDia
          });
        }, 300);
      }
    );
  };

  onBotonMesAnteriorClick = () => {
    let mesActual = this.state.mesSeleccionado;
    mesActual.setMonth(mesActual.getMonth() - 1);
    this.setState({ mesSeleccionado: mesActual, diaSeleccionado: undefined, calendarioDiaVisible: false });

    this.buscarInfoDelMes(mesActual.getMonth() + 1, mesActual.getFullYear());
  };

  onBotonMesSiguienteClick = () => {
    let mesActual = this.state.mesSeleccionado;
    mesActual.setMonth(mesActual.getMonth() + 1);
    this.setState({ mesSeleccionado: mesActual, diaSeleccionado: undefined, calendarioDiaVisible: false });
    this.buscarInfoDelMes(mesActual.getMonth() + 1, mesActual.getFullYear());
  };

  onBotonCancelarDiaSeleccionadoClick = () => {
    this.setState({ calendarioDiaVisible: false }, () => {
      setTimeout(() => {
        this.setState({ diaSeleccionado: undefined });
      }, 300);
    });
  };

  mostrarDialogoConfirmarReservaTurno = e => {
    this.setState({ turnoSeleccionado: e, dialogoTurnoConfirmacionVisible: true });
  };

  onDialogoTurnoClose = () => {
    this.setState({ dialogoTurnoConfirmacionVisible: false });
  };

  reservarTurno = () => {
    this.setState(
      {
        reservandoTurno: true,
        dialogoTurnoConfirmacionVisible: false,
        dialogoTurnoExitoVisible: true,
        dialogoErrorReservandoVisible: false
      },
      () => {
        Rules_Turno.reservar(this.state.turnoSeleccionado.id)
          .then(() => {
            this.setState({
              reservandoTurno: false,
              dialogoTurnoConfirmacionVisible: false,
              dialogoTurnoExitoVisible: true
            });
          })
          .catch(error => {
            this.setState({
              dialogoTurnoExitoVisible: false,
              dialogoTurnoConfirmacionVisible: false,
              errorReservando: error,
              dialogoErrorReservandoVisible: true
            });
          });
      }
    );
  };

  onBotonIrInicioClick = () => {
    this.setState({ dialogoTurnoExitoVisible: false }, () => {
      this.props.redirigir("/");
    });
  };

  onDialogoErrorReservandoClose = () => {
    this.setState({ dialogoErrorReservandoVisible: false });
  };

  onBotonReinterarReservarClick = () => {
    this.setState({ dialogoErrorReservandoVisible: false });
    this.reservarTurno();
  };

  onRadioTurnoSeleccionadoChange = e => {
    this.setState({ horarioTurnoSeleccionado: "" + e.currentTarget.value });
  };

  onBotonReservarClick = () => {
    let evento = _.find(this.state.eventos, evento => evento.id == this.state.horarioTurnoSeleccionado);
    if (evento) {
      this.mostrarDialogoConfirmarReservaTurno(evento);
    }
  };

  onBotonTurneroClick = () => {
    this.props.redirigir("/TurneroDetalle/" + this.state.infoTurnero.id);
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <_MiPagina
          cargando={this.state.cargando}
          contentClassName={classes.contentClassName}
          miContentContentClassName={classes.miContentContentClassName}
          miContentRootClassName={classes.miContentRootClassName}
        >
          <React.Fragment>
            {this.renderInfoContextual()}

            <Grid container className={classes.grid}>
              <Grid item xs={12} md={5} className={classNames(classes.colCalendario, this.state.infoTurnero  && "visible")}>
                {this.renderCalendarioMes()}
              </Grid>

              <Grid item xs={12} md={7} className={classNames(classes.colCalendarioDia, this.state.calendarioDiaVisible && "visible")}>
                {this.renderCalendarioDia()}
              </Grid>
            </Grid>

            {this.renderDialogoTurnoConfirmacion()}
            {this.renderDialogoTurnoExito()}
            {this.renderDialogoErrorReservando()}
          </React.Fragment>
        </_MiPagina>
      </React.Fragment>
    );
  }

  renderInfoContextual() {
    const { classes } = this.props;

    return (
      <div className={classNames(classes.contenedorInfoTurnero, this.state.infoTurnero && "visible")}>
        <MiCard className={classes.imagenTurnero} padding={false}>
          <div
            className="imagen"
            style={{
              width: 72,
              height: 72,
              backgroundImage: `url(${this.state.infoTurnero ? this.state.infoTurnero.entidadImagen : ""})`
            }}
          />
        </MiCard>
        <div className="textos">
          <Typography variant="headline">
            <b>Trámite: </b>
            {this.state.infoTurnero ? this.state.infoTurnero.tramiteNombre : ""}
          </Typography>
          <Typography onClick={this.onBotonTurneroClick} variant="body1" className={classes.linkInteres}>
            Ver mas información
          </Typography>
        </div>
      </div>
    );
  }

  renderCalendarioMes() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <MiCard padding={false} className={classNames(classes.contenedorCalendario)}>
          <div>
            <BigCalendar
              view="month"
              className={classNames(classes.calendario)}
              views={{ month: true }}
              culture="es"
              localizer={localizer}
              onDrillDown={this.onDiaClick}
              events={[]}
              startAccessor="start"
              endAccessor="end"
              components={{
                month: {
                  toolbar: props => {
                    return (
                      <CalendarioMes_Encabezado
                        props={props}
                        classes={classes}
                        mostrarAlerta={this.props.mostrarAlerta}
                        onBotonMesAnteriorClick={this.onBotonMesAnteriorClick}
                        onBotonMesSiguienteClick={this.onBotonMesSiguienteClick}
                      />
                    );
                  },
                  dateHeader: props => {
                    //Calculo si esta seleccionado
                    let fechaSeleccionada = this.state.diaSeleccionado;
                    let seleccionado = false;
                    if (fechaSeleccionada) {
                      let hoy = props.date;
                      seleccionado =
                        fechaSeleccionada.getDate() == hoy.getDate() &&
                        fechaSeleccionada.getMonth() == hoy.getMonth() &&
                        fechaSeleccionada.getFullYear() == hoy.getFullYear();
                    }

                    //calculo si tiene turnos disponibles
                    let conTurnos =
                      _.find(this.state.dataDelMes, item => {
                        let fecha = item.fecha;
                        let partes = fecha.split("T")[0].split("-");

                        let dia = parseInt(partes[2]);
                        let mes = parseInt(partes[1]) - 1;
                        let año = parseInt(partes[0]);

                        return props.date.getDate() == dia && props.date.getMonth() == mes && props.date.getFullYear() == año;
                      }) != undefined;

                    //Calculo si debe estar deshabilitada
                    let deshabilitado = false;
                    let diaActual = new Date();
                    diaActual.setHours(0);
                    diaActual.setMilliseconds(0);
                    diaActual.setMinutes(0);
                    diaActual.setSeconds(0);
                    if (props.date < diaActual) {
                      deshabilitado = true;
                    }

                    if (this.state.cargando == true) {
                      seleccionado = false;
                      conTurnos = false;
                      deshabilitado = true;
                    }

                    return (
                      <CalendarioMes_Dia
                        deshabilitado={deshabilitado}
                        conTurnos={conTurnos}
                        seleccionado={seleccionado}
                        onClick={this.onDiaClick}
                        props={props}
                      />
                    );
                  }
                }
              }}
            />
          </div>
        </MiCard>
        <div className={classNames(classes.contenedorInfo)}>
          <div className={classNames(classes.indicadorInfo, classes.indicadorInfoDiaSeleccionado)} />
          <Typography variant="body1">Día seleccionado</Typography>
        </div>

        <div className={classNames(classes.contenedorInfo)}>
          <div className={classNames(classes.indicadorInfo, classes.indicadorInfoTurnoDisponible)} />
          <Typography variant="body1">Días con turnos disponibles</Typography>
        </div>
      </React.Fragment>
    );
  }

  renderCalendarioDia() {
    const { classes } = this.props;

    let diaSeleccionado = "";
    if (this.state.diaSeleccionado != undefined) {
      let fecha = this.state.diaSeleccionado;
      let dia = fecha.getDate();
      if (dia < 10) dia = "0" + dia;
      let mes = fecha.getMonth() + 1;
      if (mes < 10) mes = "0" + mes;
      let año = fecha.getFullYear();
      diaSeleccionado = dia + "/" + mes + "/" + año;
    }

    return (
      <MiCard
        padding={false}
        className={classes.contenedorCalendarioDia}
        rootClassName={classNames(classes.contenedorCalendarioRoot, this.state.calendarioDiaVisible && "visible")}
      >
        {/* Encabezado  */}
        <div className={classNames(classes.encabezadoTurnosDeDia)}>
          <Typography variant="headline">Turnos disponibles para el dia {diaSeleccionado}</Typography>
          <IconButton onClick={this.onBotonCancelarDiaSeleccionadoClick}>
            <Icon>clear</Icon>
          </IconButton>
        </div>

        {/* Mensaje sin eventos */}
        {this.state.alertaDia != undefined && (
          <div className={classNames(classes.contenedorSinEventos)}>
            <Typography variant="body2">{this.state.alertaDia}</Typography>
          </div>
        )}

        {this.state.eventos.length != 0 && (
          <div className={classes.contenedorSeleccioneUnTurno}>
            <Typography variant="body2">Seleccione un horario</Typography>
          </div>
        )}

        <div className={classes.contenedorTurnos}>
          <RadioGroup
            aria-label=""
            name="horario"
            value={"" + this.state.horarioTurnoSeleccionado}
            onChange={this.onRadioTurnoSeleccionadoChange}
          >
            {this.state.eventos.map((evento, index) => {
              let { start, end, id } = evento;
              let horaInicio = DateUtils.toTimeString(start);
              let horaFin = DateUtils.toTimeString(end);

              return <FormControlLabel key={index} value={"" + id} control={<Radio />} label={`De ${horaInicio} a ${horaFin}`} />;
            })}
          </RadioGroup>
        </div>

        {this.state.eventos.length != 0 && (
          <div className={classes.contenedorBotones}>
            <Button
              variant="raised"
              color="primary"
              onClick={this.onBotonReservarClick}
              disabled={this.state.horarioTurnoSeleccionado == undefined}
            >
              Reservar
            </Button>
          </div>
        )}
        {/* Calendario */}
        {/* <BigCalendar
            view="day"
            className={classNames("calendarioDia")}
            date={this.state.diaSeleccionado}
            toolbar={false}
            onSelectSlot={this.onSelectSlot}
            onSelectEvent={this.onSelectEvent}
            views={{ day: true }}
            localizer={localizer}
            events={this.state.eventos}
            step={15}
            timeslots={1}
            eventPropGetter={this.eventStyleGetter}
            onSelectEvent={this.onCalendarioDiaEventoClick}
            startAccessor="start"
            endAccessor="end"
          /> */}
      </MiCard>
    );
  }

  renderDialogoTurnoConfirmacion() {
    if (this.state.turnoSeleccionado == undefined) return null;
    if (this.state.turnoRegistrado == true) return null;

    let fecha = this.state.turnoSeleccionado.start;
    let dia = fecha.getDate();
    if (dia < 10) dia = "0" + dia;
    let mes = fecha.getMonth() + 1;
    if (mes < 10) mes = "0" + mes;
    let año = fecha.getFullYear();
    let horas = fecha.getHours();
    if (horas < 10) horas = "0" + horas;
    let minutos = fecha.getMinutes();
    if (minutos < 10) minutos = "0" + minutos;
    let fechaString = dia + "/" + mes + "/" + año;
    let horaString = horas + ":" + minutos;
    return (
      <Dialog onClose={this.onDialogoTurnoClose} open={this.state.dialogoTurnoConfirmacionVisible}>
        <DialogTitle id="simple-dialog-title">Reservar turno</DialogTitle>

        <DialogContent>
          <Typography variant="body1">¿Desea reservar el turno seleccionado?</Typography>
          {/* Tramite */}
          <div className="dialogo_info">
            <Typography variant="body2">Tramite: </Typography>
            <Typography variant="body1">{this.state.infoTurnero.tramiteNombre}</Typography>
          </div>
          {/* Ubicacion */}
          {this.state.infoTurnero.ubicaciones != undefined && (
            <div className="dialogo_info">
              <Typography variant="body2">Ubicación: </Typography>
              <Typography variant="body1">{this.state.infoTurnero.ubicaciones[0].direccion}</Typography>
            </div>
          )}
          {/* Fecha */}
          <div className="dialogo_info">
            <Typography variant="body2">Fecha: </Typography>
            <Typography variant="body1">{fechaString}</Typography>
          </div>
          {/* Hora */}
          <div className="dialogo_info">
            <Typography variant="body2">Hora: </Typography>
            <Typography variant="body1">{horaString}</Typography>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={this.onDialogoTurnoClose}>Cancelar</Button>
          <Button onClick={this.reservarTurno} color="primary" autoFocus>
            Reservar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderDialogoTurnoExito() {
    if (this.state.turnoSeleccionado == undefined) return null;
    if (this.state.turnoRegistrado == true) return null;

    let fecha = this.state.turnoSeleccionado.start;
    let dia = fecha.getDate();
    if (dia < 10) dia = "0" + dia;
    let mes = fecha.getMonth() + 1;
    if (mes < 10) mes = "0" + mes;
    let año = fecha.getFullYear();
    let horas = fecha.getHours();
    if (horas < 10) horas = "0" + horas;
    let minutos = fecha.getMinutes();
    if (minutos < 10) minutos = "0" + minutos;
    let fechaString = dia + "/" + mes + "/" + año;
    let horaString = horas + ":" + minutos;

    return (
      <Dialog open={this.state.dialogoTurnoExitoVisible}>
        {this.state.reservandoTurno == true && (
          <DialogContent>
            <CircularProgress color="primary" />
          </DialogContent>
        )}
        {this.state.reservandoTurno == false && (
          <DialogContent>
            <MiPanelMensaje
              lottieExito
              mensaje="Turno reservado exitosamente"
              detalle={"Se ha enviado un e-mail a " + this.props.usuario.email + " con el comprobante del turno"}
            />
          </DialogContent>
        )}

        {this.state.reservandoTurno == false && (
          <DialogActions>
            {/* <Button onClick={this.onDialogoTurnoClose}>Cancelar</Button> */}
            <Button onClick={this.onBotonIrInicioClick} color="primary" autoFocus>
              Ir a inicio
            </Button>
          </DialogActions>
        )}
      </Dialog>
    );
  }

  renderDialogoErrorReservando() {
    return (
      <Dialog open={this.state.dialogoErrorReservandoVisible}>
        <DialogContent>
          <Typography variant="body1">{this.state.errorReservando}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onDialogoErrorReservandoClose}>Cancelar</Button>
          <Button onClick={this.onBotonReinterarReservarClick} color="primary" autoFocus>
            Reintentar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

class CalendarioMes_Dia extends React.PureComponent {
  onClick = () => {
    if (this.props.deshabilitado == true) return;
    this.props.onClick(this.props.props.date);
  };

  render() {
    let fecha = this.props.props.date;
    let hoy = new Date();
    const esHoy = fecha.getDate() == hoy.getDate() && fecha.getMonth() == hoy.getMonth() && fecha.getFullYear() == hoy.getFullYear();

    const seleccionado = this.props.seleccionado && this.props.seleccionado == true;
    const conTurnos = this.props.conTurnos && this.props.conTurnos == true;
    const deshabilitado = this.props.deshabilitado && this.props.deshabilitado == true;

    return (
      <div
        onClick={this.onClick}
        className={classNames(
          "customDate",
          esHoy && "hoy",
          seleccionado && "seleccionado",
          conTurnos && "conTurnos",
          deshabilitado && "deshabilitado"
        )}
      >
        <label>{this.props.props.label}</label>
      </div>
    );
  }
}

class CalendarioMes_Encabezado extends React.PureComponent {
  onBotonBackClick = () => {
    let fechaNueva = this.props.props.date;
    fechaNueva.setDate(1);
    fechaNueva.setHours(0);
    fechaNueva.setMinutes(0);
    fechaNueva.setMilliseconds(0);
    fechaNueva.setSeconds(0);

    if (fechaNueva < new Date()) {
      this.props.mostrarAlerta("No puede sacar un turno en una fecha menor a la actual");
      return;
    }

    this.props.props.onNavigate("PREV");
    if (this.props.onBotonMesAnteriorClick == undefined) return;
    this.props.onBotonMesAnteriorClick();
  };

  onBotonNextClick = () => {
    this.props.props.onNavigate("NEXT");
    if (this.props.onBotonMesSiguienteClick == undefined) return;
    this.props.onBotonMesSiguienteClick();
  };

  render() {
    return (
      <div className={classNames(this.props.classes.calendarioEncabezado)}>
        <Typography className={classNames("titulo")} variant="headline">
          {this.props.props.label}
        </Typography>
        <IconButton onClick={this.onBotonBackClick} id="btn_MesAnterior">
          <Icon>keyboard_arrow_left</Icon>
        </IconButton>
        <IconButton onClick={this.onBotonNextClick} id="btn_MesSiguiente">
          <Icon>keyboard_arrow_right</Icon>
        </IconButton>
      </div>
    );
  }
}

let componente = TurneroCalendario;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withWidth()(componente);
componente = withRouter(componente);
export default componente;
