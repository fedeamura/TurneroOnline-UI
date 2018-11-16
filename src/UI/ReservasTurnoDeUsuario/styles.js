import yellow from "@material-ui/core/colors/yellow";

const styles = theme => {
  return {
    card: {
      opacity: 0,
      transform: "translateY(100px)",
      transition: "all 0.3s",
      pointerEvents: "none",
      "&.visible": {
        pointerEvents: "all",
        opacity: 1,
        transform: "translateY(0px)"
      }
    },
    contenedorBotones: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end"
    },
    contenedorTitulo: {
      display: "flex",
      alignItems: "center",
      padding: "16px",
      "& h2": {
        flex: 1
      }
    },
    contenedorTabla: {
      backgroundColor: "rgba(0,0,0,0.05)",
      display: "flex",
      "& > .main": {
        flex: 1,
        overflow: "auto",
        backgroundColor: "white",
        boxShadow: "0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)"
      }
    },
    tabla: {
      flex: 1
    },
    contenedorFiltros: {
      width: "100%",
      overflow: "hidden",
      padding: "0",
      maxWidth: 0,
      opacity: 0,
      transition: "opacity 0.3s, max-width 0.3s 0.3s, padding 0.3s 0.3s",
      "&.visible": {
        opacity: 1,
        maxWidth: "10rem",
        transition: "opacity 0.3s 0.3s, max-width 0.3s, padding 0.3s"
      },
      "& .content": {
        padding: "16px"
      }
    },
    botonFiltro: {
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        opacity: 1,
        pointerEvents: "auto"
      }
    },
    cardCalendario: {
      height: "400px",
      "& > div": {
        height: "100%"
      }
    },
    calendario: {
      height: "350px"
    },
    calendarioEncabezado: {
      display: "flex",
      alignItems: "center",
      paddingLeft: "8px",
      backgroundColor: "rgba(0, 0, 0, 0.025)",
      padding: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 2,
      borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      marginBottom: theme.spacing.unit * 2,
      "& .titulo": {
        flex: 1
      }
    },
    colEstado: {
      display: "flex",
      "& > div": {
        marginRight: "8px"
      }
    },
    indicadorEstado: {
      width: 20,
      height: 20,
      backgroundColor: "black",
      borderRadius: 20
    },
    contenedorIndicadorDiaCalendario: {
      display: "flex",
      position: "absolute",
      bottom: "0px"
    },
    indicadorDiaCalendario: {
      width: 4,
      height: 4,
      backgroundColor: "black",
      borderRadius: 4,
      "&:not(:last-child)": {
        marginRight: "2px"
      }
    },
    contenedorFiltroEstado: {
      display: "flex"
    },
    cardInfoFiltroDia: {
      marginTop: theme.spacing.unit * 2,
      backgroundColor: yellow["50"]
    }
  };
};

export default styles;
