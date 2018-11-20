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
import MiCard from "@Componentes/MiCard";
import MiBaner from "@Componentes/MiBaner";
import MiTabla from "@Componentes/MiTabla";
import DateUtils from "@Componentes/Utils/Date";
import _MiPagina from "../_MiPagina";

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

              let estadoParametro = this.props.match.params.estado;

              _.forEach(estados, estado => {
                if (estadoParametro !== undefined) {
                  filtroEstados["" + estado.keyValue] = estado.keyValue == estadoParametro;
                } else {
                  filtroEstados["" + estado.keyValue] = true;
                }
              });

              if (estadoParametro === undefined) {
                filtroEstados["-1"] = true;
              } else {
                if (estadoParametro == -1) {
                  filtroEstados["-1"] = true;
                }
              }

              data.forEach(item => {
                item.fechaDate = DateUtils.toDateTime(item.fecha);
              });

              this.setState({
                data: data,
                cardVisible: true,
                estadosReservaTurno: estados,
                mostrarFiltros: estadoParametro != undefined,
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
      this.setState({ diaSeleccionado: dia });
    }
  };

  cancelarFiltros = () => {
    let filtroEstados = {};
    filtroEstados["-1"] = true;
    this.state.estadosReservaTurno.forEach(estado => {
      filtroEstados["" + estado.keyValue] = true;
    });

    this.setState({ diaSeleccionado: undefined, filtroEstados: filtroEstados, mostrarFiltros: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <_MiPagina cargando={this.state.cargando} full>
          <MiBaner modo="error" mensaje={this.state.error} visible={this.state.mostrarError} />

          <Grid container>
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
        </_MiPagina>
      </React.Fragment>
    );
  }

  renderCalendario() {
    const { classes } = this.props;

    let tieneFiltros = false;
    let filtroEstados = [];
    let conFiltroEstados = false;

    if (this.state.estadosReservaTurno.length != 0) {
      for (let filtroEstado in this.state.filtroEstados) {
        if (this.state.filtroEstados[filtroEstado] === true) {
          if (filtroEstado == -1) {
            filtroEstados.push("Vencido");
          } else {
            let estado = _.find(this.state.estadosReservaTurno, estadoReserva => estadoReserva.keyValue == filtroEstado);
            filtroEstados.push(estado.nombre);
          }
        }
      }

      conFiltroEstados =
        filtroEstados.length != 0 && filtroEstados.length != this.state.estadosReservaTurno.length + 1 && filtroEstados.length != 0;

      tieneFiltros = this.state.diaSeleccionado != undefined || conFiltroEstados;
    }

    return (
      <React.Fragment>
        <MiCard padding={false} className={classNames(classes.contenedorCalendario)}>
          <BigCalendar
            view="month"
            date={this.state.dia}
            className={classNames(classes.calendario)}
            views={{ month: true }}
            culture="es"
            localizer={localizer}
            onView={() => {}}
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
                      onBotonMesAnteriorClick={this.onBotonMesAnteriorClick}
                      onBotonMesSiguienteClick={this.onBotonMesSiguienteClick}
                    />
                  );
                },
                dateHeader: props => {
                  let diaCalendario = props.date;
                  let seleccionado = this.state.diaSeleccionado && DateUtils.esMismoDia(this.state.diaSeleccionado, diaCalendario);
                  let conTurnos =
                    _.find(this.state.data, item => {
                      let fechaTurno = DateUtils.toDateTime(item.fecha);
                      let mismoDia = DateUtils.esMismoDia(fechaTurno, diaCalendario);
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
        {tieneFiltros === true && (
          <MiCard className={classes.cardInfoFiltroDia}>
            <div>
              <Typography variant="body2">Filtros activos</Typography>
              <div style={{ height: 8 }} />
              {this.state.diaSeleccionado && (
                <Typography variant="body1">
                  <b>Dia: </b>
                  {DateUtils.toDateString(this.state.diaSeleccionado)}
                </Typography>
              )}

              {conFiltroEstados == true && (
                <Typography>
                  <b>Estados: </b>
                  {filtroEstados.join(", ")}
                </Typography>
              )}
              <div style={{ height: 16 }} />

              <Button variant="outlined" color="primary" onClick={this.cancelarFiltros}>
                Ver todos los turnos
              </Button>
            </div>
          </MiCard>
        )}
      </React.Fragment>
    );
  }

  renderContenedorTabla() {
    const { classes } = this.props;

    let titulo = "Todos mis turnos";
    if (this.state.diaSeleccionado) {
      titulo = "Mis turnos del dia " + DateUtils.toDateString(this.state.diaSeleccionado);
    }
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }

  renderTabla() {
    const { classes } = this.props;

    let cantidadDeEstadosCheckeados = 0;
    for (let filtroEstado in this.state.filtroEstados) {
      if (this.state.filtroEstados[filtroEstado] === true) {
        cantidadDeEstadosCheckeados += 1;
      }
    }

    let dataFiltrada = _.filter(this.state.data, item => {
      let cumpleEstado = cantidadDeEstadosCheckeados == 0 || this.state.filtroEstados[item.estadoKeyValue] == true;
      let cumpleDia =
        this.state.diaSeleccionado == undefined || DateUtils.esMismoDia(this.state.diaSeleccionado, DateUtils.toDateTime(item.fecha));
      return cumpleEstado && cumpleDia;
    });

    return (
      <MiTabla
        className={classes.tabla}
        rowHeight={57}
        check={false}
        rowType={"Turnos"}
        columns={[
          { id: "codigo", label: "Código", orderBy: this.orderColumnaCodigo },
          { id: "tramiteNombre", label: "Trámite" },
          { id: "fecha", label: "Fecha", orderBy: this.orderColumnaFecha },
          { id: "estadoNombre", label: "Estado", orderBy: this.orderColumnaEstado },
          { id: "botones", label: "" },
          { id: "data", hidden: true }
        ]}
        rows={dataFiltrada.map(item => {
          let fecha = DateUtils.toDateTime(item.fecha);

          return {
            codigo: this.renderColumnaCodigo(item),
            tramiteNombre: item.tramiteNombre,
            fecha: this.renderColumnaFecha(item),
            estadoNombre: this.renderColumnaEstado(item),
            botones: this.renderColumnaBotones(item),
            data: item
          };
        })}
        orderBy={"fecha"}
      />
    );
  }

  orderColumnaCodigo(dataA, dataB) {
    dataA = dataA.data;
    dataB = dataB.data;

    let codigoA = `${dataA.codigo}/${dataA.año}`;
    let codigoB = `${dataB.codigo}/${dataB.año}`;

    if (codigoA < codigoB) {
      return 1;
    }

    if (codigoA > codigoB) {
      return -1;
    }

    return 0;
  }

  orderColumnaFecha(dataA, dataB) {
    dataA = dataA.data.fechaDate;
    dataB = dataB.data.fechaDate;

    if (dataA < dataB) {
      return 1;
    }

    if (dataA > dataB) {
      return -1;
    }

    return 0;
  }

  renderColumnaFecha(data) {
    return <Typography variant="body1">{DateUtils.toDateTimeString(data.fechaDate)}</Typography>;
  }

  orderColumnaEstado(dataA, dataB) {
    dataA = dataA.data;
    dataB = dataB.data;

    let codigoA = `${dataA.estadoNombre}`;
    let codigoB = `${dataB.estadoNombre}`;

    if (codigoA < codigoB) {
      return 1;
    }

    if (codigoA > codigoB) {
      return -1;
    }

    return 0;
  }

  renderColumnaCodigo(data) {
    return (
      <Typography
        onClick={() => {
          this.props.redirigir("/Reserva/" + data.id);
        }}
        variant="body1"
        style={{ textDecoration: "underline", cursor: "pointer" }}
        color="primary"
      >{`${data.codigo}/${data.año}`}</Typography>
    );
  }
  renderColumnaEstado(data) {
    const { classes } = this.props;

    return (
      <div className={classes.colEstado}>
        <div className={classes.indicadorEstado} style={{ backgroundColor: data.estadoColor }} />
        <Typography variant="body1">{data.estadoNombre}</Typography>
      </div>
    );
  }

  renderColumnaBotones(data) {
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
  }

  renderFiltros() {
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
              <div className={classes.contenedorFiltroEstado} key={index}>
                <FormControlLabel
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
  }
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
