export const parseJSON = async function* <T = unknown>(
    itr: ReadableStream<Uint8Array>,
  ): AsyncGenerator<T> {
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
  
    const reader = itr.pipeThrough(new TextDecoderStream())
                      .pipeThrough(splitStream('\n'))
                      .getReader();
  
    while (true) {
      const { done, value: chunk } = await reader.read()
  
      if (done) {
        break
      }
      let lines = chunk.split('\n')
  
      for (const line of lines) {
        try {
          if (line !== '') {
            yield JSON.parse(line)
          } 
        } catch (error) {
          console.warn('invalid json: ', line)
        }
      }
    }
  
    // for (const part of buffer.split('\n').filter((p) => p !== '')) {
    //   try {
    //     yield JSON.parse(part)
    //   } catch (error) {
    //     console.warn('invalid json: ', part)
    //   }
    // }
  }

  export const splitStream = (splitOn:string) => {
    let buffer = '';
    return new TransformStream({
      transform(chunk, controller) {
        buffer += chunk;
        const parts = buffer.split(splitOn);
        parts.slice(0, -1).forEach((part) => controller.enqueue(part));
        buffer = parts[parts.length - 1];
      },
      flush(controller) {
        if (buffer) controller.enqueue(buffer);
      }
    });
  };