const styles = theme => {
  return {
    contentClassName: {
      transition: "all 0.3s",
      "&.drawerVisible": {
        [theme.breakpoints.up("md")]: {
          paddingLeft: "300px"
        }
      }
    },
    drawer: {
      backgroundColor: "white",
      border: "none",
      width: "300px",
      [theme.breakpoints.up("md")]: {
        paddingTop: "70px",
        backgroundColor: "transparent",
        "& .item": {
          borderTopRightRadius: "32px",
          borderBottomRightRadius: "32px"
        }
      }
    },
    cardContadores: {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      "& .boton": {
        padding: 16
      },
      [theme.breakpoints.up("sm")]: {
        flexDirection: "row",
        "& .boton": {
          alignSelf: "flex-end"
        }
      }
    },
    cardMisTurnos: {
      opacity: 0,
      marginTop: 16,
      transform: "translateY(50px)",
      transition: "all 0.3s",
      pointerEvents: "none",
      "&.visible": {
        pointerEvents: "all",
        opacity: 1,
        transform: "translateY(0px)"
      }
    },
    contenedorContadores: {
      display: "flex",
      flexWrap: "wrap"
    },
    contadorTurno: {
      margin: theme.spacing.unit,
      cursor: "pointer",
      transition: "all 0.3s",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      backgroundColor: "rgba(0,0,0,0.05)",
      padding: theme.spacing.unit,
      borderRadius: "72px",
      "& .contador": {
        width: 26,
        height: 26,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: theme.spacing.unit,
        justifyContent: "center",
        color: "white",
        borderRadius: "72px"
      },
      "& *": {
        color: "black"
      },
      "&:hover": {
        opacity: 0.7
      }
    },
    misTurnosContenedorBotones: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end",
      marginTop: "16px"
    },
    cardEntidades: {
      opacity: 0,
      transform: "translateY(50px)",
      transition: "all 0.3s",
      pointerEvents: "none",
      "&.visible": {
        pointerEvents: "all",
        opacity: 1,
        transform: "translateY(0px)"
      }
    }
  };
};

export default styles;
