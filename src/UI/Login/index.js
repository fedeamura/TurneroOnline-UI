import React from "react";

//REDUX
import { connect } from "react-redux";
import { replace } from "connected-react-router";
import { withRouter } from "react-router-dom";

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  replace: url => {
    dispatch(replace(url));
  }
});

class Login extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.addEventListener("message", e => {
      if (e === undefined || e.data === undefined) return;

      let data = e.data;

      console.log(data);
      var token = data.Token;
      this.props.replace("/Token?token=" + token);
    });
  }

  render() {
    return (
      <React.Fragment>
        <iframe
          style={{ width: "100%", height: "100%" }}
          src="https://servicios2.cordoba.gov.ar/VecinoVirtualUtils_Internet/Acceder?subtitulo=Turnero&url=http%3A%2F%2Flocalhost%3A3000%2F%23%2F"
        />
      </React.Fragment>
    );
  }
}

let componente = Login;
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);
componente = withRouter(componente);
export default componente;
