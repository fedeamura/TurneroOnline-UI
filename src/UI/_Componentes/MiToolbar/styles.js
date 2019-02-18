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
      backgroundColor: "rgba(0,0,0,0.05)"
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
      flex: 1,
      display: "flex",
      alignItems: "start",
      flexDirection: "column",
      overflow: "hidden"
    },
    contenedorTitulo: {
      display: "flex",
      flexDirection: "row",
      "& *": {
        maxWidth: "100%"
      }
      // [theme.breakpoints.up("md")]: {
      //   flexDirection: "row"
      // }
    },
    contenedorBreadcrumbs: {
      display: "flex",
      overflow: "auto",
      maxWidth: "100%",
      "& > .breadcrumb": {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        "& *": {
          cursor: "pointer"
        },
        "& .texto": {
          transition: "all 0.3s",
          padding: 4,
          paddingTop: 0,
          paddingBottom: 0,
          borderRadius: "4px",
          // overflow: "hidden",
          // textOverflow: "ellipsis",
          // display: "-webkit-box",
          // "-webkitBoxOrient": "vertical",
          // "-webkitLineClamp": 1
        },
        "&:hover": {
          "& .texto": {
            backgroundColor: "rgba(0,0,0,0.05)"
          }
        }
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
