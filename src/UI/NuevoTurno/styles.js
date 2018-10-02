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
    }
  };
};

export default styles;
