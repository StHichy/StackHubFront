$(document).ready(function () {
      $('#loginForm').on('submit', function (e) {
        e.preventDefault();

        // Limpa mensagens anteriores
        $('#emailGroup, #passwordGroup').removeClass('error');
        $('#emailError, #passwordError, #successMessage').hide();

        const email = $('#email').val().trim();
        const password = $('#password').val().trim();

        let hasError = false;

        if (!email) {
          $('#emailGroup').addClass('error');
          $('#emailError').show();
          hasError = true;
        }

        if (!password || password.length < 8) {
          $('#passwordGroup').addClass('error');
          $('#passwordError').show();
          hasError = true;
        }

        if (hasError) return;

        $.ajax({
          url: 'http://localhost:8000/api/login',
          method: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify({ email, password }),
          success: function (response) {
            if (response.acess_token) {
              $('#successMessage').show();

              localStorage.setItem('jwt', response.access_token);

              setTimeout(() => {
                window.location.href = '/tabela.html';
              }, 1500);
            } else {
              Swal.fire('Erro', 'Resposta inesperada da API.', 'error');
            }
          },
          error: function (xhr) {
            const res = xhr.responseJSON;
            Swal.fire('Erro', res?.message || 'Erro ao fazer login. Verifique as credenciais.', 'error');
          }
        });
      });

      $('.toggle-password').on('click', function () {
        const passwordField = $('#password');
        const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
        passwordField.attr('type', type);
        $(this).text(type === 'password' ? '👁️' : '🙈');
      });
    });