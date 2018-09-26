import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import styles from "./styles";
import { Typography, Icon, IconButton } from "@material-ui/core";
import red from "@material-ui/core/colors/red";

class MiBanerError extends React.PureComponent {
  render() {
    const { classes, padding } = this.props;

    return (
      <div
        className={classNames(
          classes.contenedorError,
          this.props.visible && "visible"
        )}
      >
        <div>
          <Icon style={{ color: red["500"] }}>
            {this.props.icono || "error"}
          </Icon>
          <Typography
            variant="body2"
            className="texto"
            style={{ color: red["500"] }}
          >
            {this.props.mensaje}
          </Typography>
          <IconButton onClick={this.props.onClose}>
            <Icon>clear</Icon>
          </IconButton>
        </div>
      </div>
    );
  }
}

let componente = MiBanerError;
componente = withStyles(styles)(componente);
export default componente;
