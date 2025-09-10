$(document).ready(function() {
    // Configuração personalizada do SweetAlert2
    const swalCustom = Swal.mixin({
        background: 'rgb(45, 45, 45)',
        color: 'white',
        confirmButtonColor: '#1ab617',
        cancelButtonColor: '#6c757d',
        customClass: {
            confirmButton: 'swal-confirm-btn',
            cancelButton: 'swal-cancel-btn',
            title: 'swal-title',
            htmlContainer: 'swal-html',
            popup: 'swal-popup',
            image: 'swal-image',
            container: 'swal-container'
        },
        showClass: {
            popup: 'swal-show-popup'
        },
        hideClass: {
            popup: 'swal-hide-popup'
        }
    });

    // Imagens personalizadas para cada tipo de alerta
    const alertIcons = {
        success: './imagens/sucess.png',
        error: './imagens/error.png',
        warning: './imagens/warning.png'
    };

    // Cores das bordas para cada tipo de alerta
    const borderColors = {
        success: '#1ab617',
        error: '#d9534f',
        warning: '#f0ad4e'
    };

    function showAlert(type, title, text, showConfirm = true, timer = null) {
        // Criar uma nova instância com a classe personalizada para o tipo específico
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
            showClass: {
                popup: 'swal-show-popup'
            },
            hideClass: {
                popup: 'swal-hide-popup'
            }
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
                // Adicionar o efeito de blur atrás da imagem após o alerta abrir
                const imageContainer = document.querySelector('.swal2-image-container');
                if (imageContainer) {
                    // Criar elemento para o efeito de blur
                    const blurEffect = document.createElement('div');
                    blurEffect.className = 'swal-image-blur';
                    
                    // Definir a cor de fundo do blur com base no tipo
                    blurEffect.style.background = borderColors[type];
                    
                    // Adicionar o blur atrás da imagem
                    imageContainer.style.position = 'relative';
                    imageContainer.appendChild(blurEffect);
                }
            }
        });
    }

    // Adicionar estilos CSS personalizados para os alertas
    const style = document.createElement('style');
    style.textContent = `
        .swal-popup {
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            padding: 2rem;
            backdrop-filter: blur(10px);
            background: linear-gradient(135deg, rgba(60, 60, 60, 0.95), rgba(40, 40, 40, 0.98)) !important;
            border: 3px solid; /* Borda mais espessa para melhor visibilidade */
        }
        
        /* Classes específicas para cada tipo de alerta */
        .swal-popup-success {
            border-color: #1ab617 !important;
        }
        
        .swal-popup-error {
            border-color: #d9534f !important;
        }
        
        .swal-popup-warning {
            border-color: #f0ad4e !important;
        }
        
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
        
        /* Efeito de blur atrás da imagem */
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
        
        /* Estilo para o botão de reenvio de verificação */
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

    // Toggle password visibility
    $('.toggle-password').on('click', function() {
        const input = $('#password');
        const type = input.attr('type') === 'password' ? 'text' : 'password';
        input.attr('type', type);
        
        // Alterar o ícone do olho
        $(this).text(type === 'password' ? '👁️' : '🔒');
    });

    $('#loginForm').on('submit', function(e) {
        e.preventDefault();

        // Reset erros
        $('#emailError, #passwordError').addClass('d-none');
        $('#emailGroup, #passwordGroup').removeClass('error');

        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        let hasError = false;

        // Validação
        if (!email) {
            $('#emailError').removeClass('d-none');
            $('#emailGroup').addClass('error');
            hasError = true;
        }

        if (password.length < 8) {
            $('#passwordError').removeClass('d-none');
            $('#passwordGroup').addClass('error');
            hasError = true;
        }

        if (hasError) return;

        // AJAX login
        $.ajax({
            url: 'http://127.0.0.1:8000/api/login',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({ email, password }),
            success: function(response) {
                if (response.access_token) {
                    // 1. Salva os dados de autenticação ANTES de qualquer redirecionamento
                    const authData = {
                        token: response.access_token,
                        userId: response.user_id,
                        validoAte: response.valido_ate
                    };
                    sessionStorage.setItem('authData', JSON.stringify(authData));
                    
                    // 2. Mostra o alerta de sucesso
                    showAlert('success', 'Sucesso!', 'Login realizado com sucesso!', false, 2000);

                    // 3. Redireciona APÓS o alerta sumir
                    setTimeout(() => {
                        window.location.href = 'loading.html';
                    }, 2000);
                }
            },
            error: function(xhr) {
                const res = xhr.responseJSON;
                if (xhr.status === 403) {
                    // Alert personalizado para email não verificado
                    const alertInstance = Swal.mixin({
                        customClass: {
                            popup: 'swal-popup swal-popup-warning',
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
                        showClass: {
                            popup: 'swal-show-popup'
                        },
                        hideClass: {
                            popup: 'swal-hide-popup'
                        }
                    });
                    
                    alertInstance.fire({
                        title: 'Email não verificado',
                        html: 'Por favor, verifique seu email antes de entrar.<br><br>' +
                              '<button id="resendVerification" class="btn-resend">Reenviar email de verificação</button>',
                        imageUrl: alertIcons['warning'],
                        imageWidth: 80,
                        imageHeight: 80,
                        showConfirmButton: true,
                        confirmButtonText: 'Entendido',
                        showCancelButton: false,
                        didOpen: () => {
                            // Adicionar blur atrás da imagem
                            const imageContainer = document.querySelector('.swal2-image-container');
                            if (imageContainer) {
                                const blurEffect = document.createElement('div');
                                blurEffect.className = 'swal-image-blur';
                                blurEffect.style.background = borderColors['warning'];
                                imageContainer.style.position = 'relative';
                                imageContainer.appendChild(blurEffect);
                            }
                            
                            // Evento ao botão de reenviar verificação
                            document.getElementById('resendVerification').addEventListener('click', function() {
                                $.ajax({
                                    url: 'http://localhost:8000/api/resend-verification',
                                    method: 'POST',
                                    contentType: 'application/json',
                                    data: JSON.stringify({ email: email }),
                                    success: function() {
                                        showAlert('success', 'Email enviado!', 'Verifique sua caixa de entrada.', false, 2000);
                                    },
                                    error: function() {
                                        showAlert('error', 'Erro', 'Não foi possível reenviar o email de verificação.');
                                    }
                                });
                            });
                        }
                    });
                } else {
                    // Alert personalizado de erro genérico
                    showAlert('error', 'Erro no login', res?.message || 'Erro ao fazer login. Verifique suas credenciais.');
                }
            }
        });
    });
    // Controlar animações de transição entre páginas
document.addEventListener('DOMContentLoaded', function() {
  // Adicionar classe loaded ao body quando a página carregar
  document.body.classList.add('loaded');
  
  // Adicionar animação de entrada à página atual
  const isLoginPage = window.location.pathname.includes('login.html') || 
                     !window.location.pathname.includes('cadastro.html');
  
  if (isLoginPage) {
    document.querySelector('.login-container').classList.add('page-transition', 'slide-in-right');
  } else {
    document.querySelector('.login-container').classList.add('page-transition', 'slide-in-left');
  }
  
  // Interceptar cliques nos links de navegação
  document.querySelectorAll('a[href="login.html"], a[href="cadastro.html"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetHref = this.getAttribute('href');
      
      // Determinar direção da animação
      const isGoingToLogin = targetHref.includes('login.html');
      const animationOut = isGoingToLogin ? 'slide-out-right' : 'slide-out-left';
      const animationIn = isGoingToLogin ? 'slide-in-left' : 'slide-in-right';
      
      // Aplicar animação de saída
      document.querySelector('.login-container').classList.add(animationOut);
      document.querySelector('.login-container').classList.remove('slide-in-right', 'slide-in-left');
      
      // Aguardar animação de saída terminar antes de navegar
      setTimeout(() => {
        window.location.href = targetHref;
      }, 500);
    });
  });
});
});