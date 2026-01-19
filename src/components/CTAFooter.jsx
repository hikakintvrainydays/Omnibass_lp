import React from 'react';
import { motion } from 'framer-motion';
import { FaLine, FaEnvelope } from 'react-icons/fa';

/**
 * CTAフッターセクション
 * O.SINGULARITY風のシンプルなお問い合わせ + フッター
 */
const CTAFooter = () => {
    return (
        <footer className="cta-footer" id="contact">
            {/* CTA エリア */}
            <div className="cta-area">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="cta-content"
                    >
                        <h2 className="cta-title">
                            まずは、お話をお聞かせください。
                        </h2>
                        <p className="cta-subtitle">
                            現状の課題やご要望など、どのようなことでも丁寧にお伺いします。<br />
                            無理な勧誘はいたしませんので、安心してご相談ください。
                        </p>

                        <div className="cta-buttons">
                            <a href="#" className="cta-btn cta-line">
                                <FaLine />
                                <span>LINEで相談する</span>
                            </a>
                            <a href="mailto:contact@omnibus.jp" className="cta-btn cta-email">
                                <FaEnvelope />
                                <span>メールで相談する</span>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* フッター情報 */}
            <div className="footer-info">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <span className="footer-logo">Omni Bass</span>
                            <p className="footer-desc">
                                滋賀・琵琶湖エリアを中心に、地域企業のDXを支援。<br />
                                共に歩み、共に成長するパートナーを目指します。
                            </p>
                        </div>

                        <div className="footer-links">
                            <h4>Services</h4>
                            <ul>
                                <li>業務改善・自動化</li>
                                <li>ITツール導入支援</li>
                                <li>AI活用コンサルティング</li>
                            </ul>
                        </div>

                        <div className="footer-links">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#about">私たちについて</a></li>
                                <li><a href="#contact">お問い合わせ</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; 2026 Omni Bass. All Rights Reserved.</p>
                        <div className="footer-nav">
                            <a href="#top">トップページ</a>
                            <a href="#services">サービス</a>
                            <a href="#about">会社概要</a>
                            <a href="#contact">お問い合わせ</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default CTAFooter;
