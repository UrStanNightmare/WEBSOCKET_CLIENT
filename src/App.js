import {Stomp} from "@stomp/stompjs";
import * as SockJS from "sockjs-client"
import {useState} from "react";

function App() {
    const [state,setState] = useState({});

    let stompClient

    const currentUser = {
        id: 12412152512,
        name: "vasya",
    }
    const connect = () => {
        console.log("Connect()")
        SockJS = new SockJS("http://localhost:8080/ws");

        stompClient = Stomp.over(SockJS);
        stompClient.connect({}, onConnected, onError);
    };

    const onMessageReceived = (message) => {
        console.log("Message recieved" + message)
        const result = JSON.parse(message.body)
        setState(result)
    }
    const onConnected = () => {
        console.log("connected");

        stompClient.subscribe(
            "/user/" + currentUser.id + "/queue/messages",
            onMessageReceived
        );
    };

    const onError = (e) => {
        console.log("Error!")
        console.log(e)
    }

    function sendFunc() {
        const message = {
            senderId: currentUser.id,
            chatId: 1245125512,
            content: "dolboeb",
        };
        stompClient.send("/app/chat", {}, JSON.stringify(message));
    }

    return (
        <div className="App">
            <button onClick={connect}>
                CONNECT
            </button>
            <button onClick={sendFunc}>
                SEND
            </button>

            <pre>
                {JSON.stringify(state)}
            </pre>
        </div>
    );
}

export default App;
