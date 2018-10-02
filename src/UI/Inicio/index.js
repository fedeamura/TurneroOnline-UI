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
import { push } from "connected-react-router";

//Compontes
import _ from "lodash";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import { Typography, Grid } from "@material-ui/core";

//Mis Componentes
import MiToolbar from "@Componentes/MiToolbar";
import MiContent from "@Componentes/MiContent";
import CardEntidad from "./CardEntidad";
import MiCard from "@Componentes/MiCard";

//Recursos
import ToolbarLogo from "@Resources/imagenes/toolbar_logo.png";

//Rules
import Rules_Entidad from "@Rules/Rules_Entidad";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario,
    cargando: state.MainContent.cargando
  };
};

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  }
});

const limite = "lg";
class App extends React.Component {
  constructor(props) {
    super(props);
    let paraMobile = !isWidthUp(limite, this.props.width);

    this.state = {
      open: paraMobile ? false : true,
      paraMobile: paraMobile,
      data: [],
      cargando: true,
      error: undefined
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize);

    this.setState({ cargando: true }, () => {
      Rules_Entidad.get()
        .then(data => {
          console.log(data);
          this.setState({ error: undefined, data: data });
        })
        .catch(error => {
          this.setState({ error: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  onResize = () => {
    setTimeout(() => {
      let paraMobile = !isWidthUp(limite, this.props.width);
      this.setState({
        open: false,
        paraMobile: paraMobile
      });
    }, 500);
  };

  onBotonEntidadClick = entidad => {
    this.props.redireccionar("/NuevoTurno/" + entidad.id);
  };

  render() {
    const { classes, width, location, usuario } = this.props;
    if (usuario == undefined) return null;

    return (
      <React.Fragment>
        <div className={classes.root}>
          {/* Toolbar */}
          <MiToolbar
            paraMobile={this.state.paraMobile}
            titulo={"Turnero Online"}
            cargando={this.state.cargando}
            width={width}
            renderLogo={this.renderLogo}
            className={classes.toolbar}
          />

          {/* Contenido */}
          <div className={classNames(classes.main)}>
            <div className={classes.separadorToolbar} />
            <div className={classes.content}>
              <MiContent className={classes.content}>
                <Typography variant="headline" className={classes.titulo}>
                  Mis turnos
                </Typography>
                <MiCard>
                  <Typography>Aún no reservaste ningún turno</Typography>
                </MiCard>

                <div style={{ height: 56 }} />

                <Typography variant="headline" className={classes.titulo}>
                  Nuevo turno
                </Typography>
                <Grid container spacing={32}>
                  {this.state.data.map(item => {
                    return (
                      <Grid item xs={12} md={6} key={item.id}>
                        <CardEntidad
                          data={item}
                          onClick={this.onBotonEntidadClick}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </MiContent>
            </div>
          </div>
        </div>

        <div
          className={classNames(
            classes.contentOverlayCargando,
            this.state.cargando == true && classes.contentOverlayCargandoVisible
          )}
        />
      </React.Fragment>
    );
  }

  renderLogo = () => {
    const { classes, width, location, usuario } = this.props;

    return (
      <div
        className={classes.logoMuni}
        style={{ backgroundImage: "url(" + ToolbarLogo + ")" }}
      />
    );
  };
}

let componente = undefined;
componente = withStyles(styles)(App);
componente = withWidth()(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
