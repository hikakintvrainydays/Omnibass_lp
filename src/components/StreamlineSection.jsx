import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaCogs, FaCloud, FaRobot } from 'react-icons/fa';

/**
 * Streamlineセクション - YamatoDX風スクロール連動アニメーション
 * 
 * コンセプト:
 * - スクロールするごとに青い線がステップごとに伸びていく
 * - Before/After形式で業務改善を視覚化
 * - 3つのサービスカードを川の流れで接続
 */
const StreamlineSection = () => {
    const sectionRef = useRef(null);
    const [lineProgress, setLineProgress] = useState(0);

    // スクロール連動でlineProgressを更新
    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionHeight = sectionRef.current.offsetHeight;

            // セクションが画面内にある時の進捗を計算
            const start = rect.top - windowHeight;
            const end = rect.bottom;
            const total = end - start;
            const current = -start;

            const progress = Math.min(Math.max(current / total, 0), 1);
            setLineProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // 初期呼び出し

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const beforeItems = [
        '手作業と二重入力が多い',
        'Excel管理が属人化している',
        'データが散在している',
        '判断が経験と勘に偏る'
    ];

    const afterItems = [
        '定型作業が自動化される',
        '情報が整理され共有できる',
        '数値で意思決定できる',
        'ボトルネックが見える'
    ];

    const services = [
        {
            icon: FaCogs,
            title: '業務改善・自動化',
            features: [
                'Excel業務の整理・自動化',
                '手作業フローの見直し',
                '定型作業の自動処理設計'
            ]
        },
        {
            icon: FaCloud,
            title: 'IT・ツール導入',
            features: [
                'クラウドツール導入サポート',
                '小規模システム開発',
                'API連携・データ活用'
            ]
        },
        {
            icon: FaRobot,
            title: 'AI・生成AI活用',
            features: [
                'ChatGPTなど生成AIの業務活用',
                '社内利用を前提とした設計支援',
                '実務に使える形への落とし込み'
            ]
        }
    ];

    return (
        <section
            ref={sectionRef}
            className="streamline-section"
            id="dx-flow"
        >
            {/* スクロール連動の青い線（縦方向） */}
            <div className="flow-line-container">
                <svg
                    className="flow-line-svg"
                    viewBox="0 0 20 1000"
                    preserveAspectRatio="none"
                >
                    {/* 背景の薄い線 */}
                    <line
                        x1="10" y1="0"
                        x2="10" y2="1000"
                        stroke="#e2e8f0"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    {/* スクロールで伸びる青い線 */}
                    <line
                        x1="10" y1="0"
                        x2="10" y2={lineProgress * 1000}
                        stroke="url(#blueGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        style={{ transition: 'all 0.1s ease-out' }}
                    />
                    <defs>
                        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* ステップマーカー */}
                {[0.15, 0.5, 0.85].map((pos, i) => (
                    <div
                        key={i}
                        className={`step-marker ${lineProgress > pos ? 'active' : ''}`}
                        style={{ top: `${pos * 100}%` }}
                    >
                        <span>{i + 1}</span>
                    </div>
                ))}
            </div>

            <div className="container">
                {/* セクションヘッダー */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="streamline-header"
                >
                    <span className="section-kicker">DX TRANSFORMATION</span>
                    <h2 className="section-title">DXで変わること</h2>
                    <p className="section-subtitle">
                        現場の負担を減らし、判断の材料を整えます。
                    </p>
                </motion.div>

                {/* Before / After */}
                <div className="ba-container">
                    <motion.div
                        className="ba-card ba-before"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="ba-label">Before</div>
                        <ul className="ba-list">
                            {beforeItems.map((item, index) => (
                                <li key={index} className="ba-item">
                                    <span className="ba-icon">✕</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <div className="ba-arrow">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            className="arrow-circle"
                        >
                            →
                        </motion.div>
                    </div>

                    <motion.div
                        className="ba-card ba-after"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="ba-label">After</div>
                        <ul className="ba-list">
                            {afterItems.map((item, index) => (
                                <li key={index} className="ba-item">
                                    <span className="ba-icon ba-icon-check">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* サービスカード */}
                <div className="services-header">
                    <span className="section-kicker">SERVICES</span>
                    <h3 className="section-title-sm">提供しているDX支援</h3>
                </div>

                <div className="services-flow">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            className="service-flow-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                        >
                            <div className="service-icon">
                                <service.icon />
                            </div>
                            <h4 className="service-title">{service.title}</h4>
                            <ul className="service-features">
                                {service.features.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>

                            {/* カード間の接続線 */}
                            {index < services.length - 1 && (
                                <div className="flow-connector">
                                    <svg viewBox="0 0 50 20" className="connector-svg">
                                        <path
                                            d="M0,10 Q25,10 50,10"
                                            stroke={lineProgress > 0.6 + index * 0.1 ? '#0ea5e9' : '#e2e8f0'}
                                            strokeWidth="3"
                                            fill="none"
                                            style={{ transition: 'stroke 0.3s ease' }}
                                        />
                                    </svg>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StreamlineSection;
