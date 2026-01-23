import React, { useState } from 'react';
import { FaPaperPlane, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'お名前を入力してください';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'メールアドレスを入力してください';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = '正しいメールアドレスを入力してください';
        }
        if (!formData.message.trim()) {
            newErrors.message = 'お問い合わせ内容を入力してください';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await fetch('./contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus('error');
                setErrorMessage(result.error || '送信に失敗しました。しばらく経ってからお試しください。');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('通信エラーが発生しました。しばらく経ってからお試しください。');
        }
    };

    return (
        <section id="contact-form" className="py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                            CONTACT
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            お問い合わせ
                        </h2>
                        <p className="text-xl text-gray-600">
                            ご質問・ご相談がございましたら、お気軽にお問い合わせください。
                        </p>
                    </div>

                    {/* Success Message */}
                    {status === 'success' && (
                        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-4">
                            <FaCheckCircle className="text-green-500 text-2xl flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-green-800">送信が完了しました</h3>
                                <p className="text-green-700">お問い合わせいただきありがとうございます。担当者より折り返しご連絡いたします。</p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {status === 'error' && (
                        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-4">
                            <FaExclamationCircle className="text-red-500 text-2xl flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-red-800">送信エラー</h3>
                                <p className="text-red-700">{errorMessage}</p>
                            </div>
                        </div>
                    )}

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
                        <div className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    お名前 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                                    placeholder="山田 太郎"
                                />
                                {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    メールアドレス <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none`}
                                    placeholder="example@email.com"
                                />
                                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email}</p>}
                            </div>

                            {/* Subject Field */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                                    件名
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    placeholder="お問い合わせの件名"
                                />
                            </div>

                            {/* Message Field */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                    お問い合わせ内容 <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="6"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.message ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none`}
                                    placeholder="お問い合わせ内容をご記入ください"
                                ></textarea>
                                {errors.message && <p className="mt-2 text-sm text-red-500">{errors.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        送信中...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane />
                                        送信する
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Privacy Notice */}
                    <p className="text-center text-gray-500 text-sm mt-6">
                        お問い合わせいただいた内容は、プライバシーポリシーに基づき適切に管理いたします。
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Contact;
