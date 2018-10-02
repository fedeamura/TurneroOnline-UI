import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Mis componentes
import MiToolbar from "@Componentes/MiToolbar";

class MiPagina extends React.PureComponent {
  render() {
    let { classes } = this.props;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MiToolbar
            leftIconClick={this.props.toolbarLeftIconClick}
            leftIcon={this.props.toolbarLeftIcon}
            titulo={this.props.toolbarTitulo}
            cargando={this.props.cargando}
            className={this.props.toolbarClassName}
            renderLogo={this.props.toolbarRenderLogo}
          />

          {/* Contenido */}
          <div className={classes.main}>
            <div className={classes.separadorToolbar} />
            <div
              className={classNames(
                classes.content,
                this.props.contentClassName
              )}
            >
              {this.props.children}
            </div>
          </div>

          <div
            className={classNames(
              classes.contentOverlayCargando,
              this.props.cargando == true &&
                classes.contentOverlayCargandoVisible
            )}
          />
        </div>
      </React.Fragment>
    );
  }
}

let componente = MiPagina;
componente = withStyles(styles)(componente);
export default componente;
