$(document).ready(function() {
    let isRecording = false;
    let recordedChunks = [];

    const recordBtn = $('#recordBtn');
    const replayBtn = $('#replayBtn');
    const downloadBtn = $('#downloadBtn');
    const audioPlayer = $('#audioPlayer')[0];
    const mediaRecorder = new MediaRecorder(window.stream);

    recordBtn.on('click', function() {
        if (!isRecording) {
            startRecording();
            recordBtn.attr('src', 'stop.png');
            isRecording = true;
        } else {
            stopRecording();
            recordBtn.attr('src', 'record.png');
            isRecording = false;
        }
    });

    replayBtn.on('click', function() {
        audioPlayer.play();
    });

    downloadBtn.on('click', function() {
        const blob = new Blob(recordedChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = 'recorded_audio.wav';
        a.click();
        window.URL.revokeObjectURL(url);
    });

    function startRecording() {
        recordedChunks = [];
        mediaRecorder.start();
        replayBtn.hide();
        downloadBtn.hide();
    }

    function stopRecording() {
        mediaRecorder.stop();
        replayBtn.show();
        downloadBtn.show();
    }

    mediaRecorder.ondataavailable = function(event) {
        recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = function() {
        const blob = new Blob(recordedChunks, { type: 'audio/wav' });
        audioPlayer.src = URL.createObjectURL(blob);
    };

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            window.stream = stream;
            mediaRecorder.stream = stream;
        })
        .catch(function(err) {
            console.error('Error accessing microphone:', err);
        });
});
