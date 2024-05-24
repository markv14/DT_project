document.addEventListener('DOMContentLoaded', () => {
    const stockTableBody = document.querySelector('#stockTable tbody');
    const addComponentBtn = document.getElementById('addComponentBtn');
    const addComponentModal = document.getElementById('addComponentModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const addComponentForm = document.getElementById('addComponentForm');

    const fetchComponents = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/components');
            const data = await response.json();
            data.components.forEach(component => addComponentToTable(component));
        } catch (error) {
            console.error('Error fetching components:', error);
        }
    };

    addComponentBtn.onclick = () => {
        addComponentModal.style.display = 'block';
    };

    closeModal.onclick = () => {
        addComponentModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == addComponentModal) {
            addComponentModal.style.display = 'none';
        }
    };

    addComponentForm.onsubmit = async (event) => {
        event.preventDefault();
        const componentId = document.getElementById('componentId').value;
        const componentName = document.getElementById('componentName').value;
        const quantity = document.getElementById('quantity').value;

        try {
            const response = await fetch('http://localhost:3000/api/components', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ component_id: componentId, component_name: componentName, quantity })
            });
            const newComponent = await response.json();
            addComponentToTable({ id: newComponent.id, component_id: componentId, component_name: componentName, quantity });
            addComponentForm.reset();
            addComponentModal.style.display = 'none';
        } catch (error) {
            console.error('Error adding component:', error);
        }
    };

    const addComponentToTable = (component) => {
        const row = stockTableBody.insertRow();
        row.insertCell(0).innerText = component.component_id;
        row.insertCell(1).innerText = component.component_name;
        row.insertCell(2).innerText = component.quantity;
        const actionsCell = row.insertCell(3);
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = async () => {
            try {
                await fetch(`http://localhost:3000/api/components/${component.id}`, {
                    method: 'DELETE'
                });
                row.remove();
            } catch (error) {
                console.error('Error deleting component:', error);
            }
        };
        actionsCell.appendChild(deleteBtn);
    };

    fetchComponents();
});
