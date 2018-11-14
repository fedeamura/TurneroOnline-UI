import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Compontes
import _ from "lodash";
import { Typography, Grid, FormControl, Input, InputLabel, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

class DialogoMensaje extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible != this.props.visible && nextProps.visible) {
      this.setState({ input: "" });
    }
  }

  onClose = () => {
    this.props.onClose && this.props.onClose();
  };



  onBotonNoClick = () => {
    this.props.onBotonNoClick && this.props.onBotonNoClick();
    let cerrar = !("autoCerrarBotonNo" in this.props) || this.props.autoCerrarBotonNo != false;
    cerrar && this.onClose();
  };

  onBotonSiClick = () => {
    this.props.onBotonSiClick && this.props.onBotonSiClick();
    let cerrar = !("autoCerrarBotonSi" in this.props) || this.props.autoCerrarBotonSi != false;
    cerrar && this.onClose();
  };

  render() {
    const { classes } = this.props;

    let botonNoVisible = !("botonNoVisible" in this.props) || this.props.botonNoVisible != false;
    let botonSiVisible = !("botonSiVisible" in this.props) || this.props.botonSiVisible != false;

    return (
      <React.Fragment>
        <Dialog open={this.props.visible} onClose={this.onClose} aria-labelledby="responsive-dialog-title">
          {this.props.titulo && <DialogTitle id="responsive-dialog-title">{this.props.titulo}</DialogTitle>}
          <DialogContent>
            <Grid container>
              <Grid item xs={12}>
                {this.props.mensaje && <Typography variant="body1">{this.props.mensaje}</Typography>}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            {botonNoVisible && <Button onClick={this.onBotonNoClick}>{this.props.textoNo || "No"}</Button>}
            {botonSiVisible && (
              <Button color="primary" onClick={this.onBotonSiClick}>
                {this.props.textoSi || "Si"}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

let componente = DialogoMensaje;
componente = withStyles(styles)(componente);
export default componente;
