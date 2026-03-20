import React from 'react';

const year = new Date().getFullYear();

function FooterInner() {
  return (
    <>
      <p className="footer-copy">© {year} Mohamedi Ally Mohamed</p>
      <p className="footer-project">Feature Request Tracker</p>
      <a className="footer-link" href="mailto:hackerloum@gmail.com">
        hackerloum@gmail.com
      </a>
      <a className="footer-link" href="tel:+255760442000">
        +255 760 442 000
      </a>
    </>
  );
}

export function FooterSidebar() {
  return (
    <footer className="app-footer app-footer--sidebar">
      <FooterInner />
    </footer>
  );
}

export function FooterMobile() {
  return (
    <footer className="app-footer app-footer--mobile">
      <FooterInner />
    </footer>
  );
}
