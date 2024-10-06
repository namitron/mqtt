// Inisialisasi client MQTT
const client = new Paho.MQTT.Client("broker.hivemq.com", Number(8000), "clientId");

// Callback saat terhubung
client.onConnect = function() {
    console.log("Connected to MQTT broker");
    client.subscribe("test/topic"); // Ganti dengan topic yang diinginkan
};

// Callback saat menerima pesan
client.onMessageArrived = function(message) {
    const msgDiv = document.getElementById("messages");
    msgDiv.innerHTML += `<p>${message.payloadString}</p>`;
};

// Fungsi untuk publish pesan
function publishMessage() {
    const message = document.getElementById("message").value;
    const mqttMessage = new Paho.MQTT.Message(message);
    mqttMessage.destinationName = "test/topic"; // Ganti dengan topic yang diinginkan
    client.send(mqttMessage);
}

// Mencoba menghubungkan ke broker
client.connect({ onSuccess: client.onConnect });
