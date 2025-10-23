const input = document.getElementById("taskInput");
const btn = document.getElementById("addBtn");
const list = document.getElementById("taskList");

btn.onclick = function() {
  let text = input.value.trim();
  if (text === "") return;

  let li = document.createElement("li");
  li.textContent = text;

  let del = document.createElement("button");
  del.textContent = "X";
  del.onclick = (e) => {
    e.stopPropagation();
    li.remove();
  };

  li.onclick = () => li.classList.toggle("completed");

  li.appendChild(del);
  list.appendChild(li);
  input.value = "";
};
