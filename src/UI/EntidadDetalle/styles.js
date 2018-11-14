const styles = theme => {
  return {
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
