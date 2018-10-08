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

//Compontes
import _ from "lodash";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import { Typography, Grid } from "@material-ui/core";

//Mis Componentes
import MiToolbar from "@Componentes/MiToolbar";
import MiContent from "@Componentes/MiContent";
import CardEntidad from "./CardEntidad";
import MiCard from "@Componentes/MiCard";
import TurnoPendiente from "./TurnoPendiente";

//Recursos
import ToolbarLogo from "@Resources/imagenes/toolbar_logo.png";

//Rules
import Rules_Entidad from "@Rules/Rules_Entidad";
import Rules_Turno from "@Rules/Rules_Turno";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    cargando: state.MainContent.cargando
  };
};

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  }
});

// const limite = "lg";
class App extends React.Component {
  constructor(props) {
    super(props);
    // let paraMobile = !isWidthUp(limite, this.props.width);

    this.state = {
      // open: paraMobile ? false : true,
      // paraMobile: paraMobile,
      dataEntidad: [],
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
    // console.log("did mount");
    // window.addEventListener("resize", this.onResize);

    this.setState(
      {
        cargando: true,
        mostrarError: false,
        mostrarCardMisTurnos: false,
        mostrarCardEntidades: false
      },
      () => {
        Rules_Entidad.get()
          .then(dataEntidad => {
            Rules_Turno.getDeUsuarioLogeado()
              .then(dataTurno => {
                let turnosPendientes = _.filter(_.orderBy(dataTurno, "fecha"), item => {
                  return item.estadoKeyValue == 2;
                });
                this.setState(
                  {
                    dataEntidad: dataEntidad,
                    dataTurno: dataTurno,
                    dataTurnosPendientes: turnosPendientes.slice(0, 3),
                    cantidadTurnosPendientes: turnosPendientes.length,
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
      }
    );
  }

  // componentWillUnmount() {
  //   window.removeEventListener("resize", this.onResize);
  // }

  // onResize = () => {
  //   setTimeout(() => {
  //     let paraMobile = !isWidthUp(limite, this.props.width);
  //     this.setState({
  //       open: false,
  //       paraMobile: paraMobile
  //     });
  //   }, 500);
  // };

  onTurnoPendienteClick = turno => {
    this.props.redireccionar("/TurnoDetalle/" + turno.id);
  };

  onBotonEntidadClick = entidad => {
    this.props.redireccionar("/Entidad/" + entidad.id);
  };

  render() {
    const { classes, width, location, usuario } = this.props;
    if (usuario == undefined) return null;

    return (
      <React.Fragment>
        <div className={classes.root}>
          {/* Toolbar */}
          <MiToolbar
            paraMobile={this.state.paraMobile}
            titulo={"Turnero Online"}
            cargando={this.state.cargando}
            width={width}
            renderLogo={this.renderLogo}
            className={classes.toolbar}
          />

          {/* Contenido */}
          <div className={classNames(classes.main)}>
            <div className={classes.separadorToolbar} />
            <div className={classes.content}>
              <MiContent className={classes.content}>
                <MiCard titulo="Mis turnos" rootClassName={classNames(classes.cardMisTurnos, this.state.mostrarCardMisTurnos && "visible")}>
                  <div className={classes.contenedorMisTurnos}>
                    {/* <Typography variant="subheading">Turnos pendientes</Typography> */}
                    {this.state.dataTurnosPendientes.length == 0 ? (
                      <Typography variant="body1">
                        No tiene ningun turno pendiente. Si lo desea puede reservar uno seleccionando algún tramite en la parte inferior de
                        esta página
                      </Typography>
                    ) : (
                      <div>
                        <Typography variant="title" style={{ marginLeft: "16px", marginBottom: "16px" }}>
                          Siguientes turnos pendientes:
                        </Typography>

                        {this.state.dataTurnosPendientes.map((item, index) => {
                          return <TurnoPendiente key={index} data={item} onClick={this.onTurnoPendienteClick} />;
                        })}
                        {this.state.cantidadTurnosPendientes > 3 && (
                          <Typography style={{ marginLeft: "16px" }} variant="body1">
                            De un total de {this.state.cantidadTurnosPendientes} turnos pendientes
                          </Typography>
                        )}
                      </div>
                    )}

                    {this.state.dataTurno.length != 0 && (
                      <div className={classes.misTurnosContenedorBotones}>
                        <Button color="primary" variant="raised">
                          Ver todos mis turnos
                        </Button>
                      </div>
                    )}
                  </div>
                </MiCard>

                <div style={{ height: 56 }} />

                <div className={classNames(classes.cardEntidades, this.state.mostrarCardEntidades && "visible")}>
                  <Typography style={{ marginLeft: "32px" }} variant="headline" className={classes.titulo}>
                    Nuevo turno
                  </Typography>
                  <Grid container spacing={32}>
                    {this.state.dataEntidad.map(item => {
                      return (
                        <Grid item xs={12} md={6} key={item.id}>
                          <CardEntidad data={item} onClick={this.onBotonEntidadClick} />
                        </Grid>
                      );
                    })}
                  </Grid>
                </div>
              </MiContent>
            </div>
          </div>
        </div>

        <div className={classNames(classes.contentOverlayCargando, this.state.cargando == true && classes.contentOverlayCargandoVisible)} />
      </React.Fragment>
    );
  }

  renderLogo = () => {
    const { classes, width, location, usuario } = this.props;

    return <div className={classes.logoMuni} style={{ backgroundImage: "url(" + ToolbarLogo + ")" }} />;
  };
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
