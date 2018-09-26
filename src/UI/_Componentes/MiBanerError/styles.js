const styles = theme => {
  return {
    contenedorError: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.05)",
      maxHeight: 0,
      minHeight: 0,
      height: "100%",
      padding: 0,
      paddingLeft: "2rem",
      paddingRigth: "2rem",
      overflow: "hidden",
      marginBottom: 0,
      "& > div": {
        width: "100%",
        minHeight: "3rem",
        display: "flex",
        alignItems: "center"
      },
      "& > div > .material-icons": {
        marginRight: "0.5rem"
      },
      "& > div > .texto": {
        flex: 1
      },
      opacity: 0,
      transition:
        "max-height 0.3s 0.3s,min-height 0.3s 0.3s, margin 0.3s 0.3s, opacity 0.3s",
      "&.visible": {
        transition:
          "max-height 0.3s, min-height 0.3s, margin 0.3s, opacity 0.3s 0.3s",
        marginBottom: "1rem",
        maxHeight: "3rem",
        minHeight: "3rem",
        opacity: 1
      }
    },
    contenedorInfoUsername: {
      display: "flex",
      "& > .material-icons": {
        marginRight: "0.5rem"
      }
    }
  };
};

export default styles;
