import React from 'react';
import { FaTwitter, FaFacebook, FaInstagram, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer id="contact" className="bg-gray-900 text-white pt-24 pb-12 relative">
            <div className="container mx-auto px-6">
                {/* CTA Section */}
                <div className="border-b border-gray-800 pb-20 mb-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            まずは、小さな相談から。
                        </h2>
                        <p className="text-xl text-gray-400 mb-10">
                            現場の課題ひとつから、DXは始まります。<br />
                            無理な売り込みは一切いたしません。現状をお聞かせください。
                        </p>
                        <a href="mailto:contact@omnibus.jp" className="btn btn-primary bg-white text-[var(--color-primary)] hover:bg-gray-100 border-none px-12 py-4 text-xl shadow-lg shadow-blue-900/50">
                            無料相談を申し込む
                        </a>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <span className="text-2xl font-bold tracking-tight block mb-6">Omnibus</span>
                        <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
                            琵琶湖エリアを拠点に、観光・飲食産業のDXを支援する。<br />
                            「現場で使える」実装にこだわり、地域のビジネスを強くします。
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-gray-300">Services</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">業務改善・自動化</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">ITツール導入支援</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">AI活用コンサルティング</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">QRオーダーシステム</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-gray-300">Company</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">私たちについて</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">導入事例</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">お知らせ</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">プライバシーポリシー</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Omnibus Inc. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        {/* Social Icons (Placeholder) */}
                        <a href="#" className="hover:text-white transition-colors"><FaTwitter size={20} /></a>
                        <a href="#" className="hover:text-white transition-colors"><FaFacebook size={20} /></a>
                        <a href="#" className="hover:text-white transition-colors"><FaInstagram size={20} /></a>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className="absolute bottom-10 right-6 md:right-10 w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-all shadow-lg border border-gray-700"
                aria-label="Scroll to top"
            >
                <FaArrowUp />
            </button>
        </footer>
    );
};

export default Footer;
