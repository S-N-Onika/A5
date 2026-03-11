const container = document.getElementById("allCards");
const issueCount = document.getElementById("issueCount");
const searchInput = document.getElementById("search");
const loadingSpinner = document.getElementById("loadingSpinner");

let issuesData = [];

const labelDesign = {
    "BUG": { bg: "bg-red-100", text: "text-red-600", border: "border border-red-400", icon: '<i class="fa-solid fa-bug pr-2" style="color: #e7000b"></i>' },
    "HELP WANTED": { bg: "bg-yellow-100", text: "text-yellow-600", border: "border border-yellow-400", icon: '<i class="fa-solid fa-life-ring pr-2" style="color: #d08700"></i>' },
    "ENHANCEMENT": { bg: "bg-green-100", text: "text-green-600", border: "border border-green-400", icon: '<i class="fa-solid fa-wand-magic-sparkles pr-2" style="color: #00a63e"></i>' },
    "GOOD FIRST ISSUE": { bg: "bg-pink-100", text: "text-pink-600", border: "border border-pink-400", icon: '<i class="fa-solid fa-star pr-2" style="color: #ff69b4"></i>' },
    "DOCUMENTATION": { bg: "bg-blue-100", text: "text-blue-600", border: "border border-blue-400", icon: '<i class="fa-solid fa-book pr-2" style="color: #0066cc"></i>' }
};

const priorityDesign = {
    "HIGH": { border: "border-red-600", bg: "bg-red-100", text: "text-red-700" },
    "MEDIUM": { border: "border-yellow-600", bg: "bg-yellow-100", text: "text-yellow-700" },
    "LOW": { border: "border-purple-600", bg: "bg-purple-100", text: "text-purple-700" }
};

function showLoadingSpinner() {
    container.innerHTML = "";
    loadingSpinner.classList.remove("hidden");
    loadingSpinner.classList.add("flex");
    container.appendChild(loadingSpinner)
}

function hideLoadingSpinner() {
    loadingSpinner.classList.add("hidden");
}

async function loadIssues() {
    showLoadingSpinner();
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();
    issuesData = data.data;
    hideLoadingSpinner();
    displayIssues(issuesData);
}

loadIssues();

function displayIssues(issues) {
    container.innerHTML = "";
    issueCount.innerText = issues.length + " Issues";

    issues.forEach(issue => {
        const statusBorder = issue.status === "open" ? "border-green-600" : "border-purple-600";
        const statusIcon = issue.status === "open" ? "./img/Open-Status.png" : "./img/Closed- Status .png";

        const card = document.createElement("div");
        card.className = `w-[308px] p-4 rounded-md border-t-4 ${statusBorder} space-y-4 bg-white`;

        const priority = priorityDesign[issue.priority.toUpperCase()] || priorityDesign["LOW"];
        const priorityClass = `${priority.bg} ${priority.text} ${priority.border} px-5 py-1 rounded-full font-bold uppercase`;

        card.innerHTML = `
            <div class="flex justify-between items-center">
                <img class="w-8" src="${statusIcon}" alt="status">
                <h2 class="${priorityClass}">${issue.priority}</h2>
            </div>

            <div>
                <h2 class="text-[16px] font-bold text-[#1F2937] pb-2">${issue.title}</h2>
                <p class="text-[12px] text-[#64748b]">${issue.description}</p>
            </div>

            <div class="flex gap-2 overflow-x-auto">
                ${issue.labels.map(label => {
            const design = labelDesign[label.toUpperCase()] || labelDesign['ENHANCEMENT'];
            return `<span class="px-2 py-1 rounded-full border ${design.border} ${design.bg} ${design.text} flex items-center whitespace-nowrap text-[12px]">${design.icon}${label.toUpperCase()}</span>`;
        }).join('')}
            </div>

            <hr class="border-gray-300 p-0">

            <div>
                <p class="text-[12px] text-[#64748b] pb-2">#${issue.id} by ${issue.author}</p>
                <p class="text-[12px] text-[#64748b]">${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
        `;

        card.addEventListener("click", () => zoomCard(card, issue));
        container.appendChild(card);
    });
}

function toggleStyle(type) {
    let filtered = issuesData;
    if (type === "opened") filtered = issuesData.filter(issue => issue.status === "open");
    if (type === "closed") filtered = issuesData.filter(issue => issue.status === "closed");
    displayIssues(filtered);
}

function toggleButton(id) {
    const all = document.getElementById("all");
    const opened = document.getElementById("opened");
    const closed = document.getElementById("closed");

    [all, opened, closed].forEach(btn => {
        btn.classList.remove('bg-[#3b5fea]', 'text-[#ffffff]');
        btn.classList.add('bg-[#ffffff]', 'text-[#002c5c]');
    });

    const selected = document.getElementById(id);
    selected.classList.add('bg-[#3b5fea]', 'text-[#ffffff]');
    selected.classList.remove('bg-[#ffffff]', 'text-[#002c5c]');
}

document.getElementById("all").addEventListener("click", () => { toggleButton("all"); toggleStyle("all"); });
document.getElementById("opened").addEventListener("click", () => { toggleButton("opened"); toggleStyle("opened"); });
document.getElementById("closed").addEventListener("click", () => { toggleButton("closed"); toggleStyle("closed"); });

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = issuesData.filter(issue =>
        issue.id.toString().includes(query) ||
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query)
    );
    displayIssues(filtered);
});

let activeCard = null;
let activeOverlay = null;


function zoomCard(card, issue) {

    if (activeCard) return;
    activeCard = card;

    const overlay = document.createElement("section");
    overlay.className = "zoom-overlay";

    const statusStyle = issue.status === "open" ? "bg-green-600" : "bg-purple-600";

    const modal = document.createElement("section");
    modal.className = "zoomCard";

    modal.innerHTML = `
    <h2 class="text-2xl font-bold text-[#1F2937]">${issue.title}</h2>
        <div class="flex items-center gap-2 mt-2">
            <div class="${statusStyle} px-2 py-1 rounded-full text-white">${issue.status}</div>
            <div class="bg-gray-500 px-px w-2 h-2 rounded-full"></div>
            <p class="text-gray-500">Opened by ${issue.assignee}</p>
            <div class="bg-gray-500 px-px w-2 h-2 rounded-full"></div>
            <p class="text-gray-500">${new Date(issue.updatedAt).toLocaleDateString()}</p>
        </div>
        <div class="flex gap-2 overflow-x-auto mt-3">
            ${issue.labels.map(label => {
        const design = labelDesign[label.toUpperCase()] || labelDesign['ENHANCEMENT'];
        return `<span class="px-2 py-1 rounded-full border ${design.border} ${design.bg} ${design.text} flex items-center whitespace-nowrap text-[12px]">${design.icon}${label.toUpperCase()}</span>`;
    }).join('')}
        </div>
        <p class="mt-4 text-[#64748b]">${issue.description}</p>
        <div class="flex gap-[200px] items-center mt-4 p-2 bg-[#F8FAFC] rounded">
            <div>
                <p class="text-gray-500">Assignee:</p>
                <p class="font-medium">${issue.assignee}</p>
            </div>
            <div>
                <p class="text-gray-500">Priority:</p>
                <h2 class="${priorityDesign[issue.priority.toUpperCase()].bg} ${priorityDesign[issue.priority.toUpperCase()].text} ${priorityDesign[issue.priority.toUpperCase()].border} px-2 rounded-full font-bold uppercase">${issue.priority}</h2>
            </div>
        </div>
        <div class="flex justify-end mt-2 bottom-3">
            <button onclick="closeZoom()" 
            class="bg-blue-600 text-white px-4 py-2 rounded">
            Close
            </button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    activeOverlay = overlay;
}

function closeZoom() {
    if (activeOverlay) {
        activeOverlay.remove();
        activeOverlay = null;
        activeCard = null;
    }
}