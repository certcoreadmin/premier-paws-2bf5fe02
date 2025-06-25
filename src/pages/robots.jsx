import React from 'react';

// This component handles the robots.txt route by serving plain text.
export default function RobotsTxt() {
  // This component doesn't render anything itself.
  return null;
}

// getInitialProps runs on the server and allows us to send a custom response.
RobotsTxt.getInitialProps = async ({ res }) => {
  if (res) {
    res.setHeader('Content-Type', 'text/plain');
    res.write(`User-agent: *
Disallow:

Sitemap: https://demo.pawspixeldesign.com/sitemap.xml`);
    res.end();
  }
  return {};
};