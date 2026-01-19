import React from 'react';
import { motion } from 'framer-motion';

/**
 * データレイク → 琵琶湖 ヒーローセクション
 * コンセプト: 琵琶湖 = データが集まる巨大な湖（データレイク）
 * OMNI ≒ 近江、Bass ≒ ブラックバス → 世界進出
 */
const DataLakeHero = () => {
    return (
        <section className="datalake-hero" id="top">
            {/* 水面の波紋アニメーション背景 */}
            <div className="hero-bg">
                <div className="ripple ripple-1"></div>
                <div className="ripple ripple-2"></div>
                <div className="ripple ripple-3"></div>
            </div>

            <div className="container hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="hero-text"
                >
                    {/* メインコピー */}
                    <h1 className="hero-title">
                        <span className="title-main">Omni Bass</span>
                        <span className="title-sub">近江から世界へ</span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="hero-catchcopy"
                    >
                        データの湖から、<br />
                        ビジネスに新しい流れを。
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="hero-subcopy"
                    >
                        琵琶湖のように、すべてのデータが集まり、<br />
                        ブラックバスのように、世界へ力強く進出する。
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                        className="hero-cta"
                    >
                        <a href="#services" className="btn btn-primary">
                            サービスを見る
                        </a>
                        <a href="#contact" className="btn btn-outline-white">
                            お問い合わせ
                        </a>
                    </motion.div>
                </motion.div>

                {/* スクロールインジケーター */}
                <motion.div
                    className="scroll-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                >
                    <span>Scroll</span>
                    <div className="scroll-line"></div>
                </motion.div>
            </div>
        </section>
    );
};

export default DataLakeHero;
