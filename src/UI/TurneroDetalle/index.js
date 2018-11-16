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
import { Grid, Button } from "@material-ui/core";

//Mis componentes
import MiCard from "@Componentes/MiCard";
import PanelTurneroDetalle from "./PanelTurneroDetalle";
import _MiPagina from "../_MiPagina";

//Recursos
import ToolbarLogo from "@Resources/imagenes/escudo_muni_texto_verde.png";
import ToolbarLogo_Chico from "@Resources/imagenes/escudo_muni_verde.png";

//Rules
import Rules_Turnero from "@Rules/Rules_Turnero";

const mapStateToProps = state => {
  return { token: state.Usuario.token };
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

class TurneroDetalle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      cargando: true,
      cardVisible: false,
      data: undefined,
      error: undefined
    };
  }

  componentDidMount() {
    this.setState({ cargando: true }, () => {
      Rules_Turnero.getDetalle(this.state.id)
        .then(data => {
          console.log(data);
          this.setState({ error: undefined, data: data }, () => {
            setTimeout(() => {
              this.setState({ cardVisible: true });
            }, 300);
          });
        })
        .catch(error => {
          this.setState({ error: error });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  }

  onCerrarSesionClick = () => {
    this.props.cerrarSesion();
  };

  onMiPerfilClick = () => {
    window.location.href = window.Config.URL_MI_PERFIL + "/#/?token=" + this.props.token;
  };

  onBotonTurneroCalendarioClick = () => {
    this.props.redirigir("/TurneroCalendario/" + this.state.id);
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <_MiPagina cargando={this.state.cargando} toolbarTitulo="Turnero online" onToolbarTituloClick={this.onToolbarTituloClick}>
          <React.Fragment>
            {this.state.data != undefined && (
              <div className={classNames(classes.card, this.state.cardVisible && "visible")}>
                <MiCard>
                  <Grid container spacing={32} direction="row">
                    <Grid item xs={12}>
                      <PanelTurneroDetalle data={this.state.data} />
                    </Grid>

                    {/* Botones */}
                    <Grid item xs={12}>
                      <div className={classes.contenedorBotones}>
                        <Button variant="raised" color="primary" onClick={this.onBotonTurneroCalendarioClick}>
                          Reservar turno
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </MiCard>
              </div>
            )}
          </React.Fragment>
        </_MiPagina>
      </React.Fragment>
    );
  }

  renderToolbarLogo() {
    const { classes, width } = this.props;
    let url = isWidthUp("md", width) ? ToolbarLogo : ToolbarLogo_Chico;
    return <div className={classes.logoMuni} style={{ backgroundImage: "url(" + url + ")" }} />;
  }
}

let componente = TurneroDetalle;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withWidth()(componente);
componente = withRouter(componente);
export default componente;
