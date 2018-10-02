import React from "react";

//Styles
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";
import "./style.css";

//Router
import { withRouter } from "react-router-dom";
import { Route, Redirect } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";

//REDUX
import { connect } from "react-redux";
import { ocultarAlerta } from "@Redux/Actions/alerta";
import { login } from "@Redux/Actions/usuario";

//Componentes
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { IconButton, Icon } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

//Mis componentes
import Pagina404 from "@UI/_Pagina404";
import Inicio from "@UI/Inicio";
import ValidarToken from "@UI/ValidarToken";
import NuevoTurno from "@UI/NuevoTurno";
import NuevoTurnoTramites from "@UI/NuevoTurnoTramites";

//Mis rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import { push } from "connected-react-router";

const mapStateToProps = state => {
  return {
    alertas: state.Alerta.alertas
  };
};

const mapDispatchToProps = dispatch => ({
  onAlertaClose: id => {
    dispatch(ocultarAlerta(id));
  },
  login: usuario => {
    dispatch(login(usuario));
  },
  redireccionar: url => {
    dispatch(push(url));
  }
});

// Promise.prototype.finally = function(callback) {
//   return this.then(
//     value => this.constructor.resolve(callback()).then(() => value),
//     reason =>
//       this.constructor.resolve(callback()).then(() => {
//         throw reason;
//       })
//   );
// };

String.prototype.toTitleCase = function() {
  return this.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    if (this.props.location.pathname == "/Token") return;

    // debugger;
    let token = localStorage.getItem("token");
    if (token == undefined || token == null || token == "undefined") {
      localStorage.removeItem("token");
      window.location.href = window.Config.URL_LOGIN;
      return;
    }

    Rules_Usuario.validarToken(token)
      .then(resultado => {
        if (resultado == false) {
          localStorage.removeItem("token");
          window.location.href = window.Config.URL_LOGIN;
          return;
        }

        Rules_Usuario.datos(token)
          .then(datos => {
            this.props.login(datos);
            this.props.redireccionar(
              this.props.location.pathname + this.props.location.search
            );
          })
          .catch(error => {
            localStorage.removeItem("token");
            window.location.href = window.Config.URL_LOGIN;
          });
      })
      .catch(error => {
        localStorage.removeItem("token");
        window.location.href = window.Config.URL_LOGIN;
      });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        {this.renderContent()}
        {this.renderAlertas()}
      </div>
    );
  }

  renderContent() {
    const { classes, match } = this.props;

    let base = "";

    return (
      <main className={classes.content}>
        <AnimatedSwitch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
          className={"switch-wrapper"}
        >
          <Route exact path={`${base}/`} component={Inicio} />
          <Route path={`${base}/Token`} component={ValidarToken} />
          <Route exact path={`${base}/NuevoTurno`} component={NuevoTurno} />
          <Route exact path={`${base}/NuevoTurno/:id`} component={NuevoTurnoTramites} />

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
              <span
                id={"message-id" + alerta.id}
                className={classes.snackMessage}
              >
                {alerta.icono != undefined && (
                  <Icon className={classes.snackCustomIcon}>
                    {alerta.icono}
                  </Icon>
                )}
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
