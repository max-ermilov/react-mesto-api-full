function Footer() {
  const year = new Date().getFullYear();

  return(
    <footer className="footer page__footer">
      <p className="footer__copyright" lang="en">© {year} Mesto Russia</p>
    </footer>
  )
}

export default Footer
