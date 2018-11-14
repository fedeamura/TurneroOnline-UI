import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Compontes
import _ from "lodash";
import { IconButton, Typography, Grid, FormControlLabel, Checkbox, Button, Icon } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class DialogoConfirmacion extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  onClose = () => {
    this.props.onClose && this.props.onClose();
  };

  onBotonNoClick = () => {
    this.props.onBotonNoClick && this.props.onBotonNoClick();
    (this.props.autoCerrarBotonNo || true) == true && this.onClose();
  };

  onBotonSiClick = () => {
    this.props.onBotonSiClick && this.props.onBotonSiClick();
    (this.props.autoCerrarBotonSi || true) == true && this.onClose();
  };

  render() {
    const { classes } = this.props;

    let botonNoVisible = !("botonNoVisible" in this.props) || this.props.botonNoVisible != false;
    let botonSiVisible = !("botonSiVisible" in this.props) || this.props.botonSiVisible != false;

    return (
      <React.Fragment>
        <Dialog open={this.props.visible} onClose={this.onClose} aria-labelledby="responsive-dialog-title">
          {this.props.titulo && <DialogTitle id="responsive-dialog-title">{this.props.titulo}</DialogTitle>}
          {this.props.mensaje && (
            <DialogContent>
              <Typography variant="body1">{this.props.mensaje}</Typography>
            </DialogContent>
          )}
          <DialogActions>
            {botonNoVisible && (
              <Button onClick={this.onBotonNoClick} color="primary">
                {this.props.textoNo || "No"}
              </Button>
            )}
            {botonSiVisible && (
              <Button color="primary" autoFocus onClick={this.onBotonSiClick}>
                {this.props.textoSi || "Si"}
              </Button>
            )}
          </DialogActions>
        </Dialog>{" "}
      </React.Fragment>
    );
  }
}

let componente = DialogoConfirmacion;
componente = withStyles(styles)(componente);
export default componente;
