const BACKEND_URL = "http://127.0.0.1:8000";


// ======================================
// LOAD ALL STUDENTS
// ======================================

async function loadStudents() {

    try {

        const response =
            await fetch(`${BACKEND_URL}/students`);

        const students = await response.json();

        if (!response.ok) {
            showMessage("Unable to load students");
            return;
        }

        displayStudents(students);

        updateStatistics(students);

    }

    catch (error) {

        showMessage("Unable to connect to backend");

        console.error(error);
    }
}


// ======================================
// DISPLAY STUDENTS IN TABLE
// ======================================

function displayStudents(students) {

    const table =
        document.getElementById("studentTable");

    table.innerHTML = "";


    if (students.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4" class="empty">
                    No students found
                </td>
            </tr>
        `;

        return;
    }


    students.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>#${student.id}</td>

            <td>
                <strong>${student.name}</strong>
            </td>

            <td>${student.course}</td>

            <td>
                <span class="marks">
                    ${student.marks}
                </span>
            </td>
        `;

        table.appendChild(row);
    });


    document.getElementById("recordCount")
        .textContent = students.length;
}


// ======================================
// UPDATE DASHBOARD STATISTICS
// ======================================

function updateStatistics(students) {

    const total =
        students.length;


    document.getElementById("totalStudents")
        .textContent = total;


    // Unique courses

    const courses =
        new Set(
            students.map(student =>
                student.course.toLowerCase()
            )
        );


    document.getElementById("totalCourses")
        .textContent = courses.size;


    // Average marks

    if (total === 0) {

        document.getElementById("averageMarks")
            .textContent = "0";

        return;
    }


    const totalMarks =
        students.reduce(
            (sum, student) =>
                sum + Number(student.marks),
            0
        );


    const average =
        Math.round(totalMarks / total);


    document.getElementById("averageMarks")
        .textContent = average;
}


// ======================================
// GET STUDENT
// ======================================

async function getStudent() {

    const id =
        document.getElementById("studentId").value;


    if (!id) {

        showMessage("Please enter Student ID");

        return;
    }


    try {

        const response =
            await fetch(
                `${BACKEND_URL}/students/${id}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.detail ||
                "Student not found"
            );

            return;
        }


        document.getElementById("name").value =
            data.name;

        document.getElementById("course").value =
            data.course;

        document.getElementById("marks").value =
            data.marks;


        showMessage(
            "✓ Student found successfully"
        );

    }

    catch (error) {

        showMessage(
            "Unable to connect to backend"
        );
    }
}


// ======================================
// ADD STUDENT
// ======================================

async function addStudent() {

    const student =
        getFormData();


    if (!student) {
        return;
    }


    try {

        const response =
            await fetch(
                `${BACKEND_URL}/students`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(student)
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.detail ||
                "Failed to add student"
            );

            return;
        }


        showMessage(
            "✓ Student added successfully"
        );


        clearFields();

        await loadStudents();

    }

    catch (error) {

        showMessage(
            "Unable to connect to backend"
        );
    }
}


// ======================================
// UPDATE STUDENT
// ======================================

async function updateStudent() {

    const id =
        document.getElementById("studentId").value;


    const student =
        getFormData();


    if (!student) {
        return;
    }


    try {

        const response =
            await fetch(
                `${BACKEND_URL}/students/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(student)
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.detail ||
                "Failed to update student"
            );

            return;
        }


        showMessage(
            "✓ Student updated successfully"
        );


        await loadStudents();

    }

    catch (error) {

        showMessage(
            "Unable to connect to backend"
        );
    }
}


// ======================================
// DELETE STUDENT
// ======================================

async function deleteStudent() {

    const id =
        document.getElementById("studentId").value;


    if (!id) {

        showMessage(
            "Please enter Student ID"
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${BACKEND_URL}/students/${id}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.detail ||
                "Student not found"
            );

            return;
        }


        showMessage(
            "✓ Student deleted successfully"
        );


        clearFields();

        await loadStudents();

    }

    catch (error) {

        showMessage(
            "Unable to connect to backend"
        );
    }
}


// ======================================
// GET FORM DATA
// ======================================

function getFormData() {

    const id =
        document.getElementById("studentId").value;

    const name =
        document.getElementById("name").value.trim();

    const course =
        document.getElementById("course").value.trim();

    const marks =
        document.getElementById("marks").value;


    if (!id || !name || !course || !marks) {

        showMessage(
            "Please fill all fields"
        );

        return null;
    }


    return {

        id: Number(id),

        name: name,

        course: course,

        marks: Number(marks)

    };
}


// ======================================
// MESSAGE
// ======================================

function showMessage(message) {

    const element =
        document.getElementById("message");


    element.textContent = message;


    setTimeout(() => {

        element.textContent = "";

    }, 3500);
}


// ======================================
// CLEAR FORM
// ======================================

function clearFields() {

    document.getElementById("studentId").value = "";

    document.getElementById("name").value = "";

    document.getElementById("course").value = "";

    document.getElementById("marks").value = "";
}


// ======================================
// LOAD DATA WHEN PAGE OPENS
// ======================================

window.addEventListener(
    "DOMContentLoaded",
    loadStudents
);