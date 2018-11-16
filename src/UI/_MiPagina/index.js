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

//Mis componentes
import MiPagina from "@Componentes/MiPagina";
import MiContent from "@Componentes/MiContent";

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

  onToolbarTituloClick = () => {
    this.props.redirigir("/");
  };

  onCerrarSesionClick = () => {
    this.props.cerrarSesion();
  };

  onMiPerfilClick = () => {
    window.location.href = window.Config.URL_MI_PERFIL + "/#/?token=" + this.props.token;
  };

  render() {
    const { classes } = this.props;

    let toolbarLeftIconVisible = this.props.toolbarLeftIconVisible !== false;
    let toolbarLeftIcon = undefined;
    if (toolbarLeftIconVisible === true) {
      toolbarLeftIcon = this.props.toolbarLeftIcon || "arrow_back";
    }
    return (
      <React.Fragment>
        <MiPagina
          cargando={this.props.cargando}
          toolbarTitulo={this.props.toolbarTitulo || window.Config.NOMBRE_SISTEMA}
          toolbarClassName={classes.toolbar}
          toolbarRenderLogo={this.renderToolbarLogo()}
          toolbarLeftIcon={toolbarLeftIcon}
          toolbarLeftIconClick={this.props.toolbarLeftIconClick || this.props.goBack}
          onToolbarTituloClick={this.props.onToolbarTituloClick || this.onToolbarTituloClick}
          onToolbarMiPerfilClick={this.onMiPerfilClick}
          onToolbarCerrarSesionClick={this.onCerrarSesionClick}
          contentClassName={classNames(classes.paginaContent, this.props.contentClassName)}
        >
          <MiContent
            rootClassName={classNames(classes.miContentRootClassName, this.props.miContentRootClassName)}
            contentClassName={classNames(classes.miContentContentClassName, this.props.miContentContentClassName)}
            full={this.props.full || false}
          >
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
