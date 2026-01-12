import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaClock, FaUsers, FaExclamationTriangle } from 'react-icons/fa';

const Logic = () => {
    const impacts = [
        {
            icon: <FaClock />,
            title: "工数の削減",
            desc: "注文・会計対応の時間を物理的に減らし、接客の質へ転換する。"
        },
        {
            icon: <FaChartLine />,
            title: "回転率の向上",
            desc: "オペレーションのボトルネックを解消し、機会損失を防ぐ。"
        },
        {
            icon: <FaUsers />,
            title: "人件費の最適化",
            desc: "ピークタイムの人員配置をデータに基づいて判断可能にする。"
        },
        {
            icon: <FaExclamationTriangle />,
            title: "ミスの撲滅",
            desc: "聞き間違いや伝達ミスなどの「人間ならではのエラー」をゼロにする。"
        }
    ];

    return (
        <section id="services" className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                        なぜ、「観光」と「食」なのか
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        この領域は、オペレーションの定型化が進んでおり、<br className="hidden md:block" />
                        改善の結果が、明確な「数字」として表れるからです。
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {impacts.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 text-center group"
                        >
                            <div className="text-4xl text-[var(--color-primary)] mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-800">{item.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500 bg-white/50 inline-block px-4 py-2 rounded-full border border-gray-200">
                        Omnibusは、これらの指標を可視化し、PDCAを共に回します。
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Logic;
