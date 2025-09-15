const btn = document.getElementById('darkToggle'); //Procura o ID 'darkToggle'
const body = document.body; //Seleciona o elemento body
const cards = document.querySelectorAll('.crud-card');

function updateIcon() { //Função para dar update no icone
    const current = body.getAttribute('data-bs-theme'); //Seleciona o atributo dentro do data-bs-theme
    btn.textContent = current === 'dark' ? '☀️' : '🌙'; //Define qual será o icone dependendo do atributo dentro do data-bs-theme
}
function showCard(id){
    cards.forEach(c => c.classList.add('d-none'));
    if (id){
        document.getElementById(id).classList.remove('d-none');
        document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
document.getElementById('menuHome').addEventListener('click', e => { e.preventDefault(); showCard(null); });
document.getElementById('menuCreate').addEventListener('click', e => { e.preventDefault(); showCard('cardCreate'); });
document.getElementById('menuRead').addEventListener('click', e => { e.preventDefault(); showCard('cardRead'); });
document.getElementById('menuUpdate').addEventListener('click', e => { e.preventDefault(); showCard('cardUpdate'); });
document.getElementById('menuDelete').addEventListener('click', e => { e.preventDefault(); showCard('cardRemove'); });
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
