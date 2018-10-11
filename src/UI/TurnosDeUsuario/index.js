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
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

//Mis componentes
import MiContent from "@Componentes/MiContent";
import MiPagina from "@Componentes/MiPagina";
import MiCard from "@Componentes/MiCard";
import MiBanerError from "@Componentes/MiBanerError";
import MiTabla from "@Componentes/MiTabla";

//Recursos
import ToolbarLogo from "@Resources/imagenes/toolbar_logo.png";

//Rules
import Rules_Turno from "@Rules/Rules_Turno";
import { IconButton, Icon } from "@material-ui/core";

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
      cardVisible: false,
      cargando: true,
      data: [],
      mostrarError: false,
      error: undefined,
      mostrarFiltros: false,
      filtroEstados: { 2: true, 3: true }
    };
  }

  componentDidMount() {
    this.setState({ cargando: true, mostrarError: false }, () => {
      Rules_Turno.getDeUsuarioLogeado()
        .then(data => {
          this.setState({ data: data, cardVisible: true });
        })
        .catch(error => {
          this.setState({ mostrarError: true, error: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  }

  onBotonFiltrosClick = () => {
    this.setState({ mostrarFiltros: !this.state.mostrarFiltros });
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
          <MiContent className={classes.content} contentClassName={classes.miContentContent}>
            <MiBanerError mensaje={this.state.error} visible={this.state.mostrarError} />
            <MiCard padding={false} rootClassName={classNames(classes.card, this.state.cardVisible && "visible")}>
              <div className={classes.contenedorTabla}>
                <div className="main">
                  <div className={classes.contenedorTitulo}>
                    <Typography variant="title">Mis Turnos</Typography>
                    <IconButton
                      onClick={this.onBotonFiltrosClick}
                      className={classNames(classes.botonFiltro, this.state.mostrarFiltros == false && "visible")}
                    >
                      <Icon>{"filter_list"}</Icon>
                    </IconButton>
                  </div>
                  {this.renderTabla()}
                </div>
                {this.renderFiltros()}
              </div>
            </MiCard>
          </MiContent>
        </MiPagina>
      </React.Fragment>
    );
  }

  renderTabla = () => {
    const { classes } = this.props;

    let dataFiltrada = _.filter(this.state.data, item => {
      console.log(item);
      return this.state.filtroEstados[item.estadoKeyValue] == true;
    });

    return (
      <MiTabla
        className={classes.tabla}
        rowHeight={57}
        check={false}
        rowType={"Turnos"}
        columns={[
          { id: "entidadNombre", type: "string", numeric: false, label: "Tipo" },
          { id: "tramiteNombre", type: "string", numeric: false, label: "Trámite" },
          { id: "fecha", type: "date", numeric: false, label: "Fecha" },
          { id: "hora", type: "string", numeric: false, label: "Hora" },
          { id: "estadoNombre", type: "string", numeric: false, label: "Estado" },
          { id: "botones", type: "string", numeric: false, label: "" }
        ]}
        rows={dataFiltrada.map(item => {
          return {
            entidadNombre: item.entidadNombre,
            tramiteNombre: item.tramiteNombre,
            fecha: this.transformarFecha(item.fecha),
            hora: this.transformarHora(item.inicio),
            estadoNombre: item.estadoNombre,
            botones: this.renderColumnaBotones(item)
          };
        })}
        orderBy={"fecha"}
      />
    );
  };
  handleCheckboxEstadoChange = e => {
    let filtroEstados = this.state.filtroEstados;
    filtroEstados[e.target.name] = e.target.checked;
    this.setState({ filtroEstados: filtroEstados });
    console.log(filtroEstados);
  };

  renderFiltros = () => {
    const { classes } = this.props;

    return (
      <div className={classNames(classes.contenedorFiltros, this.state.mostrarFiltros && "visible")}>
        <div className={classes.contenedorTitulo}>
          <Typography variant="title">Filtros</Typography>
          <IconButton onClick={this.onBotonFiltrosClick}>
            <Icon>clear</Icon>
          </IconButton>
        </div>

        <div className="content">
          <Typography variant="body2">Estados</Typography>
          <FormControlLabel
            control={
              <Checkbox
                name="2"
                checked={this.state.filtroEstados["2"] == true}
                onChange={this.handleCheckboxEstadoChange}
                value="2"
                color="primary"
              />
            }
            label="Reservado"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="3"
                checked={this.state.filtroEstados["3"] == true}
                onChange={this.handleCheckboxEstadoChange}
                value="3"
                color="primary"
              />
            }
            label="Anulado"
          />
        </div>
      </div>
    );
  };
  renderColumnaBotones = data => {
    return (
      <div>
        <IconButton
          onClick={() => {
            this.props.redirigir("/TurnoDetalle/" + data.id);
          }}
        >
          <Icon>info</Icon>
        </IconButton>
      </div>
    );
  };

  transformarFecha = fecha => {
    try {
      let partesFecha = fecha.split("T")[0].split("-");
      let dia = partesFecha[2];
      if (dia < 10) dia = "0" + dia;
      let mes = partesFecha[1];
      if (mes < 10) mes = "0" + mes;
      let año = partesFecha[0];
      return dia + "/" + mes + "/" + año;
    } catch (e) {
      return "";
    }
  };

  transformarHora = inicio => {
    try {
      let fecha = new Date();
      fecha.setHours(0);
      fecha.setMinutes(0 + parseInt(inicio) * 5);
      fecha.setSeconds(0);
      fecha.setMilliseconds(0);

      let hora = fecha.getHours();
      if (hora < 10) hora = "0" + hora;
      let minutos = fecha.getMinutes();
      if (minutos < 10) minutos = "0" + minutos;
      return hora + ":" + minutos;
    } catch (e) {
      return "";
    }
  };

  renderToolbarLogo = () => {
    const { classes } = this.props;

    return <div className={classes.logoMuni} style={{ backgroundImage: "url(" + ToolbarLogo + ")" }} />;
  };
}

let componente = TurnosDeUsuario;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withRouter(componente);
export default componente;
