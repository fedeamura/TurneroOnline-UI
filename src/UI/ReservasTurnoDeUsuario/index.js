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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { IconButton, Icon, Grid, Button } from "@material-ui/core";

//Mis componentes
import MiContent from "@Componentes/MiContent";
import MiPagina from "@Componentes/MiPagina";
import MiCard from "@Componentes/MiCard";
import MiBanerError from "@Componentes/MiBanerError";
import MiTabla from "@Componentes/MiTabla";
import utils from "@Componentes/utils";

//Recursos
import ToolbarLogo from "@Resources/imagenes/toolbar_logo.png";

//Rules
import Rules_ReservaTurno from "@Rules/Rules_ReservaTurno";
import Rules_EstadoReservaTurno from "@Rules/Rules_EstadoReservaTurno";

//Globalizacion
import moment from "moment";
import "moment/locale/es";
moment.locale("es");

const localizer = BigCalendar.momentLocalizer(moment);

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
      diaSeleccionado: undefined,
      cardVisible: false,
      cargando: true,
      data: [],
      mostrarError: false,
      error: undefined,
      mostrarFiltros: false,
      estadosReservaTurno: [],
      filtroEstados: {}
    };
  }

  componentDidMount() {
    this.setState({ cargando: true, mostrarError: false }, () => {
      Rules_EstadoReservaTurno.get()
        .then(estados => {
          Rules_ReservaTurno.getDeUsuarioLogeado()
            .then(data => {
              let filtroEstados = {};
              _.forEach(estados, estado => {
                filtroEstados["" + estado.keyValue] = estado.keyValue == 1;
              });

              this.setState({
                data: data,
                cardVisible: true,
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

  onBotonFiltrosClick = () => {
    this.setState({ mostrarFiltros: !this.state.mostrarFiltros });
  };

  handleCheckboxEstadoChange = e => {
    let filtroEstados = this.state.filtroEstados;
    filtroEstados[e.target.name] = e.target.checked;
    this.setState({ filtroEstados: filtroEstados });
  };

  onDiaClick = dia => {
    if (this.state.diaSeleccionado && this.state.diaSeleccionado.getDate() == dia.getDate()) {
      this.setState({ diaSeleccionado: undefined });
    } else {
      let filtroEstados = this.state.filtroEstados;
      filtroEstados["1"] = true;
      this.setState({ diaSeleccionado: dia, filtroEstados: filtroEstados });
    }
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
          <Grid container>
            {this.state.mostrarError && (
              <Grid item xs={12}>
                {/* <MiContent className={classes.content} contentClassName={classes.miContentContent}> */}
                <MiBanerError mensaje={this.state.error} visible={this.state.mostrarError} />
              </Grid>
            )}

            <Grid item xs={12}>
              <Grid container spacing={16}>
                <Grid item xs={12} md={4} lg={3}>
                  {this.renderCalendario()}
                </Grid>

                <Grid item xs={12} md={8} lg={9}>
                  {this.renderContenedorTabla()}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* </MiContent> */}
        </MiPagina>
      </React.Fragment>
    );
  }

  renderCalendario = () => {
    const { classes } = this.props;

    return (
      <MiCard padding={false} className={classes.cardCalendario}>
        <BigCalendar
          view="month"
          date={this.state.dia}
          className={classNames("calendarioMes")}
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
                    onBotonMesAnteriorClick={this.onBotonMesAnteriorClick}
                    onBotonMesSiguienteClick={this.onBotonMesSiguienteClick}
                  />
                );
              },
              dateHeader: props => {
                let diaCalendario = props.date;
                let seleccionado = this.state.diaSeleccionado && utils.esMismoDia(this.state.diaSeleccionado, diaCalendario);
                let conTurnos =
                  _.find(this.state.data, item => {
                    let fechaTurno = utils.toDateTime(item.fecha);
                    let mismoDia = utils.esMismoDia(fechaTurno, diaCalendario);
                    return item.estadoKeyValue == 1 && mismoDia == true;
                  }) != undefined;

                return (
                  <CalendarioMes_Dia
                    deshabilitado={false}
                    conTurnos={false}
                    classes={classes}
                    seleccionado={seleccionado}
                    conTurnos={conTurnos}
                    onClick={this.onDiaClick}
                    props={props}
                  />
                );
              }
            }
          }}
        />
      </MiCard>
    );
  };

  renderContenedorTabla = () => {
    const { classes } = this.props;

    let titulo = "Mis turnos";
    if (this.state.diaSeleccionado) {
      titulo = "Mis turnos del dia " + utils.toDateString(this.state.diaSeleccionado);
    }
    return (
      <MiCard padding={false} rootClassName={classNames(classes.card, this.state.cardVisible && "visible")}>
        <div className={classes.contenedorTabla}>
          <div className="main">
            <div className={classes.contenedorTitulo}>
              <Typography variant="title">{titulo}</Typography>
              <Button
                variant="outlined"
                onClick={this.onBotonFiltrosClick}
                className={classNames(classes.botonFiltro, this.state.mostrarFiltros == false && "visible")}
              >
                <Icon style={{ marginRight: "8px" }}>{"filter_list"}</Icon>
                Filtros
              </Button>
            </div>
            {this.renderTabla()}
          </div>
          {this.renderFiltros()}
        </div>
      </MiCard>
    );
  };

  renderTabla = () => {
    const { classes } = this.props;

    let dataFiltrada = _.filter(this.state.data, item => {
      let cumpleEstado = this.state.filtroEstados[item.estadoKeyValue] == true;
      let cumpleDia = this.state.diaSeleccionado == undefined || utils.esMismoDia(this.state.diaSeleccionado, utils.toDateTime(item.fecha));
      return cumpleEstado && cumpleDia;
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
          let fecha = utils.toDate(item.fecha);

          return {
            entidadNombre: item.entidadNombre,
            tramiteNombre: item.tramiteNombre,
            fecha: utils.toDateString(fecha),
            hora: utils.transformarDuracion(item.inicio, 5),
            estadoNombre: this.renderColumnaEstado(item),
            botones: this.renderColumnaBotones(item)
          };
        })}
        orderBy={"fecha"}
      />
    );
  };

  renderColumnaEstado = data => {
    const { classes } = this.props;

    return (
      <div className={classes.colEstado}>
        <div className={classes.indicadorEstado} style={{ backgroundColor: data.estadoColor }} />
        <Typography>{data.estadoNombre}</Typography>
      </div>
    );
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

          <div className={classes.contenedorFiltroEstado}>
            <FormControlLabel
              control={
                <div style={{ display: "flex", alignItems: "center", marginRight: "8px" }}>
                  <Checkbox
                    name={"-1"}
                    checked={this.state.filtroEstados["-1"] == true}
                    onChange={this.handleCheckboxEstadoChange}
                    value={"-1"}
                    color="primary"
                  />
                  <div className={classes.indicadorEstado} style={{ backgroundColor: "violet" }} />
                </div>
              }
              label={"Vencido"}
            />
          </div>

          {this.state.estadosReservaTurno.map((item, index) => {
            return (
              <div className={classes.contenedorFiltroEstado}>
                <FormControlLabel
                  key={index}
                  control={
                    <div style={{ display: "flex", alignItems: "center", marginRight: "8px" }}>
                      <Checkbox
                        name={"" + item.keyValue}
                        checked={this.state.filtroEstados["" + item.keyValue] == true}
                        onChange={this.handleCheckboxEstadoChange}
                        value={"" + item.keyValue}
                        color="primary"
                      />

                      <div className={classes.indicadorEstado} style={{ backgroundColor: item.color }} />
                    </div>
                  }
                  label={item.nombre}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  renderColumnaBotones = data => {
    return (
      <div>
        <IconButton
          onClick={() => {
            this.props.redirigir("/Reserva/" + data.id);
          }}
        >
          <Icon>info</Icon>
        </IconButton>
      </div>
    );
  };

  renderToolbarLogo = () => {
    const { classes } = this.props;

    return <div className={classes.logoMuni} style={{ backgroundImage: "url(" + ToolbarLogo + ")" }} />;
  };
}

class CalendarioMes_Encabezado extends React.PureComponent {
  onBotonBackClick = () => {
    this.props.props.onNavigate("PREV");
    this.props.onBotonMesAnteriorClick && this.props.onBotonMesAnteriorClick();
  };

  onBotonNextClick = () => {
    this.props.props.onNavigate("NEXT");
    this.props.onBotonMesSiguienteClick && this.props.onBotonMesSiguienteClick();
  };

  render() {
    return (
      <div className={classNames("calendarioMes_encabezado")}>
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

class CalendarioMes_Dia extends React.PureComponent {
  onClick = () => {
    if (this.props.deshabilitado == true) return;
    this.props.onClick && this.props.onClick(this.props.props.date);
  };

  render() {
    let fecha = this.props.props.date;
    let hoy = new Date();
    const esHoy = fecha.getDate() == hoy.getDate() && fecha.getMonth() == hoy.getMonth() && fecha.getFullYear() == hoy.getFullYear();

    const seleccionado = this.props.seleccionado && this.props.seleccionado == true;
    const conTurnos = this.props.conTurnos && this.props.conTurnos == true;
    // const deshabilitado = this.props.deshabilitado && this.props.deshabilitado == true;

    return (
      <div
        onClick={this.onClick}
        className={classNames(
          "customDate",
          esHoy && "hoy",
          seleccionado && "seleccionado",
          conTurnos && "conTurnos"
          // deshabilitado && "deshabilitado"
        )}
        style={{ position: "relative" }}
      >
        {/* <div className={this.props.classes.contenedorIndicadorDiaCalendario}>
          {(this.props.indicadores || []).map((item, index) => {
            return <div key={index} className={this.props.classes.indicadorDiaCalendario} style={{ backgroundColor: item }} />;
          })}
        </div> */}

        <label>{this.props.props.label}</label>
      </div>
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
