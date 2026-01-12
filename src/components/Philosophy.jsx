import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const Philosophy = () => {
    return (
        <section id="about" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Moved Headline from Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mb-16 text-center"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8 text-gray-900">
                            琵琶湖から、<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
                                ビジネスに新しい流れを
                            </span>
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            現場の手間を減らし、数字で改善が回る状態まで伴走します。<br />
                            観光・飲食の課題を、テクノロジーと運用で解決へ。
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a href="#contact" className="btn btn-primary group px-8">
                                無料で相談する
                                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Philosophy Content */}
                    <div className="grid md:grid-cols-2 gap-12 items-center mt-24">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-100 rounded-full blur-2xl opacity-70"></div>
                            <h3 className="text-2xl font-bold mb-4 relative z-10">
                                小さい現場から、<br />すべてを強くするDX
                            </h3>
                            <p className="text-gray-600 leading-7">
                                Omnibusは、技術ありきではありません。<br />
                                滋賀・京都のローカルな現場に寄り添い、
                                「本当に使える形」に落とし込む実装重視のスタイルです。
                            </p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2.5"></span>
                                    <span className="text-gray-700"><strong>ローカル起点:</strong> 琵琶湖エリアから実証されたモデルを展開</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2.5"></span>
                                    <span className="text-gray-700"><strong>実装重視:</strong> 綺麗な設計図より、現場で動く仕組み</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2.5"></span>
                                    <span className="text-gray-700"><strong>現場完結:</strong> 相談から導入、改善まで一気通貫</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Philosophy;
