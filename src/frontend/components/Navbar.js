import { Link } from "react-router-dom";
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import market from './market1.png';
import './Navigation.css'; // Custom styles

const Navigation = ({ web3Handler, account }) => {
    return (
        <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm py-3">
            <Container fluid>
                {/* Left-aligned logo and title */}
                <Navbar.Brand
                    href=""
                    className="d-flex align-items-center gap-3"
                >
                    <img
                        src={market}
                        width="60"
                        height="60"
                        alt="market"
                        className="rounded-circle shadow-sm"
                    />
                    <span className="marketplace-title">OpenOcean Marketplace</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    {/* Right-aligned nav links and wallet button */}
                    <Nav className="ms-auto d-flex align-items-center">
                        <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>
                        <Nav.Link as={Link} to="/create" className="nav-link-custom">Create</Nav.Link>
                        <Nav.Link as={Link} to="/my-listed-items" className="nav-link-custom">My Listed Items</Nav.Link>
                        <Nav.Link as={Link} to="/my-purchases" className="nav-link-custom">My Purchases</Nav.Link>

                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="nav-link-custom ms-3"
                            >
                                <Button variant="outline-light" className="rounded-pill px-3 fw-semibold">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>
                            </Nav.Link>
                        ) : (
                            <Button
                                onClick={web3Handler}
                                variant="outline-light"
                                className="rounded-pill px-4 fw-semibold ms-3"
                            >
                                Connect Wallet
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
