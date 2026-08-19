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
