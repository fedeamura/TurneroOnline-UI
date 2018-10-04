const styles = theme => {
  return {
    paginaContent: {
      display: "flex"
    },
    content: {
      overflow: "auto",
      flex: 1
    },
    toolbar: {
      backgroundColor: "white",
      "& h2": {
        color: "black"
      },
      "& .material-icons": {
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
    },
    diaSeleccionado: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "red"
    }
  };
};

export default styles;
