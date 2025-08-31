let flag=0;
let filename = null;
let userid = null;
console.log("Script loaded!");
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
function openaiModal(user_id,fileName) {
  filename=fileName;
  userid=user_id;
  document.getElementById("aiModal").style.display = "block";
}

function closeModal() {
  document.getElementById("aiModal").style.display = "none";
}

async function sendToAI() {
  const prompt = document.getElementById("aiPrompt").value;

  // Show loader
  Swal.fire({
    title: 'Sending to AI...',
    text: 'Please wait while we process your request.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    const res = await fetch(`https://chest-temple-catering-advertisers.trycloudflare.com/${userid}/${filename}`);
    const content = await res.text();
    console.log(content);

    const ai = await fetch(`https://chest-temple-catering-advertisers.trycloudflare.com/askai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content, prompt: prompt })
    });

    const data = await ai.json();

    // Close loader and show response
    Swal.fire({
      title: 'AI Response',
      icon: 'success',
      confirmButtonText: 'OK'
    });

    document.getElementById("chatBox").innerHTML += `<div class="ai-message">${data.answer || "No response"}</div>`;

  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: error.message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}

async function loadFiles(userId) {
    console.log("loadFiles called with userId:", userId);
    try {
      const res = await fetch(`https://chest-temple-catering-advertisers.trycloudflare.com/${userId}`);
      const files = await res.json();
  
      const container = document.getElementById("mainContent");
      container.innerHTML = "<h2>Your Cloud Files</h2>";
        
      if (!files.length) {
        container.innerHTML += "<p>No files uploaded yet.</p>";
        return;
      }
  
      const list = document.createElement("ul");
      console.log(files);
      files.forEach(file => {
        const li = document.createElement("li");
  
        if (file.isDirectory) {
          li.innerHTML = `<span style="font-size: 16px; font-weight: bold; color: #2c3e50;">📁 ${file}</span>`;
        } else {
          li.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; margin: 5px 0; border: 1px solid #ddd; border-radius: 6px; background: #f9f9f9; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <a href="http://localhost:4000/Cloudify_Files/${userId}/${file}" target="_blank" 
                 style="text-decoration: none; font-size: 15px; color: #34495e; font-weight: 500;">
                 📄 ${file}
              </a>
              <div>
                <button onclick="editFile('${userId}','${file}')" 
                  style="margin-right: 8px; padding: 6px 12px; font-size: 13px; font-weight: 500; color: #fff; background: #3498db; border: none; border-radius: 4px; cursor: pointer; transition: background 0.3s;">
                  ✏️ Edit
                </button>
                <button onclick="filedelete('${file}','${userId}')" 
                  style="padding: 6px 12px; font-size: 13px; font-weight: 500; color: #fff; background: #e74c3c; border: none; border-radius: 4px; cursor: pointer; transition: background 0.3s;">
                  🗑️ Delete
                </button>
                <button style="margin-left:6px; padding:5px 12px; border:none; border-radius:6px; background:#6f42c1; color:white; cursor:pointer;"
                 onclick="openaiModal('${userId}','${file}')">🤖 Ask AI</button>
              </div>
            </div>
          `;
         
        }
  
        list.appendChild(li);
      });
  
      container.appendChild(list);
    } catch (err) {
      console.error(err);
    }
  }
  async function editFile(userId, fileName) {
    const res = await fetch(`https://chest-temple-catering-advertisers.trycloudflare.com/${userId}/${fileName}`);
    const content = await res.text();
  
    const container = document.getElementById("mainContent");
    container.innerHTML = `
      <h2>Editing: ${fileName}</h2>
      <textarea id="editor" style="width:100%; height:400px;">${content}</textarea>
      <button onclick="saveFile('${userId}','${fileName}')">💾 Save</button>
    `;

    
  const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    lineNumbers: true,
    mode: detectLanguage(fileName),
    theme: "default"
  });
  window.currentEditor = editor;
  }
  function detectLanguage(fileName) {
    if (fileName.endsWith(".js")) return "javascript";
    if (fileName.endsWith(".py")) return "python";
    if (fileName.endsWith(".c") || fileName.endsWith(".cpp")) return "text/x-c++src";
    if (fileName.endsWith(".java")) return "text/x-java";
    return "plaintext";
  }
  async function saveFile(userId, fileName) {
    const updatedContent = document.getElementById("editor").value;
  
    const res = await fetch(`http://localhost:4000/saveFile/${userId}/${fileName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: updatedContent })
    });
  
    if (res.ok) {
      alert("✅ File saved successfully!");
      loadFiles(userId); // reload list
    } else {
      alert("❌ Error saving file!");
    }
  }

async function filedelete(filename,user_id){
  const res = await fetch(`https://chest-temple-catering-advertisers.trycloudflare.com/${user_id}/${filename}`, {
      method: "DELETE",
    });
    if(res.flag){
      loadFiles(user_id);
    }
    else{
      alert("FAILED TO DELETE THE FILE");
    }

}
