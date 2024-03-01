export const parseJSON = async function* <T = unknown>(
    itr: ReadableStream<Uint8Array>,
  ): AsyncGenerator<T> {
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
  
    const reader = itr.getReader()
  
    while (true) {
      const { done, value: chunk } = await reader.read()
  
      if (done) {
        break
      }
  
      buffer += decoder.decode(chunk)
  
      const parts = buffer.split('\n')
  
      buffer = parts.pop() ?? ''
  
      for (const part of parts) {
        try {
          yield JSON.parse(part)
        } catch (error) {
          console.warn('invalid json: ', part)
        }
      }
    }
  
    for (const part of buffer.split('\n').filter((p) => p !== '')) {
      try {
        yield JSON.parse(part)
      } catch (error) {
        console.warn('invalid json: ', part)
      }
    }
  }