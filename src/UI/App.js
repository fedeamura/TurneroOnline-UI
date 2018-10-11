import React from "react";

//Styles
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import "./style.css";

//Router
import { withRouter } from "react-router-dom";
import { Route } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";

//REDUX
import { connect } from "react-redux";
import { ocultarAlerta } from "@Redux/Actions/alerta";
import { login, cerrarSesion } from "@Redux/Actions/usuario";
import { push } from "connected-react-router";

//Componentes
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { IconButton, Icon, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

//Mis componentes
import Pagina404 from "@UI/_Pagina404";
import Inicio from "@UI/Inicio";
import ValidarToken from "@UI/ValidarToken";
import EntidadDetalle from "@UI/EntidadDetalle";
import TurneroDetalle from "@UI/TurneroDetalle";
import TurneroCalendario from "@UI/TurneroCalendario";
import TurnoDetalle from "@UI/TurnoDetalle";
import TurnosDeUsuario from "@UI/TurnosDeUsuario";

//Mis rules
import Rules_Usuario from "@Rules/Rules_Usuario";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    alertas: state.Alerta.alertas
  };
};

const mapDispatchToProps = dispatch => ({
  onAlertaClose: id => {
    dispatch(ocultarAlerta(id));
  },
  login: comando => {
    dispatch(login(comando));
  },
  cerrarSesion: () => {
    dispatch(cerrarSesion());
  },
  redireccionar: url => {
    dispatch(push(url));
  }
});

Promise.prototype.finally = function(callback) {
  return this.then(
    value => this.constructor.resolve(callback()).then(() => value),
    reason =>
      this.constructor.resolve(callback()).then(() => {
        throw reason;
      })
  );
};

String.prototype.toTitleCase = function() {
  return this.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      validandoToken: false
    };
  }

  componentDidMount() {
    if (this.props.location.pathname == "/Token") return;

    let token = localStorage.getItem("token");
    if (token == undefined || token == null || token == "undefined") {
      this.props.cerrarSesion();
      window.location.href = window.Config.URL_LOGIN;
      return;
    }

    this.setState({ validandoToken: true }, () => {
      Rules_Usuario.validarToken(token)
        .then(resultado => {
          if (resultado == false) {
            this.props.cerrarSesion();
            window.location.href = window.Config.URL_LOGIN;
            return;
          }

          Rules_Usuario.datos(token)
            .then(datos => {
              this.props.login({
                usuario: datos,
                token: token
              });
              this.onLogin();
            })
            .catch(error => {
              this.props.cerrarSesion();
              window.location.href = window.Config.URL_LOGIN;
            });
        })
        .catch(error => {
          this.props.cerrarSesion();
          window.location.href = window.Config.URL_LOGIN;
        })
        .finally(() => {
          this.setState({ validandoToken: false });
        });
    });
  }

  onLogin = () => {
    //Cada 5 seg valido el token
    this.intervalo = setInterval(() => {
      let token = localStorage.getItem("token");
      if (token == undefined || token == null || token == "undefined") {
        this.props.cerrarSesion();
        window.location.href = window.Config.URL_LOGIN;
        return;
      }

      Rules_Usuario.validarToken(token)
        .then(resultado => {
          if (resultado == false) {
            this.props.cerrarSesion();
            window.location.href = window.Config.URL_LOGIN;
            return;
          }
        })
        .catch(error => {
          this.props.cerrarSesion();
          window.location.href = window.Config.URL_LOGIN;
        });
    }, 5000);
  };

  componentWillUnmount() {
    this.intervalo && clearInterval(this.intervalo);
  }

  render() {
    const { classes } = this.props;

    const procesandoLogin = this.state.validandoToken == true;

    return (
      <div className={classes.root}>
        <CssBaseline />
        {this.renderContent()}
        {this.renderAlertas()}

        {/* {procesandoLogin && (
          <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, zIndex: 2000, background: "red" }}>
            <Typography>Procesando login</Typography>
          </div>
        )} */}
      </div>
    );
  }

  renderContent() {
    const { classes, match } = this.props;

    let base = "";

    const login = this.state.validandoToken == false && this.props.usuario != undefined;

    return (
      <main className={classes.content}>
        <AnimatedSwitch atEnter={{ opacity: 0 }} atLeave={{ opacity: 0 }} atActive={{ opacity: 1 }} className={"switch-wrapper"}>
          <Route path={`${base}/Token`} component={ValidarToken} />

          {/* Todas las paginas de aca abajo necesitan usuario logeado */}
          <Route exact path={`${base}/`} component={login ? Inicio : null} />
          <Route exact path={`${base}/Entidad/:id`} component={login ? EntidadDetalle : null} />
          <Route exact path={`${base}/TurneroDetalle/:id`} component={login ? TurneroDetalle : null} />
          <Route exact path={`${base}/TurneroCalendario/:id`} component={login ? TurneroCalendario : null} />
          <Route exact path={`${base}/TurnoDetalle/:id`} component={login ? TurnoDetalle : null} />
          <Route exact path={`${base}/MisTurnos`} component={login ? TurnosDeUsuario : null} />
          <Route component={Pagina404} />
        </AnimatedSwitch>
      </main>
    );
  }

  renderAlertas() {
    const { classes } = this.props;

    return this.props.alertas.map((alerta, index) => {
      return (
        <Snackbar
          key={alerta.id}
          key={index}
          open={alerta.visible}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          autoHideDuration={5000}
          onClose={() => {
            this.props.onAlertaClose(alerta.id);
          }}
          ContentProps={{
            "aria-describedby": "message-id" + alerta.id
          }}
        >
          <SnackbarContent
            style={{ backgroundColor: alerta.color }}
            aria-describedby="client-snackbar"
            message={
              <span id={"message-id" + alerta.id} className={classes.snackMessage}>
                {alerta.icono != undefined && <Icon className={classes.snackCustomIcon}>{alerta.icono}</Icon>}
                {alerta.texto}
              </span>
            }
            action={[
              alerta.mostrarIconoCerrar && (
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  onClick={() => {
                    this.props.onAlertaClose(alerta.id);
                  }}
                >
                  <CloseIcon className={classes.icon} />
                </IconButton>
              )
            ]}
          />
        </Snackbar>
      );
    });
  }
}

const styles = theme => {
  return {
    root: {
      display: "flex",
      height: "100vh",
      overflow: "hidden"
    },
    content: {
      display: "flex",
      flexGrow: 1,
      overflow: "auto",
      overflow: "hidden"
    },
    icon: {
      fontSize: 20
    },
    snackCustomIcon: {
      marginRight: theme.spacing.unit
    },
    snackMessage: {
      display: "flex",
      alignItems: "center"
    }
  };
};

let componente = App;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
