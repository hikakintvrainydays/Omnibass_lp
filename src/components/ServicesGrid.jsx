import React from 'react';
import { motion } from 'framer-motion';
import { FaCogs, FaCloud, FaRobot } from 'react-icons/fa';

/**
 * サービスグリッドセクション
 * 3つのDX支援サービスをカード形式で表示
 */
const ServicesGrid = () => {
    const services = [
        {
            icon: FaCogs,
            title: '業務改善・自動化',
            description: 'Excel業務の整理・自動化、手作業フローの見直し、定型作業の自動処理設計',
            features: [
                'Excel業務の整理・自動化',
                '手作業フローの見直し',
                '定型作業の自動処理設計'
            ]
        },
        {
            icon: FaCloud,
            title: 'IT・ツール導入支援',
            description: 'クラウドツール導入サポート、小規模システム開発、API連携・データ活用',
            features: [
                'クラウドツール導入サポート',
                '小規模システム開発',
                'API連携・データ活用'
            ]
        },
        {
            icon: FaRobot,
            title: 'AI・生成AI活用',
            description: 'ChatGPTなど生成AIの業務活用、社内利用を前提とした設計支援',
            features: [
                'ChatGPTなど生成AIの業務活用',
                '社内利用を前提とした設計支援',
                '実務に使える形への落とし込み'
            ]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <section className="services-section" id="services">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="section-header"
                >
                    <span className="section-kicker">SERVICES</span>
                    <h2 className="section-title">
                        提供しているDX支援
                    </h2>
                    <p className="section-subtitle">
                        技術ありきではなく、現場で本当に使えるDX・業務改善を重視します。
                    </p>
                </motion.div>

                <motion.div
                    className="services-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            className="service-card"
                            variants={cardVariants}
                        >
                            <div className="service-icon">
                                <service.icon />
                            </div>
                            <h3 className="service-title">{service.title}</h3>
                            <ul className="service-features">
                                {service.features.map((feature, i) => (
                                    <li key={i}>{feature}</li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="services-cta"
                >
                    <a href="#contact" className="btn btn-primary">
                        サービス詳細を見る
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default ServicesGrid;
