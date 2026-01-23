import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGlobe, FaLine, FaDatabase, FaArrowRight } from 'react-icons/fa';
import productImg from '../assets/product-mockup.png';

const Product = () => {
    const features = [
        {
            icon: <FaGlobe />,
            title: "インバウンド完全対応",
            desc: "英語・中国語など多言語メニューを標準搭載。外国人観光客の「注文の壁」を取り払います。"
        },
        {
            icon: <FaDatabase />,
            title: "データを資産に変える",
            desc: "注文データから「よく出る組み合わせ」や「時間帯別の傾向」を自動分析。次の打ち手が見えます。"
        },
        {
            icon: <FaLine />, // Assuming Line icon substitute or generic
            title: "LINE連携でリピート促進",
            desc: "注文時にLINE公式アカウントと連携し、旅アトの再来訪やECへの誘導を可能にします。"
        }
    ];

    return (
        <section id="product" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Text Side */}
                    <motion.div
                        className="lg:w-1/2 order-2 lg:order-1"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="text-[var(--color-primary)] font-bold tracking-wider uppercase mb-4">
                            Omnibus QR Order
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 leading-tight">
                            現場を止めるな。<br />
                            <span className="text-[var(--color-primary)]">世界基準の注文体験を。</span>
                        </h2>
                        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                            スマホで完結する、最も摩擦の少ないオーダーシステム。<br />
                            お客様の待ち時間をゼロにし、スタッフは「接客」に集中できます。
                        </p>

                        <div className="space-y-8 mb-12">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[var(--color-primary)] text-xl">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                                        <p className="text-gray-600 text-sm">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <Link to="/contact" className="btn btn-primary px-8">
                                デモを依頼する
                                <FaArrowRight className="ml-2" />
                            </Link>
                            <a href="#details" className="btn btn-outline px-8">
                                機能詳細
                            </a>
                        </div>
                    </motion.div>

                    {/* Image Side */}
                    <motion.div
                        className="lg:w-1/2 order-1 lg:order-2 relative"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative">
                            {/* Decorative Circle backdrop */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-3xl opacity-60 -z-10"></div>

                            <img
                                src={productImg}
                                alt="QR Order App Mockup"
                                className="w-full h-auto rounded-3xl shadow-2xl border-8 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500"
                            />

                            {/* Floating Badge */}
                            <div className="absolute bottom-10 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce shadow-blue-900/10">
                                <div className="text-green-500 text-2xl">⚡</div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase font-bold">Latency</div>
                                    <div className="font-bold text-gray-900">Zero Wait</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Product;
