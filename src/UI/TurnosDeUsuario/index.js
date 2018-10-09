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
import Typography from "@material-ui/core/Typography";

//Mis componentes
import MiContent from "@Componentes/MiContent";
import MiPagina from "@Componentes/MiPagina";
import MiCard from "@Componentes/MiCard";
import MiBanerError from "@Componentes/MiBanerError";
import MiTabla from "@Componentes/MiTabla";

//Recursos
import ToolbarLogo from "@Resources/imagenes/toolbar_logo.png";

//Rules
import Rules_Turno from "@Rules/Rules_Turno";

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

class TurnosDeUsuario extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { classes } = this.props;

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
            <MiCard
              padding={false}
              // rootClassName={classNames(classes.card, this.state.cardVisible && "visible")}
            >
              <div style={{ padding: "16px" }}>
                <Typography variant="title">Mis Turnos</Typography>
              </div>
              <MiTabla
                rowType={"Turnos"}
                columns={[
                  { id: "col1", type: "string", numeric: false, label: "Col1" },
                  { id: "col2", type: "date", numeric: false, label: "Col2" },
                  { id: "col3", type: "string", numeric: false, label: "Col3" }
                ]}
                rows={[{ col1: "hola", col2: "chau", col3: "asdasdasd" }]}
                orderBy={"col1"}
                // getImporteTotal={this.getImporteTotal}
              />
            </MiCard>
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

let componente = TurnosDeUsuario;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withStyles(styles)(componente);
componente = withRouter(componente);
export default componente;
