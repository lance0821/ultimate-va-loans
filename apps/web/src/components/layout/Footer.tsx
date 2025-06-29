import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Next-Gen VA Loans, Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;