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
