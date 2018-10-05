import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
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

//Mis componentes
import MiPagina from "@Componentes/MiPagina";

//Recursos
import ToolbarLogo from "@Resources/imagenes/toolbar_logo.png";

//Rules
import Rules_Turnero from "@Rules/Rules_Turnero";
import { IconButton, Icon, Typography } from "../../../node_modules/@material-ui/core";

//Globalizacion
import moment from "moment";
import "moment/locale/es";
moment.locale("es");
const localizer = BigCalendar.momentLocalizer(moment);

const mapStateToProps = state => {
  return {};
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
      dataDelMes: undefined,
      mesSeleccionado: new Date(),
      diaSeleccionado: undefined,
      eventos: []
    };
  }

  componentDidMount() {
    this.buscarInfoDelMes(new Date().getMonth() + 1, new Date().getFullYear());
  }

  buscarInfoDelMes = (mes, año) => {
    this.setState({ cargando: true }, () => {
      let fechaInicio = undefined;
      if (mes == new Date().getMonth() + 1) {
        let dateHoy = new Date();
        let diaInicio = dateHoy.getDate();
        if (diaInicio < 9) diaInicio = "0" + diaInicio;
        let mesInicio = dateHoy.getMonth() + 1;
        if (mesInicio < 9) mesInicio = "0" + mesInicio;
        let añoInicio = dateHoy.getFullYear();
        fechaInicio = diaInicio + "/" + mesInicio + "/" + añoInicio;
      } else {
        if (mes < 9) mes = "0" + mes;
        fechaInicio = "01/" + mes + "/" + año;
      }

      let dateFin = new Date();
      dateFin.setDate(1);
      dateFin.setMonth(mes);

      let diaFin = dateFin.getDate();
      if (diaFin < 9) diaFin = "0" + diaFin;
      let mesFin = dateFin.getMonth() + 1;
      if (mesFin < 9) mesFin = "0" + mesFin;
      let añoFin = dateFin.getFullYear();
      let fechaFin = diaFin + "/" + mesFin + "/" + añoFin;

      console.log(fechaInicio);
      console.log(fechaFin);

      Rules_Turnero.getTurnos({
        idTurnero: this.state.id,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      })
        .then(data => {
          console.log(data);
          this.setState({ dataDelMes: data });
        })
        .catch(error => {
          console.log(error);
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

    this.setState(
      {
        panelTurnosVisible: false,
        diaSeleccionado: e
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

          // let id = 0;

          // eventos = eventos.map(item => {
          //   let fecha = item.fecha;
          //   let partes = fecha.split("T")[0].split("-");
          //   let dia = parseInt(partes[2]);
          //   let mes = parseInt(partes[1]) - 1;
          //   let año = parseInt(partes[0]);

          //   let fechaInicio = new Date(año, mes, dia);
          //   fechaInicio.setMinutes(item.inicio * 5);

          //   let fechaFin = new Date(año, mes, dia);
          //   fechaFin.setMinutes(item.inicio * 5);
          //   fechaFin.setMinutes(fechaFin.getMinutes() + item.duracion * 5);

          //   id = id + 1;

          //   return {
          //     id: id,
          //     start: fechaInicio,
          //     end: fechaFin,
          //     title: "Turno " + item.estadoNombre
          //   };
          // });

          // let resultado = eventos;

          let agrupados = _.groupBy(eventos, "inicio", "duracion", "estadoKeyValue");

          let resultado = [];
          let id = 0;
          for (var property in agrupados) {
            if (agrupados.hasOwnProperty(property)) {
              let item = agrupados[property];
              if (item.length != 0 && item[0].estadoKeyValue == 1) {
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

                id = id + 1;
                resultado.push({
                  id: id,
                  start: fechaInicio,
                  end: fechaFin,
                  title: "Turno disponible"
                });
              }
            }
          }

          this.setState({ eventos: resultado, panelTurnosVisible: true });
        }, 300);
      }
    );
  };

  onBotonMesAnteriorClick = () => {
    let mesActual = this.state.mesSeleccionado;
    mesActual.setMonth(mesActual.getMonth() - 1);
    this.setState({ mesSeleccionado: mesActual });

    if (mesActual.getMonth() < new Date().getMonth()) {
      this.props.mostrarAlerta("No puede sacar un turno en una fecha menor a la actual");
      return;
    }

    this.buscarInfoDelMes(mesActual.getMonth() + 1, mesActual.getFullYear());
  };

  onBotonMesSiguienteClick = () => {
    let mesActual = this.state.mesSeleccionado;
    mesActual.setMonth(mesActual.getMonth() + 1);
    this.setState({ mesSeleccionado: mesActual });
    this.buscarInfoDelMes(mesActual.getMonth() + 1, mesActual.getFullYear());
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <MiPagina
          cargando={this.state.cargando}
          toolbarTitulo="Turnero online"
          toolbarClassName={classes.toolbar}
          toolbarRenderLogo={this.renderToolbarLogo}
          toolbarLeftIcon="arrow_back"
          toolbarLeftIconClick={this.props.goBack}
          contentClassName={classes.paginaContent}
        >
          <BigCalendar
            view="month"
            // toolbar={false}
            views={{ month: true }}
            style={{
              height: "300px",
              width: "300px",
              maxWidth: "300px",
              minWidth: "300px"
            }}
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

                      return (
                        item.estadoKeyValue == 1 &&
                        props.date.getDate() == dia &&
                        props.date.getMonth() == mes &&
                        props.date.getFullYear() == año
                      );
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

          <BigCalendar
            view="day"
            className={classNames("panelTurnos", this.state.panelTurnosVisible && "visible")}
            date={this.state.diaSeleccionado}
            toolbar={false}
            onSelectSlot={this.onSelectSlot}
            onSelectEvent={this.onSelectEvent}
            views={{ day: true }}
            localizer={localizer}
            events={this.state.eventos}
            components={{
              day: {
                header: () => {
                  return <CalendarioPanel_Evento />;
                },
                event: () => {
                  return <CalendarioPanel_Evento />;
                }
              }
            }}
            startAccessor="start"
            endAccessor="end"
          />
        </MiPagina>
      </React.Fragment>
    );
  }

  renderToolbarLogo = () => {
    const { classes } = this.props;

    return <div className={classes.logoMuni} style={{ backgroundImage: "url(" + ToolbarLogo + ")" }} />;
  };
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
      <div className={classNames("calendarioMes_encabezado")}>
        <Typography className={classNames("titulo")} variant="headline">
          {this.props.props.label}
        </Typography>
        <IconButton onClick={this.onBotonBackClick}>
          <Icon>keyboard_arrow_left</Icon>
        </IconButton>
        <IconButton onClick={this.onBotonNextClick}>
          <Icon>keyboard_arrow_right</Icon>
        </IconButton>
      </div>
    );
  }
}

class CalendarioPanel_Evento extends React.PureComponent {
  render() {
    return (
      <div className={classNames("")}>
        <Typography>Evento</Typography>
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
componente = withRouter(componente);
export default componente;
