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
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

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

class TurneroCalendario extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id
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
            onSelectSlot={this.onSelectSlot}
            onSelectEvent={this.onSelectEvent}
            views={{ month: true }}
            style={{ height: 200 }}
            localizer={localizer}
            events={[]}
            onDrillDown={e => {
              console.log("drill");
              console.log(e);
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

let componente = TurneroCalendario;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withRouter(componente);
export default componente;
