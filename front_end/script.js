document.addEventListener('DOMContentLoaded', () => {
    const stockTableBody = document.querySelector('#stockTable tbody');
    const addComponentBtn = document.getElementById('addComponentBtn');
    const addComponentModal = document.getElementById('addComponentModal');
    const editComponentModal = document.getElementById('editComponentModal');
    const closeAddModal = addComponentModal.querySelector('.close');
    const closeEditModal = editComponentModal.querySelector('.close');
    const addComponentForm = document.getElementById('addComponentForm');
    const editComponentForm = document.getElementById('editComponentForm');
    const searchBar = document.getElementById('searchBar');

    let components = [];

    const fetchComponents = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/components');
            const data = await response.json();
            components = data.components;
            displayComponents(components);
        } catch (error) {
            console.error('Error fetching components:', error);
        }
    };

    const displayComponents = (componentsToDisplay) => {
        stockTableBody.innerHTML = ''; // Clear the table before adding rows
        componentsToDisplay.forEach(component => addComponentToTable(component));
    };

    addComponentBtn.onclick = () => {
        addComponentModal.style.display = 'block';
    };

    closeAddModal.onclick = () => {
        addComponentModal.style.display = 'none';
    };

    closeEditModal.onclick = () => {
        editComponentModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == addComponentModal) {
            addComponentModal.style.display = 'none';
        }
        if (event.target == editComponentModal) {
            editComponentModal.style.display = 'none';
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
            components.push({ id: newComponent.id, component_id: componentId, component_name: componentName, quantity });
            displayComponents(components);
            addComponentForm.reset();
            addComponentModal.style.display = 'none';
        } catch (error) {
            console.error('Error adding component:', error);
        }
    };

    editComponentForm.onsubmit = async (event) => {
        event.preventDefault();
        const id = document.getElementById('editComponentId').value;
        const componentId = document.getElementById('editComponentIdentifier').value;
        const componentName = document.getElementById('editComponentName').value;
        const quantity = document.getElementById('editQuantity').value;

        try {
            await fetch(`http://localhost:3000/api/components/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ component_id: componentId, component_name: componentName, quantity })
            });
            const updatedComponent = components.find(comp => comp.id === parseInt(id));
            updatedComponent.component_id = componentId;
            updatedComponent.component_name = componentName;
            updatedComponent.quantity = quantity;
            displayComponents(components);
            editComponentForm.reset();
            editComponentModal.style.display = 'none';
        } catch (error) {
            console.error('Error updating component:', error);
        }
    };

    const addComponentToTable = (component) => {
        const row = stockTableBody.insertRow();
        row.insertCell(0).innerText = component.component_id;
        row.insertCell(1).innerText = component.component_name;
        row.insertCell(2).innerText = component.quantity;
        const actionsCell = row.insertCell(3);

        const editBtn = document.createElement('button');
        editBtn.innerText = 'Edit';
        editBtn.onclick = () => {
            document.getElementById('editComponentId').value = component.id;
            document.getElementById('editComponentIdentifier').value = component.component_id;
            document.getElementById('editComponentName').value = component.component_name;
            document.getElementById('editQuantity').value = component.quantity;
            editComponentModal.style.display = 'block';
        };
        actionsCell.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.onclick = async () => {
            try {
                await fetch(`http://localhost:3000/api/components/${component.id}`, {
                    method: 'DELETE'
                });
                components = components.filter(comp => comp.id !== component.id);
                displayComponents(components);
            } catch (error) {
                console.error('Error deleting component:', error);
            }
        };
        actionsCell.appendChild(deleteBtn);
    };

    searchBar.oninput = () => {
        const query = searchBar.value.toLowerCase();
        const filteredComponents = components.filter(component => component.component_id.toLowerCase().includes(query));
        displayComponents(filteredComponents);
    };

    fetchComponents();
});
