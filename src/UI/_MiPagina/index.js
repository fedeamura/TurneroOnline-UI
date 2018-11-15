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
import { goBack, push } from "connected-react-router";
import { cerrarSesion } from "@Redux/Actions/usuario";

//Componentes
import BigCalendar from "react-big-calendar";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

//Mis componentes
import MiPagina from "@Componentes/MiPagina";
import MiContent from "@Componentes/MiContent";
import MiPanelMensaje from "@Componentes/MiPanelMensaje";
import MiCard from "@Componentes/MiCard";

//Recursos
import ToolbarLogo from "@Resources/imagenes/escudo_muni_texto_verde.png";
import ToolbarLogo_Chico from "@Resources/imagenes/escudo_muni_verde.png";

const mapStateToProps = state => {
  return {
    token: state.Usuario.token,
    usuario: state.Usuario.usuario
  };
};

const mapDispatchToProps = dispatch => ({
  goBack: () => {
    dispatch(goBack());
  },
  redirigir: url => {
    dispatch(push(url));
  },
  cerrarSesion: () => {
    dispatch(cerrarSesion());
  }
});

class _MiPagina extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onCerrarSesionClick = () => {
    this.props.cerrarSesion();
  };

  onMiPerfilClick = () => {
    window.location.href = window.Config.URL_MI_PERFIL + "/#/?token=" + this.props.token;
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <MiPagina
          cargando={this.props.cargando}
          toolbarTitulo={this.props.toolbarTitulo}
          toolbarClassName={classes.toolbar}
          toolbarRenderLogo={this.renderToolbarLogo()}
          toolbarLeftIcon={this.props.toolbarLeftIcon}
          toolbarLeftIconClick={this.props.toolbarLeftIconClick}
          onToolbarTituloClick={this.onToolbarTituloClick}
          onToolbarMiPerfilClick={this.onMiPerfilClick}
          onToolbarCerrarSesionClick={this.onCerrarSesionClick}
          contentClassName={classes.paginaContent}
        >
          <MiContent rootClassNames={classes.rootClassNames} contentClassNames={classes.contentClassNames}>
            {this.props.children}
          </MiContent>
        </MiPagina>
      </React.Fragment>
    );
  }
  renderToolbarLogo() {
    const { classes, width } = this.props;
    let url = isWidthUp("md", width) ? ToolbarLogo : ToolbarLogo_Chico;
    return <div className={classes.logoMuni} style={{ backgroundImage: "url(" + url + ")" }} />;
  }
}

let componente = _MiPagina;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withWidth()(componente);
componente = withRouter(componente);
export default componente;
