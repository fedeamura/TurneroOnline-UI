import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import withWidth from "@material-ui/core/withWidth";
import "@UI/transitions.css";

import styles from "./styles";

//REDUX
import { connect } from "react-redux";

//Componentes
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";

// import { CSSTransition } from "react-transition-group";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputAdornment from "@material-ui/core/InputAdornment";
import _ from "lodash";

import IconEditOutlined from "@material-ui/icons/EditOutlined";

//Mis componentes
import Validador from "@Componentes/Utils/Validador";
import MiPanelMensaje from "@Componentes/MiPanelMensaje";
import MiBaner from "@Componentes/MiBaner";
import MiItemDetalle from "@Componentes/MiItemDetalle";
import MiSelect from "@Componentes/MiSelect";
import MiDialogoInput from "@Componentes/MiDialogoInput";
import MiDialogoMensaje from "@Componentes/MiDialogoMensaje";
import CordobaFilesUtils from "@Componentes/Utils/CordobaFiles";
import StringUtils from "@Componentes/Utils/String";
import FotoUtils from "@Componentes/Utils/Foto";

import { ButtonBase, TextField, LinearProgress, IconButton, Avatar, Menu, CircularProgress } from "@material-ui/core";

const mapDispatchToProps = dispatch => ({});

const mapStateToProps = state => {
  return { usuario: state.Usuario.usuario };
};

class MenuApps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchor: undefined
    };
  }

  componentDidMount() {
    this.buscarApps();
  }

  onBotonClick = e => {
    this.setState({ anchor: e.currentTarget });
  };

  buscarApps = () => {
    if (this.state.apps) return;
    const url = `https://servicios2.cordoba.gov.ar/WSVecinoVirtual_Bridge/v2/AplicacionPanel`;

    this.setState({ cargando: true });
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(data => {
        if (data.ok !== true) {
          this.setState({ errorVisible: true, errorMensaje: "Error buscando las apps" });
          return;
        }
        return data.json();
      })
      .then(info => {
        if (info.ok != true) {
          this.setState({ errorVisible: true, errorMensaje: "Error buscando las apps" });
          return;
        }

        this.setState({ apps: info.return });
      })
      .catch(error => {
        this.setState({ errorVisible: true, errorMensaje: "Error buscando las apps" });
      })
      .finally(() => {
        this.setState({ cargando: false });
      });
  };

  onClose = () => {
    this.setState({ anchor: null });
  };

  render() {
    const { classes, token } = this.props;

    var urlPanel = "";
    if (token) {
      urlPanel = "https://servicios2.cordoba.gov.ar/MuniOnlinePanel/#/?token=" + token;
    } else {
      urlPanel = "https://servicios2.cordoba.gov.ar/MuniOnlinePanel";
    }

    return (
      <React.Fragment>
        <Button variant="text" className={classes.boton} onClick={this.onBotonClick} style={{ color: this.props.color || "rgba(0,0,0,0.7)" }}>
          <Icon className={classes.icon} style={{ color: this.props.color || "rgba(0,0,0,0.7)" }}>
            apps
          </Icon>
          Servicios
        </Button>

        <Menu
          id="simple-menu"
          anchorEl={this.state.anchor}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={Boolean(this.state.anchor)}
          onClose={this.onClose}
        >
          <div className={classes.menu}>
            {this.state.cargando == true && <CircularProgress />}
            {this.state.apps && (
              <div className={classes.apps}>
                {this.state.apps.map((app, index) => {
                  return <BotonApp app={app} key={index} classes={classes} token={token} />;
                })}
              </div>
            )}
            {this.state.cargando == false && (
              <Button variant="raised" color="primary" href={urlPanel}>
                Ir al panel
              </Button>
            )}
          </div>
        </Menu>
      </React.Fragment>
    );
  }
}
class BotonApp extends React.PureComponent {
  render() {
    let { classes, app, token } = this.props;

    var nombre = app.nombre || "";
    if (nombre.indexOf(".") != -1) {
      nombre = nombre.split(".")[1].trim();
    }

    var url = "";
    if (token && app.urlToken) {
      url = app.urlToken.replace("{token}", token);
    } else {
      url = app.url;
    }

    return (
      <Button className={"app"} href={url}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Avatar src={app.urlIcono} className="icono" />
          <Typography className="nombre">{nombre}</Typography>
        </div>
      </Button>
    );
  }
}

let componente = MenuApps;
componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
