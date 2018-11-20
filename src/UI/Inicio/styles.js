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
    cardMisTurnos: {
      opacity: 0,
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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s",
      "&:hover": {
        opacity: 0.7
      },
      "& > .button": {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "48px",
        height: "48px",
        borderRadius: "72px",
        color: "white",
        marginBottom: theme.spacing.unit,
        "& *": {
          color: "white"
        }
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
