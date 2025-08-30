let flag=0;
console.log("Script loaded!");
function onlogin(){
  window.location.href="login.html";
}
function openSidebar() {
  if(flag==0){
    document.getElementById("mySidebar").style.width = "200px";
    document.getElementById("mainContent").style.marginLeft = "200px";
    flag=1;
  }
  else{
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("mainContent").style.marginLeft= "0"
    flag=0;
  }
}
const modal = document.getElementById("uploadModal");
document.getElementById("openModal").onclick = () => modal.style.display = "flex";
document.getElementById("closeModal").onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

//document.getElementById("uploadButton").addEventListener("click", upload);
async function upload() { 
  const user=localStorage.getItem('user_id');
  if(!user){
    window.location.href="login.html";
  }
  const input = document.getElementById("fileInput");
  if (!input.files.length) {
    alert("Please select a file!");
    return;
  }

  const formData = new FormData();
  for (let i = 0; i < input.files.length; i++) {
    formData.append("files", input.files[i]);
  }

  try {
    const res = await fetch(`http://localhost:4000/upload/${user}`, {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    if (data.flag) {
     alert("file submitted");
    } else {
      alert("Upload failed: " + (data.message || ""));
    }
    modal.style.display = "none";
  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }
};



async function loadFiles(userId) {
    try {
      const res = await fetch(`http://localhost:4000/fetch/${userId}`);
      const data = await res.json();
  
      const container = document.getElementById("mainContent");
      container.innerHTML = "<h2>Your Cloud Files</h2>";
  
      if (!data.files.length) {
        container.innerHTML += "<p>No files uploaded yet.</p>";
        return;
      }
  
      let list = document.createElement("ul");
      data.files.forEach(file => {
        let li = document.createElement("li");
        li.innerHTML = `
          <a href="http://localhost:4000/uploads/${file.filename}" target="_blank">
            ${file.filename}
          </a>
        `;
        list.appendChild(li);
      });
      container.appendChild(list);
  
    } catch (err) {
      console.error(err);
    }
  }