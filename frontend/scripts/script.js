const btn = document.getElementById('darkToggle'); //Procura o ID 'darkToggle'
const body = document.body; //Seleciona o elemento body

    function updateIcon() { //Função para dar update no icone
        const current = body.getAttribute('data-bs-theme'); //Seleciona o atributo dentro do data-bs-theme
        btn.textContent = current === 'dark' ? '☀️' : '🌙'; //Define qual será o icone dependendo do atributo dentro do data-bs-theme
    }

    btn.addEventListener('click', () => {
        const current = body.getAttribute('data-bs-theme'); //Seleciona o atributo dentro do data-bs-theme
        body.setAttribute('data-bs-theme', current === 'dark' ? 'light' : 'dark'); //Configura o atributo, utilizando um if, se current tiver o valor de dark dentro, então ele vai mudar para light, caso não, ou seja caso seja diferente de dark, ele muda o valor para dark
        updateIcon();
        localStorage.setItem('theme', body.getAttribute('data-bs-theme')); //Salva no cache
    });

    // ao recarregar o site, pega o dado no cache
    const saved = localStorage.getItem('theme');
    if (saved) body.setAttribute('data-bs-theme', saved);
    updateIcon();