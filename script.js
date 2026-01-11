let subjectCounter = 0;

// Load saved data on page load
window.addEventListener('load', function() {
    const savedData = localStorage.getItem('jecrcMarksData');
    if (savedData) {
        const data = JSON.parse(savedData);
        if (confirm('Found saved data. Do you want to continue from where you left off?')) {
            restoreSession(data);
        }
    }
});

// Auto-save data every 5 seconds
setInterval(saveData, 5000);

function saveData() {
    const loginPage = document.getElementById('loginPage');
    if (loginPage.style.display !== 'none') return;

    const data = {
        studentName: document.getElementById('displayName').textContent,
        enrollment: document.getElementById('displayEnrollment').textContent,
        year: document.getElementById('displayYear').textContent,
        course: document.getElementById('displayCourse').textContent,
        subjects: []
    };

    for (let i = 1; i <= subjectCounter; i++) {
        if (document.getElementById(`row${i}`)) {
            data.subjects.push({
                id: i,
                name: document.getElementById(`subject${i}`).value,
                insem1: document.getElementById(`insem1_${i}`).value,
                insem2: document.getElementById(`insem2_${i}`).value,
                assignment: document.getElementById(`assignment${i}`).value,
                endterm: document.getElementById(`endterm${i}`).value
            });
        }
    }

    localStorage.setItem('jecrcMarksData', JSON.stringify(data));
}

function restoreSession(data) {
    document.getElementById('displayName').textContent = data.studentName;
    document.getElementById('displayEnrollment').textContent = data.enrollment;
    document.getElementById('displayYear').textContent = data.year;
    document.getElementById('displayCourse').textContent = data.course;

    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('calculatorPage').style.display = 'block';

    data.subjects.forEach(subject => {
        subjectCounter = subject.id;
        const tbody = document.getElementById('tableBody');
        const row = tbody.insertRow();
        row.id = `row${subjectCounter}`;

        row.innerHTML = `
            <td><input type="text" id="subject${subjectCounter}" value="${subject.name}"></td>
            <td><input type="number" id="insem1_${subjectCounter}" value="${subject.insem1}" onchange="calculateRow(${subjectCounter})"></td>
            <td><input type="number" id="insem2_${subjectCounter}" value="${subject.insem2}" onchange="calculateRow(${subjectCounter})"></td>
            <td><input type="number" id="assignment${subjectCounter}" value="${subject.assignment}" onchange="calculateRow(${subjectCounter})"></td>
            <td><input type="number" id="endterm${subjectCounter}" value="${subject.endterm}" onchange="calculateRow(${subjectCounter})"></td>
            <td id="final${subjectCounter}">0</td>
            <td id="grade${subjectCounter}">-</td>
            <td><button onclick="deleteRow(${subjectCounter})">🗑️</button></td>
        `;
        calculateRow(subjectCounter);
    });
}

function submitLogin() {
    const name = studentName.value.trim();
    const enrollment = enrollmentNo.value.trim();
    const year = yearOfStudy.value;
    const courseVal = course.value.trim();

    if (!name || !enrollment || !year || !courseVal) {
        alert('Please fill all fields');
        return;
    }

    displayName.textContent = name;
    displayEnrollment.textContent = enrollment;
    displayYear.textContent = year;
    displayCourse.textContent = courseVal;

    loginPage.style.display = 'none';
    calculatorPage.style.display = 'block';
    addSubject();
}

function addSubject() {
    if (subjectCounter >= 20) return alert('Max 20 subjects allowed');
    subjectCounter++;

    const row = tableBody.insertRow();
    row.id = `row${subjectCounter}`;

    row.innerHTML = `
        <td><input type="text" id="subject${subjectCounter}"></td>
        <td><input type="number" id="insem1_${subjectCounter}" onchange="calculateRow(${subjectCounter})"></td>
        <td><input type="number" id="insem2_${subjectCounter}" onchange="calculateRow(${subjectCounter})"></td>
        <td><input type="number" id="assignment${subjectCounter}" onchange="calculateRow(${subjectCounter})"></td>
        <td><input type="number" id="endterm${subjectCounter}" onchange="calculateRow(${subjectCounter})"></td>
        <td id="final${subjectCounter}">0</td>
        <td id="grade${subjectCounter}">-</td>
        <td><button onclick="deleteRow(${subjectCounter})">🗑️</button></td>
    `;
}

function calculateRow(id) {
    const i1 = +document.getElementById(`insem1_${id}`).value || 0;
    const i2 = +document.getElementById(`insem2_${id}`).value || 0;
    const asg = +document.getElementById(`assignment${id}`).value || 0;
    const end = +document.getElementById(`endterm${id}`).value || 0;

    let marks = (((i1 + i2) / 2) * 0.375 + asg + end / 2) / 85 * 100;
    marks = Math.min(marks, 100);

    final${id}.textContent = marks.toFixed(2);
    grade${id}.textContent = getGrade(marks);
    calculateTotals();
}

function getGrade(m) {
    if (m >= 90) return 'A+';
    if (m >= 80) return 'A';
    if (m >= 70) return 'B';
    if (m >= 60) return 'C';
    if (m >= 50) return 'D';
    if (m >= 40) return 'E';
    return 'F';
}

function calculateTotals() {
    let total = 0, count = 0;
    for (let i = 1; i <= subjectCounter; i++) {
        if (document.getElementById(`row${i}`)) {
            total += +document.getElementById(`final${i}`).textContent || 0;
            count++;
        }
    }
    summaryTotal.textContent = total.toFixed(2);
    summaryAverage.textContent = count ? (total / count).toFixed(2) : 0;
    overallGrade.textContent = getGrade(total / count);
}

function deleteRow(id) {
    document.getElementById(`row${id}`)?.remove();
    calculateTotals();
}
