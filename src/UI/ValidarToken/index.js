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
import { push, replace } from "connected-react-router";
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
  },
  replace: url => {
    dispatch(replace(url));
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
      this.props.cerrarSesion();
      // this.props.replace("/Login");
      window.location.href = window.Config.URL_LOGIN;
      return;
    }

    search = search.substring(1);
    search = new URLSearchParams(search);
    let token = search.get("token");
    if (token == undefined) {
      this.props.cerrarSesion();
      // this.props.replace("/Login");
      window.location.href = window.Config.URL_LOGIN;
      return;
    }

    Rules_Usuario.validarToken(token)
      .then(resultado => {
        if (resultado == false) {
          debugger;

          this.props.cerrarSesion();
          // this.props.replace("/Login");
          window.location.href = window.Config.URL_LOGIN;
          return;
        }

        Rules_Usuario.datos(token)
          .then(datos => {
            this.props.login({ usuario: datos, token: token });

            let url = search.get("url") || "/";
            this.props.redireccionar(url);
          })
          .catch(error => {
            debugger;

            this.props.cerrarSesion();
            // this.props.replace("/Login");
            window.location.href = window.Config.URL_LOGIN;
          });
      })
      .catch(error => {
        debugger;

        this.props.cerrarSesion();
        // this.props.replace("/Login");
        window.location.href = window.Config.URL_LOGIN;
      });
  }

  render() {
    const { classes, width, location } = this.props;

    // console.log(location);

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
