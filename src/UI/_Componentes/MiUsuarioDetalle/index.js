import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";

//Componentes
import { Typography } from "@material-ui/core";

//Mis compontentes
import CordobaFileUtils from "../Utils/CordobaFiles";

class MiDetalleUsuario extends React.PureComponent {
  render() {
    let { classes, data } = this.props;
    if (data == undefined) return null;
    let { identificadorFotoPersonal, sexoMasculino, nombre, apellido } = data;

    let foto = CordobaFileUtils.getUrlFotoMiniatura(identificadorFotoPersonal, sexoMasculino);

    return (
      <React.Fragment>
        <div className={classes.contenedor}>
          <div className={classes.foto} style={{ backgroundImage: `url(${foto})` }} />
          <div>
            <Typography variant="body1">
              {nombre} {apellido}
            </Typography>
            {/* <Typography variant="body1" className={classes.link}>
              Ver detalle
            </Typography> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

let componente = MiDetalleUsuario;
componente = withStyles(styles)(componente);
export default componente;
