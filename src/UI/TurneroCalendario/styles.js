import orange from "@material-ui/core/colors/orange";

const styles = theme => {
  return {
    contentClassName: {
      overflow: "auto",
      [theme.breakpoints.up("md")]: {
        overflow: "hidden"
      }
    },
    miContentRootClassName: {
      [theme.breakpoints.up("md")]: {
        height: "100%"
      }
    },
    miContentContentClassName: {
      [theme.breakpoints.up("md")]: {
        display: "flex",
        flexDirection: "column",
        height: "100%"
      }
    },
    toolbar: {
      backgroundColor: "white",
      "& h2": {
        color: "black"
      },
      "& h3": {
        color: "black"
      },
      color: "black"
    },
    logoMuni: {
      marginRight: "8px",
      backgroundPosition: "center",
      minWidth: "40px",
      maxWidth: "40px",
      minHeight: "40px",
      maxHeight: "40px",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      [theme.breakpoints.up("md")]: {
        marginRight: "16px",
        flexDirection: "row",
        minWidth: "126px",
        maxWidth: "126px"
      }
    },
    card: {
      opacity: 0,
      transform: "translateY(100px)",
      transition: "all 0.3s",
      "&.visible": {
        opacity: 1,
        transform: "translateY(0px)"
      }
    },
    linkInteres: {
      cursor: "pointer",
      textDecoration: "underline",
      color: theme.palette.primary.main,
      "&:hover": {
        fontWeight: "bold"
      }
    },
    contenedorBotones: {
      display: "flex",
      justifyContent: "flex-end",
      padding: theme.spacing.unit
    },

    contenedorInfo: {
      margin: "8px",
      display: "flex",
      alignItems: "center",
      "& > div": {
        marginRight: "8px"
      }
    },
    indicadorInfo: {
      width: "26px",
      height: "26px",
      borderRadius: "30px",
      backgroundColor: "red",
      boxShadow: "0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)"
    },
    indicadorInfoDiaSeleccionado: {
      backgroundColor: "#f68a1e"
    },
    indicadorInfoTurnoDisponible: {
      backgroundColor: "#149257"
    },
    contenedorCalendario: {
      marginBottom: theme.spacing.unit * 2
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
    contenedorCalendarioRoot: {
      // height: "100%",
      width: "100%",
      display: "flex",
      opacity: 0,
      transform: "translateY(50px)",
      transition: "all 0.3s",
      pointerEvents: "none",
      "&.visible": {
        opacity: 1,
        transform: "translateY(0px)",
        pointerEvents: "all"
      }
    },
    contenedorCalendarioDia: {
      width: "100%",

      // height: "100%",
      "& > div": {
        display: "flex",
        flexDirection: "column",
        // backgroundColor: 'white',
        // border-radius: 16px;
        height: "100%"
        // overflow: hidden;
        // box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
        // display: flex;
        // flex-direction: column;
        // width: 100%;
      }
    },
    colCalendario: {
      paddingRight: 0,
      marginBottom: theme.spacing.unit * 4,
      [theme.breakpoints.up("md")]: {
        paddingRight: theme.spacing.unit * 4,
        marginBottom: 0
      },
      opacity: 0,
      transition: "all 0.3s",
      "&.visible": {
        opacity: 1
      }
    },
    colCalendarioDia: {
      display: "flex"
    },
    encabezadoTurnosDeDia: {
      display: "flex",
      alignItems: "center",
      paddingLeft: "8px",
      backgroundColor: "rgba(0, 0, 0, 0.025)",
      padding: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 2,
      borderBottom: "1px solid rgba(0, 0, 0, 0.1)"
    },
    contenedorTurnos: {
      flex: 1,
      padding: theme.spacing.unit,
      overflow: "auto"
    },
    contenedorSeleccioneUnTurno: {
      padding: theme.spacing.unit,
      paddingBottom: 0
    },
    contenedorSinEventos: {
      padding: theme.spacing.unit,
      backgroundColor: orange["500"]
    },
    contenedorInfoTurnero: {
      display: "flex",
      marginBottom: theme.spacing.unit * 4,
      alignItems: "center",
      opacity: 0,
      transition: "all 0.3s",
      "& .imagen": {
        backgroundSize: "cover",
        backgroundPosition: "center"

        // borderRadius: theme.spacing.unit
      },
      "&.visible": {
        opacity: 1
      }
    },
    imagenTurnero: {
      marginRight: theme.spacing.unit * 2
    }
  };
};

export default styles;
