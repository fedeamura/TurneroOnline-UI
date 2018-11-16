import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { setEntidades } from "@Redux/Actions/entidades";
import { toggleDrawer } from "@Redux/Actions/drawer";

//Compontes
import _ from "lodash";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Icon } from "@material-ui/core";

//Mis Componentes
import _MiPagina from "../_MiPagina";
import CardEntidad from "./CardEntidad";
import MiCard from "@Componentes/MiCard";
import TurnoPendiente from "./TurnoPendiente";
import MiBaner from "@Componentes/MiBaner";

//Rules
import Rules_Entidad from "@Rules/Rules_Entidad";
import Rules_ReservaTurno from "@Rules/Rules_ReservaTurno";
import Rules_EstadoReservaTurno from "@Rules/Rules_EstadoReservaTurno";
import DateUtils from "@Componentes/Utils/Date";

const ESTADO_VENCIDO = -1;
const ESTADO_PENDIENTE = 1;
const ESTADO_ANULADO = 2;
const ESTADO_CANCELADO = 3;
const ESTADO_COMPLETADO = 4;

const mapStateToProps = state => {
  return {
    token: state.Usuario.token,
    usuario: state.Usuario.usuario,
    entidades: state.Entidades.entidades,
    drawerOpen: state.Drawer.open
  };
};

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  },
  setEntidades: entidades => {
    dispatch(setEntidades(entidades));
  },
  toggleDrawer: () => {
    dispatch(toggleDrawer());
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      estados: [],
      dataTurno: [],
      dataTurnosPendientes: [],
      cantidadTurnosPendientes: false,
      cargando: true,
      error: undefined,
      mostrarError: false,
      mostrarCardMisTurnos: false,
      mostrarCardEntidades: false
    };
  }

  componentDidMount() {
    this.setState(
      {
        cargando: true,
        mostrarError: false,
        mostrarCardMisTurnos: false,
        mostrarCardEntidades: false
      },
      () => {
        Rules_EstadoReservaTurno.get()
          .then(estados => {
            Rules_Entidad.get()
              .then(dataEntidad => {
                Rules_ReservaTurno.getDeUsuarioLogeado()
                  .then(dataTurno => {
                    this.props.setEntidades(dataEntidad);

                    let cantidadTurnosVencidos = _.filter(_.orderBy(dataTurno, "fecha"), item => {
                      return item.estadoKeyValue == ESTADO_VENCIDO;
                    }).length;

                    let cantidadTurnosPendientes = _.filter(_.orderBy(dataTurno, "fecha"), item => {
                      return item.estadoKeyValue == ESTADO_PENDIENTE;
                    }).length;

                    let cantidadTurnosAnulado = _.filter(_.orderBy(dataTurno, "fecha"), item => {
                      return item.estadoKeyValue == ESTADO_ANULADO;
                    }).length;

                    let cantidadTurnosCancelado = _.filter(_.orderBy(dataTurno, "fecha"), item => {
                      return item.estadoKeyValue == ESTADO_CANCELADO;
                    }).length;

                    let cantidadTurnosCompletado = _.filter(_.orderBy(dataTurno, "fecha"), item => {
                      return item.estadoKeyValue == ESTADO_COMPLETADO;
                    }).length;

                    let turnosPendientes = _.filter(dataTurno, turno => {
                      return turno.estadoKeyValue == ESTADO_PENDIENTE;
                    });
                    turnosPendientes = _.orderBy(turnosPendientes, turno => {
                      let fecha = DateUtils.toDateTime(turno.fecha);
                      return fecha;
                    });
                    turnosPendientes = turnosPendientes.slice(0, 3);

                    this.setState(
                      {
                        estados: estados,
                        dataTurno: dataTurno,
                        turnosPendientes: turnosPendientes,
                        contadores: [
                          {
                            estado: { nombre: "Vencido", color: "violet", keyValue: -1 },
                            contador: cantidadTurnosVencidos
                          },
                          {
                            estado: _.find(estados, estado => estado.keyValue == ESTADO_PENDIENTE),
                            contador: cantidadTurnosPendientes
                          },
                          {
                            estado: _.find(estados, estado => estado.keyValue == ESTADO_ANULADO),
                            contador: cantidadTurnosAnulado
                          },
                          {
                            estado: _.find(estados, estado => estado.keyValue == ESTADO_CANCELADO),
                            contador: cantidadTurnosCancelado
                          },
                          {
                            estado: _.find(estados, estado => estado.keyValue == ESTADO_COMPLETADO),
                            contador: cantidadTurnosCompletado
                          }
                        ],
                        mostrarCardMisTurnos: true
                      },
                      () => {
                        setTimeout(() => {
                          this.setState({ mostrarCardEntidades: true });
                        }, 300);
                      }
                    );
                  })
                  .catch(error => {
                    this.setState({
                      error: error,
                      mostrarError: true
                    });
                  })
                  .finally(() => {
                    this.setState({ cargando: false });
                  });
              })
              .catch(error => {
                this.setState({
                  cargando: false,
                  error: error,
                  mostrarError: true
                });
              });
          })
          .catch(error => {
            this.setState({
              cargando: false,
              error: error,
              mostrarError: true
            });
          });
      }
    );
  }

  onTurnoPendienteClick = turno => {
    this.props.redireccionar("/Reserva/" + turno.id);
  };

  onBotonEntidadClick = entidad => {
    this.props.redireccionar("/Entidad/" + entidad.id);
  };

  onBotonMisTurnosClick = () => {
    const { width } = this.props;
    let isMobile = !isWidthUp("md", width);
    if (isMobile && this.props.drawerOpen === true) {
      this.props.toggleDrawer();
    }

    this.props.redireccionar("/MisReservas/" + ESTADO_PENDIENTE);
  };

  onBotonMisTurnosEstadoClick = e => {
    let estado = e.currentTarget.attributes.estado.value;

    const { width } = this.props;
    let isMobile = !isWidthUp("md", width);
    if (isMobile && this.props.drawerOpen === true) {
      this.props.toggleDrawer();
    }

    this.props.redireccionar("/MisReservas/" + estado);
  };

  onBotonMenuEntidadClick = e => {
    const { width } = this.props;
    let isMobile = !isWidthUp("md", width);
    if (isMobile && this.props.drawerOpen === true) {
      this.props.toggleDrawer();
    }

    let id = e.currentTarget.attributes.identidad.value;
    this.props.redireccionar("/Entidad/" + id);
  };

  render() {
    const { classes, usuario } = this.props;
    if (usuario == undefined) return null;

    return (
      <React.Fragment>
        <_MiPagina
          toolbarLeftIcon="menu"
          toolbarLeftIconClick={this.props.toggleDrawer}
          cargando={this.state.cargando}
          contentClassName={classNames(classes.contentClassName, this.props.drawerOpen && "drawerVisible")}
        >
          <React.Fragment>
            {this.renderDrawer()}

            <MiBaner modo="error" visible={this.state.mostrarError} mensaje={this.state.error} />

            <MiCard titulo="Mis turnos" rootClassName={classNames(classes.cardMisTurnos, this.state.mostrarCardMisTurnos && "visible")}>
              <div className={classes.contenedorMisTurnos}>
                {/* Sin turnos */}
                {this.state.dataTurno.length == 0 && (
                  <div style={{ display: "flex" }}>
                    <Icon style={{ marginRight: "8px" }}>info_outline</Icon>
                    <Typography variant="body2">Todavia no tiene ningun turno asociado.</Typography>
                  </div>
                )}

                {/* pendientes mas proximos  */}
                {this.state.turnosPendientes && this.state.turnosPendientes.length != 0 && (
                  <div>
                    <Typography variant="body2">Próximos turnos</Typography>
                    {this.state.turnosPendientes.map((item, index) => {
                      return <TurnoPendiente key={index} data={item} onClick={this.onTurnoPendienteClick} />;
                    })}
                  </div>
                )}

                {/* separador */}
                {this.state.turnosPendientes &&
                  this.state.turnosPendientes.length != 0 &&
                  this.state.contadores &&
                  this.state.contadores.length != 0 && <div style={{ height: 32 }} />}

                {/* contadores */}
                {this.state.contadores && this.state.contadores.length != 0 && (
                  <div className={classes.contenedorContadores}>
                    {this.state.contadores.map((contador, index) => {
                      if (contador.contador === 0) return null;
                      return (
                        <div
                          className={classes.contadorTurno}
                          key={index}
                          estado={contador.estado.keyValue}
                          onClick={this.onBotonMisTurnosEstadoClick}
                        >
                          <div style={{ backgroundColor: contador.estado.color }}>
                            <Typography variant="subheading">{contador.contador}</Typography>
                          </div>
                          <Typography variant="body2">{contador.estado.nombre}</Typography>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* boton todos los turnos  */}
                {this.state.dataTurno.length != 0 && (
                  <div className={classes.misTurnosContenedorBotones}>
                    <Button color="primary" variant="raised" onClick={this.onBotonMisTurnosClick}>
                      Ver mis turnos
                    </Button>
                  </div>
                )}
              </div>
            </MiCard>

            <div style={{ height: 56 }} />

            <div className={classNames(classes.cardEntidades, this.state.mostrarCardEntidades && "visible")}>
              <Typography style={{ marginLeft: "32px", marginTop: "32px" }} variant="headline" className={classes.titulo}>
                Nuevo turno
              </Typography>
              <Grid container spacing={32}>
                {this.props.entidades.map(item => {
                  return (
                    <Grid item xs={12} md={6} key={item.id}>
                      <CardEntidad data={item} onClick={this.onBotonEntidadClick} />
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </React.Fragment>
        </_MiPagina>
      </React.Fragment>
    );
  }

  renderDrawer() {
    const { classes, width } = this.props;
    let isMobile = !isWidthUp("md", width);

    return (
      <SwipeableDrawer
        classes={{ paper: classes.drawer }}
        variant={isMobile ? "temporary" : "persistent"}
        open={this.props.drawerOpen}
        onClose={this.props.toggleDrawer}
        onOpen={this.props.toggleDrawer}
      >
        <List>
          <ListItem button className="item" style={{ backgroundColor: "rgba(0,0,0,0.1)" }}>
            <ListItemText primary="Inicio" />
          </ListItem>
          <ListItem button className="item" onClick={this.onBotonMisTurnosClick}>
            <ListItemText primary="Mis turnos" />
          </ListItem>

          <Divider />
        </List>
        <List subheader={<ListSubheader component="div">Nuevo turno</ListSubheader>}>
          {this.props.entidades.map((itemMenu, index) => {
            return (
              <ListItem identidad={itemMenu.id} button key={index} className="item" onClick={this.onBotonMenuEntidadClick}>
                <ListItemText primary={itemMenu.nombre} />
              </ListItem>
            );
          })}
        </List>
      </SwipeableDrawer>
    );
  }
}

let componente = undefined;
componente = withStyles(styles)(App);
componente = withWidth()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
