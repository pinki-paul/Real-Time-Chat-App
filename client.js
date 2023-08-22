const socket = io();
const form = document.getElementById("sendcont");
const messageInput = document.getElementById("send_msg");
const messageContainer = document.getElementById("messagebox");
const audio1 = new Audio("/sounds/send.mp3");
const audio2 = new Audio("/sounds/ting.mp3");


const append = (message,position) =>{
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageContainer.appendChild(messageElement);

if (position == "left") {
    audio1.play();
}
if (position == "center") {
    audio2.play();
}


}

form.addEventListener("submit",(event)=>{
    event.preventDefault();
    const message = messageInput.value;
    append(`You : ${message}`,"right");
    socket.emit("send",message);
    messageInput.value = "";
})

const username = prompt("Enter your name");
socket.emit("new_user_joined", username);

socket.on("user-joined", (username)=>{
    append(`${username} joined the chat`,"center");
});
socket.on("recieve",(data)=>{
    append(`${data.username} : ${data.message}`, "left");
})

socket.on("user-left", (username)=>{
    append(`${username} left the chat`,"center");
});
