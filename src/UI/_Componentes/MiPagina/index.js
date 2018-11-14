import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Mis componentes
import MiToolbar from "../MiToolbar";

class MiPagina extends React.PureComponent {
  render() {
    let { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MiToolbar
            leftIconClick={this.props.toolbarLeftIconClick}
            leftIcon={this.props.toolbarLeftIcon}
            leftIconClassName={this.props.toolbarLeftIconClassName}
            cargando={this.props.cargando}
            className={this.props.toolbarClassName}
            renderLogo={this.props.toolbarRenderLogo}
            titulo={this.props.toolbarTitulo}
            subtitulo={this.props.toolbarSubtitulo}
            onTituloClick={this.props.onToolbarTituloClick}
            mostrarUsuario={this.props.toolbarMostrarUsuario}
            onCerrarSesionClick={this.props.onToolbarCerrarSesionClick}
            onMiPerfilClick={this.props.onToolbarMiPerfilClick}
          >
            {this.props.toolbarChildren}
          </MiToolbar>

          {/* Contenido */}
          <div className={classes.main}>
            <div className={classes.separadorToolbar} />
            <div className={classNames(classes.content, this.props.contentClassName)}>{this.props.children}</div>
          </div>

          <div
            className={classNames(classes.contentOverlayCargando, this.props.cargando == true && classes.contentOverlayCargandoVisible)}
          />
        </div>
      </React.Fragment>
    );
  }
}

let componente = MiPagina;
componente = withStyles(styles)(componente);
export default componente;
