$("#logoutBtn").on("click", function (e) {
    e.preventDefault();

    apiRequest('http://127.0.0.1:8000/api/logout', 'POST')
        .done(function(response) {
            // Remove token do storage
            sessionStorage.removeItem('jwt');

            // Redireciona para loading.html
            window.location.href = 'loading.html';
        })
        .fail(function() {
            sessionStorage.removeItem('jwt');
            window.location.href = 'loading.html';
        });
});