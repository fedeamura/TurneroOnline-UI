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

//Mis componentes
import MiContent from "@Componentes/MiContent";
import MiPagina from "@Componentes/MiPagina";
import CardEntidad from "./CardEntidad";

//Recursos
import ToolbarLogo from "@Resources/imagenes/toolbar_logo.png";

//Rules
import Rules_Entidad from "@Rules/Rules_Entidad";
import { Grid } from "../../../node_modules/@material-ui/core";

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

class NuevoTurno extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cargando: true,
      data: [],
      error: undefined
    };
  }

  componentDidMount() {
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

  onEntidadClick = entidad => {
    this.props.redirigir("/NuevoTurno/" + entidad.id);
  };

  render() {
    const { classes, location } = this.props;
    // const values = queryString.parse(location.search);
    // let app = values.app;

    return (
      <React.Fragment>
        <MiPagina
          cargando={this.state.cargando}
          toolbarTitulo="Nuevo turno"
          toolbarClassName={classes.toolbar}
          toolbarRenderLogo={this.renderToolbarLogo}
          toolbarLeftIcon="arrow_back"
          toolbarLeftIconClick={this.props.goBack}
          contentClassName={classes.paginaContent}
        >
          <MiContent className={classes.content}>
            <Grid container spacing={32}>
              {this.state.data.map(item => {
                return (
                  <Grid item xs={12} md={6} key={item.id}>
                    <CardEntidad data={item} onClick={this.onEntidadClick} />
                  </Grid>
                );
              })}
            </Grid>
          </MiContent>
        </MiPagina>
      </React.Fragment>
    );
  }

  renderToolbarLogo = () => {
    const { classes, width, location, usuario } = this.props;

    return (
      <div
        className={classes.logoMuni}
        style={{ backgroundImage: "url(" + ToolbarLogo + ")" }}
      />
    );
  };
}

let componente = NuevoTurno;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withRouter(componente);
export default componente;
