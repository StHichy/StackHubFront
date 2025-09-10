$(document).ready(function () {
    // --- Configuração dos SweetAlerts (igual ao seu JS)
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
        showClass: { popup: 'swal-show-popup' },
        hideClass: { popup: 'swal-hide-popup' }
    });

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

    function showAlert(type, title, text, showConfirm = true, timer = null) {
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

    const authDataString = sessionStorage.getItem('authData');
    if (!authDataString) {
        showAlert('error', 'Sessão Expirada', 'Você precisa fazer login novamente.');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    const authData = JSON.parse(authDataString);

    $.ajax({
        // URL da API para buscar os dados
        url: "http://127.0.0.1:8000/api/freelancer/dados",
        type: "GET",
        headers: {
            // Envia o token para a API
            "Authorization": "Bearer " + authData.token
        },
        success: function (response) {
            if (response.success) {
                // Acessa o objeto de usuário diretamente da resposta
                const u = response.usuario;

                // Preenche os campos de email e nome com os dados da tabela 'users'
                $("input[name='email']").val(u.email || '');
                $("input[name='apelido']").val(u.name || '');
                
                // Exibe uma mensagem para o console, se precisar
                console.log('Informações do usuário carregadas. Pronto para novo cadastro.');
            } else {
                showAlert('error', 'Erro', response.message);
            }
        },
        error: function (xhr) {
            console.error("Erro ao carregar dados:", xhr.responseText);
            showAlert('error', 'Erro', 'Não foi possível carregar os dados do usuário.');
        }
    });

    $("#form-freelancer").on("submit", function (e) {
        e.preventDefault();
        let formData = new FormData(this);

        formData.append('user_type', 'desenvolvedor');

        const authDataString = sessionStorage.getItem('authData');
        if (!authDataString) {
            showAlert('error', 'Sessão Expirada', 'Você precisa fazer login novamente.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }
        const authData = JSON.parse(authDataString);

        $.ajax({
            url: "http://127.0.0.1:8000/api/freelancer/cadastrar",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            headers: {
                "Authorization": "Bearer " + authData.token
            },
            success: function (response) {
                if (response.success) {
                    showAlert('success', 'Sucesso!', 'Cadastro finalizado com sucesso!', true, 2000);
                    setTimeout(() => {
                        window.location.href = 'swap.html';
                    }, 2000);
                } else {
                    showAlert('error', 'Erro', response.message);
                }
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                showAlert('error', 'Erro', 'Ocorreu um erro ao finalizar o cadastro!');
            }
        });
    });
        $("input[placeholder='CEP']").on("blur", function() {
        const cep = $(this).val().replace(/\D/g,'');
        if (cep.length === 8) {
            $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function(data) {
                if (!data.erro) {
                    $("input[placeholder='Estado']").val(data.uf || '');
                    $("input[placeholder='Cidade']").val(data.localidade || '');
                    $("input[placeholder='Bairro']").val(data.bairro || '');
                    $("input[placeholder='Rua']").val(data.logradouro || '');
                } else {
                    showAlert('error', 'CEP não encontrado', 'Verifique o CEP digitado.');
                }
            }).fail(function(){
                showAlert('error', 'Erro', 'Não foi possível consultar o CEP.');
            });
        } else if (cep.length > 0) {
            showAlert('error', 'CEP inválido', 'O CEP deve conter 8 números.');
        }
    });

    $("input[name='telefone']").mask("(00) 00000-0000");
    $("input[name='cpf_cnpj']").mask("000.000.000-00", { reverse: true });
    $("input[name='cep']").mask("00000-000");
});
