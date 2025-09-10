$(document).ready(function () {
    // --- Configuração dos SweetAlerts
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

    // --- Verifica a autenticação e busca os dados
    const authDataString = sessionStorage.getItem('authData');
    if (!authDataString) {
        showAlert('error', 'Sessão Expirada', 'Você precisa fazer login novamente.');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    const authData = JSON.parse(authDataString);

    // --- Preencher dados da empresa
    $.ajax({
        url: "http://127.0.0.1:8000/api/empresa/dados",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + authData.token
        },
        success: function (res) {
            if (res.success) {
                const e = res.empresa;
                const u = res.usuario;

                // Preenche os campos do formulário
                $("input[name='email']").val(u.email || '');
                $("input[name='name']").val(u.name || '');
            }
        },
        error: function () {
            showAlert('error', 'Erro', 'Não foi possível carregar os dados da empresa.');
        }
    });

    // --- Máscaras
    $("input[placeholder='Telefone']").mask("(00) 00000-0000");
    $("input[placeholder='CEP']").mask("00000-000");
    $("input[placeholder='CNPJ OU CP']").mask("00.000.000/0000-00", { reverse: true });
    
    // --- CEP automático
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

    // --- Preview da foto e remoção
    const fileInput = $("#file");
    const removeButton = $("#remove-file");
    removeButton.hide();

    fileInput.on('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $("#file-preview").remove();
                $("<img>", {
                    id: "file-preview",
                    src: e.target.result,
                    css: { width: '100px', marginTop: '10px', borderRadius: '8px' }
                }).insertAfter(fileInput);
                removeButton.show();
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    removeButton.on('click', function(){
        fileInput.val('');
        $("#file-preview").remove();
        $(this).hide();
    });

    // --- Envio do formulário via AJAX
       $("#form-empresa").on("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append('user_type', 'empresa');

        $.ajax({
            url: "http://127.0.0.1:8000/api/empresa/cadastrar",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            headers: { "Authorization": "Bearer " + authData.token },
            success: function (response) {
                if (response.success) {
                    showAlert('success', 'Sucesso!', 'Cadastro finalizado com sucesso!', true, 2000);
                    setTimeout(() => window.location.href = 'swap.html', 2000);
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
});
