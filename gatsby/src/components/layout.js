import React from "react";
// import { Link } from "gatsby";

import Newsletter from "../components/newsletter"
import Footer from "../components/footer"

class Layout extends React.Component {
  render() {
    const {
      children
    } = this.props;
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
        }}
      >
        <main>{children}</main>
        <Newsletter />
        <Footer />
      </div>
    );
  }
}

export default Layout;
