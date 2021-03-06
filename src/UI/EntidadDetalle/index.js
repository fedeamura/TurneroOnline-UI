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
import { setEntidades } from "@Redux/Actions/entidades";
import { toggleDrawer } from "@Redux/Actions/drawer";

//Componentes
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import _ from "lodash";
import memoize from "memoize-one";

import MiSelect from "@Componentes/MiSelect";

//Mis componentes
import MiCard from "@Componentes/MiCard";
import _MiPagina from "../_MiPagina";

//Rules
import Rules_Entidad from "@Rules/Rules_Entidad";

const mapStateToProps = state => {
  return {
    token: state.Usuario.token,
    entidades: state.Entidades.entidades,
    drawerOpen: state.Drawer.open
  };
};

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  },
  setEntidades: entidades => {
    dispatch(setEntidades(entidades));
  },
  toggleDrawer: () => {
    dispatch(toggleDrawer());
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
    this.buscarDatos();
  }

  buscarDatos() {
    this.setState({ cargando: true, cardVisible: false }, () => {
      Rules_Entidad.getDetalle(this.props.match.params.id)
        .then(data => {
          let turneroSeleccionadoEnTramite = {};
          _.each(data.tramites, tramite => {
            let turneros = this.getTurneros(tramite.turneros);
            if (turneros.length != 0) {
              turneroSeleccionadoEnTramite[tramite.id] = turneros[0].id;
            }
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

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id != nextProps.match.params.id) {
      this.setState({ id: nextProps.match.params.id }, () => {
        this.buscarDatos();
      });
    }
  }

  onTurneroChange = e => {
    let tramite = _.find(this.state.data.tramites, item => {
      return (
        _.find(item.turneros, turnero => {
          return turnero.id == e.target.value;
        }) != undefined
      );
    });
    if (tramite == undefined) return;
    this.setState({ turneroSeleccionadoEnTramite: { ...this.state.turneroSeleccionadoEnTramite, [tramite.id]: e.target.value } });
  };

  onTurneroSelectChange = t => {
    let tramite = _.find(this.state.data.tramites, item => {
      return (
        _.find(item.turneros, turnero => {
          return turnero.id == t.value;
        }) != undefined
      );
    });
    if (tramite == undefined) return;
    this.setState({ turneroSeleccionadoEnTramite: { ...this.state.turneroSeleccionadoEnTramite, [tramite.id]: t.value } });
  };

  onBotonTurneroDetalleClick = e => {
    let idTramite = e.currentTarget.attributes.itemprop.value;
    let idTurnero = this.state.turneroSeleccionadoEnTramite[idTramite];
    this.props.redireccionar("/TurneroDetalle/" + idTurnero);
  };

  onBotonTurneroCalendarioClick = e => {
    let idTramite = e.currentTarget.attributes.itemprop.value;
    let idTurnero = this.state.turneroSeleccionadoEnTramite[idTramite];
    this.props.redireccionar("/TurneroCalendario/" + idTurnero);
  };

  onBotonInicioClick = () => {
    const { width } = this.props;
    let isMobile = !isWidthUp("md", width);
    if (isMobile && this.props.drawerOpen === true) {
      this.props.toggleDrawer();
    }

    this.props.redireccionar("/");
  };

  onBotonMisTurnosClick = () => {
    const { width } = this.props;
    let isMobile = !isWidthUp("md", width);
    if (isMobile && this.props.drawerOpen === true) {
      this.props.toggleDrawer();
    }

    this.props.redireccionar("/MisReservas");
  };

  onBotonMenuEntidadClick = e => {
    const { width } = this.props;
    let isMobile = !isWidthUp("md", width);
    if (isMobile && this.props.drawerOpen === true) {
      this.props.toggleDrawer();
    }

    let id = e.currentTarget.attributes.identidad.value;
    this.props.redireccionar("/Entidad/" + id);
  };

  getTurneros = memoize(data => {
    return _.orderBy(
      _.filter(data || [], t => {
        return t.publicado == true && t.visible == true;
      }),
      "label"
    );
  });

  getOpcionesTurnero = memoize(data => {
    return _.orderBy(
      _.filter(data || [], t => {
        return t.publicado == true && t.visible == true;
      }).map(t => {
        return {
          value: t.id + "",
          label: t.nombre
        };
      }),
      "label"
    );
  });

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <_MiPagina
          cargando={this.state.cargando}
          toolbarLeftIconClick={this.props.toggleDrawer}
          toolbarLeftIcon="menu"
          contentClassName={classNames(classes.contentClassName, this.props.drawerOpen && "drawerVisible")}
        >
          <React.Fragment>
            {this.renderDrawer()}

            {this.state.data != undefined && (
              <MiCard rootClassName={classNames(classes.card, this.state.cardVisible && "visible")}>
                <Grid container spacing={32} direction="row-reverse">
                  {/* Datos de la entidad */}
                  <Grid item xs={12} sm={4}>
                    {/* Imagen */}
                    <div className={classes.imagenEntidad} style={{ backgroundImage: "url(" + this.state.data.urlImagen + ")" }} />

                    {/* Descripcion  */}
                    <Typography variant="body1">{this.state.data.descripcion}</Typography>

                    {/* Links */}
                    {this.state.data.links != undefined && this.state.data.links.length != 0 && (
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

                  <Grid item xs={12} sm={8}>
                    <Grid container spacing={16}>
                      <Grid item xs={12}>
                        <Typography variant="title">Tramites disponibles para {this.state.data.nombre}</Typography>
                      </Grid>

                      {/* Tramites */}
                      {/* Sin tramites */}
                      {(this.state.data.tramites == undefined || this.state.data.tramites.length == 0) && (
                        <Grid item xs={12}>
                          <Typography variant="body1">No hay trámites disponibles</Typography>
                        </Grid>
                      )}

                      {this.state.data.tramites &&
                        this.state.data.tramites.length != 0 &&
                        this.state.data.tramites.map((tramite, index) => {
                          const opcionesTurneros = this.getOpcionesTurnero(tramite.turneros);

                          return (
                            <React.Fragment key={"tramite_" + tramite.id}>
                              <Grid item xs={12} key={"" + index}>
                                <Typography variant="headline">{tramite.nombre}</Typography>
                                <Typography variant="body1">{tramite.descripcion}</Typography>
                              </Grid>

                              {/* Turneros */}
                              {opcionesTurneros.length == 0 && (
                                <Grid item xs={12}>
                                  <Typography variant="body1">No hay turneros disponibles</Typography>
                                </Grid>
                              )}

                              {opcionesTurneros.length != 0 && (
                                <React.Fragment>
                                  <Grid item xs={12}>
                                    {tramite.turneros && tramite.turneros.length > 3 ? (
                                      <React.Fragment>
                                        <Typography variant="body2">Seleccione un turnero:</Typography>
                                        <MiSelect
                                          value={this.state.turneroSeleccionadoEnTramite[tramite.id]}
                                          onChange={this.onTurneroSelectChange}
                                          fullWidth
                                          variant="outlined"
                                          options={opcionesTurneros}
                                        />
                                      </React.Fragment>
                                    ) : (
                                      <FormControl
                                        component="fieldset"
                                        fullWidth
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
                                          {this.getTurneros(tramite.turneros).map((turnero, index) => {
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
                                    )}
                                  </Grid>

                                  <Grid item xs={12}>
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
                                        variant="contained"
                                        onClick={this.onBotonTurneroCalendarioClick}
                                      >
                                        Reservar turno
                                      </Button>
                                    </div>
                                  </Grid>
                                </React.Fragment>
                              )}
                            </React.Fragment>
                          );
                        })}
                    </Grid>
                  </Grid>
                </Grid>
              </MiCard>
            )}
          </React.Fragment>
        </_MiPagina>
      </React.Fragment>
    );
  }

  renderDrawer() {
    const { classes, width } = this.props;
    let isMobile = !isWidthUp("md", width);

    return (
      <SwipeableDrawer
        classes={{ paper: classes.drawer }}
        variant={isMobile ? "temporary" : "persistent"}
        open={this.props.drawerOpen}
        onClose={this.props.toggleDrawer}
        onOpen={this.props.toggleDrawer}
      >
        <List>
          <ListItem button className="item" onClick={this.onBotonInicioClick}>
            <ListItemText primary="Inicio" />
          </ListItem>
          <ListItem button className="item" onClick={this.onBotonMisTurnosClick}>
            <ListItemText primary="Mis turnos" />
          </ListItem>

          <Divider />
        </List>
        <List subheader={<ListSubheader component="div">Trámites disponibles</ListSubheader>}>
          {this.props.entidades.map(itemMenu => {
            let seleccionado = this.props.match.params.id == itemMenu.id;
            return (
              <ListItem
                identidad={itemMenu.id}
                button
                key={itemMenu.id}
                className="item"
                // selected={seleccionado}
                style={{
                  backgroundColor: seleccionado ? "rgba(0,0,0,0.1)" : "transparent"
                }}
                onClick={this.onBotonMenuEntidadClick}
              >
                <ListItemText primary={itemMenu.nombre} />
              </ListItem>
            );
          })}
        </List>
      </SwipeableDrawer>
    );
  }
}

let componente = EntidadDetalle;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withWidth()(componente);
componente = withRouter(componente);
export default componente;
