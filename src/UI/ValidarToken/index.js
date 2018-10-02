import React from "react";

//Style
import styles from "./styles";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";

//Componentes
import _ from "lodash";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";
import { login, cerrarSesion } from "@Redux/Actions/usuario";

import Rules_Usuario from "@Rules/Rules_Usuario";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    cargando: state.MainContent.cargando
  };
};

const mapDispatchToProps = dispatch => ({
  login: usuario => {
    dispatch(login(usuario));
  },
  cerrarSesion: () => {
    dispatch(cerrarSesion());
  },
  redireccionar: url => {
    dispatch(push(url));
  }
});

class ValidarToken extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { location } = this.props;

    let search = location.search;
    if (!search.startsWith("?")) {
      localStorage.removeItem("token");
      window.location.href = window.Config.URL_LOGIN;
      return;
    }

    let token = search.substring(1).split("=")[1];
    if (token == undefined) {
      localStorage.removeItem("token");
      window.location.href = window.Config.URL_LOGIN;
      return;
    }

    localStorage.setItem("token", token);

    Rules_Usuario.validarToken(token)
      .then(resultado => {
        if (resultado == false) {
          debugger;
          localStorage.removeItem("token");
          this.props.cerrarSesion();
          window.location.href = window.Config.URL_LOGIN;
          return;
        }

        Rules_Usuario.datos(token)
          .then(datos => {
            this.props.login(datos);
            this.props.redireccionar("/");
          })
          .catch(error => {
            debugger;

            localStorage.removeItem("token");
            this.props.cerrarSesion();
            window.location.href = window.Config.URL_LOGIN;
          });
      })
      .catch(error => {
        debugger;

        localStorage.removeItem("token");
        this.props.cerrarSesion();
        window.location.href = window.Config.URL_LOGIN;
      });
  }

  render() {
    const { classes, width, location } = this.props;

    console.log(location);

    return (
      <React.Fragment>
        <div className={classes.root} />
      </React.Fragment>
    );
  }
}

let componente = ValidarToken;
componente = withStyles(styles)(componente);
componente = withWidth()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
