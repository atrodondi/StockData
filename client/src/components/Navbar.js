import React from "react";
import styled from "styled-components";

const Nav = styled.nav`
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  background: #ffffff;
  width: 100%;
  height: 50px;
  display: flex;
`;

const LinkBox = styled.div`
  width: 60%;
  height: 50px;
  margin: auto;
  display: flex;
  justify-content: space-between;
`;

export default function Navbar(props) {
  return (
    <Nav>
      <LinkBox>
        <h1>Home</h1>
        <h2>Portfolio</h2>
        <h2>My Watchlist</h2>
      </LinkBox>
    </Nav>
  );
}
