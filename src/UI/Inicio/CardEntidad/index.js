import React from "react";

//Styles
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { goBack } from "connected-react-router";

//Componentes
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconoFlechaAtras from "@material-ui/icons/ArrowBack";
import IconButton from "@material-ui/core/IconButton";

//Mis componentes
import MiCard from "@Componentes/MiCard";

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  goBack: () => {
    dispatch(goBack());
  }
});

class CardEntidad extends React.Component {
  onClick = () => {
    if (this.props.onClick == undefined) return;
    this.props.onClick(this.props.data);
  };

  render() {
    const { classes, location } = this.props;
    // const values = queryString.parse(location.search);
    // let app = values.app;

    return (
      <React.Fragment>
        <MiCard padding={false} contentClassName={classes.contentClassName}>
          <div
            className={classes.imagen}
            style={{
              backgroundImage: "url(" + this.props.data.urlImagen + ")"
            }}
          />
          <div className={classes.textos}>
            <Typography variant="title">{this.props.data.nombre || ""}</Typography>
            {/* <Typography>{this.props.data.descripcion || ""}</Typography> */}
            {/* <div className="shadow" /> */}
          </div>
          <div className={classes.contenedorBotones}>
            <Button color="primary" variant="raised" onClick={this.onClick}>
              Ver tramites y turnos
            </Button>
          </div>
        </MiCard>
      </React.Fragment>
    );
  }
}

let componente = CardEntidad;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withRouter(componente);
export default componente;
