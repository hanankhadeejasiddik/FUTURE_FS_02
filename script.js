    let leads = JSON.parse(localStorage.getItem('crm_leads')) || [];

    const leadForm = document.getElementById('lead-form');
    const leadTableBody = document.getElementById('lead-table-body');

    function saveLeads() {
      localStorage.setItem('crm_leads', JSON.stringify(leads));
    }

    function renderLeads() {
      leadTableBody.innerHTML = '';

      if (leads.length === 0) {
        leadTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No leads found.</td></tr>';
        return;
      }

      leads.forEach((lead, index) => {
        const row = document.createElement('tr');

        const notesHtml = lead.notes && lead.notes.length > 0 
          ? `<ul class="notes-list">${lead.notes.map(n => `<li>${n}</li>`).join('')}</ul>` 
          : '<em>No notes</em>';

        row.innerHTML = `
          <td><strong>${escapeHtml(lead.name)}</strong></td>
          <td>${escapeHtml(lead.email)}</td>
          <td>${escapeHtml(lead.source)}</td>
          <td>
            <select onchange="updateStatus(${index}, this.value)">
              <option value="new" ${lead.status === 'new' ? 'selected' : ''}>New</option>
              <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>Contacted</option>
              <option value="converted" ${lead.status === 'converted' ? 'selected' : ''}>Converted</option>
            </select>
          </td>
          <td>
            ${notesHtml}
            <button class="action-btn" style="margin-top: 5px;" onclick="addNote(${index})">+ Note</button>
          </td>
          <td>
            <button class="action-btn btn-delete" onclick="deleteLead(${index})">Delete</button>
          </td>
        `;
        leadTableBody.appendChild(row);
      });
    }

    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newLead = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        source: document.getElementById('source').value,
        status: document.getElementById('status').value,
        notes: []
      };

      leads.push(newLead);
      saveLeads();
      renderLeads();
      leadForm.reset();
    });

    function updateStatus(index, newStatus) {
      leads[index].status = newStatus;
      saveLeads();
      renderLeads();
    }

    function addNote(index) {
      const noteText = prompt('Enter a new note or follow-up:');
      if (noteText && noteText.trim() !== '') {
        leads[index].notes.push(noteText.trim());
        saveLeads();
        renderLeads();
      }
    }

    function deleteLead(index) {
      if (confirm('Are you sure you want to delete this lead?')) {
        leads.splice(index, 1);
        saveLeads();
        renderLeads();
      }
    }

    function escapeHtml(str) {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    renderLeads();