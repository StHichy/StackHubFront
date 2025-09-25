
$(document).ready(function() {
    // Primeiro tenta obter o authData do sessionStorage
    const authDataString = sessionStorage.getItem('authData');

    if (authDataString) {
        // SessionStorage contém os dados, tudo certo
        return;
    }

    // Caso contrário, tenta recuperar dos cookies
    const token = getCookie('token');
    const userId = getCookie('user_id');
    const validoAte = getCookie('valido_ate');

    if (!token || !userId || !validoAte) {
        // Se qualquer dado estiver ausente, redireciona
        window.location.href = 'login.html';
    } else {
        // Se quiser restaurar o sessionStorage a partir dos cookies
        const authData = {
            token: token,
            userId: userId,
            validoAte: validoAte
        };
        sessionStorage.setItem('authData', JSON.stringify(authData));
    }
});

// Sua função getCookie
function getCookie(nome) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const c = cookies[i].trim();
        if (c.indexOf(nome + "=") === 0) {
            return c.substring((nome + "=").length, c.length);
        }
    }
    return null;
}