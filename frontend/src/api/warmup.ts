import { apiClient } from './client';

let isWarmingUp = false;
let warmupPromise: Promise<void> | null = null;

export const warmUpServer = async (): Promise<void> => {
  if (isWarmingUp || warmupPromise) {
    return warmupPromise || Promise.resolve();
  }

  console.log('🔥 Warming up server connection...');
  isWarmingUp = true;

  warmupPromise = (async () => {
    try {
      // Faz uma requisição de warmup para acordar o servidor
      await Promise.race([
        apiClient.get('/warmup'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Warmup timeout')), 15000)
        ),
      ]);
      
      console.log('✅ Server warmed up successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log('⚠️ Server warmup failed, but continuing anyway:', errorMessage);
    } finally {
      isWarmingUp = false;
      // Limpa a promise após 30 segundos para permitir novo warmup
      setTimeout(() => {
        warmupPromise = null;
      }, 30000);
    }
  })();

  return warmupPromise;
};

// Auto warmup quando a aplicação carrega
export const autoWarmUp = () => {
  // Só faz warmup em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    warmUpServer();
  }
};

// Warmup quando a janela volta ao foco (usuário volta para a aplicação)
let lastFocusTime = Date.now();
export const setupFocusWarmup = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', () => {
      const timeSinceLastFocus = Date.now() - lastFocusTime;
      // Se ficou mais de 5 minutos fora da aplicação, faz warmup
      if (timeSinceLastFocus > 5 * 60 * 1000) {
        console.log('🔄 App returned to focus after long time, warming up...');
        warmUpServer();
      }
      lastFocusTime = Date.now();
    });

    window.addEventListener('blur', () => {
      lastFocusTime = Date.now();
    });
  }
};
