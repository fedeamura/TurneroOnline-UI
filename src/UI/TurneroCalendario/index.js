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
import _ from "lodash";
import BigCalendar from "react-big-calendar";
import Calendar from "react-calendar";

import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";

//Mis componentes
import MiPagina from "@Componentes/MiPagina";

//Recursos
import ToolbarLogo from "@Resources/imagenes/toolbar_logo.png";

//Rules
import Rules_Turnero from "@Rules/Rules_Turnero";

const localizer = BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

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

const CalendarioMes_Dia = data => (
  <div>
    <label>{JSON.stringify(data)}</label>
  </div>
);

class TurneroCalendario extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      diaSeleccionado: undefined,
      dataDelMes: undefined,
      eventos: []
    };
  }

  componentDidMount() {
    this.setState({ cargando: true }, () => {
      let dateHoy = new Date();

      let diaInicio = dateHoy.getDate();
      if (diaInicio < 9) diaInicio = "0" + diaInicio;
      let mesInicio = dateHoy.getMonth() + 1;
      if (mesInicio < 9) mesInicio = "0" + mesInicio;
      let añoInicio = dateHoy.getFullYear();
      let fechaInicio = diaInicio + "/" + mesInicio + "/" + añoInicio;
      console.log(fechaInicio);

      let dateFin = new Date();
      dateFin.setDate(1);
      dateFin.setMonth(dateFin.getMonth() + 1);

      let diaFin = dateFin.getDate();
      if (diaFin < 9) diaFin = "0" + diaFin;
      let mesFin = dateFin.getMonth() + 1;
      if (mesFin < 9) mesFin = "0" + mesFin;
      let añoFin = dateFin.getFullYear();
      let fechaFin = diaFin + "/" + mesFin + "/" + añoFin;
      console.log(fechaFin);

      Rules_Turnero.getTurnos({
        idTurnero: this.state.id,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      })
        .then(data => {
          this.setState({ dataDelMes: data });
          console.log(data);
        })
        .catch(error => {
          this.setState({ error: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  }
  onSelectEvent = e => {
    console.log(e);
  };

  onSelectSlot = e => {
    console.log("onSelectSlot");
    console.log(e);
  };

  onDiaClick = e => {
    console.log(e);

    let eventos = _.filter(this.state.dataDelMes, item => {
      let fecha = item.fecha;
      let partes = fecha.split("T")[0].split("-");
      let dia = parseInt(partes[2]);
      let mes = parseInt(partes[1]);
      let año = parseInt(partes[0]);

      return e.getDate() == dia && e.getMonth() + 1 == mes && e.getFullYear() == año;
    });

    let agrupados = _.groupBy(eventos, "inicio", "duracion", "estadoKeyValue");
    // console.log(eventos);
    // console.log(agrupados);

    let resultado = [];
    let id = 0;
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

    console.log(resultado);

    this.setState({ diaSeleccionado: e, eventos: resultado });
  };

  renderDay = dia => {
    return <label>{JSON.stringify(dia)}</label>;
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
            localizer={localizer}
            onDrillDown={this.onDiaClick}
            events={[]}
            startAccessor="start"
            endAccessor="end"
            components={{
              month: {
                dateHeader: props => {
                  let fecha = this.state.diaSeleccionado;
                  let seleccionado = false;
                  if (fecha) {
                    let hoy = new Date();
                    seleccionado =
                      fecha.getDate() == hoy.getDate() && fecha.getMonth() == hoy.getMonth() && fecha.getFullYear() == hoy.getFullYear();
                  }

                  return <CustomDate seleccionado={seleccionado} onClick={this.onDiaClick} props={props} />;
                }
              }
            }}
          />

          {/* <Calendar
            maxDetail="month"
            minDetail="month"
            render
            renderChildren={() => {
              return <div className={classes.diaSeleccionado} />;
            }}
            onChange={this.onDiaClick}
            value={new Date()}
          /> */}

          <BigCalendar
            view="day"
            date={this.state.diaSeleccionado}
            // toolbar={false}
            onSelectSlot={this.onSelectSlot}
            onSelectEvent={this.onSelectEvent}
            views={{ day: true }}
            style={{
              height: "100%",
              width: "100%",
              opacity: this.state.diaSeleccionado ? 1 : 0
            }}
            localizer={localizer}
            events={this.state.eventos}
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

class CustomDate extends React.PureComponent {
  onClick = () => {
    this.props.onClick(this.props.props.date);
  };

  render() {
    console.log(this.props.props);

    let fecha = this.props.props.date;
    let hoy = new Date();
    const esHoy = fecha.getDate() == hoy.getDate() && fecha.getMonth() == hoy.getMonth() && fecha.getFullYear() == hoy.getFullYear();

    const seleccionado = this.props.seleccionado;

    return (
      <div onClick={this.onClick} className={classNames("customDate", esHoy && "hoy", seleccionado && "seleccionado")}>
        <label>{this.props.props.label}</label>
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
