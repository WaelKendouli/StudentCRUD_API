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

 function render() {
        // ✅ Read search query
        const q = UI.search.value.trim().toLowerCase();

        // ✅ Filter list if query exists
        const filtered = q
          ? students.filter(
              (s) =>
                s.fullName.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q) ||
                s.major.toLowerCase().includes(q)
            )
          : students;

        // ✅ Update "X shown" label
        UI.count.textContent = `${filtered.length.toLocaleString()} shown`;

        // ✅ Build list HTML
        UI.list.innerHTML = filtered
          .map(
            (s) => `
        <div class="item">
          <div>
            <div class="name">${esc(s.fullName)}</div>
            <p class="meta">${esc(s.email)}</p>

            <div style="margin-top:6px;">
              <span class="pill">id: ${s.id}</span>
              <span class="pill">Major: ${esc(s.major)}</span>
              <span class="pill">GPA: ${Number(s.gpa).toFixed(1)}</span>
            </div>
          </div>

          <div class="actions">
            <!-- ✅ Inline onclick calls global functions exposed below -->
            <button class="secondary" onclick="window.__editStudent(${
              s.id
            })">Edit</button>
            <button class="danger" onclick="window.__delStudent(${
              s.id
            })">Delete</button>
          </div>
        </div>
      `
          )
          .join("");

        // ✅ If nothing found, show a friendly message
        if (filtered.length === 0) {
          UI.list.innerHTML = `<div class="muted">No students found.</div>`;
        }
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

      async function loadStudents() {
        UI.btnReload.disabled = true;
        setError("");
        setLoading(true);
            try {
            const users = await apiFetch(LIST_URL , {method : "GET"});
            students = users.map((u) => ({
            id: u.id,
            fullName: u.name,
            email: u.email,
            major: MAJORS[u.id % MAJORS.length], // ✅ deterministic "random" major
            gpa: clampGpa(2.6 + (u.id % 15) * 0.1), // ✅ deterministic, looks random-ish
          }));
            render();
             showToast("✅ Loaded students");
        } catch (e) {
          setError(`❌ Failed to load students: ${e.message}`);
        } finally {
          setLoading(false);
          UI.btnReload.disabled = false;
        }
      }

     async function CreateStudent()
     {
        const Fullname = UI.addName.value.trim();
        const email = UI.addEmail.value.trim();
        const major = UI.addMajor.value;
        const gpa = clampGpa(UI.addGpa.value);
        if (!fullName) return showToast("❌ Name is required");
        if (!email || !email.includes("@"))
          return showToast("❌ Valid email is required");

        UI.btnAdd.disabled = true;
        setError("");

        try {
const created = await apiFetch(`${API_BASE}/users` , {
    method : "POST" ,
    body: JSON.stringify({ name: fullName, email, major, gpa }),
});
const newStudent = {
            id: created?.id ?? Date.now(), // ✅ API may return id; fallback to timestamp
            fullName,
            email,
            major,
            gpa,
          };
          students.unshift(newStudent);
           UI.addName.value = "";
          UI.addEmail.value = "";
          UI.addMajor.value = "Computer Science";
          UI.addGpa.value = "3.2";
          render();
          showToast("New Student Added successfully!");

        }
        catch(e) {
        setError(`Creation failed ${e.message}`);
        }
        finally {
            UI.btnAdd.disabled = true;
        }
     }

     loadStudents();
UI.btnAdd.addEventListener(()=> {
    CreateStudent();
});