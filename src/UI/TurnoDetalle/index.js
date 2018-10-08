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
import { Grid, Typography, Button } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
// import _ from "lodash";

//Mis componentes
import MiContent from "@Componentes/MiContent";
import MiPagina from "@Componentes/MiPagina";
import MiCard from "@Componentes/MiCard";
import MiBanerError from "@Componentes/MiBanerError";

//Recursos
import ToolbarLogo from "@Resources/imagenes/toolbar_logo.png";

//Rules
import Rules_Turno from "@Rules/Rules_Turno";

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

class TurnoDetalle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      cargando: true,
      cardVisible: false,
      data: undefined,
      mostrarError: false,
      error: undefined
    };
  }

  componentDidMount() {
    this.buscarDatos();
  }

  buscarDatos = () => {
    this.setState({ cargando: true, mostrarError: false }, () => {
      this.setState({ cargando: false });
    });
  };

  cancelar = () => {
    this.setState({ cargando: true, mostrarError: false }, () => {
      Rules_Turno.cancelarReserva(this.state.id)
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
            <MiCard padding={false}>
              <MiBanerError visible={this.state.mostrarError} mensaje={this.state.error} onClick={this.onBotonOcultarErrorClick} />
              <div style={{ padding: "16px" }}>
                <Button variant="raised" color="primary" onClick={this.cancelar}>
                  Cancelar
                </Button>
              </div>
            </MiCard>
          </MiContent>
        </MiPagina>
      </React.Fragment>
    );
  }

  renderToolbarLogo = () => {
    const { classes } = this.props;

    return <div className={classes.logoMuni} style={{ backgroundImage: "url(" + ToolbarLogo + ")" }} />;
  };
}

let componente = TurnoDetalle;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withRouter(componente);
export default componente;
