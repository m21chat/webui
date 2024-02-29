const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL

interface OllamaMessage {
    role:string
    content: string
}

interface OllamaChatPrompt {
    model: string
    messages: OllamaMessage[]
}

const generateChat = async (prompt: OllamaChatPrompt): Promise<{ response: Response | null, controller: AbortController }> => {
    
    // TODO: Implement later
    // if (!validateAuthToken(authToken)) {
    //     throw new Error('Invalid authToken');
    // }

    let controller = new AbortController();
    let error = null;

    const baseUrl = OLLAMA_BASE_URL || 'http://192.168.0.37:11434/api';

    const res = await fetch(`${baseUrl}/chat`, {
        signal: controller.signal,
        method: 'POST',
        headers: {
            'Content-Type': 'text/event-stream',
        },
        body: JSON.stringify(prompt)
    }).catch((err) => {
        error = err;
        return null;
    });

    if (error) {
        throw error;
    }

    return { response: res, controller: controller };
}