import React from 'react';
import { motion } from 'framer-motion';

/**
 * 基盤セクション - 彦根城
 * コンセプト: 「強力な基盤」= 彦根城の堅牢さ、地域に根差した信頼性
 */
const FoundationSection = () => {
    return (
        <section className="foundation-section" id="about">
            {/* 彦根城シルエット背景 */}
            <div className="castle-bg">
                <svg className="castle-silhouette" viewBox="0 0 400 200" preserveAspectRatio="xMidYMax meet">
                    {/* 簡易的な彦根城シルエット */}
                    <g fill="currentColor" opacity="0.1">
                        {/* 石垣ベース */}
                        <polygon points="50,200 350,200 320,160 80,160" />
                        {/* メイン天守 */}
                        <polygon points="150,160 250,160 240,120 160,120" />
                        <polygon points="170,120 230,120 220,80 180,80" />
                        <polygon points="185,80 215,80 210,50 190,50" />
                        {/* 屋根のカーブ */}
                        <path d="M145,160 Q150,150 160,120 L240,120 Q250,150 255,160 Z" />
                        <path d="M165,120 Q170,110 180,80 L220,80 Q230,110 235,120 Z" />
                        <path d="M182,80 Q185,70 190,50 L210,50 Q215,70 218,80 Z" />
                    </g>
                </svg>
            </div>

            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="section-header"
                >
                    <span className="section-kicker">FOUNDATION</span>
                    <h2 className="section-title">
                        滋賀に根差した確かな基盤
                    </h2>
                    <p className="section-subtitle">
                        彦根城のように堅牢で、琵琶湖のように深い信頼を。
                    </p>
                </motion.div>

                <div className="foundation-content">
                    <motion.div
                        className="about-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="about-title">会社概要</h3>
                        <p className="about-text">
                            Omni Bassは、滋賀・琵琶湖エリアを拠点に、
                            中小企業・個人事業主向けのDX支援を行っています。
                        </p>
                        <p className="about-text">
                            「近江（OMNI）」の地から、「ブラックバス（Bass）」のように
                            力強く世界へ進出する。それが私たちのビジョンです。
                        </p>

                        <div className="about-features">
                            <div className="feature-item">
                                <span className="feature-label">拠点</span>
                                <span className="feature-value">滋賀県（琵琶湖エリア）</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-label">対応エリア</span>
                                <span className="feature-value">滋賀・京都・関西全域</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-label">得意領域</span>
                                <span className="feature-value">観光・飲食・地域産業のDX</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FoundationSection;
