import React from 'react';
import ReactDOM from 'react-dom';

var timeText: string;
var innerText: string;

var allMeetings: ScheduledMeeting[] = [];

class ScheduledMeeting {
    constructor(public id: String, public startTime: Date, public endTime: Date) {}
}
class MeetingInfo {
    constructor(public participants: String[], public subject: String, public body: String) {}
}

// function App(props: any) {
class App extends React.Component {
    render() {
        loadAllMeetings();
        displayMeeting('aa');
        setInterval(uhrzeit, 1000);

        return (
            <div>
                <h1 id="uhr" className="time">
                    {timeText}
                </h1>
                <h2 id="text" className="infoText">
                    {innerText}
                </h2>
            </div>
        );
    }
}

function displayMeeting(id: string) {
    var message = '';
    fetch('https://localhost:44320/meetings/helloMessage')
        .then((res) => res.json())
        .then((data) => {
            console.log(data.message);
            message = data.message;

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };
            const opts: RequestInit = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(new PostRequest('asdsad')),
            };

            fetch('https://localhost:44320/meetings/meetingInfo', opts)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data.subject);
                    var info = data as MeetingInfo;
                    var tmp = '';
                    for (let i = 0; i < info.participants.length; i++) {
                        tmp += info.participants[i];
                        if (i != info.participants.length - 1) {
                            tmp += ', ';
                        }
                    }
                    console.log(message);
                    console.log(tmp);
                    setInfoText([message, tmp, info.subject]);
                })
                .catch(console.log);
        })
        .catch(console.log);
}

function loadAllMeetings() {
    fetch('https://localhost:44320/meetings/all')
        .then((res) => res.json())
        .then((data) => {
            allMeetings = [];
            for (let i = 0; i < data.length; i++) {
                const meeting = data[i] as ScheduledMeeting;
                allMeetings.push(meeting);
            }
        })
        .catch(console.log);
}

function uhrzeit() {
    var jetzt = new Date(),
        h = jetzt.getHours(),
        m = jetzt.getMinutes(),
        mt = fuehrendeNull(m);
    timeText = h + ':' + mt;
}

function fuehrendeNull(zahl: number): string {
    return (zahl < 10 ? '0' : '') + zahl;
}

function displayWelcome(participants: string[]) {
    var tmp = '';
    for (let i = 0; i < participants.length; i++) {
        tmp += participants[i];
        if (i != participants.length - 1) {
            tmp += ', ';
        }
    }
    setInfoText(['Herzlich willkommen', tmp, 'Schön, dass ihr da seid']);
}

function setInfoText(text: String[]) {
    var temp = '';
    for (let i = 0; i < text.length; i++) {
        temp += text[i];
        temp += '\n'; // TODO
    }
    innerText = temp;

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    );
}

class PostRequest {
    Id: string | undefined;
    constructor(id: string) {
        this.Id = id;
    }
}

export default App;
