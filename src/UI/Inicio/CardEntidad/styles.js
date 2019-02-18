const styles = theme => {
  return {
    contentClassName: {
      maxHeight: 500,
      minHeight: 500,
      display: "flex",
      flexDirection: "column"
    },
    imagen: {
      width: "100%",
      height: 200,
      minHeight: 200,
      backgroundSize: "cover",
      backgroundPosition: "center"
    },
    textos: {
      flex: 1,
      padding: "16px",
      overflow: "hidden",
      position: "relative",
      "& .shadow": {
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 36,
        right: 0,
        background: "-moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,0.01) 1%, rgba(255,255,255,1) 100%)",
        background: "-webkit-linear-gradient(top, rgba(255,255,255,0) 0%,rgba(255,255,255,0.01) 1%,rgba(255,255,255,1) 100%)",
        background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,0.01) 1%,rgba(255,255,255,1) 100%)"
      }
    },
    contenedorBotones: {
      display: "flex",
      padding: theme.spacing.unit * 2,
      minHeight: "fit-content",
      justifyContent: "flex-end"
    }
  };
};

export default styles;
