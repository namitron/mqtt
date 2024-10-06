import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

public class MQTTExample {

    public static void main(String[] args) {
        String broker = "tcp://broker.mqtt-dashboard.com:1883"; // Alamat broker MQTT
        String clientId = "JavaClient"; // ID unik untuk client MQTT
        String topic = "test/topic"; // Topik yang akan di-subscribe
        int qos = 2; // Quality of Service (QOS)

        MemoryPersistence persistence = new MemoryPersistence();

        try {
            // Inisialisasi client MQTT
            MqttClient client = new MqttClient(broker, clientId, persistence);

            // Set callback untuk menangani pesan masuk
            client.setCallback(new MqttCallback() {
                @Override
                public void connectionLost(Throwable cause) {
                    System.out.println("Koneksi hilang: " + cause.getMessage());
                }

                @Override
                public void messageArrived(String topic, MqttMessage message) throws Exception {
                    System.out.println("Pesan diterima di topik " + topic + ": " + new String(message.getPayload()));
                }

                @Override
                public void deliveryComplete(IMqttDeliveryToken token) {
                    System.out.println("Pengiriman pesan selesai.");
                }
            });

            // Koneksikan ke broker
            client.connect();

            System.out.println("Terhubung ke broker: " + broker);

            // Subscribe ke topik yang diinginkan
            client.subscribe(topic, qos);
            System.out.println("Subscribed ke topik: " + topic);

            // Mengirim pesan ke topik
            String content = "Hello MQTT!";
            MqttMessage message = new MqttMessage(content.getBytes());
            message.setQos(qos);
            client.publish(topic, message);
            System.out.println("Pesan dikirim: " + content);

            // Tunggu beberapa detik untuk menerima pesan
            Thread.sleep(5000);

            // Disconnect dari broker
            client.disconnect();
            System.out.println("Terputus dari broker.");

        } catch (MqttException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
