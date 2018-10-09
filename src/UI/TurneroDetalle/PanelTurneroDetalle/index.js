import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Componentes
import { Grid, Typography, Button } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";

class PanelTurneroDetalle extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.data == undefined) return null;

    const { classes } = this.props;

    return (
      <React.Fragment>
        <Grid container spacing={32} direction="row">
          {/* COntenido principal */}
          <Grid item xs={12}>
            <Typography variant="display1">{this.props.data.tramiteNombre}</Typography>
            <Typography variant="body1">{this.props.data.descripcion}</Typography>
          </Grid>

          {/* Ubicaciones */}
          <Grid item xs={12} sm={8}>
            {this.props.data.ubicaciones != undefined &&
              this.props.data.ubicaciones.length != 0 && (
                <div>
                  <Typography variant="headline">Ubicación</Typography>

                  {this.props.data.ubicaciones.map((ubicacion, index) => {
                    let lat = (ubicacion.latitud || "").replace(",", ".");
                    let lng = (ubicacion.longitud || "").replace(",", ".");

                    let urlMapa =
                      "https://maps.googleapis.com/maps/api/staticmap?center=-31.416110,-64.191006&zoom=17&scale=false&size=300x300&maptype=roadmap&key=AIzaSyCrx7fsnW-aDmoUOvVrsf88WihSe9Vza2g&format=png&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C{lat},{lng}";
                    urlMapa = urlMapa.replace("{lat}", lat);
                    urlMapa = urlMapa.replace("{lng}", lng);

                    return (
                      <div key={index} className={classes.contenedorUbicacion}>
                        <div className={classes.mapaUbicacion} style={{ backgroundImage: "url(" + urlMapa + ")" }} />
                        <div className={classes.contenedorUbicacionTextos}>
                          <Typography variant="body2">{ubicacion.nombre}</Typography>
                          <Typography variant="body1">{ubicacion.direccion}</Typography>
                          <Button
                            onClick={() => {
                              var win = window.open("https://www.google.com/maps/?q=" + lat + "," + lng, "_blank");
                              if (win) win.focus();
                            }}
                            variant="outlined"
                            color="primary"
                            className={classes.ubicacionBotonMapa}
                          >
                            Abrir mapa
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
          </Grid>

          {/* Links */}
          <Grid item xs={12} sm={4}>
            {this.props.data.links != undefined &&
              this.props.data.links.length != 0 && (
                <div className={classes.contenedorLinksInteres}>
                  <Typography variant="body2">Links de interés</Typography>
                  {this.props.data.links.map((item, index) => {
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

          {/* Requisitos */}
          {this.props.data.requisitos != undefined &&
            this.props.data.requisitos.length != 0 && (
              <Grid item xs={12}>
                <div className={classes.contenedorRequisitos}>
                  <Typography variant="headline">Requisitos</Typography>
                  {this.props.data.requisitos.map((requisito, index) => {
                    return (
                      <div key={index} className={classNames("contenedorRequisito")}>
                        <Typography variant="body2">{requisito.nombre}</Typography>
                        <Typography variant="body1">{requisito.descripcion}</Typography>

                        {requisito.links != undefined &&
                          requisito.links.length != 0 && (
                            <view className={classes.contenedorLinksRequisito}>
                              {requisito.links.map((link, index) => {
                                return (
                                  <Typography
                                    key={index}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={link.url}
                                    component="a"
                                    className={classes.linkInteres}
                                  >
                                    {link.alias}
                                  </Typography>
                                );
                              })}
                            </view>
                          )}
                      </div>
                    );
                  })}
                </div>
              </Grid>
            )}

          {/* Personas asociadas */}
          {this.props.data.usuariosAsociados != undefined &&
            this.props.data.usuariosAsociados.length != 0 && (
              <Grid item xs={12}>
                <div className={classes.contenedorUsuarios}>
                  <Typography variant="headline">Personal asociado</Typography>
                  {this.props.data.usuariosAsociados.map((usuario, index) => {
                    return (
                      <div key={index} className={classNames("contenedorUsuario")}>
                        <Avatar
                          className={classNames("avatar")}
                          alt="Adelle Charles"
                          src={window.Config.URL_CORDOBA_FILES + "/Archivo/" + usuario.identificadorFotoPersonal + "/3"}
                        />
                        <div className={classNames("textos")}>
                          <Typography variant="body2">
                            {usuario.nombre} {usuario.apellido}
                          </Typography>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Grid>
            )}
        </Grid>
      </React.Fragment>
    );
  }
}

let componente = PanelTurneroDetalle;
componente = withStyles(styles)(componente);
export default componente;
