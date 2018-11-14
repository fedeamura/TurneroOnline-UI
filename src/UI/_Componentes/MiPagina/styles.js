const styles = theme => ({
  root: {
    display: "flex",
    width: "100%",
    height: "100%"
  },

  main: {
    width: "100%",
    display: "flex",
    flexDirection: "column"
  },
  separadorToolbar: theme.mixins.toolbar,
  content: {
    flex: 1,
    width: "100%",
    overflow: "auto"
  },
  contentOverlayCargando: {
    backgroundColor: "rgba(255,255,255,0.6)",
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: theme.zIndex.drawer + 1,
    top: 0,
    bottom: 0,
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.3s"
  },
  contentOverlayCargandoVisible: {
    opacity: 1,
    pointerEvents: "auto"
  }
});

export default styles;
