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
    imagenEntidad: {
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      borderRadius: "16px",
      width: "100%",
      height: "200px",
      marginBottom: "16px"
    },
    contenedorLinksInteres: {
      marginTop: "16px",
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
    contenedorTramite: {
      marginTop: "16px",
      marginBottom: "32px"
    },
    contenedorBotonesTramite: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "16px",
      "& button:not(:last-child)": {
        marginRight: "8px"
      }
    }
  };
};

export default styles;
