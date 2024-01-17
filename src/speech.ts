import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useEffect, useState } from 'react';

export const useSpeechSynthesis = () => {
  const [animation, setAnimation] = useState([]);
  const [speechSynthesizer, setSpeechSynthesizer] = useState(null);

  const startSpeechSynthesis = async (text: string) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(import.meta.env.VITE_SPEECH_KEY, import.meta.env.VITE_SPEECH_REGION);
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
    const speechSynthesisVoiceName  = "de-DE-KatjaNeural";  
    const ssml = `<speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'> \r\n \
        <voice name='${speechSynthesisVoiceName}'> \r\n \
        <mstts:viseme type="FacialExpression"/> \r\n \
            <mstts:viseme type='redlips_front'/> \r\n \
            '${text}' \r\n \
        </voice> \r\n \
    </speak>`;
    
    speechConfig.setProperty(sdk.PropertyId.SpeechServiceResponse_RequestSentenceBoundary, "true");
    let synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.visemeReceived = function(s, e) {
        const ani = JSON.parse(e.animation);
       //console.log(ani.BlendShapes);
        //animation.push(JSON.parse(ani));
        setAnimation(prevAnimation => [...prevAnimation, ani.BlendShapes]);
      };
      
      synthesizer.speakSsmlAsync(ssml,
      function (result) {
        if (result.reason !== sdk.ResultReason.SynthesizingAudioCompleted) {
          console.error("Speech synthesis canceled, " + result.errorDetails +
          "\nDid you set the speech resource key and region values?");
        }
        
        synthesizer.close();
        setSpeechSynthesizer(null);
      },
      function (err) {
        console.trace("err - " + err);
        synthesizer.close();
        setSpeechSynthesizer(null);
      }
    );
    setSpeechSynthesizer(synthesizer);
  }
  
  useEffect(() => {
    return () => {
      if (speechSynthesizer) {
        speechSynthesizer.close();
      }
    };
  }, [speechSynthesizer]);
  
  
  
  return { animation, startSpeechSynthesis };
};