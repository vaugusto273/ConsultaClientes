///Variables
const darkTogglebtn = document.getElementById('darkToggle'); //Procura o ID 'darkToggle'
const body = document.body; //Seleciona o elemento body
const cards = document.querySelectorAll('.crud-card');
const saved = localStorage.getItem('theme');
const crudBtn = document.querySelectorAll('.crud-btn')
const createform = document.querySelectorAll('.form-create');
const readform = document.querySelectorAll('.form-read');
const updateform = document.querySelectorAll('.form-update');
const removeform = document.querySelectorAll('.form-remove');
const generalform = document.querySelectorAll('.form-control');

//Functions
function updateIcon() { //Função para dar update no icone
    const current = body.getAttribute('data-bs-theme'); //Seleciona o atributo dentro do data-bs-theme
    darkTogglebtn.textContent = current === 'dark' ? '☀️' : '🌙'; //Define qual será o icone dependendo do atributo dentro do data-bs-theme
}
function showCard(id){
    cards.forEach(c => c.classList.add('d-none'));
    if (id){
        document.getElementById(id).classList.remove('d-none');
        document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
// EventListener
document.getElementById('menuHome').addEventListener('click', e => { 
    e.preventDefault(); 
    showCard(null); 
    generalform.forEach(input => {
        const campo = document.getElementById(input.id); 
        campo.value = "";
        campo.classList.remove('is-valid'); 
        campo.classList.remove('is-invalid');
    })
});

document.getElementById('menuCreate').addEventListener('click', e => {
    e.preventDefault(); 
    showCard('cardCreate');
    //Clean inputs
    generalform.forEach(input => {
        const campo = document.getElementById(input.id);
        campo.value = "";
        campo.classList.remove('is-valid'); 
        campo.classList.remove('is-invalid');
    })
});

document.getElementById('menuRead').addEventListener('click', e => { 
    e.preventDefault(); 
    showCard('cardRead');
    generalform.forEach(input => {
        const campo = document.getElementById(input.id);
        campo.value = "";
        campo.classList.remove('is-valid'); 
        campo.classList.remove('is-invalid');
    })
});

document.getElementById('menuUpdate').addEventListener('click', e => { 
    e.preventDefault(); 
    showCard('cardUpdate');
    generalform.forEach(input => {
        const campo = document.getElementById(input.id);
        campo.value = "";
        campo.classList.remove('is-valid'); 
        campo.classList.remove('is-invalid');
    })
});

document.getElementById('menuDelete').addEventListener('click', e => { 
    e.preventDefault(); 
    showCard('cardRemove');
    generalform.forEach(input => {
        const campo = document.getElementById(input.id);
        campo.value = "";
        campo.classList.remove('is-valid'); 
        campo.classList.remove('is-invalid');
    })
});

darkTogglebtn.addEventListener('click', () => {
    const current = body.getAttribute('data-bs-theme'); //Seleciona o atributo dentro do data-bs-theme
    body.setAttribute('data-bs-theme', current === 'dark' ? 'light' : 'dark'); //Configura o atributo, utilizando um if, se current tiver o valor de dark dentro, então ele vai mudar para light, caso não, ou seja caso seja diferente de dark, ele muda o valor para dark
    updateIcon();
    localStorage.setItem('theme', body.getAttribute('data-bs-theme')); //Salva no cache
});
//Tratamento do formulario v2
crudBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        let c = 0;
        switch (btn.id){
            case 'btn-create':
                createform.forEach(input =>{
                    const campo = document.getElementById(input.id);
                    if (!input.checkValidity()){
                        campo.classList.remove('is-valid');
                        campo.classList.add('is-invalid');
                    }else{
                        campo.classList.remove('is-invalid');
                        campo.classList.add('is-valid');
                    }
                })
                break;
            case 'btn-read':
                c = 0
                readform.forEach(input =>{
                    const campo = document.getElementById(input.id);
                    if (!input.checkValidity()){
                        c++;
                        if (c == 4){
                            readform.forEach(input =>{
                                const campo = document.getElementById(input.id);
                                campo.classList.remove('is-valid');
                                campo.classList.add('is-invalid');
                            })
                        }else{
                            campo.classList.add('is-valid');
                            campo.classList.remove('is-invalid');
                        }
                    }else{
                        campo.classList.remove('is-invalid');
                        campo.classList.add('is-valid');
                    }
                })
                break;
            case 'btn-update':
                updateform.forEach(input =>{
                    const campo = document.getElementById(input.id);
                    if (!input.checkValidity()){
                        campo.classList.remove('is-valid')
                        campo.classList.add('is-invalid')
                    }else{
                        campo.classList.remove('is-invalid')
                        campo.classList.add('is-valid')
                    }
                })
                break;
            case 'btn-remove':
                c = 0;
                removeform.forEach(input =>{
                    const campo = document.getElementById(input.id);
                    if (!input.checkValidity()){
                        c++
                        if (c == 4){
                            removeform.forEach(input =>{
                                const campo = document.getElementById(input.id);
                                campo.classList.remove('is-valid');
                                campo.classList.add('is-invalid');
                            })
                        }else{
                            campo.classList.add('is-valid');
                            campo.classList.remove('is-invalid');
                        }
                    }else{
                        campo.classList.remove('is-invalid');
                        campo.classList.add('is-valid');
                    }
                })
                break;
            default:
                console.log('something gone wrong!');
                break;
        }
    })
})
// Extras
if (saved) body.setAttribute('data-bs-theme', saved);
updateIcon();
