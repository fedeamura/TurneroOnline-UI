const styles = theme => {
  return {
    contenedorInfoTurnero: {
      minHeight: "fit-content",
      display: "flex",
      marginBottom: theme.spacing.unit * 4,
      alignItems: "center",
      opacity: 0,
      transition: "all 0.3s",
      "& .textos": {
        marginLeft: theme.spacing.unit * 2
      },
      "& .imagen": {
        minWidth: 72,
        maxWidth: 72,
        minHeight: 72,
        maxHeight: 72,
        backgroundSize: "cover",
        backgroundPosition: "center"
      },
      "&.visible": {
        opacity: 1
      }
    },
    contentClassNames: {
      display: "flex",
      flexDirection: "column"
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
    contenedorLinksInteres: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start"
    },
    linkInteres: {
      color: theme.palette.primary.main,
      "&:hover": {
        fontWeight: "bold"
      }
    },
    contenedorUbicaciones: {},
    contenedorUbicacion: {
      display: "flex"
    },
    contenedorUbicacionTextos: {},
    mapaUbicacion: {
      marginRight: "16px",
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderRadius: "16px",
      width: "156px",
      height: "156px"
    },
    ubicacionBotonMapa: {
      marginTop: "16px"
    },
    contenedorRequisitos: {
      "& > .contenedorRequisito:not(:last-child)": {
        marginBottom: "16px"
      }
    },
    contenedorLinksRequisito: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start"
    },
    contenedorUsuarios: {
      "& > .contenedorUsuario": {
        display: "flex",
        alignItems: "center",
        marginBottom: "8px",
        "& > .avatar": {
          marginRight: "8px"
        },
        "& > .textos": {}
      }
    },
    contenedorBotones: {
      display: "flex",
      justifyContent: "flex-end"
    }
  };
};

export default styles;
