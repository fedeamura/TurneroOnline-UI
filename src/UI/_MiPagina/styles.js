import orange from "@material-ui/core/colors/orange";

const styles = theme => {
  return {
    paginaContent: {
      overflow: "auto",
      [theme.breakpoints.up("md")]: {
        overflow: "hidden"
      }
    },
    rootClassNames: {
      [theme.breakpoints.up("md")]: {
        height: "100%"
      }
    },
    contentClassNames: {
      display: "flex",
      flexDirection: "column",
      height: "100%"
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
    }
  };
};

export default styles;
