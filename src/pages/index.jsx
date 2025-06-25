import Layout from "./Layout.jsx";

import Home from "./Home";

import Philosophy from "./Philosophy";

import BreedResources from "./BreedResources";

import Parents from "./Parents";

import Puppies from "./Puppies";

import Application from "./Application";

import Blog from "./Blog";

import Contact from "./Contact";

import AdminPanel from "./AdminPanel";

import OwnerPortal from "./OwnerPortal";

import Testimonials from "./Testimonials";

import UpcomingLitters from "./UpcomingLitters";

import Marketplace from "./Marketplace";

import SuperAdminSettings from "./SuperAdminSettings";

import robots from "./robots";

import sitemap from "./sitemap";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Philosophy: Philosophy,
    
    BreedResources: BreedResources,
    
    Parents: Parents,
    
    Puppies: Puppies,
    
    Application: Application,
    
    Blog: Blog,
    
    Contact: Contact,
    
    AdminPanel: AdminPanel,
    
    OwnerPortal: OwnerPortal,
    
    Testimonials: Testimonials,
    
    UpcomingLitters: UpcomingLitters,
    
    Marketplace: Marketplace,
    
    SuperAdminSettings: SuperAdminSettings,
    
    robots: robots,
    
    sitemap: sitemap,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Philosophy" element={<Philosophy />} />
                
                <Route path="/BreedResources" element={<BreedResources />} />
                
                <Route path="/Parents" element={<Parents />} />
                
                <Route path="/Puppies" element={<Puppies />} />
                
                <Route path="/Application" element={<Application />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/AdminPanel" element={<AdminPanel />} />
                
                <Route path="/OwnerPortal" element={<OwnerPortal />} />
                
                <Route path="/Testimonials" element={<Testimonials />} />
                
                <Route path="/UpcomingLitters" element={<UpcomingLitters />} />
                
                <Route path="/Marketplace" element={<Marketplace />} />
                
                <Route path="/SuperAdminSettings" element={<SuperAdminSettings />} />
                
                <Route path="/robots" element={<robots />} />
                
                <Route path="/sitemap" element={<sitemap />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}