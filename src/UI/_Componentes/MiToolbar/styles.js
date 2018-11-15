const styles = theme => {
  return {
    toolbar: {
      paddingLeft: 12,
      paddingRight: 12 // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    },
    menuButton: {
      // marginLeft: 12,
      // marginRight: 12
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 2
    },
    logoMuni: {},
    contenedorTitulo: {
      flexGrow: 1,
      display: "flex",
      alignItems: "center"
    },

    icono: {
      width: 40,
      height: 40,
      borderRadius: 40,
      backgroundColor: "white"
    },
    menuUsuario: {
      "& div:nth-child(2)": {
        width: "20rem",
        // minWidth: "20rem",
        maxWidth: "calc(100% - 2rem)"
      },
      "& ul": {
        paddingTop: 0
      }
    },
    menuUsuarioInfo: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.unit * 2,
      "& h2": {
        marginLeft: theme.spacing.unit
      },
      "& > div": {
        width: "5rem",
        height: "5rem",
        marginBottom: "0.5rem"
      },
      "&:focus": {
        outline: "none"
      },
      backgroundColor: "rgba(0,0,0,0.025)",
      borderBottom: "1px solid rgba(0, 0, 0, 0.095);"
    },
    contenedorCargando: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      opacity: 0,
      transition: "all 0.3s"
      // position: "absolute"
    },
    contenedorCargandoVisible: {
      opacity: 1
    },
    contenedorCuerpo: {
      flex: 1
    },
    contenedorTitulo: {
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.up("md")]: {
        flexDirection: "row"
      }
    },

    title: {},
    subtitle: {
      [theme.breakpoints.up("md")]: {
        marginLeft: theme.spacing.unit
      }
    }
  };
};

export default styles;
