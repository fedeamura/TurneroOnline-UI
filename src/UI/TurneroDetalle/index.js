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
import { cerrarSesion } from "@Redux/Actions/usuario";

//Componentes
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

//Mis componentes
import MiCard from "@Componentes/MiCard";
import PanelTurneroDetalle from "./PanelTurneroDetalle";
import _MiPagina from "../_MiPagina";

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
        <_MiPagina cargando={this.state.cargando}>
          <React.Fragment>
            {this.state.data != undefined && (
              <div className={classNames(classes.card, this.state.cardVisible && "visible")}>
                {this.renderInfoContextual()}
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

  renderInfoContextual() {
    const { classes } = this.props;
    console.log(this.state.data);
    return (
      <div className={classNames(classes.contenedorInfoTurnero, this.state.data && "visible")}>
        <MiCard padding={false}>
          <div
            className="imagen"
            style={{
              backgroundImage: `url(${this.state.data ? this.state.data.entidadImagen : ""})`
            }}
          />
        </MiCard>
        <div className="textos">
          <Typography variant="body1">
            <b>Entidad: </b>
            {this.state.data ? this.state.data.entidadNombre : ""}
          </Typography>
          <Typography variant="body1">
            <b>Trámite: </b>
            {this.state.data ? this.state.data.tramiteNombre : ""}
          </Typography>
        </div>
      </div>
    );
  }
}

let componente = TurneroDetalle;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withRouter(componente);
export default componente;
