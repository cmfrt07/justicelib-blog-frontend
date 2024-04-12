import styles from '../styles/Navbar.module.css'
import Link from 'next/link';

function Navbar(){
  return(
        <div className={styles.navbarContainer}>
          <Link href='https://declarations.justicelib.fr'>
          <div className={styles.navbarLogo}>
            <img src='/logo.svg' alt='' />
            <h1>Justicelib</h1>
          </div>
          </Link>
          <Link href="https://declarations.justicelib.fr/">
            <a  className={styles.btnGoJL}>
              Créer ma mise en demeure
            </a>
          </Link>
        </div>
  )
}

export default Navbar;