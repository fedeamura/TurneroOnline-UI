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
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import _ from "lodash";

//Mis componentes
import MiContent from "@Componentes/MiContent";
import MiPagina from "@Componentes/MiPagina";
import MiCard from "@Componentes/MiCard";

//Recursos
import ToolbarLogo from "@Resources/imagenes/toolbar_logo.png";

//Rules
import Rules_Entidad from "@Rules/Rules_Entidad";

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

class EntidadDetalle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.match.params.id,
      cargando: true,
      cardVisible: false,
      data: [],
      error: undefined,
      turneroSeleccionadoEnTramite: {}
    };
  }

  componentDidMount() {
    this.setState({ cargando: true }, () => {
      Rules_Entidad.getDetalle(this.state.id)
        .then(data => {
          let turneroSeleccionadoEnTramite = {};
          _.each(data.tramites, tramite => {
            turneroSeleccionadoEnTramite[tramite.id] = tramite.turneros[0].id;
          });
          this.setState({ error: undefined, data: data, turneroSeleccionadoEnTramite: turneroSeleccionadoEnTramite }, () => {
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

  onTurneroChange = e => {
    let turnero = _.find(this.state.data.tramites, item => {
      return (
        _.find(item.turneros, turnero => {
          return turnero.id == e.target.value;
        }) != undefined
      );
    });
    if (turnero == undefined) return;
    let turneroSeleccionadoEnTramite = this.state.turneroSeleccionadoEnTramite;
    turneroSeleccionadoEnTramite[turnero.id] = "" + e.target.value;
    this.setState({ turneroSeleccionadoEnTramite: turneroSeleccionadoEnTramite });
  };

  onBotonTurneroDetalleClick = e => {
    let idTramite = e.currentTarget.attributes.itemprop.value;
    let idTurnero = this.state.turneroSeleccionadoEnTramite[idTramite];
    this.props.redirigir("/TurneroDetalle/" + idTurnero);
  };

  onBotonTurneroCalendarioClick = e => {
    let idTramite = e.currentTarget.attributes.itemprop.value;
    let idTurnero = this.state.turneroSeleccionadoEnTramite[idTramite];
    this.props.redirigir("/TurneroCalendario/" + idTurnero);
  };

  render() {
    const { classes, location } = this.props;
    // const values = queryString.parse(location.search);
    // let app = values.app;

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
                  <Grid container spacing={32} direction="row-reverse">
                    {/* Datos de la entidad */}
                    <Grid item xs={12} sm={4}>
                      {/* Imagen */}
                      <div className={classes.imagenEntidad} style={{ backgroundImage: "url(" + this.state.data.urlImagen + ")" }} />

                      {/* Descripcion  */}
                      <Typography variant="body1">{this.state.data.descripcion}</Typography>

                      {/* Links */}
                      {this.state.data.links != undefined &&
                        this.state.data.links.length != 0 && (
                          <div className={classes.contenedorLinksInteres}>
                            <Typography variant="body2">Links de interés</Typography>
                            {this.state.data.links.map((item, index) => {
                              return (
                                <Typography
                                  key={index}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href={item.url}
                                  component="a"
                                  className={classes.linkInteres}
                                >
                                  {item.alias}
                                </Typography>
                              );
                            })}
                          </div>
                        )}
                    </Grid>

                    {/* COntenido principal */}
                    <Grid item xs={12} sm={8}>
                      <Typography variant="display1">Tramites disponibles para {this.state.data.nombre}</Typography>

                      {/* Tramites */}
                      {this.state.data.tramites == undefined ||
                        (this.state.data.tramites.length == 0 && <Typography variant="body1">No hay trámites disponibles</Typography>)}

                      {this.state.data.tramites != undefined &&
                        this.state.data.tramites.length != 0 && (
                          <div className={classes.contenedorTramites}>
                            {this.state.data.tramites.map((tramite, index) => {
                              return (
                                <div className={classes.contenedorTramite} key={index}>
                                  <Typography variant="headline">{tramite.nombre}</Typography>
                                  <Typography variant="body1">{tramite.descripcion}</Typography>

                                  {/* Turneros */}
                                  <FormControl
                                    component="fieldset"
                                    className={classes.formControl}
                                    // style={{ display: tramite.turneros.length == 1 ? "none" : "auto" }}
                                  >
                                    <RadioGroup
                                      aria-label="Turnero"
                                      name={"turnero" + tramite.id}
                                      className={classes.group}
                                      value={"" + this.state.turneroSeleccionadoEnTramite[tramite.id]}
                                      onChange={this.onTurneroChange}
                                    >
                                      {tramite.turneros.map((turnero, index) => {
                                        return (
                                          <FormControlLabel
                                            key={index}
                                            value={"" + turnero.id}
                                            control={<Radio />}
                                            label={turnero.nombre}
                                          />
                                        );
                                      })}
                                    </RadioGroup>
                                  </FormControl>

                                  <div className={classes.contenedorBotonesTramite}>
                                    <Button
                                      itemProp={tramite.id}
                                      color="primary"
                                      variant="outlined"
                                      onClick={this.onBotonTurneroDetalleClick}
                                    >
                                      Más información
                                    </Button>
                                    <Button
                                      itemProp={tramite.id}
                                      color="primary"
                                      variant="raised"
                                      onClick={this.onBotonTurneroCalendarioClick}
                                    >
                                      Reservar turno
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
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

let componente = EntidadDetalle;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withRouter(componente);
export default componente;
