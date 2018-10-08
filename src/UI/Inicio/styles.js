const styles = theme => {
  return {
    root: {
      display: "flex",
      width: "100%",
      height: "100vh",
      backgroundColor: theme.palette.background.default
    },
    main: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.palette.background.default
    },
    separadorToolbar: theme.mixins.toolbar,
    content: {
      backgroundColor: theme.palette.background.default,
      flex: 1,
      width: "100%",
      overflow: "auto",
      "& > div": {
        width: "100%",
        height: "100%"
      }
    },
    contentOverlayCargando: {
      backgroundColor: "rgba(255,255,255,0.6)",
      position: "absolute",
      left: 0,
      right: 0,
      zIndex: theme.zIndex.drawer + 1,
      top: 0,
      bottom: 0,
      opacity: 0,
      pointerEvents: "none",
      transition: "opacity 0.3s"
    },
    contentOverlayCargandoVisible: {
      opacity: 1,
      pointerEvents: "auto"
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
      }
    },
    logoMuni: {
      marginRight: "16px",
      backgroundPosition: "center",
      minWidth: "126px",
      maxWidth: "126px",
      minHeight: "56px",
      maxHeight: "56px",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain"
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
    },
  };
};

export default styles;
