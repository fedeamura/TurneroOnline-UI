import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

class MiContent extends React.PureComponent {
  render() {
    let { classes } = this.props;

    return (
      <div className={classNames(classes.root, this.props.rootClassNames)}>
        <div className={classNames(classes.content, this.props.contentClassNames)}>{this.props.children}</div>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    display: "flex",
    width: "100%",
    padding: theme.spacing.unit * 2,
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing.unit * 4
    }
  },
  content: {
    alignSelf: "center",
    width: "100%",
    maxWidth: "50rem"
  }
});

export default withStyles(styles)(MiContent);
