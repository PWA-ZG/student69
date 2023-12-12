document.addEventListener('DOMContentLoaded', (event) => {
    let videoStream;

    const startCameraButton = document.getElementById('startCamera');
    const stopCameraButton = document.getElementById('stopCamera');
    const cameraContainer = document.getElementById('camera-container');

    startCameraButton.addEventListener('click', startCamera);
    stopCameraButton.addEventListener('click', stopCamera);

    function startCamera() {
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    videoStream = stream;
                    const video = document.createElement('video');
                    video.srcObject = stream;
                    video.setAttribute('playsinline', '');
                    video.setAttribute('controls', '');
                    cameraContainer.appendChild(video);
                    video.play();
                })
                .catch((error) => {
                    console.error('Error accessing camera:', error);
                });
        } else {
            console.error('Camera not supported.');
        }
    }

    function stopCamera() {
        if (videoStream) {
            const tracks = videoStream.getTracks();
            tracks.forEach(track => track.stop());
            cameraContainer.innerHTML = ''; 
        }
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);

                registration.sync.register('my-sync-tag')
                    .then(() => {
                        console.log('Background sync registered.');
                    })
                    .catch((error) => {
                        console.error('Background sync registration failed:', error);
                    });

                Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                        console.log('Notification permission granted.');
                    }
                });
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    }
});
