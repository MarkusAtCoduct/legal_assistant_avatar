import { useAtom } from "jotai";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { useState } from 'react';
import { speakingAtom } from "./atoms/speakingAtom";

export const useSpeechSynthesis = () => {
  //const [animation, setAnimation] = useState([]);
  const [visemes, setVisemes] = useState([]);
  const [speaking, setSpeaking] = useAtom(speakingAtom);

  const tempVisemeBlendshapes = [];
  const tempAudioOffsets = [];

  const visemeMap = [];

  const startSpeechSynthesis = async (text: string) => {

    setVisemes([]);
    setSpeaking(true);

    const speechConfig = sdk.SpeechConfig.fromSubscription(import.meta.env.VITE_SPEECH_KEY, import.meta.env.VITE_SPEECH_REGION);
    
    
    const audioContext = new (window.AudioContext)();
    const audioDestination = audioContext.createMediaStreamDestination();
   const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
  //const audioConfig = sdk.AudioConfig.fromStreamOutput(audioDestination.stream);
    const speechSynthesisVoiceName  = "de-DE-KatjaNeural";  
    const ssml = `<speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'> \r\n \
        <voice name='${speechSynthesisVoiceName}'> \r\n \
        <mstts:viseme type="FacialExpression"/> \r\n \
        
            '${text}' \r\n \
       
        </voice> \r\n \
    </speak>`;

    
    speechConfig.setProperty(sdk.PropertyId.SpeechServiceResponse_RequestSentenceBoundary, "true");
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    let isFirstViseme = true;

    synthesizer.visemeReceived = function(s, e) {
      if (isFirstViseme) {
        setSpeaking(true);
        isFirstViseme = false;
      }
        console.log(e);
        if (e.audioOffset / 10000 > 0){        
          tempAudioOffsets.push(e.audioOffset / 10000);
        }
        if (e.animation !== undefined){
        const ani = JSON.parse(e.animation);
        tempVisemeBlendshapes.push(ani.BlendShapes);
        }

      };



      console.log(synthesizer.internalData)

      synthesizer.speakSsmlAsync(ssml,
      function (result) {
        console.log(result.audioDuration / 100000, "ms");
        
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          
          tempAudioOffsets.forEach((offset, index) => {
            visemeMap.push({frameOffset: offset, visemeBlendshapes: tempVisemeBlendshapes[index]});
            
          });
          setVisemes(visemeMap);
          setSpeaking(false);
      }
        if (result.reason !== sdk.ResultReason.SynthesizingAudioCompleted) {
          console.error("Speech synthesis canceled, " + result.errorDetails +
          "\nDid you set the speech resource key and region values?");
        }        
        synthesizer.close();
      
      },
      function (err) {
        console.trace("err - " + err);
        synthesizer.close();
      }
    );

   
  }

  
  return { visemes, startSpeechSynthesis };
};