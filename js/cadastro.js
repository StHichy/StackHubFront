$(document).ready(function() {
    // Reaproveita a função showAlert que já existe no login
    function showAlert(type, title, text, showConfirm = true, timer = null) {
        const alertIcons = {
            success: './imagens/sucess.png',
            error: './imagens/error.png',
            warning: './imagens/warning.png'
        };
        const borderColors = {
            success: '#1ab617',
            error: '#d9534f',
            warning: '#f0ad4e'
        };

        const alertInstance = Swal.mixin({
            customClass: {
                popup: `swal-popup swal-popup-${type}`,
                confirmButton: 'swal-confirm-btn',
                cancelButton: 'swal-cancel-btn',
                title: 'swal-title',
                htmlContainer: 'swal-html',
                image: 'swal-image',
                container: 'swal-container'
            },
            background: 'rgb(45, 45, 45)',
            color: 'white',
            confirmButtonColor: '#1ab617',
            showClass: { popup: 'swal-show-popup' },
            hideClass: { popup: 'swal-hide-popup' }
        });

        alertInstance.fire({
            title: title,
            text: text,
            imageUrl: alertIcons[type],
            imageWidth: 120,
            imageHeight: 120,
            imageAlt: 'Ícone de ' + type,
            showConfirmButton: showConfirm,
            timer: timer,
            confirmButtonText: 'OK',
            didOpen: () => {
                // efeito blur na imagem
                const imageContainer = document.querySelector('.swal2-image-container');
                if (imageContainer) {
                    const blurEffect = document.createElement('div');
                    blurEffect.className = 'swal-image-blur';
                    blurEffect.style.background = borderColors[type];
                    imageContainer.style.position = 'relative';
                    imageContainer.appendChild(blurEffect);
                }
            }
        });
    }

    // Evento do botão de cadastro
    $('.login-btn').on('click', function(e) {
        e.preventDefault();

        const name = $('input[placeholder="nome do usuário"]').val().trim();
        const email = $('input[placeholder="exemplo@stackhub.com"]').val().trim();
        const password = $('input[placeholder="Criar senha"]').val().trim();
        const password_confirmation = $('input[placeholder="Confirmar senha"]').val().trim();
        const terms = $('#remember').is(':checked');

        // validações
        if (!name || !email || !password || !password_confirmation) {
            showAlert('error', 'Campos obrigatórios', 'Preencha todos os campos antes de continuar.');
            return;
        }

        if (password.length < 8) {
            showAlert('warning', 'Senha fraca', 'A senha deve ter pelo menos 8 caracteres.');
            return;
        }

        if (password !== password_confirmation) {
            showAlert('error', 'Senhas diferentes', 'As senhas informadas não coincidem.');
            return;
        }

        if (!terms) {
            showAlert('warning', 'Atenção', 'Você deve concordar com os Termos de Uso e Política de Privacidade.');
            return;
        }

        // Enviar cadastro via API Laravel
        $.ajax({
            url: 'http://127.0.0.1:8000/api/register',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                name,
                email,
                password,
                password_confirmation
            }),
            success: function(response) {
                // se cadastro já retorna token (como no login)
                if (response.access_token) {
                    sessionStorage.setItem('jwt', response.access_token);

                    showAlert('success', 'Cadastro realizado!', 'Conta criada com sucesso!', false, 2000);

                    setTimeout(() => {
                        window.location.href = 'loading.html';
                    }, 2000);
                } else {
                    // se cadastro exige verificação de email
                    showAlert('success', 'Cadastro realizado!', 'Verifique seu email para confirmar sua conta.', false, 2500);

                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2500);
                }
            },
            error: function(xhr) {
                const res = xhr.responseJSON;
                showAlert('error', 'Erro no cadastro', res?.message || 'Não foi possível realizar o cadastro.');
            }
        });
    });
});
// --- Estilos personalizados para os SweetAlerts (iguais ao login)
const style = document.createElement('style');
style.textContent = `
    .swal-popup {
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        padding: 2rem;
        backdrop-filter: blur(10px);
        background: linear-gradient(135deg, rgba(60, 60, 60, 0.95), rgba(40, 40, 40, 0.98)) !important;
        border: 3px solid;
    }

    .swal-popup-success { border-color: #1ab617 !important; }
    .swal-popup-error { border-color: #d9534f !important; }
    .swal-popup-warning { border-color: #f0ad4e !important; }

    .swal-show-popup {
        animation: swal-scaleIn 0.3s ease-out;
    }

    .swal-hide-popup {
        animation: swal-scaleOut 0.2s ease-in;
    }

    @keyframes swal-scaleIn {
        0% { transform: scale(0.9); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }

    @keyframes swal-scaleOut {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(0.9); opacity: 0; }
    }

    .swal-title {
        color: white;
        font-weight: 700;
        font-size: 1.8rem;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        margin-bottom: 1rem;
    }

    .swal-html {
        color: rgba(255, 255, 255, 0.85);
        font-size: 1.05rem;
        line-height: 1.5;
    }

    .swal-image {
        margin: 0.5rem auto 1rem;
        border-radius: 50%;
        position: relative;
        z-index: 2;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        border: 4px solid rgba(255, 255, 255, 0.1);
    }

    .swal2-image-container {
        position: relative;
        margin: 1rem auto !important;
        padding: 0 !important;
        border-radius: 50% !important;
        overflow: visible !important;
    }

    .swal-image-blur {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 160px;
        height: 160px;
        border-radius: 50%;
        z-index: 1;
        filter: blur(15px);
        opacity: 0.3;
    }

    .swal-confirm-btn {
        background: linear-gradient(135deg, #1ab617, #1e871c);
        border: none;
        border-radius: 30px;
        padding: 12px 30px;
        font-weight: 600;
        font-size: 1rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        transition: all 0.3s;
        margin-top: 1rem;
    }

    .swal-confirm-btn:hover {
        background: linear-gradient(135deg, #1e871c, #1ab617);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    }

    .swal-cancel-btn {
        background: linear-gradient(135deg, #6c757d, #5a6268);
        border: none;
        border-radius: 30px;
        padding: 10px 25px;
        font-weight: 600;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        transition: all 0.3s;
    }

    .swal-cancel-btn:hover {
        background: linear-gradient(135deg, #5a6268, #6c757d);
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
    }

    #resendVerification {
        background: transparent;
        border: 2px solid #1ab617;
        color: #1ab617;
        border-radius: 30px;
        padding: 8px 20px;
        font-weight: 600;
        transition: all 0.3s;
        margin-top: 15px;
    }

    #resendVerification:hover {
        background: #1ab617;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(26, 182, 23, 0.3);
    }
`;
document.head.appendChild(style);

