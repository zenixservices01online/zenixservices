/**
 * Zenith Workspace - Gantt Interactive Planner Controller
 */

document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const taskRowsContainer = document.getElementById("gantt-task-rows");
    const addTaskBtn = document.getElementById("add-task-node-btn");

    // Mock Task Pools for randomized adds
    const taskPool = {
        design: [
            { name: "Logo Asset Exports", startCol: 1, span: 1, progress: "100% Complete" },
            { name: "Mobile UI Layout Refinements", startCol: 2, span: 2, progress: "40% Done" },
            { name: "Typography Style Guide Audit", startCol: 1, span: 3, progress: "90% Checked" }
        ],
        dev: [
            { name: "Webpack bundle compression", startCol: 3, span: 2, progress: "10% Ready" },
            { name: "User Auth Session cookie validation", startCol: 2, span: 4, progress: "80% Code" },
            { name: "SQLite Database tables backup", startCol: 4, span: 1, progress: "100% Saved" }
        ],
        qa: [
            { name: "Stress-testing webhook controllers", startCol: 4, span: 2, progress: "50% Active" },
            { name: "Lighthouse core web vitals check", startCol: 3, span: 1, progress: "100% Score" },
            { name: "CSS Cross-browser flexbox audit", startCol: 1, span: 5, progress: "70% Done" }
        ]
    };

    // 1. Task filter logic
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");
            const rows = taskRowsContainer.querySelectorAll(".gantt-row");

            rows.forEach(row => {
                const category = row.getAttribute("data-cat");
                if (filterValue === "all" || category === filterValue) {
                    row.style.display = "grid";
                } else {
                    row.style.display = "none";
                }
            });
        });
    });

    // 2. Add Task Node
    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", () => {
            // Select random category: design, dev, qa
            const categories = ["design", "dev", "qa"];
            const randCat = categories[Math.floor(Math.random() * categories.length)];
            
            // Select random task from pool
            const pool = taskPool[randCat];
            const randTask = pool[Math.floor(Math.random() * pool.length)];

            // Create row elements
            const newRow = document.createElement("div");
            newRow.className = "gantt-row";
            newRow.setAttribute("data-cat", randCat);

            // Determine border color indicator dot
            let dotClass = "";
            let barClass = "";
            if (randCat === "design") { dotClass = "dot-design"; barClass = "bar-design"; }
            else if (randCat === "dev") { dotClass = "dot-dev"; barClass = "bar-dev"; }
            else if (randCat === "qa") { dotClass = "dot-qa"; barClass = "bar-qa"; }

            newRow.innerHTML = `
                <div class="gantt-col-taskname">
                    <span class="gantt-cat-dot ${dotClass}"></span>
                    <span>${randTask.name}</span>
                </div>
                <div class="gantt-bar-cell">
                    <div class="gantt-bar ${barClass}" style="grid-column: ${randTask.startCol} / span ${randTask.span}; width: 100%;">
                        <span class="bar-progress">${randTask.progress}</span>
                        <button class="bar-delete-btn">&times;</button>
                    </div>
                </div>
            `;

            // Append row
            taskRowsContainer.appendChild(newRow);

            // Bind delete button for newly added node
            bindDeleteAction(newRow.querySelector(".bar-delete-btn"));

            // Re-apply active filters
            const activeFilterBtn = document.querySelector(".filter-btn.active");
            const filterValue = activeFilterBtn.getAttribute("data-filter");
            if (filterValue !== "all" && randCat !== filterValue) {
                newRow.style.display = "none";
            }
        });
    }

    // 3. Bind task delete buttons
    function bindDeleteAction(btn) {
        btn.addEventListener("click", (e) => {
            const row = btn.closest(".gantt-row");
            row.style.opacity = "0";
            row.style.transform = "translateY(5px)";
            setTimeout(() => {
                row.remove();
            }, 300);
        });
    }

    // Initial binding of static rows
    document.querySelectorAll(".bar-delete-btn").forEach(btn => {
        bindDeleteAction(btn);
    });
});
