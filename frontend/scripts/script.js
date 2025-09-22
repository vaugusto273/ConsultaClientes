///Variables
const darkTogglebtn = document.getElementById("darkToggle");
const body = document.body;
const cards = document.querySelectorAll(".crud-card");
const saved = localStorage.getItem("theme");
const crudBtn = document.querySelectorAll(".crud-btn");
const createform = document.querySelectorAll(".form-create");
const readform = document.querySelectorAll(".form-read");
const updateform = document.querySelectorAll(".form-update");
const removeform = document.querySelectorAll(".form-remove");
const generalform = document.querySelectorAll(".form-control");
const API_BASE = "http://localhost:8080";
const container = document.getElementById("output-table");
const v = (id) => (document.getElementById(id)?.value || '').trim();
let lastID;
const LIMIT = 10;

//Functions
function updateIcon() {
	//Função para dar update no icone
	const current = body.getAttribute("data-bs-theme"); //Seleciona o atributo dentro do data-bs-theme
	darkTogglebtn.textContent = current === "dark" ? "☀️" : "🌙"; //Define qual será o icone dependendo do atributo dentro do data-bs-theme
}
function showCard(id) {
	//Função para mostrar um dos cards, CREATE, READ, UPDATE e REMOVE
	cards.forEach((c) => c.classList.add("d-none"));
	if (id) {
		document.getElementById(id).classList.remove("d-none");
		document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start" });
	}
}
async function submitForm(json) {
	//Função para fazer a conexão com o backend (Criar, Buscar/Ler, Atualizar e Deletar dados)
	switch (json.method) {
		case "GET":
			try {
				const currentPage = Number(json.page || container.dataset.page || 1);
				//Caso qualquer uma das caracteristicas seja null, undefined ou similar, faz com que vire uma string vazia
				json.page = json.page ?? "";
				json.id = json.id ?? "";
				json.name = json.name ?? "";
				json.email = json.email ?? "";
				json.phone = json.phone ?? "";
				json.birthdate = json.birthdate ?? "";
				//Configurar a resposta
				const res = await fetch(
					`${API_BASE}/api/clients.php?page=${json.page}&id=${json.id}&name=${json.name}&email=${json.email}&phone=${json.phone}&birthdate=${json.birthdate}`
				);
				// Dados recebidos dependendo dos parâmetros
				const { data } = await res.json();
				//Configuração da tabela
				container.innerHTML = "";
				container.dataset.page = String(currentPage);
				//Cabeçalho da tabela
				let table = `
                    <table class='table'>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Birth date</th>
                            <th>Actions</th>
                        </tr>`;
				//Mostra no HTML cada um dos resultados condizentes a pesquisa
				data.forEach((c) => {
					table += `
                    <tr>
                        <td>${c.id}</td>
                        <td>${c.name}</td>
                        <td>${c.email}</td>
                        <td>${c.phone}</td>
                        <td>${c.birthdate}</td>
                        <td>
                            <button class="btn btn-outline-primary goUpdate" value="${c.id}">Update</button>
                            <button class="btn btn-outline-danger goRemove" value="${c.id}">Delete</button>
                        </td>
                    </tr>
                    `;
				});
				table += `
                </table>
                <div id="pager" class="d-flex gap-2 align-items-center mt-3">
					<button id="btnPrev" class="btn btn-outline-secondary btn-sm">« Anterior</button>
					<span id="pageInfo" class="small"></span>
					<button id="btnNext" class="btn btn-outline-secondary btn-sm">Próxima »</button>
				</div>`;
				container.innerHTML = table;

				const btnPrev = document.getElementById('btnPrev');
				const btnNext = document.getElementById('btnNext');

				 // Prev desabilita na página 1
				btnPrev.disabled = currentPage === 1;
				// Next desabilita se voltou menos que o LIMIT (provável última página)
				btnNext.disabled = data.length < LIMIT;

				btnPrev.onclick = function (e) {
					e.preventDefault();
					if (currentPage > 1) {
						submitForm({
						method: "GET",
						page: currentPage - 1,
						name: json.name,
						email: json.email,
						phone: json.phone,
						birthdate: json.birthdate
						});
					}
					};

				btnNext.onclick = function (e) {
					e.preventDefault();
					if (data.length === LIMIT) {
						submitForm({
						method: "GET",
						page: currentPage + 1,
						name: json.name,
						email: json.email,
						phone: json.phone,
						birthdate: json.birthdate
						});
					}
					};

				container.addEventListener("click", async (e) => {
					if (e.target.classList.contains("goUpdate")) {
						const Updateid = e.target.value;
						showCard("cardUpdate");
						try {
							lastID = Updateid;
							const res = await fetch(`${API_BASE}/api/clients.php?id=${Updateid}`);
							const { data } = await res.json();

							if (data.length === 0) {
								alert("Cliente não encontrado");
								return;
							}
							const cliente = data[0];
							document.getElementById("name-update").value = cliente.name;
							document.getElementById("mail-update").value = cliente.email;
							document.getElementById("tel-update").value = cliente.phone;
							document.getElementById("ddn-update").value = cliente.birthdate;
						} catch (err) {
							console.error(err);
							alert("Erro ao buscar cliente para update");
						}
					}
					if (e.target.classList.contains("goRemove")) {
						const Removeid = e.target.value;
						showCard("cardRemove");
						try {
							lastID = Removeid;
							const res = await fetch(`${API_BASE}/api/clients.php?id=${Removeid}`);
							const { data } = await res.json();

							if (data.length === 0) {
								alert("Cliente não encontrado");
								return;
							}
							const cliente = data[0];
							document.getElementById("name-remove").value = cliente.name;
							document.getElementById("mail-remove").value = cliente.email;
							document.getElementById("tel-remove").value = cliente.phone;
							document.getElementById("ddn-remove").value = cliente.birthdate;
						} catch (err) {
							console.error(err);
							alert("Erro ao buscar cliente para update");
						}
						

					}
				});
			} catch (err) {
				//Tratamento de erro
				console.error(err);
				alert("Falha ao listar: " + err.message);
			}
			break;
		case "POST":
			try {
				const fd = new FormData();
				if (!json.name?.trim() || !json.email?.trim() || !json.phone?.trim() || !json.birthdate?.trim()) {
					throw new Error("Todos os campos são obrigatórios!");
				}
				fd.set("name", json.name);
				fd.set("email", json.email);
				fd.set("phone", json.phone);
				fd.set("birthdate", json.birthdate);
				const res = await fetch(`${API_BASE}/api/clients.php`, {
					method: "POST",
					body: fd,
				});

				const data = await res.json();

				if (!res.ok) {
					const msg = data?.errors ? JSON.stringify(data.errors) : data?.error || "Erro no POST";
					throw new Error(msg);
				}

				alert("Cliente criado! ID: " + data.id);
				clearUI();
				submitForm({ method: "GET", id: data.id });
			} catch (err) {
				console.error(err);
				alert("Falha ao criar: " + err.message);
			}
			break;
		case "PUT": {
			try {
				const id = json.id ?? lastID;
				if (!id) {
					throw new Error("Informe o ID para atualizar.");
				}
				if (!json.name?.trim() || !json.email?.trim() || !json.phone?.trim() || !json.birthdate?.trim()) {
					throw new Error("Todos os campos são obrigatórios!");
				}

				// monta URL COM o id na query string
				const url = new URL(`${API_BASE}/api/clients.php`);
				url.searchParams.set("id", id);

				const payload = {
					name: json.name,
					email: json.email,
					phone: json.phone,
					birthdate: json.birthdate,
				};

				const res = await fetch(url.toString(), {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});

				const data = await res.json();

				if (!res.ok) {
					const msg = data?.errors ? JSON.stringify(data.errors) : data?.error || "Erro no PUT";
					throw new Error(msg);
				}
				const updatedId = data.updated_id ?? id;
				alert("Cliente atualizado! ID: " + updatedId);

				// recarrega listagem focando no ID atualizado (usa updated_id!)
				submitForm({ method: "GET", id: String(updatedId) });
			} catch (err) {
				console.error(err);
				alert("Falha ao editar: " + err.message);
			}
			break;
		}
		case "DELETE":
			try {
				const id = json.id ?? lastID ?? v("id-delete");
				if (!id) throw new Error("Informe o ID para excluir.");

				if (!confirm(`Excluir cliente #${id}?`)) return;

				const url = new URL(`${API_BASE}/api/clients.php`);
				url.searchParams.set("id", id);

				const res = await fetch(url.toString(), { method: "DELETE" });
				const data = await res.json();

				if (!res.ok) throw new Error(data?.error || "Erro no DELETE");

				submitForm({ method: "GET" });

				alert("Cliente removido! ID: " + (data.deleted_id ?? id));
			} catch (err) {
				console.error(err);
				alert("Falha ao remover: " + err.message);
			}
			break;
		default:
			console.warn("Método não suportado:", json.method);
	}
}
//Função para marcar se é valido
function markValidity(inputEl, ok) {
	const campo = document.getElementById(inputEl.id);
	campo.classList.toggle("is-valid", ok);
	campo.classList.toggle("is-invalid", !ok);
}
//Returna verdadeiro se for vazio
function allEmpty(nodeList) {
	return Array.from(nodeList).every((inp) => inp.value.trim() === "");
}
//Utilizado quando o valor não precisa ser validado
function setNeutral(el) {
	el.classList.remove("is-valid", "is-invalid");
}
//Utilizado para configurar que um campo é válido
function setValid(el) {
	el.classList.add("is-valid");
	el.classList.remove("is-invalid");
}
//Utilizado para configurar que um campo é inválido
function setInvalid(el) {
	el.classList.add("is-invalid");
	el.classList.remove("is-valid");
}
//Utilizado para validação “opcional”: vazio = neutro (true), preenchido = checa validade 
function validateOptional(inputEl) {
	const el = document.getElementById(inputEl.id);
	const val = inputEl.value.trim();
	if (val === "") {
		setNeutral(el);
		return true;
	} //Neutro
	if (inputEl.checkValidity()) {
		setValid(el);
		return true;
	}
	setInvalid(el);
	return false;
}

//Utilizado para validação “obrigatória”: vazio é inválido 
function validateRequired(inputEl) {
	const el = document.getElementById(inputEl.id);
	const ok = inputEl.value.trim() !== "" && inputEl.checkValidity();
	if (ok) setValid(el);
	else setInvalid(el);
	return ok;
}
//Utilizado para limpar a interface de usuario ao trocar de aba
function clearUI() {
	generalform.forEach((input) => {
		const el = document.getElementById(input.id);
		if (!el) return;
		el.value = "";
		setNeutral(el);
	});
	container.innerHTML = "";
}
//Faz uma pesquisa e mostra a tabela
function showTable(crud_method) {
    crud_method = crud_method.toLowerCase();
	let ok = true;
	readform.forEach((input) => {
		if (!validateOptional(input)) ok = false;
	});
	if (!ok) return;

	const payload = { method: "GET" };
	if (v(`name-${crud_method}`)) payload.name = v(`name-${crud_method}`);
	if (v(`mail-${crud_method}`)) payload.email = v(`mail-${crud_method}`);
	if (v(`tel-${crud_method}`)) payload.phone = v(`tel-${crud_method}`);
	if (v(`ddn-${crud_method}`)) payload.birthdate = v(`ddn-${crud_method}`);

	submitForm(payload);
}

// EventListener - Limpeza da UI
document.getElementById("menuHome").addEventListener("click", (e) => {
	e.preventDefault();
	showCard(null);
	clearUI();
});

document.getElementById("menuCreate").addEventListener("click", (e) => {
	e.preventDefault();
	showCard("cardCreate");
	clearUI();
});

document.getElementById("menuRead").addEventListener("click", (e) => {
	e.preventDefault();
	showCard("cardRead");
	clearUI();
});

darkTogglebtn.addEventListener("click", () => {
	const current = body.getAttribute("data-bs-theme"); //Seleciona o atributo dentro do data-bs-theme
	body.setAttribute("data-bs-theme", current === "dark" ? "light" : "dark"); //Configura o atributo, utilizando um if, se current tiver o valor de dark dentro, então ele vai mudar para light, caso não, ou seja caso seja diferente de dark, ele muda o valor para dark
	updateIcon();
	localStorage.setItem("theme", body.getAttribute("data-bs-theme")); //Salva no cache
});
//Tratamento do formulario v2
crudBtn.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		e.preventDefault();

		switch (btn.id) {
			case "btn-create": {
				let ok = true;
				createform.forEach((input) => {
					if (!validateRequired(input)) ok = false;
				});
				if (!ok) return;

				const payload = {
					method: "POST",
					name: v("name-create"),
					email: v("mail-create"),
					phone: v("tel-create"),
					birthdate: v("ddn-create"),
				};
				submitForm(payload);
				break;
			}

			// READ = vazio -> neutro e lista tudo; preenchido inválido -> marca e não chama
			case "btn-read": {
				showTable("read");
				break;
			}
			// UPDATE = mesmo comportamento do READ no front (opcional)
			// Obs: seu backend PUT normalmente precisa de ?id=...; se você tiver um input de id, inclua aqui.
			case "btn-update": {
				let ok = true;
				updateform.forEach((input) => {
					if (!validateOptional(input)) ok = false;
				});
				if (!ok) return;

				const payload = {
					method: "PUT",
					name: v("name-update"),
					email: v("mail-update"),
					phone: v("tel-update"),
					birthdate: v("ddn-update"),
				};

				submitForm(payload);
                clearUI()
				break;
			}
			case "btn-remove": {
				let ok = true;
				removeform.forEach((input) => {
					if (!validateOptional(input)) ok = false;
				});
				if (!ok) return;

                const payload = {
					method: "DELETE",
					name: v("name-remove"),
					email: v("mail-remove"),
					phone: v("tel-remove"),
					birthdate: v("ddn-remove"),
				};

				submitForm(payload);
                clearUI()
				break;
			}

			default:
				console.log("something gone wrong!");
				break;
		}
	});
});


// Extras
if (saved) body.setAttribute("data-bs-theme", saved);
updateIcon();
