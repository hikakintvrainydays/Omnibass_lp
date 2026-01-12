import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Philosophy from './components/Philosophy'
import Logic from './components/Logic'
import Product from './components/Product'
import Footer from './components/Footer'

function App() {
    return (
        <main className="w-full min-h-screen bg-[var(--color-bg-light)]">
            <Header />
            <Hero />
            <Philosophy />
            <Logic />
            <Product />
            <Footer />
        </main>
    )
}

export default App
