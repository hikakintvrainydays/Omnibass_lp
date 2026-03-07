document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
    btn.disabled = true;

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    fetch('public/contact.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success === false) {
                alert('エラー: ' + data.error);
                btn.innerHTML = originalText;
                btn.disabled = false;
            } else {
                document.getElementById('contactFormWrapper').classList.add('hidden');
                document.getElementById('successMessage').classList.remove('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.getElementById('contactForm').reset();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('通信エラーが発生しました。');
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
});
