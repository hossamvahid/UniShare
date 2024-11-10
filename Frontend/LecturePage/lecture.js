document.addEventListener('DOMContentLoaded', () => {
    fetchMaterii();
});  

// Functie pentru a obtine cursurile (materiile)
function fetchMaterii() {
    fetch("https://localhost:7209/api/Course/GetCourse", {
         method: 'GET',
         mode: 'cors',
         headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
         }
    })
    .then(response => response.json())
    .then(data => {
        const lectureList = document.getElementById('lecture-list');
        const token = localStorage.getItem('authToken');

        if (token) {
            const base64Url = token.split('.')[1];  // Payload-ul este partea a doua a tokenului
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');  // Corectează pentru compatibilitate
            const decodedPayload = JSON.parse(atob(base64));  // Decodifică payload-ul JWT
            const role = decodedPayload.Role;  // Extrage rolul din payload
            const userId=decodedPayload.userId;

            console.log("Rolul utilizatorului este:", role);
            if (role === 'Student') {
                const addLecture = document.getElementById('createLecture');
                addLecture.classList.add('hidden');
                addLecture.classList.remove('visible');

                const lectureTitle = document.getElementById('lectureTitle');
                lectureTitle.style.textAlign = 'center'; 
            }
            lectureList.innerHTML = '';
  // Adăugarea cursurilor în UI
        data.forEach(lecture => {
            console.log(lecture.name);
            console.log(lecture.id);
            const listItem = document.createElement('li');
            listItem.textContent = lecture.name;
            listItem.dataset.id = lecture.id;
            listItem.addEventListener('click', () => showPdfsForMaterie(lecture.id, lecture.name,lecture.creatorId,userId));
            lectureList.appendChild(listItem);
        });

        } else {
            console.log("Nu există niciun token.");
        }

      
    })
    .catch(error => console.error('Eroare la obținerea materiilor:', error));
}

// Functia pentru a arata materialele asociate unui curs
function showPdfsForMaterie(courseId, courseName, creatorId, currentUserId) {
    const lectureTitle = document.getElementById('lecture-title');
    lectureTitle.textContent = courseName;

    const pdfList = document.getElementById('pdf-list');
    pdfList.innerHTML = ''; // Clears previous materials
    

    getMaterials(courseId);

    // Verificăm dacă utilizatorul care a accesat cursul este creatorul acestuia
    if (creatorId === currentUserId) {
        addUploadButton(courseId);  // Dacă utilizatorul este creator, adăugăm butonul de upload
    }

    document.getElementById('materii').classList.add('hidden');
    document.getElementById('material-section').classList.remove('hidden');
}


// Functia pentru a obtine materialele pentru un curs
function getMaterials(courseId) {
    const token = localStorage.getItem('authToken');
    fetch(`https://localhost:7209/api/Course/GetMaterials?courseId=${courseId}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Materiale găsite:', data);  // Verifică datele primite
        if (data && data.length > 0) {
            const pdfList = document.getElementById('pdf-list');
            pdfList.innerHTML = ''; // Curăță lista existentă

            // Parcurge lista de materiale și adaugă fiecare material în lista HTML
            data.forEach(material => {
                const listItem = document.createElement('li');
                
                // Creăm linkul pentru descărcare direct în JavaScript
                const downloadLink = document.createElement('a');
                downloadLink.href = "#"; // Lăsăm href ca fiind "#", dar vom gestiona descărcarea prin event listener
                downloadLink.innerText = material.fileName || 'Nume indisponibil';  // Numele fișierului se va afișa ca text
                console.log(downloadLink);
                // Adăugăm event listener pentru descărcare
                downloadLink.addEventListener('click', (event) => {
                    event.preventDefault(); // Previne comportamentul default al linkului
                    downloadMaterial(material.id,material.fileName); // Apelează funcția de descărcare cu ID-ul materialului
                });

                // Adaugă linkul de descărcare în elementul de listă
                listItem.appendChild(downloadLink);
                
                // Adaugă elementul de listă în lista finală
                
                pdfList.appendChild(listItem);
               
            });
            pdfList.classList.add('custom-list');
        } else {
            alert('No materials found for this course.');
        }
    })
    .catch(error => {
        console.error('Error fetching materials:', error);
        alert('Error fetching materials.');
    });
}




// Functia pentru a descarca materialele
function downloadMaterial(materialId,materialName) {
    
    fetch(`https://localhost:7209/api/Course/DownloadMaterial?materialId=${materialId}`, {
        method: 'GET',
     })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to download material.');
        }
        return response.blob(); // Transformăm răspunsul într-un blob
    })
    .then(blob => {
        // Creăm un link temporar pentru a descărca fișierul
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = materialName; // Poți modifica numele fișierului dacă ai un alt nume
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url); // Curățăm URL-ul temporar
        a.remove();
    })
    .catch(error => {
        console.error('Error downloading material:', error);
        alert('Error downloading material.');
    });
}

function addUploadButton(courseId) {
    const uploadButtonContainer = document.createElement('div');
    uploadButtonContainer.classList.add('upload-container');

    const uploadButton = document.createElement('button');
    uploadButton.classList.add('buttonCreate');
    uploadButton.textContent = 'Adaugă Material';
    uploadButton.addEventListener('click', () => openUploadForm(courseId));

    uploadButtonContainer.appendChild(uploadButton);
    document.getElementById('material-section').appendChild(uploadButtonContainer);
}

function openUploadForm(courseId) {
    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');

    const form = document.createElement('form');
    form.classList.add('upload-form');
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.name = 'file';
    fileInput.required = true;

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Upload';
    submitButton.classList.add('buttonCreate');

    form.appendChild(fileInput);
    form.appendChild(submitButton);

    formContainer.appendChild(form);
    document.getElementById('material-section').appendChild(formContainer);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        handleFileUpload(courseId, fileInput.files[0]);
    });
}

function handleFileUpload(courseId, file) {
    const formData = new FormData();
    formData.append('file', file);

    fetch(`https://localhost:7209/api/Course/CreateMaterial?courseId=${courseId}`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Fișierul a fost încărcat cu succes.');
        // Actualizează lista de materiale după încărcare
        getMaterials(courseId);
    })
    .catch(error => {
        console.error('Eroare la încărcarea materialului:', error);
        alert('Eroare la încărcarea materialului.');
    });
}
// Functie pentru a reveni la lista de materii
function backToMaterii() {
    // Ascunde secțiunea de materiale și afișează lista de cursuri
    document.getElementById('materii').classList.remove('hidden');
    document.getElementById('materii').classList.add('visible');
    document.getElementById('material-section').classList.add('hidden');

    // Restabilește titlul la "Lectures"
    const lectureTitle = document.getElementById('lectureTitle');
    lectureTitle.textContent = 'Lectures'; 

    // Resetează eventualele butoane de upload
    const uploadContainer = document.querySelector('.upload-container');
    if (uploadContainer) {
        uploadContainer.remove();  // Șterge butonul de upload
    }

    // Dacă există un formular de upload deschis, îl închidem
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.remove();  // Șterge formularul de upload
    }
}


// Afisarea meniului
const showMenu = document.getElementById('button');

showMenu.addEventListener('click', (event) => {
    const materii = document.getElementById('materii');
    materii.classList.add('hidden');
    materii.classList.remove('visible');

    const menu = document.getElementById('menu');
    menu.classList.add('visible');
    menu.classList.remove('hidden');
});

// Afisarea materii dupa apasarea butonului de meniu
const showMaterii = document.getElementById("buttonMenu");
showMaterii.addEventListener('click', (event) => {
    const materii = document.getElementById('materii');
    materii.classList.add('visible');
    materii.classList.remove('hidden');

    const menu = document.getElementById('menu');
    menu.classList.add('hidden');
    menu.classList.remove('visible');
});

//Lecture
document.getElementById('createLecture').addEventListener('click', () => {
    toggleVisibilityForCreateForm(true); // Face formularul de creare vizibil
});

// Event listener pentru trimiterea formularului de creare curs
document.getElementById('courseForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Previne reîncărcarea paginii

    const courseName = document.getElementById('courseName').value;
    const courseCategory = document.getElementById('courseCategory').value;

    // Trimite datele către server pentru a crea un nou curs
    createCourse(courseName, courseCategory);
});

// Event listener pentru anularea formularului
document.getElementById('cancelCreate').addEventListener('click', () => {
    toggleVisibilityForCreateForm(false); // Ascunde formularul de creare curs
});


// Funcție pentru a ascunde/afișa formularul de creare curs
function toggleVisibilityForCreateForm(isVisible) {
const materiiSection = document.getElementById('materii');
const createLectureForm = document.getElementById('createLectureForm');

if (isVisible) {
    // Ascunde secțiunea cu lista de cursuri
    materiiSection.classList.add('hidden');
    // Afișează formularul de creare curs
    createLectureForm.classList.remove('hidden');
} else {
    // Afișează secțiunea cu lista de cursuri
    materiiSection.classList.remove('hidden');
    // Ascunde formularul de creare curs
    createLectureForm.classList.add('hidden');
}
}


// Funcție pentru a crea un nou curs
function createCourse(courseName, courseCategory) {
    const token = localStorage.getItem('authToken');

   
    console.log(courseName);
    const courseData = {
        name: String(courseName),
        description:"string",
        category: parseInt(courseCategory)// 0 = Programming, 1 = Mathematics
    };

    fetch("https://localhost:7209/api/Course/CourseCreate", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Course created successfully!');
        // Actualizează lista de cursuri după crearea unui nou curs
        toggleVisibilityForCreateForm(false); // Ascunde formularul de creare curs
        fetchMaterii(); // Reîncarcă lista de cursuri
    })
    .catch(error => {
        console.error('Error creating course:', error);
        alert('Error creating course.');
    });
}
window.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight'||e.key==='ArrowUp'||e.key==='ArrowDown') {
        e.preventDefault(); // Previne acțiunea implicită de derulare
    }
});
window.addEventListener('wheel', function(e) {
    e.preventDefault(); // Previne comportamentul implicit de derulare
}, { passive: false });



const circleSper=document.getElementById('circle');
const circles = document.querySelectorAll('.circle');
const radius = 300; // Raza cercului de mișcare
const speed = 0.014; // Viteza mișcării

circles.forEach((circle, index) => {
  let angle = index * (Math.PI /2); // Offset de un sfert de cerc între elemente
  
  function animate() {
    angle += speed; // Incrementăm unghiul pentru a crea mișcarea
    const x = radius * Math.cos(angle); // Calculăm coordonata X
    const y = radius * Math.sin(angle); // Calculăm coordonata Y
    
    // Aplicăm transformarea pentru poziționare
    circle.style.transform = `translate(${x}px, ${y}px)`;
    
    requestAnimationFrame(animate); // Continuăm animația
  }

  animate();
});