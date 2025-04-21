import style from "./Public.Nav.css";

function PublicNav() {
    return (
        <>
            <nav className="navbar bg-nav-public shadow-lg">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <a className="navbrand" href="/">
                        <img
                            src="/assets/img/pesopig.png" 
                            alt="PesoPig"
                            width="65"
                            height="60"
                        />

                    </a>
                    <div className="navList flex space-x-4">
                        <a href="/about" className="nav-link">¿Quienes Somos?</a>
                        <a href="/contact" className="nav-link">Contactanos</a>
                        <a href="/documentations" className="nav-link">Documentacion</a>
                    </div>
                    <a href="/user/login" className="btn">Ingresar</a>
                </div>
            </nav>
        </>
    );
}
export default PublicNav;

