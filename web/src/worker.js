// import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.2';
import { pipeline } from '@xenova/transformers';

class MyTranslationPipeline {
  static task = 'translation';
  static model = 'Xenova/whisper-small';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }

    return this.instance;
  }
}

// Listen for messages from the main thread
/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('message', async (event) => {
  // Retrieve the translation pipeline. When called for the first time,
  // this will load the pipeline and save it for future use.
  let translator = await MyTranslationPipeline.getInstance(x => {
    // We also add a progress callback to the pipeline so that we can
    // track model loading.
    /* eslint-disable-next-line no-restricted-globals */
    self.postMessage({
      data: x
    });
  });

  // Actually perform the translation
  let output = await translator(event.data.audio, {

    // Allows for partial output
    callback_function: x => {
      /* eslint-disable-next-line no-restricted-globals */
      self.postMessage({
        status: 'update',
        output: translator.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true })
      });
    }
  });

  // Send the output back to the main thread
  /* eslint-disable-next-line no-restricted-globals */
  self.postMessage({
    status: 'complete',
    output: output,
  });
});



// // Listen for messages from UI
// /* eslint-disable-next-line no-restricted-globals */
// self.addEventListener('message', async (event) => {
//   const data = event.data;
//   let fn = speech_to_text[data.task];

//   if (!fn) return;

//   let result = await fn(data);
//   /* eslint-disable-next-line no-restricted-globals */
//   self.postMessage({
//     task: data.task,
//     type: 'complete',
//     data: result
//   });
// });

// // Define model factories
// // Ensures only one model is created of each type
// class PipelineFactory {
//   static task = null;
//   static model = null;

//   // NOTE: instance stores a promise that resolves to the pipeline
//   static instance = null;

//   constructor(tokenizer, model) {
//     this.tokenizer = tokenizer;
//     this.model = model;
//   }

//   /**
//    * Get pipeline instance
//    * @param {*} progressCallback 
//    * @returns {Promise}
//    */
//   static getInstance(progressCallback = null) {
//     if (this.task === null || this.model === null) {
//       throw Error("Must set task and model")
//     }
//     if (this.instance === null) {
//       this.instance = pipeline(this.task, this.model, {
//         progress_callback: progressCallback
//       });
//     }

//     return this.instance;
//   }
// }

// class AutomaticSpeechRecognitionPipelineFactory extends PipelineFactory {
//   static task = 'automatic-speech-recognition';
//   static model = 'Xenova/whisper-tiny.en';
// }

// async function speech_to_text(data) {
//   let pipeline = await AutomaticSpeechRecognitionPipelineFactory.getInstance(data => {
//     /* eslint-disable-next-line no-restricted-globals */
//     self.postMessage({
//       type: 'initiate',
//       task: 'automatic-speech-recognition',
//       data: data
//     });
//   })

//   return await pipeline(data.audio, {
//     // Choose good defaults for the demo
//     chunk_length_s: 30,
//     stride_length_s: 5,

//     ...data.generation,
//     callback_function: function (beams) {
//       const decodedText = pipeline.tokenizer.decode(beams[0].output_token_ids, {
//         skip_special_tokens: true,
//       })

//       /* eslint-disable-next-line no-restricted-globals */
//       self.postMessage({
//         type: 'update',
//         target: data.elementIdToUpdate,
//         data: decodedText.trim()
//       });
//     }
//   })
// }