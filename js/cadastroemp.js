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
        const selectArea = document.querySelector('select[name="area_de_atuacao"]');
        const areaOutrosContainer = document.getElementById("area-outros-container");

        selectArea.addEventListener("change", function () {
            if (this.value === "Outros") {
                areaOutrosContainer.style.display = "block";
            } else {
                areaOutrosContainer.style.display = "none";
            }
        });

    // --- Envio do formulário via AJAX
    $("#form-empresa").on("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append('user_type', 'empresa');

        // Verifica se há um arquivo de imagem selecionado
        const fileInput = $("input[name='foto']")[0]; // Nome deve ser 'foto' para match com o Laravel
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            
            // Validação do tipo de arquivo
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                showAlert('warning', 'Formato inválido', 'Por favor, selecione uma imagem JPEG, PNG, GIF ou WebP.');
                return;
            }
            
            // Validação do tamanho do arquivo (5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                showAlert('warning', 'Arquivo muito grande', 'A imagem deve ter no máximo 5MB.');
                return;
            }
        }

        // Sua lógica existente para "Outros"
        const areaSelecionada = $("select[name='area_de_atuacao']").val();
        if (areaSelecionada === "Outros") {
            const personalizada = $("input[name='area_personalizada']").val().trim();
            if (!personalizada) {
                showAlert('warning', 'Campo obrigatório', 'Por favor, preencha sua área de atuação personalizada.');
                return;
            }
            formData.set('area_de_atuacao', personalizada);
        }

        // Feedback visual de carregamento
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Enviando...');

        $.ajax({
            url: "http://127.0.0.1:8000/api/empresa/cadastrar",
            type: "POST",
            data: formData,
            contentType: false, // IMPORTANTE para FormData
            processData: false, // IMPORTANTE para FormData
            headers: { 
                "Authorization": "Bearer " + authData.token,
                "X-Requested-With": "XMLHttpRequest"
            },
            success: function (response) {
                if (response.success) {
                    showAlert('success', 'Sucesso!', 'Cadastro finalizado com sucesso!', true, 2000);
                    
                    // Agora você tem a URL da imagem na resposta
                    if (response.imagem_url) {
                        console.log('Imagem salva em:', response.imagem_url);
                        // Você pode usar a URL da imagem aqui
                    }
                    
                    setTimeout(() => window.location.href = 'swap.html', 2000);
                } else {
                    showAlert('error', 'Erro', response.message);
                }
            },
            error: function (xhr) {
                console.error('Erro completo:', xhr);
                let errorMsg = 'Ocorreu um erro ao finalizar o cadastro!';
                
                // Tratamento de erros mais específico
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMsg = xhr.responseJSON.message;
                } else if (xhr.status === 413) {
                    errorMsg = 'Arquivo muito grande! O tamanho máximo é 5MB.';
                } else if (xhr.status === 415) {
                    errorMsg = 'Tipo de arquivo não suportado!';
                } else if (xhr.status === 404) {
                    errorMsg = 'Usuário não encontrado. Faça login novamente.';
                }
                
                showAlert('error', 'Erro', errorMsg);
            },
            complete: function() {
                submitBtn.prop('disabled', false).text(originalText);
            }
        });
    });



    $("input[name='telefone']").mask("(00) 00000-0000");
    $("input[name='cep']").mask("00000-000");
    const cpfCnpjField = $("input[name='cpf_cnpj']");

    $("input[name='cpf_cnpj']").mask("000.000.000-00", { reverse: true });
    $("#cpf_cnpj").keypress(function() {
        if($(this).val().length == 14) {
            $(this).mask("00.000.000/0000-00", {reverse: true});
        }
    });

// Validação de CPF ou CNPJ no blur (ao sair do campo)
cpfCnpjField.on("blur", function () {
    const valor = $(this).val().replace(/\D/g, '');

    if (valor.length === 11) {
        if (!validarCPF(valor)) {
            showAlert('warning', 'CPF inválido', 'Digite um CPF válido.');
            $(this).val('');
        }
    } else if (valor.length === 14) {
        if (!validarCNPJ(valor)) {
            showAlert('warning', 'CNPJ inválido', 'Digite um CNPJ válido.');
            $(this).val('');
        }
    } else if (valor.length > 0) {
        showAlert('warning', 'CPF/CNPJ inválido', 'O número digitado está incompleto.');
        $(this).val('');
    }
});
});

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


