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
import PanelTurneroDetalle from "./PanelTurneroDetalle";

//Recursos
import ToolbarLogo from "@Resources/imagenes/toolbar_logo.png";

//Rules
import Rules_Turnero from "@Rules/Rules_Turnero";

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

  onBotonTurneroCalendarioClick = () => {
    this.props.redirigir("/TurneroCalendario/" + this.state.id);
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

let componente = TurneroDetalle;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withRouter(componente);
export default componente;
