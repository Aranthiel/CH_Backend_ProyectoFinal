const socketClient = io();
// Emitir el evento "vistaActiva" cuando el carrito está activo

const inicialEvent = {
    vista: "chat",
    evento: null,
    data: null, // Aquí puedes incluir los datos necesarios
};
socketClient.emit("vistaActiva", inicialEvent);
console.log('Evento "vistaActiva" enviado desde chat.js');

const form = document.getElementById("chatForm");
const inputText = document.getElementById("chatMessage");
const h3Name = document.getElementById("name");
const div = document.getElementById("showChat");
const names =[];
const messages=[];

Swal.fire({
    title: 'Bienvenide!',
    input: 'text',
    inputLabel: 'Ingresa tu nombre',
    showCancelButton: true,
    inputValidator: (value) => {
        if (!value) {
            return 'No olvides ingrersar tu nombre!'
        }
    },
    confirmButtonText: 'Ingresar'
    
}).then(input =>{
    user=input.value;
    h3Name.innerText= `Te uniste al chat como ${user}`;
    const newChatUserEvent = {
        vista: "chat",
        tipo:'socketClient.emit',
        evento: "newChatUser",
        data: user,
    };
    socketClient.emit("vistaActiva", newChatUserEvent);
    //socketClient.emit('newChatUser', user);
    console.log('evento newChatUser enviado desde chat.js')

});

socketClient.on('newChatUserBroadcast', (user)=>{
    console.log('evento newChatUserBroadcast recibido en chat.js')
    console.log(`se ha unido ${user}`); 

    Toastify({
        text: `se ha unido ${user}`,
        duration: 3000
    }).showToast();
    
})

//chatMessages
form.onsubmit=(e)=>{
    e.preventDefault();
    const newChatMessage ={
        name: user,
        message : inputText.value,
    }
    const newChatMessageEvent = {
        vista: "chat",
        tipo: 'socketClient.emit',
        evento: "newChatMessage",
        data: newChatMessage
    };
    socketClient.emit("vistaActiva", newChatMessageEvent);
    //socketClient.emit('newChatMessage', newChatMessage);
    console.log('evento newChatMessage enviado desde chat.js')
}

socketClient.on("chatMessages", (messages)=>{
    console.log('evento chatMessages recibido en chat.js')
    div.innerHTML = "";

    messages.forEach((message) => {
        const pElement = document.createElement("p");
        const bElement = document.createElement("b");

        bElement.innerText = `${message.name}: `;
        pElement.appendChild(bElement);
        pElement.innerText = `${message.name}: ${message.message}`;


        div.appendChild(pElement);
    });
    inputText.value="";
})