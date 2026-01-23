import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ContactPage from './pages/ContactPage'

function App() {
    return (
        <Router>
            <main className="w-full min-h-screen bg-[var(--color-bg-light)]">
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>
                <Footer />
            </main>
        </Router>
    )
}

export default App
