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
