const API_USER = window.location.hostname === 'localhost'
  ? "http://localhost:8080/api/user"
  : "https://tax-au-backend-production.up.railway.app/api/user";

function getToken() {
  return localStorage.getItem("token");
}

document.addEventListener('DOMContentLoaded', () => {
  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = function() {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    };
  }

  // Load user info
  fetch(`${API_USER}/me`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
    .then(res => res.json())
    .then(data => {
      if (data.email) {
        document.getElementById('userInfo').innerHTML = `
          <strong>Email:</strong> ${data.email}<br>
          <strong>Filing Status:</strong> ${data.filingStatus || 'N/A'}<br>
          <strong>Dependents:</strong> ${data.dependents || 0}
        `;
        document.getElementById('filingStatus').value = data.filingStatus || 'single';
        document.getElementById('dependents').value = data.dependents || 0;
      } else {
        window.location.href = "login.html";
      }
    })
    .catch(() => window.location.href = "login.html");

  // Update tax info
  const taxInfoForm = document.getElementById('taxInfoForm');
  if (taxInfoForm) {
    taxInfoForm.onsubmit = async function(e) {
      e.preventDefault();
      const filingStatus = document.getElementById('filingStatus').value;
      const dependents = document.getElementById('dependents').value;
      const res = await fetch(`${API_USER}/update-tax-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ filingStatus, dependents })
      });
      const data = await res.json();
      document.getElementById('taxInfoMsg').textContent = data.message || "Updated!";
    };
  }
});