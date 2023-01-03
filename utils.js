export async function convertAudioBufferToWavBlob(audioBuffer) {
  return new Promise(function (resolve) {
    var worker = new Worker('./wave-worker.js');

    worker.onmessage = function (e) {
      var blob = new Blob([e.data.buffer], { type: 'audio/wav' });
      resolve(blob);
    };

    let pcmArrays = [];
    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      pcmArrays.push(audioBuffer.getChannelData(i));
    }

    worker.postMessage({
      pcmArrays,
      config: { sampleRate: audioBuffer.sampleRate },
    });
  });
}

export function downloadBlob(blob, name) {
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = name;
  document.body.appendChild(link);

  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );

  document.body.removeChild(link);
}

export function initButtonListener(mediaRecorder) {
  const recordButton = document.getElementById('record-button');
  recordButton.innerHTML = 'Record';

  recordButton.addEventListener('click', () => {
    if (mediaRecorder.state === 'inactive') {
      mediaRecorder.start();
      recordButton.innerHTML = 'Recording ...';
    } else {
      mediaRecorder.stop();
      recordButton.innerHTML = 'Record';
    }
  });
}
