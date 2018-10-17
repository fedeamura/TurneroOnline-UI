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
import { Typography, Button } from "@material-ui/core";
// import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
// import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import _ from "lodash";
import red from "@material-ui/core/colors/red";

//Mis componentes
import MiContent from "@Componentes/MiContent";
import MiPagina from "@Componentes/MiPagina";
import MiCard from "@Componentes/MiCard";
import MiBanerError from "@Componentes/MiBanerError";

import TurnoPendiente from "../Inicio/TurnoPendiente";
import PanelTurneroDetalle from "../TurneroDetalle/PanelTurneroDetalle";

//Recursos
import ToolbarLogo from "@Resources/imagenes/toolbar_logo.png";

//Rules
import Rules_Turnero from "@Rules/Rules_Turnero";
import Rules_ReservaTurno  from "@Rules/Rules_ReservaTurno";

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

class ReservaDetalle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      cargando: true,
      cardVisible: false,
      dataTurno: undefined,
      dataTurnero: undefined,
      mostrarError: false,
      error: undefined,
      dialogoConfirmarCancelarVisible: false
    };
  }

  componentDidMount() {
    this.buscarDatos();
  }

  buscarDatos = () => {
    this.setState(
      {
        cargando: true,
        mostrarError: false,
        cardVisible: false
      },
      () => {
        Rules_ReservaTurno.getDetalle(this.state.id)
          .then(dataTurno => {
            if (dataTurno == undefined) {
              this.setState({
                cargando: false,
                mostrarError: true,
                error: "El turno indicado no existe",
                cardVisible: true
              });
              return;
            }

            Rules_Turnero.getDetalle(dataTurno.turneroId)
              .then(dataTurnero => {
                this.setState(
                  {
                    cargando: false,
                    dataTurnero: dataTurnero,
                    dataTurno: dataTurno,
                    cardVisible: true
                  },
                  () => {
                    setTimeout(() => {
                      this.setState({ cardTurneroVisible: true });
                    }, 300);
                  }
                );
              })
              .catch(errorTurnero => {
                this.setState({
                  cargando: false,
                  mostrarError: true,
                  error: errorTurnero,
                  cardVisible: true
                });
              });
          })
          .catch(error => {
            this.setState({
              cargando: false,
              mostrarError: true,
              error: error,
              cardVisible: true
            });
          });
      }
    );
  };

  onBotonCancelarTurnoClick = () => {
    this.setState({ dialogoConfirmarCancelarVisible: true });
  };

  onDialogoConfirmarCancelarTurnoClose = () => {
    this.setState({ dialogoConfirmarCancelarVisible: false });
  };

  anularReserva = () => {
    this.setState({ cargando: true, mostrarError: false, dialogoConfirmarCancelarVisible: false }, () => {
      Rules_ReservaTurno.anular(this.state.id)
        .then(() => {
          this.buscarDatos();
        })
        .catch(error => {
          this.setState({ error: error, mostrarError: true, cargando: false });
        });
    });
  };

  onBotonOcultarErrorClick = () => {
    this.setState({ mostrarError: false });
  };

  convertirFecha = fecha => {
    let partesDia = fecha.split("T")[0].split("-");
    let partesHora = fecha.split("T")[1].split(":");

    let dia = partesDia[2];
    // if (dia < 9) dia = "0" + dia;
    let mes = partesDia[1];
    // if (mes < 9) mes = "0" + mes;
    let año = partesDia[0];
    return dia + "/" + mes + "/" + año + " " + partesHora[0] + ":" + partesHora[1];
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
          <MiContent className={classes.content}>
            <MiCard padding={false} titulo="Datos del turno" rootClassName={classNames(classes.card, this.state.cardVisible && "visible")}>
              <MiBanerError visible={this.state.mostrarError} mensaje={this.state.error} onClose={this.onBotonOcultarErrorClick} />
              {this.state.dataTurno && (
                <div style={{ padding: "16px" }}>
                  <TurnoPendiente data={this.state.dataTurno} />

                  {this.state.dataTurno.estadoKeyValue == 1 && (
                    <div className={classes.contenedorBotones}>
                      <Button
                        variant="outlined"
                        style={{ color: red["500"], borderColor: red["500"] }}
                        onClick={this.onBotonCancelarTurnoClick}
                      >
                        Anular turno
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {this.state.dataTurnero && (
                <React.Fragment>
                  <div style={{ backgroundColor: "rgba(0,0,0,0.1)", height: "1px" }} />
                  <div style={{ padding: "16px" }}>
                    <PanelTurneroDetalle data={this.state.dataTurnero} />
                  </div>
                </React.Fragment>
              )}
            </MiCard>
          </MiContent>
        </MiPagina>

        {this.renderDialogoConfirmarCancelarTurno()}
      </React.Fragment>
    );
  }

  renderDialogoConfirmarCancelarTurno() {
    return (
      <Dialog open={this.state.dialogoConfirmarCancelarVisible} onClose={this.onDialogoConfirmarCancelarTurnoClose}>
        <DialogContent>
          <Typography variant="body1">¿Esta seguro que desea cancelar la reserva del turno? Esta operación no se puede deshacer</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onDialogoConfirmarCancelarTurnoClose}>Cancelar</Button>
          <Button onClick={this.anularReserva} color="primary" autoFocus>
            Si, cancelar el turno
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderToolbarLogo = () => {
    const { classes } = this.props;

    return <div className={classes.logoMuni} style={{ backgroundImage: "url(" + ToolbarLogo + ")" }} />;
  };
}

let componente = ReservaDetalle;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withRouter(componente);
export default componente;
