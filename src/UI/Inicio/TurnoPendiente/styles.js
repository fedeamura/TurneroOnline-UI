const styles = theme => {
  return {
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: 'flex-start',
      width:'100%',
      cursor: "pointer",
      transition: "all 0.3s",
      "&:not(:last-child)": {
        marginBottom: "16px"
      },
      "&:hover": {
        backgroundColor: "rgba(0,0,0,0.05)",
        borderRadius: "8px"
      },
      "& *": {
        cursor: "pointer"
      }
    },

    contenedorFecha: {
      display: "flex",
      minWidth: "72px",
      minHeight: "72px",
      flexDirection: "column",
      maxWidth: "72px",
      maxHeight: "72px",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "16px",
      borderRight: "1px solid rgba(0,0,0,0.1)"
    },
    contenedorTextos: {
      display: "flex",
      alignItems: "baseline",
      "& aside": {
        marginRight: "8px"
      }
    }
  };
};

export default styles;
