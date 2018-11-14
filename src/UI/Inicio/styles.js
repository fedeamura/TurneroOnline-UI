const styles = theme => {
  return {
    toolbar: {
      backgroundColor: "white",
      "& h2": {
        color: "black"
      },
      "& h3": {
        color: "black"
      }
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
    contentClassNames: {
      padding: theme.spacing.unit * 2,
      display: "flex",
      flexDirection: "column"
    },
    switchWrapper: {
      backgroundColor: theme.palette.background.default,
      position: "relative",
      width: "100%",
      flex: 1
    },
    toolbar: {
      backgroundColor: "white",
      "& h2": {
        color: "black"
      },
      "& h3": {
        color: "black"
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
