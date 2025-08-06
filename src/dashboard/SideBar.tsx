import * as React from "react";

import { Link } from "react-router-dom";

export default function AdminMenu() {
  return (
    <React.Fragment>
      <div
        style={{
          display: "block",
          justifyContent: "center",
          textAlign: "center",
          // lineHeight: "80px",
        }}
      >
        <ul>
          <li style={{ marginBottom: "20px" }}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              Process Transaction
            </Link>
          </li>
        </ul>{" "}
      </div>
    </React.Fragment>
  );
}
