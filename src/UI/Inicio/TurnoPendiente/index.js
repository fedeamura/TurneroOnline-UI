import React from "react";
import PropTypes from "prop-types";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { Typography } from "@material-ui/core";

import ButtonBase from "@material-ui/core/ButtonBase";

const mapStateToProps = state => {
  return {
    usuario: state.Usuario.usuario
  };
};

const mapDispatchToProps = dispatch => ({});

class Turno extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  onClick = () => {
    if (this.props.onClick == undefined) return;
    this.props.onClick(this.props.data);
  };

  render() {
    const { classes, usuario } = this.props;

    return (
      <React.Fragment>
        <ButtonBase className={classes.root} onClick={this.onClick}>
          <div className={classes.contenedorFecha}>
            <Typography variant="body2">{this.getMes(this.props.data.fecha)}</Typography>
            <Typography variant="headline">{this.getDia(this.props.data.fecha)}</Typography>
          </div>
          <div>
            <Typography variant="headline" style={{ textAlign: "left" }}>
              {this.props.data.tramiteNombre}
            </Typography>
            <div className={classes.contenedorTextos}>
              <Typography variant="body2">Codigo:</Typography>
              <Typography variant="body1">{`${this.props.data.codigo}/${this.props.data.año}`}</Typography>
            </div>
            <div className={classes.contenedorTextos}>
              <Typography variant="body2">Fecha:</Typography>
              <Typography variant="body1">{this.convertirFecha(this.props.data.fecha)}</Typography>
            </div>
            <div className={classes.contenedorTextos}>
              <Typography variant="body2">Estado:</Typography>
              <Typography variant="body1">{this.props.data.estadoNombre}</Typography>
            </div>
          </div>
        </ButtonBase>
      </React.Fragment>
    );
  }

  convertirFecha = fecha => {
    let partesDia = fecha.split("T")[0].split("-");
    let partesHora = fecha.split("T")[1].split(":");

    let dia = partesDia[2];
    // if (dia < 9) dia = "0" + dia;
    let mes = partesDia[1];
    // if (mes < 9) mes = "0" + mes;
    let año = partesDia[0];
    return dia + "/" + mes + "/" + año + " " + partesHora[0] + ":" + partesHora[1];
  };

  getMes = fecha => {
    let partesDia = fecha.split("T")[0].split("-");
    let mes = parseInt(partesDia[1]);

    switch (mes) {
      case 1: {
        return "ENE";
      }
      case 2: {
        return "FEB";
      }
      case 3: {
        return "MAR";
      }
      case 4: {
        return "ABR";
      }
      case 5: {
        return "MAY";
      }
      case 6: {
        return "JUN";
      }
      case 7: {
        return "JUL";
      }
      case 8: {
        return "AGO";
      }
      case 9: {
        return "SEP";
      }
      case 10: {
        return "OCT";
      }
      case 11: {
        return "NOV";
      }
      case 12: {
        return "DIC";
      }
      default: {
        return "";
      }
    }
  };

  getDia = fecha => {
    let partesDia = fecha.split("T")[0].split("-");
    return partesDia[2];
  };
}

Turno.propTypes = {
  data: PropTypes.object.isRequired
};

let componente = Turno;

componente = withStyles(styles)(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);

// componente.propTypes = {
//   data: PropTypes.func
// };

export default componente;
