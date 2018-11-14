import React from "react";

import classNames from "classnames";
import styles from "./styles";
import { withStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import TextField from "@material-ui/core/TextField";

import _ from "lodash";
import { Icon, Typography } from "@material-ui/core";

class MiSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      busqueda: ""
    };
  }

  onBotonClick = () => {
    if (this.props.disabled === true) return;
    this.setState({ open: true, busqueda: "" });
  };

  onClose = () => {
    this.setState({ open: false });
  };

  onClick = value => {
    let item = _.find(this.props.options, opcion => {
      return opcion.value === value;
    });
    if (item === undefined) return;

    this.props.onChange && this.props.onChange(item);
    this.onClose();
  };

  onBusquedaChange = e => {
    this.setState({ busqueda: e.currentTarget.value });
  };

  onInputRef = ref => {
    ref && ref.focus();
  };

  onInputKeyPress = e => {
    if (e.key === "Enter") {
      let opcionesFiltradas = _.filter(this.props.options, opcion => {
        let busqueda = this.transformarTexto(this.state.busqueda);
        let label = this.transformarTexto(opcion.label);
        return label.indexOf(busqueda) !== -1;
      });

      if (opcionesFiltradas.length === 1) {
        this.onClick(opcionesFiltradas[0].value);
      }
    }
  };
  render() {
    let { options, fullScreen, value } = this.props;
    options = options || [];

    if (
      this.props.default &&
      _.find(options, item => {
        return item.value === this.props.default.value;
      }) === undefined
    ) {
      options.unshift(this.props.default);
    }

    let opcionSeleccionada = undefined;
    if (value) {
      opcionSeleccionada = _.find(this.props.options, item => {
        return item.value == value;
      });
    }

    let opcionesFiltradas = _.filter(options, opcion => {
      let busqueda = this.transformarTexto(this.state.busqueda);
      let label = this.transformarTexto(opcion.label);
      return label.indexOf(busqueda) !== -1;
    });

    return (
      <React.Fragment>
        <Typography variant="body2">{this.props.label}</Typography>
        <Button
          onClick={this.onBotonClick}
          style={{
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderBottom: this.props.disabled === true ? "1px dotted rgba(0, 0, 0, 0.42)" : "1px solid rgba(0, 0, 0, 0.42)",
            paddingLeft: 0,
            display: "flex"
          }}
        >
          <Typography style={{ flex: 1, textAlign: "initial", textTransform: "capitalize" }}>
            {opcionSeleccionada ? opcionSeleccionada.label : "Seleccione..."}
          </Typography>
          <Icon>keyboard_arrow_down</Icon>
        </Button>
        <Dialog fullScreen={fullScreen} open={this.state.open} onClose={this.onClose}>
          <DialogContent style={{ padding: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ minHeight: "fit-content", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Icon style={{ marginRight: "16px" }}>search</Icon>
                <TextField
                  inputRef={this.onInputRef}
                  name="busqueda"
                  onKeyPress={this.onInputKeyPress}
                  style={{ flex: 1 }}
                  placeholder={this.props.placeholderBusqueda || "Buscar..."}
                  value={this.state.busqueda}
                  onChange={this.onBusquedaChange}
                />
              </div>
            </div>

            <div style={{ flex: 1, overflow: "auto" }}>
              <List>
                {opcionesFiltradas.map(opcion => {
                  return (
                    <Item
                      selected={opcion.value == value}
                      key={opcion.value}
                      label={opcion.label}
                      value={opcion.value}
                      onClick={this.onClick}
                    />
                  );
                })}
              </List>
            </div>
          </DialogContent>

          <DialogActions>
            <Button color="primary" onClick={this.onClose}>
              Volver
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }

  transformarTexto = txt => {
    if (txt === undefined) return "";
    txt = txt.toLowerCase();
    txt = txt.replace(/á/g, "a");
    txt = txt.replace(/é/g, "e");
    txt = txt.replace(/í/g, "i");
    txt = txt.replace(/ó/g, "o");
    txt = txt.replace(/ú/g, "u");
    return txt;
  };
}

class Item extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  onClick = () => {
    this.props.onClick && this.props.onClick(this.props.value);
  };

  render() {
    return (
      <ListItem button onClick={this.onClick} selected={this.props.selected}>
        <ListItemText primary={this.props.label} />
      </ListItem>
    );
  }
}

let componente = MiSelect;
componente = withStyles(styles)(componente);
componente = withMobileDialog()(componente);
export default componente;
