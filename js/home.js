$(document).ready(function() {
      function showAlert(type, title, message) {
        console.error(`Alerta: ${title} - ${message}`);
      }
      
      // Pega os dados do usuário do sessionStorage
      const authDataString = sessionStorage.getItem('authData');
      
      // Se o item não existir, redireciona para a página de login
      if (!authDataString) {
        window.location.href = 'login.html';
        return;
      }

      try {
        const authData = JSON.parse(authDataString);

        // Se o token não existir, redireciona para o login
        if (!authData.token) {
          window.location.href = 'login.html';
          return;
        }

        // Faz a chamada à API para obter os dados do usuário
        $.ajax({
          url: "http://127.0.0.1:8000/api/freelancer/dados",
          type: "GET",
          headers: {
            "Authorization": "Bearer " + authData.token
          },
          success: function (response) {
            if (response.success) {
              const u = response.usuario;
              
              // Preenche o nome do usuário no elemento span
              $('#userName').text(u.name || 'Usuário');

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

      } catch (e) {
        // Se houver um erro ao processar os dados, redireciona para o login
        console.error('Erro ao processar dados de autenticação:', e);
        window.location.href = 'login.html';
      }
    });