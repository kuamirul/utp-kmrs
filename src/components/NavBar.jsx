import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const NavBar = () => {
  const { auth, signOut } = useAuth();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { error } = await signOut();
      console.log(error);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>UTP-KMRS</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {!auth && (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
            {!auth && (
              <Nav.Link as={Link} to="/register">
                Register
              </Nav.Link>
            )}
            {auth && (
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
            )}
            {auth && (
              <Nav.Link as={Link} to="/request-list">
                Request List
              </Nav.Link>
            )}
            {auth && (
              <Nav.Link as={Link} to="/user-details">
                User Details
              </Nav.Link>
            )}
            {auth && (
              <Nav.Link as={Link} to="/staff-details">
                Staff Details Forms
              </Nav.Link>
            )}
            {auth && (
              <Nav.Link as={Link} to="/utp-records">
                UTP Records
              </Nav.Link>
            )}
            {auth && (
              <Nav.Link as={Link} to="/digitized-records">
                Digitized Records
              </Nav.Link>
            )}
            {auth && (
              <Nav.Link as={Link} to="/disposed-records">
                Disposed Records
              </Nav.Link>
            )}
            {auth && (
              <Nav.Link as={Link} to="/record-management-guideline">
                Record Management Guideline
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {auth && (
              <Nav.Link as={Button} onClick={handleLogout}>
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;