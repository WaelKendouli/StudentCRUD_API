      const API_BASE = "https://jsonplaceholder.typicode.com";
            const LIST_URL = `${API_BASE}/users`;
const UI = {
        // List area
        list: document.getElementById("list"),
        loading: document.getElementById("loading"),
        error: document.getElementById("error"),
        count: document.getElementById("count"),
        search: document.getElementById("search"),

        // Buttons
        btnReload: document.getElementById("btnReload"),

        // Add form inputs
        addName: document.getElementById("addName"),
        addEmail: document.getElementById("addEmail"),
        addMajor: document.getElementById("addMajor"),
        addGpa: document.getElementById("addGpa"),
        btnAdd: document.getElementById("btnAdd"),
        btnClear: document.getElementById("btnClear"),

        // Modal elements
        backdrop: document.getElementById("backdrop"),
        editName: document.getElementById("editName"),
        editEmail: document.getElementById("editEmail"),
        editMajor: document.getElementById("editMajor"),
        editGpa: document.getElementById("editGpa"),
        editMeta: document.getElementById("editMeta"),
        btnCancel: document.getElementById("btnCancel"),
        btnUpdate: document.getElementById("btnUpdate"),

        // Toast
        toast: document.getElementById("toast"),
      };

      let students = [];
// ✅ Local in-memory list (the UI renders from this)
      // Because JSONPlaceholder doesn't persist changes.
      
      let editingId = null;
// ✅ Holds which student is currently
      //  being edited in the modal.

       const MAJORS = [
        "Computer Science",
        "Software Engineering",
        "Information Systems",
        "Cybersecurity",
        "Data Science",
      ];
    // ✅ Used for mapping users → students (fake majors)

    function showToast(message)
    {
        UI.toast.textContent = message;
        UI.toast.style.display = "block";
        setTimeout(() => {
            UI.toast.style.display = "none";
        }, 2000);
    }
    function setLoading(isLoading)
    {
        UI.loading.style.display = isLoading ? "flex" : "none";
    }
function setError(message) {
        UI.error.textContent = message;
        UI.error.style.display = message ? "block" : "none";
      }


      function openModal() {
        UI.backdrop.style.display = "flex";
        UI.backdrop.setAttribute("aria-hidden", "false");
      }

      // ✅ Close the edit modal and reset editing state
      function closeModal() {
        UI.backdrop.style.display = "none";
        UI.backdrop.setAttribute("aria-hidden", "true");
        editingId = null;
      }

      // ✅ Escape text before injecting into innerHTML (basic safety)
      // Prevents user input from becoming real HTML
      function esc(s) {
        return String(s)
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }

      // ✅ GPA helper: keep number between 0.0 and 4.0 and rounded to 1 decimal
      function clampGpa(value) {
        const n = Number(value);
        if (Number.isNaN(n)) return 0;
        return Math.min(4, Math.max(0, Math.round(n * 10) / 10));
      }

      async function apiFetch(url,options = {})
      {
            const res = await fetch(url ,
               { headers : {
                "Content-Type" : "application/json" ,
                ...(options.headers || {}) ,

               },
               ...options
            }
            );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
return text ? JSON.parse(text) : null ;
      } 