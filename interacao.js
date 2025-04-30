<script>
document.addEventListener("DOMContentLoaded", () => {
    const buttonContainer = document.getElementById("buttonContainer");
    const dynamicTable = document.getElementById("dynamicTable").querySelector("tbody");
    const openAddButtonModal = document.getElementById("openAddButtonModal");
    const addButtonModal = new bootstrap.Modal(document.getElementById("addButtonModal"));
    const buttonNameInput = document.getElementById("buttonNameInput");
    const buttonLinkInput = document.getElementById("buttonLinkInput");
    const saveButton = document.getElementById("saveButton");
    const exportXLSXButton = document.getElementById("exportXLSX");
    const importXLSXInput = document.getElementById("importXLSX");

    function createButton(name, link) {
        const newButton = document.createElement("button");
        newButton.className = "btn btn-success me-2 mb-2";
        newButton.textContent = name;
        newButton.onclick = () => navigator.clipboard.writeText(name);
        buttonContainer.appendChild(newButton);
        addRowToTable(name, link);
    }

    function addRowToTable(name, link) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${name}</td>
            <td><a href="${link}" target="_blank">${link}</a></td>
            <td><button class="btn btn-danger btn-sm">Excluir</button></td>
        `;
        row.querySelector("button").addEventListener("click", () => {
            row.remove();
            removeButtonFromJumbotron(name);
        });
        dynamicTable.appendChild(row);
    }

    function removeButtonFromJumbotron(name) {
        [...buttonContainer.children].forEach(button => {
            if (button.textContent === name) button.remove();
        });
    }

    saveButton.addEventListener("click", () => {
        const name = buttonNameInput.value.trim();
        const link = buttonLinkInput.value.trim();
        if (!name || !link) return alert("Preencha todos os campos!");
        createButton(name, link);
        addButtonModal.hide();
        buttonNameInput.value = "";
        buttonLinkInput.value = "";
    });

    exportXLSXButton.addEventListener("click", () => {
        const rows = [...dynamicTable.querySelectorAll("tr")].map(row => [
            row.cells[0].textContent.trim(),
            row.cells[1].textContent.trim()
        ]);
        if (!rows.length) return alert("Nenhum registro para exportar!");
        const worksheet = XLSX.utils.aoa_to_sheet([["Nome do Botão", "Link"], ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Botões");
        XLSX.writeFile(workbook, "botoes.xlsx");
    });

    importXLSXInput.addEventListener("change", ({ target }) => {
        const file = target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ({ target: { result } }) => {
            const workbook = XLSX.read(new Uint8Array(result), { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }).slice(1);
            dynamicTable.innerHTML = "";
            buttonContainer.innerHTML = "";
            rows.forEach(([name, link]) => createButton(name, link));
        };
        reader.readAsArrayBuffer(file);
    });
});
</script>
